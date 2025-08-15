use actix_web::{
    dev::{Service, ServiceRequest, ServiceResponse},
    get, post, web, HttpResponse, Responder
};
use chrono::Utc;
use nanoid::nanoid;
use redis::{aio::ConnectionManager, AsyncCommands, RedisError};
use serde_json::json;
use url::ParseError;
use super::models;

#[post("/shorten")]
pub async fn shorten(
    req: web::Json<models::ShortenRequest>,
    pool: web::Data<ConnectionManager>,
) -> HttpResponse {
    let mut conn = pool.get_ref().clone();
    let id = nanoid!(6);
    
    if let Err(e) = validate_url(&req.url) {
        return HttpResponse::BadRequest().json(json!({
            "error": "Invalid URL",
            "details": e.to_string()
        }));
    }

    match redis::cmd("SET")
        .arg(&id)
        .arg(&req.url)
        .arg("EX")
        .arg(60 * 60 * 24 * 30)  
        .query_async::<_, String>(&mut conn)
        .await
    {
        Ok(_) => HttpResponse::Ok().json(models::ShortenResponse {
            short_url: format!("http://localhost:8080/{}", id),
        }),
        Err(e) => {
            log::error!("Failed to store URL: {}", e);
            HttpResponse::InternalServerError().json(json!({
                "error": "Storage failed",
                "details": e.to_string()
            }))
        }
    }
}

#[get("/{id}")]
pub async fn redirect(
    id: web::Path<String>,
    pool: web::Data<ConnectionManager>,
) -> HttpResponse {
    let mut conn = pool.get_ref().clone();
    

    let url: String = match conn.get(&*id).await {
        Ok(Some(url)) => url,
        Ok(None) => {
            return HttpResponse::NotFound().json(json!({
                "error": "URL not found",
                "code": id.to_string()
            }))
        },
        Err(e) => {
            log::error!("Redis GET failed for {}: {}", id, e);
            return HttpResponse::InternalServerError().json(json!({
                "error": "Service unavailable"
            }));
        }
    };


    if let Err(e) = track_click(&mut conn, &id).await {
        log::warn!("Click tracking failed for {}: {}", id, e);
    }

    HttpResponse::Found()
        .append_header(("Location", url))
        .finish()
}

async fn track_click(
    conn: &mut ConnectionManager,
    id: &str,
) -> Result<(), RedisError> {
    
    let _: () = conn.set_nx(format!("clicks:{}", id), 0).await?;
    let _: i64 = conn.incr(format!("clicks:{}", id), 1).await?;
    let _: () = conn.zadd(
        format!("clicks:detailed:{}", id),
        Utc::now().timestamp(),
        ""
    ).await?;
    
    Ok(())
}

#[get("/stats/{id}")]
pub async fn get_stats(
    id: web::Path<String>,
    pool: web::Data<ConnectionManager>,
) -> impl Responder {
    let mut conn = pool.get_ref().clone();
    
    if let Err(e) = validate_redis_data(&mut conn, &id).await {
        log::error!("Data validation failed for {}: {}", id, e);
    }

    match get_click_stats(&mut conn, &id).await {
        Ok((total, daily)) => HttpResponse::Ok().json(json!({
            "short_code": id.to_string(),
            "total_clicks": total,
            "daily_clicks": daily,
            "status": "success"
        })),
        Err(e) => {
            log::error!("Stats failed for {}: {}", id, e);
            HttpResponse::InternalServerError().json(json!({
                "error": "Statistics unavailable",
                "details": e.to_string()
            }))
        }
    }
}

async fn validate_redis_data(
    conn: &mut ConnectionManager,
    id: &str,
) -> Result<(), RedisError> {
   
    let _: i64 = match conn.get(format!("clicks:{}", id)).await {
        Ok(num) => num,
        Err(_) => {
            let _: () = conn.set(format!("clicks:{}", id), 0).await?;
            0
        }
    };
    Ok(())
}

async fn get_click_stats(
    conn: &mut ConnectionManager,
    id: &str,
) -> Result<(i64, i64), RedisError> {
    let now = Utc::now().timestamp();
    let (total, daily): (i64, i64) = redis::pipe()
        .get(format!("clicks:{}", id))
        .zcount(
            format!("clicks:detailed:{}", id),
            now - 86400,  
            now
        )
        .query_async(conn)
        .await?;
    
    Ok((total, daily))
}

pub async fn repair_click_counts(
    conn: &mut ConnectionManager,
    id: &str,
) -> Result<(), RedisError> {
    let total: i64 = conn.get(format!("clicks:{}", id)).await.unwrap_or(0);
    let recorded: i64 = conn.zcard(format!("clicks:detailed:{}", id)).await.unwrap_or(0);

    if total > recorded {
        log::warn!("Repairing {} missing clicks for {}", total - recorded, id);
        
        let now = Utc::now().timestamp();
        for i in 1..=(total - recorded) {
            let _: () = conn.zadd(
                format!("clicks:detailed:{}", id),
                now - i as i64,
                ""
            ).await?;
        }
    }

    Ok(())
}

pub async fn verify_counts_middleware<S>(
    req: ServiceRequest,
    srv: &mut S,
) -> Result<ServiceResponse, actix_web::Error>
where
    S: Service<ServiceRequest, Response = ServiceResponse, Error = actix_web::Error>,
{
    let res = srv.call(req).await?;
    
    if let Some(id) = res.request().match_info().get("id") {
        if let Some(pool) = res.request().app_data::<web::Data<ConnectionManager>>() {
            let mut conn = pool.get_ref().clone();
            if let Err(e) = repair_click_counts(&mut conn, id).await {
                log::error!("Count verification failed for {}: {}", id, e);
            }
        }
    }
    
    Ok(res)
}

fn validate_url(url: &str) -> Result<(), ParseError> {
    let parsed = url::Url::parse(url)?;
    if !parsed.has_host() {
        return Err(ParseError::EmptyHost);
    }
    Ok(())
}
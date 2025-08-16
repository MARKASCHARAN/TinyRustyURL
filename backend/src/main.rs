use actix_web::{App, HttpServer, web, middleware::Logger};
use actix_cors::Cors;
use actix_web::http;
use std::env;

mod models;
mod routes;
mod db;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();

    // Redis pool
    let redis_pool = db::create_redis_pool().await
        .map_err(|e| {
            eprintln!("Failed to create Redis pool: {}", e);
            std::io::Error::new(std::io::ErrorKind::Other, "Redis connection failed")
        })?;

    // Port and base URL
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let base_url = env::var("BASE_URL").unwrap_or_else(|_| format!("http://localhost:{}", port));
    println!("Starting server on port {} with base URL {}", port, base_url);

    // Frontend CORS origin
    let cors_origin = env::var("CORS_ORIGIN").unwrap_or_else(|_| base_url.clone());

    HttpServer::new(move || {
        let cors = Cors::default()
            .send_wildcard() // allow any origin for dev; change to allowed_origin in production
            .allowed_methods(vec!["GET", "POST", "OPTIONS"])
            .allowed_headers(vec![http::header::CONTENT_TYPE, http::header::AUTHORIZATION])
            .supports_credentials()
            .max_age(3600);

        App::new()
            .wrap(Logger::default())
            .wrap(cors)
            .app_data(web::Data::new(redis_pool.clone()))
            .app_data(web::Data::new(base_url.clone()))
            .service(routes::shorten)
            .service(routes::redirect)
            .service(routes::get_stats)
    })
    .bind(format!("0.0.0.0:{}", port))?
    .run()
    .await
}

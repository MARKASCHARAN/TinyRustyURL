use actix_web::{App, HttpServer, web};
use actix_cors::Cors;
use actix_web::middleware::Logger;
use actix_web::http;
use std::env;

mod models;
mod routes;
mod db;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();

    let redis_pool = db::create_redis_pool().await
        .map_err(|e| {
            eprintln!("Failed to create Redis pool: {}", e);
            std::io::Error::new(std::io::ErrorKind::Other, "Redis connection failed")
        })?;

    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let cors_origin = env::var("CORS_ORIGIN").unwrap_or_else(|_| "http://localhost:5173".to_string());

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin(&cors_origin)
            .allowed_methods(vec!["GET", "POST", "OPTIONS"])
            .allowed_headers(vec![
                http::header::CONTENT_TYPE,
                http::header::AUTHORIZATION,
            ])
            .supports_credentials()  
            .max_age(3600);

        App::new()
            .wrap(Logger::default())
            .wrap(cors)
            .app_data(web::Data::new(redis_pool.clone()))
            .service(routes::shorten)
            .service(routes::redirect)
            .service(routes::get_stats)
    })
    .bind(format!("0.0.0.0:{}", port))?
    .run()
    .await
}
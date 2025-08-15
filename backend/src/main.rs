use actix_web::{App, HttpServer, web};
use actix_cors::Cors;
use actix_web::middleware::Logger;
use actix_web::http;

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

    HttpServer::new(move || {
        // Configure CORS properly
        let cors = Cors::default()
    .allowed_origin("http://localhost:5173")
    .allowed_methods(vec!["GET", "POST", "OPTIONS"])  // Add OPTIONS
    .allowed_headers(vec![
        http::header::CONTENT_TYPE,
        http::header::AUTHORIZATION,
    ])
    .supports_credentials()  // If using cookies/auth
    .max_age(3600);  // Cache preflight response

        App::new()
            .wrap(Logger::default())
            .wrap(cors)
            .app_data(web::Data::new(redis_pool.clone()))
            .service(routes::shorten)
            .service(routes::redirect)
            .service(routes::get_stats)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
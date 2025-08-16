use redis::{AsyncCommands, Client, RedisError};
use redis::aio::ConnectionManager;
use std::env;

/// Create Redis connection pool
pub async fn create_redis_pool() -> Result<ConnectionManager, RedisError> {
    let redis_url = env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1/0".to_string());
    let client = Client::open(redis_url)?;
    let manager = ConnectionManager::new(client).await?;
    Ok(manager)
}

/// Store URL in Redis
pub async fn store_url(
    conn: &mut ConnectionManager,
    id: &str,
    url: &str,
) -> redis::RedisResult<()> {
    conn.set(id, url).await
}

/// Get URL from Redis
pub async fn get_url(
    conn: &mut ConnectionManager,
    id: &str,
) -> redis::RedisResult<String> {
    conn.get(id).await
}

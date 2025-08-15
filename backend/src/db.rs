use redis::{AsyncCommands, Client, RedisError};
use redis::aio::ConnectionManager;

pub async fn create_redis_pool() -> Result<ConnectionManager, RedisError> {
    let client = redis::Client::open("redis://127.0.0.1/0")?; 
    let manager = ConnectionManager::new(client).await?;
    Ok(manager)
}

pub async fn store_url(
    conn: &mut ConnectionManager,
    id: &str,
    url: &str,
) -> redis::RedisResult<()> {
    conn.set(id, url).await
}

pub async fn get_url(
    conn: &mut ConnectionManager,
    id: &str,
) -> redis::RedisResult<String> {
    conn.get(id).await
}
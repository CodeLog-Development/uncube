use migration::{Migrator, MigratorTrait};
use service::sea_orm::{Database, DatabaseConnection};
use std::sync::Arc;

pub struct ServerState {
    db: DatabaseConnection,
}

#[tokio::main]
pub async fn start() {
    tracing_subscriber::fmt().init();

    if let Err(err) = dotenvy::dotenv() {
        tracing::warn!(error = %err, "Failed to load .env");
    }

    let db_url = std::env::var("DB_URL").expect("DB_URL not set in .env");
    let host = std::env::var("HOST")
        .unwrap_or("127.0.0.1".to_string())
        .parse::<std::net::IpAddr>()
        .expect("Invalid host IP");
    let port = std::env::var("PORT")
        .unwrap_or("8080".to_string())
        .parse::<u16>()
        .expect("Invalid host port");

    let db = Database::connect(db_url)
        .await
        .expect("Failed to connect to database");

    Migrator::up(&db, None)
        .await
        .expect("Failed to run migrations");

    let listener = tokio::net::TcpListener::bind(format!("{host}:{port}"))
        .await
        .expect("Failed to bind TCP socket");

    let router = axum::Router::new().with_state(Arc::new(ServerState { db }));

    if let Err(err) = axum::serve(listener, router).await {
        tracing::error!(error = %err, "Axum server panicked");
    }

    todo!()
}

pub fn main() {
    start();
}

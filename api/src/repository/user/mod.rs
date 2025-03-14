use std::time::{SystemTime, UNIX_EPOCH};

use dto::User;

pub mod dto;

#[derive(Debug)]
pub struct UserRepository<'a> {
    pool: &'a sqlx::MySqlPool,
}

impl<'a> UserRepository<'a> {
    pub fn new(pool: &'a sqlx::MySqlPool) -> Self {
        Self { pool }
    }

    pub async fn create_user(
        &self,
        req: dto::CreateUser,
    ) -> Result<sqlx::mysql::MySqlQueryResult, sqlx::Error> {
        sqlx::query!(
            "INSERT INTO user (username, email, hash) VALUES (?, ?, ?)",
            req.username,
            req.email,
            req.hash
        )
        .execute(self.pool)
        .await
    }

    pub async fn by_email(&self, email: impl AsRef<str>) -> Result<User, sqlx::Error> {
        sqlx::query_as!(User, "SELECT * FROM user WHERE email = ?;", email.as_ref())
            .fetch_one(self.pool)
            .await
    }

    pub async fn by_cookie_secret(
        &self,
        secret: impl AsRef<str>,
    ) -> Result<Option<User>, sqlx::Error> {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("Failed to calculate system time")
            .as_secs();
        match sqlx::query_as!(
            User,
            r#"
                SELECT user.id AS id, username, email, hash 
                FROM user JOIN cookie ON user.id = cookie.user_id 
                WHERE secret = ? AND expires >= ?;
            "#,
            secret.as_ref(),
            now
        )
        .fetch_one(self.pool)
        .await
        {
            Ok(user) => Ok(Some(user)),
            Err(sqlx::Error::RowNotFound) => Ok(None),
            Err(err) => {
                tracing::error!(error = %err, "Failed to query cookie");
                Err(err)
            }
        }
    }
}

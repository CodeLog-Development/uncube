pub mod dto;

#[derive(Debug)]
pub struct CookieRepository<'a> {
    pool: &'a sqlx::mysql::MySqlPool,
}

impl<'a> CookieRepository<'a> {
    pub fn new(pool: &'a sqlx::mysql::MySqlPool) -> Self {
        Self { pool }
    }

    pub async fn create_cookie(
        &self,
        req: dto::CreateCookie,
    ) -> Result<sqlx::mysql::MySqlQueryResult, sqlx::Error> {
        sqlx::query!(
            "INSERT INTO cookie (user_id, secret, expires) VALUES (?, ?, ?);",
            req.user_id,
            req.secret,
            req.expires
        )
        .execute(self.pool)
        .await
    }
}

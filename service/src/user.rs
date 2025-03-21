use ::entity::user;
use sea_orm::*;

#[derive(Debug)]
pub struct CreateUser {
    pub username: String,
    pub hash: String,
    pub email: String,
}

pub struct UserService;

impl UserService {
    pub async fn create_user(
        db: &DatabaseConnection,
        req: CreateUser,
    ) -> Result<user::ActiveModel, sea_orm::error::DbErr> {
        user::ActiveModel {
            username: Set(req.username),
            hash: Set(req.hash),
            email: Set(req.email),
            ..Default::default()
        }
        .save(db)
        .await
    }
}

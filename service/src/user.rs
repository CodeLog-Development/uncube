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

    pub async fn find_user_by_email(
        db: &DatabaseConnection,
        email: impl AsRef<str>,
    ) -> Result<Option<user::Model>, sea_orm::error::DbErr> {
        user::Entity::find()
            .filter(user::Column::Email.eq(email.as_ref()))
            .one(db)
            .await
    }

    pub async fn find_user_by_username_or_email(
        db: &DatabaseConnection,
        username: impl AsRef<str>,
        email: impl AsRef<str>,
    ) -> Result<Option<user::Model>, sea_orm::error::DbErr> {
        user::Entity::find()
            .filter(
                user::Column::Username
                    .eq(username.as_ref())
                    .or(user::Column::Email.eq(email.as_ref())),
            )
            .one(db)
            .await
    }

    pub async fn find_user_by_id(
        db: &DatabaseConnection,
        user_id: i32,
    ) -> Result<Option<user::Model>, sea_orm::error::DbErr> {
        user::Entity::find_by_id(user_id).one(db).await
    }
}

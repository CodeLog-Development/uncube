use ::entity::puzzle;
use sea_orm_migration::{prelude::*, sea_orm::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();
        puzzle::ActiveModel {
            name: Set("3x3".to_string()),
            code: Set("3x3".to_string()),
            ..Default::default()
        }
        .insert(db)
        .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();
        puzzle::Entity::delete_many()
            .filter(puzzle::Column::Code.eq("3x3"))
            .exec(db)
            .await?;
        Ok(())
    }
}

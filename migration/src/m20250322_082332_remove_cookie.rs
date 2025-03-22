use sea_orm_migration::{prelude::*, schema::*};

use crate::m20220101_000001_create_table::User;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Cookie::Table).to_owned())
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Cookie::Table)
                    .if_not_exists()
                    .col(pk_auto(Cookie::Id))
                    .col(string(Cookie::Secret).not_null())
                    .col(big_unsigned(Cookie::Expires).not_null())
                    .col(integer(Cookie::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .from(Cookie::Table, Cookie::UserId)
                            .to(User::Table, User::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
pub enum Cookie {
    Table,
    Id,
    Secret,
    Expires,
    UserId,
}

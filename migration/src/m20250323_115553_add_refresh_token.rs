use sea_orm_migration::{prelude::*, schema::*};

use crate::m20220101_000001_create_table::User;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(RefreshToken::Table)
                    .if_not_exists()
                    .col(pk_auto(RefreshToken::Id))
                    .col(integer(RefreshToken::UserId))
                    .col(string(RefreshToken::Secret))
                    .col(big_unsigned(RefreshToken::Expires))
                    .col(boolean(RefreshToken::Used).default(false))
                    .foreign_key(
                        ForeignKey::create()
                            .from(RefreshToken::Table, RefreshToken::UserId)
                            .to(User::Table, User::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(RefreshToken::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum RefreshToken {
    Table,
    Id,
    UserId,
    Secret,
    Expires,
    Used,
}

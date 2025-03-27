pub use sea_orm_migration::prelude::*;

mod m20220101_000001_create_table;
mod m20250322_104247_add_solve;
mod m20250322_114106_add_3x3;
mod m20250323_115553_add_refresh_token;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_create_table::Migration),
            Box::new(m20250322_104247_add_solve::Migration),
            Box::new(m20250322_114106_add_3x3::Migration),
            Box::new(m20250323_115553_add_refresh_token::Migration),
        ]
    }
}

use chrono::{DateTime, Utc};
use lombok::Getter;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tracing::warn;

use crate::core::tradingview::TVError;

use super::TVClient;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TVScript {
    id: i32,
    uuid: String,
    name: String,
    views: i32,
    like_score: i32,
    is_active: bool,
    is_visible: bool,
    is_public: bool,
    chart_url: String,
    created_at: DateTime<Utc>,
}

impl TVScript{
    pub fn uuid(&self) -> String{
        self.uuid.to_owned()
    }

    pub fn name(&self) -> String{
        self.name.to_owned()
    }
}
pub trait TVScriptExt {
    fn get_script(&self, id: String) -> impl Future<Output = Result<TVScript, TVError>>;

    fn list_scripts(&self, id: String) -> impl Future<Output = Result<(), TVError>>;
}

impl TVScriptExt for TVClient {
    async fn get_script(&self, id: String) -> Result<TVScript, TVError> {
        Ok(self.get(format!("/ideas/{id}")).await?)
    }

    async fn list_scripts(&self, user: String) -> Result<(), TVError> {
        let response: Value = self.get(format!("/scripts?by={user}")).await?;

        Ok(())
    }
}

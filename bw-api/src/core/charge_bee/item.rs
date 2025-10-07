use chrono::{DateTime, Utc, serde::ts_milliseconds};
use serde::{Deserialize, Serialize};
use serde_json::{Value, json};

use crate::core::charge_bee::{CBClient, CBError};

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "lowercase")]
pub enum CBItemType {
    Addon,
    Plan,
    Charge,
}

#[allow(unused)]
#[derive(Deserialize, Serialize, Debug)]
pub struct CBItem {
    channel: String,
    deleted: bool,
    description: Option<String>,
    enabled_for_checkout: bool,
    enabled_in_portal: bool,
    external_name: String,
    id: String,
    is_giftable: bool,
    is_shippable: bool,
    // item_applicability: String,
    item_family_id: String,
    metadata: Option<Value>,
    metered: bool,
    name: String,
    // resource_version: i32,
    status: String,

    #[serde(rename = "type")]
    type_: CBItemType,

    #[serde(with = "ts_milliseconds")]
    updated_at: DateTime<Utc>,
}

pub trait CBItemExt {
    fn list_items(&self) -> impl Future<Output = Result<Vec<CBItem>, CBError>>;

    fn create_item(
        &self,
        id: String,
        name: String,
        type_: CBItemType,
        family: String,
    ) -> impl Future<Output = Result<CBItem, CBError>>;
}

impl CBItemExt for CBClient {
    async fn list_items(&self) -> Result<Vec<CBItem>, CBError> {
        #[derive(Deserialize, Debug)]
        struct List {
            list: Vec<Item>,
        }

        #[derive(Deserialize, Debug)]
        struct Item {
            item: CBItem,
        }

        let response: List = self.get("/api/v2/items").await?;

        Ok(response.list.into_iter().map(|x| x.item).collect())
    }

    async fn create_item(
        &self,
        id: String,
        name: String,
        type_: CBItemType,
        family: String,
    ) -> Result<CBItem, CBError> {
        #[derive(Deserialize, Debug)]
        struct Item {
            item: CBItem,
        }

        let response: Item = self
            .post(
                "/api/v2/items",
                json!({
                    "id": id,
                    "name": name,
                    "type": type_,
                    "item_family_id": family
                }),
            )
            .await?;

        Ok(response.item)
    }
}

use crate::{
    config::Config,
    core::{
        charge_bee::{CBItem, CBItemExt, CBItemType},
        tradingview::TVScriptExt,
    },
    error::Error,
};
use axum::{
    Form, Json, debug_handler,
    extract::{Path, State},
};
use serde::{Deserialize, Serialize};
use serde_json::{Value, json};
use tracing::warn;

#[debug_handler]
pub async fn list_handler(State(config): State<Config>) -> Result<Json<Vec<CBItem>>, Error> {
    let charge_bee = config.charge_bee();
    let items = charge_bee.list_items().await?;

    Ok(Json(items))
}

#[debug_handler]
pub async fn get_handler(
    State(config): State<Config>,
    Path(id): Path<String>,
) -> Result<(), Error> {
    let charge_bee = config.charge_bee();
    let response: Value = charge_bee.get(format!("/api/v2/items/{id}")).await?;

    warn!("{response:#?}");

    Ok(())
}

#[derive(Deserialize, Serialize, Clone)]
pub struct UpdateReq {}

#[debug_handler]
pub async fn update_handler(
    Path(id): Path<String>,
    State(config): State<Config>,
    Form(_req): Form<UpdateReq>,
) -> Result<(), Error> {
    let charge_bee = config.charge_bee();
    let response: Value = charge_bee
        .post(
            format!("/api/v2/items/{id}"),
            json!({
                "id": id
            }),
        )
        .await?;

    warn!("{response:#?}");

    Ok(())
}

#[derive(Deserialize, Serialize, Clone)]
pub struct CreateReq {
    id: String,
    name: Option<String>,
}

#[debug_handler]
pub async fn create_handler(
    State(config): State<Config>,
    Form(req): Form<CreateReq>,
) -> Result<(), Error> {
    let args = config.args().charge_bee();
    let charge_bee = config.charge_bee();
    let tradingview = config.tradingview();

    let script = tradingview.get_script(req.id).await?;

    let name = req.name.unwrap_or(script.name());
    let family = args.get_family().to_owned();

    let item = charge_bee
        .create_item(script.uuid(), name, CBItemType::Addon, family)
        .await?;

    warn!("{item:#?}");

    Ok(())
}

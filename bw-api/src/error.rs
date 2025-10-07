use std::{convert::Infallible, num::ParseIntError, string::FromUtf8Error};

use axum::{
    extract::{multipart::MultipartError, rejection::QueryRejection}, http::{
        header::{InvalidHeaderValue, ToStrError}, uri::InvalidUri, StatusCode
    }, response::{IntoResponse, Response}
};
use axum_extra::typed_header::TypedHeaderRejection;
use postgres_rs::PostgresError;
use sonar_common::RpcError;
use thiserror::Error;
use tokio::{io, task::JoinError};

use crate::core::{charge_bee::CBError, tradingview::TVError};

#[derive(Error, Debug)]
pub enum InternalError {
    #[error(transparent)]
    Server(#[from] crate::core::server::ServerError),

    #[error(transparent)]
    JoinError(#[from] JoinError),

    #[error(transparent)]
    Axum(#[from] axum::Error),

    // #[error(transparent)]
    // Prometheus(#[from] prometheus::Error),

    // #[error(transparent)]
    // Exporter(#[from] metrics_exporter_prometheus::BuildError),
    #[error(transparent)]
    TypedHeader(#[from] TypedHeaderRejection),

    // #[error(transparent)]
    // PrometheusError(#[from] PrometheusError),
    #[error(transparent)]
    Tungstenite(#[from] tungstenite::Error),

    #[error(transparent)]
    Rpc(#[from] RpcError),

    #[error(transparent)]
    Postgres(#[from] PostgresError),

    // #[error(transparent)]
    // Jwt(#[from] JwtError),
    #[error(transparent)]
    Reqwest(#[from] reqwest::Error),

    #[error(transparent)]
    Header(#[from] InvalidHeaderValue),

    #[error(transparent)]
    Infallible(#[from] Infallible),

    // #[error(transparent)]
    // BroadcastSend(#[from] SendError<Value>),

    // #[error(transparent)]
    // BroadcastRecv(#[from] RecvError),

    // #[error(transparent)]
    // OpenAI(#[from] OpenAIError),
    // #[error(transparent)]
    // InvalidBase64(#[from] InvalidBase64),

    // #[error(transparent)]
    // DataUrl(#[from] DataUrlError),

    #[error(transparent)]
    Query(#[from] QueryRejection),

    #[error(transparent)]
    Multipart(#[from] MultipartError),

    #[error(transparent)]
    DotEnv(#[from] dotenv_rs::Error),

    // #[error(transparent)]
    // Base64Dec(#[from] DecodeError),

    // #[error(transparent)]
    // ParseUserAgent(#[from] UserAgentParserError),
    #[error(transparent)]
    Utf8(#[from] FromUtf8Error),

    #[error(transparent)]
    Io(#[from] io::Error),

    #[error(transparent)]
    Serde(#[from] serde_json::Error),

    #[error(transparent)]
    ParseInt(#[from] ParseIntError),

    #[error(transparent)]
    ParseUri(#[from] InvalidUri),

    #[error(transparent)]
    ToStr(#[from] ToStrError),

    #[error("{0}")]
    Custom(String),
}

impl IntoResponse for InternalError {
    fn into_response(self) -> Response {
        match self {
            _ => (StatusCode::INTERNAL_SERVER_ERROR, "server error").into_response(),
        }
    }
}


#[derive(Error, Debug)]
pub enum Error {
    // #[error("{0}")]
    // Message(String),

    // #[error(transparent)]
    // Catalog(#[from] ChatCatalogError),
    
    // #[error(transparent)]
    // Catalog(#[from] ChatCatalogError),

    // #[error(transparent)]
    // Wallet(#[from] WalletError),

    // #[error(transparent)]
    // Session(#[from] SessionError),

    // #[error(transparent)]
    // TvSession(#[from] TvSessionError),

    // #[error(transparent)]
    // Google(#[from] GoogleError),

    #[error(transparent)]
    TradingView(#[from] TVError),

    #[error(transparent)]
    ChargeBee(#[from] CBError),

    #[error(transparent)]
    Internal(InternalError),
}

impl<T> From<T> for Error
where
    T: Into<InternalError>,
{
    fn from(value: T) -> Self {
        Error::Internal(value.into())
    }
}

impl IntoResponse for Error {
    fn into_response(self) -> Response {
        log::error!("{self:#?}");

        match self {
            // Error::Auth(err) => err.into_response(),
            Error::Internal(err) => err.into_response(),
            _ => (StatusCode::BAD_REQUEST, format!("{}", self)).into_response(),
        }
    }
}

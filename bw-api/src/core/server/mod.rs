use axum::Router;
use axum_server::Handle;
use std::net::SocketAddr;
use tower_http::timeout::TimeoutLayer;
use tracing::info;

pub use config::ServerArgs;
pub use error::ServerError;
// pub use router::RouterExt;
pub use trace::Tracing;

// pub mod blob;
mod config;
mod error;
mod trace;

pub async fn bind(args: ServerArgs, router: Router) -> Result<(), ServerError> {
    info!("Starting server...");

    // Create the router
    let app = match args.shutdown_period() {
        Some(timeout) => router.layer(TimeoutLayer::new(timeout)),
        None => router,
    }
    .with_tracing();

    // Create a new shutdown handle
    let handle = Handle::new();
    let addr = SocketAddr::from((args.host(), args.port()));

    // Spawn the shutdown listener
    // tokio::spawn(shutdown(handle.clone(), args.shutdown_period()));

    info!("HTTP listening on {addr}");

    axum_server::bind(addr)
        .handle(handle)
        .serve(app.into_make_service_with_connect_info::<SocketAddr>())
        .await?;

    Ok(())
}

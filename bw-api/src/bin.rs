mod config;
mod error;
mod models;
mod router;
mod tracing;

mod core {
    pub mod charge_bee;
    pub mod server;
    pub mod tradingview;
}

use ::tracing::{error, info};
use clap::Parser;
use dotenv_rs::dotenv;
pub use error::InternalError;

use crate::{
    config::{Args, Config},
    core::server,
    error::Error,
    router::Router,
};

#[tokio::main(flavor = "multi_thread", worker_threads = 8)]
async fn main() -> Result<(), Error> {
    if cfg!(debug_assertions) {
        dotenv()?;
    }

    let args = Args::parse();
    let server = args.server();
    let tracing = args.tracing();

    let config = Config::from_args(args);
    let router = Router::router().with_state(config);

    tracing::bind(tracing)?;

    tokio::select! {
        signal = tokio::signal::ctrl_c() => {
            match signal{
                Ok(_) =>  info!("Received SIGNIT signal, shutting down"),
                Err(err) => error!(message = %err, "error occurred while reading SIGNIT:"),
            }
        }
        result = server::bind(server, router) => {
            if let Err(err) = result{
                error!(message = %err, "error occurred in public server:");
            }
        }
        // result = prometheus::bind(prom_server, prom_router) => {
        //     if let Err(err) = result{
        //         error!(message = %err, "error occurred in prometheus server:");
        //     }

        //     loki_abort.abort();
        // }
        // x = loki_handle => {
        //     match x {
        //         Ok(_) => (),
        //         Err(err) => error!(message = %err, "error occurred in loki task:"),
        //     };
        // }
    }

    info!("Application stopped");

    Ok(())
}

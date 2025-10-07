use clap::Parser;
use reqwest::Url;
use std::collections::HashMap;
use tracing_subscriber::{EnvFilter, layer::SubscriberExt, util::SubscriberInitExt};

use crate::error::Error;

#[derive(Parser, Debug, Clone)]
pub struct TracingArgs {
    #[arg(name("loki-host"), long("loki-host"), env("LOKI_HOST"))]
    loki_host: Option<Url>,
}

pub fn bind(args: TracingArgs) -> Result<(), Error> {
    let registry = tracing_subscriber::registry()
        .with(match EnvFilter::try_from_default_env() {
            Ok(filter) => filter.add_directive("tokio_postgres=info".parse().unwrap()),
            Err(_) => format!("{}=debug,tokio_postgres=info", env!("CARGO_CRATE_NAME")).into(),
        })
        .with(tracing_subscriber::fmt::layer().pretty());

    match args.loki_host {
        Some(host) => {
            let labels = HashMap::from([("service".to_string(), "bw-api".to_string())]);
            let fields = HashMap::default();

            // Initialize loki tracing
            let (loki_layer, loki_task) =
                tracing_loki::layer(host.clone(), labels, fields).unwrap();

            registry.with(loki_layer).init();

            tokio::spawn(loki_task);
        }
        None => {
            registry.init();
        }
    };

    Ok(())
}

use axum::{
    extract::{MatchedPath, Request},
    Router,
};
use tower_http::trace::{
    DefaultOnEos, DefaultOnFailure, DefaultOnRequest, DefaultOnResponse, TraceLayer
};
use tracing::{info_span, Level};

pub trait Tracing {
    fn with_tracing(self) -> Self;
}

impl<S> Tracing for Router<S>
where
    S: Send + Sync + Clone + 'static,
{
    fn with_tracing(self) -> Self {
        self.layer(
            TraceLayer::new_for_http()
                .make_span_with(|request: &Request<_>| {
                    let path = request
                        .extensions()
                        .get::<MatchedPath>()
                        .map(MatchedPath::as_str);

                    info_span!(
                        "http_request",
                        method = ?request.method(),
                        path,
                    )
                })
                .on_failure(DefaultOnFailure::new().level(Level::ERROR))
                .on_response(DefaultOnResponse::new().level(Level::INFO))
                .on_request(DefaultOnRequest::new().level(Level::INFO))
                .on_eos(DefaultOnEos::new().level(Level::ERROR)),
        )
    }
}

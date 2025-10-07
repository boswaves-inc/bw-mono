use reqwest::{Client, Method, RequestBuilder};
use serde::{Deserialize, Serialize};

use crate::core::tradingview::{TVArgs, TVError};

#[derive(Clone)]
pub struct TVClient {
    pub(super) client: Client,
}

#[allow(unused)]
impl TVClient {
    pub async fn put<E, B, R>(&self, endpoint: E, body: B) -> Result<R, TVError>
    where
        E: AsRef<str>,
        B: Serialize,
        R: for<'de> Deserialize<'de>,
    {
        let request = self.request(endpoint, Method::PUT).form(&body);
        let response = self.send(request).await?;

        Ok(response)
    }

    pub async fn patch<E, B, R>(&self, endpoint: E, body: B) -> Result<R, TVError>
    where
        E: AsRef<str>,
        B: Serialize,
        R: for<'de> Deserialize<'de>,
    {
        let request = self.request(endpoint, Method::PATCH).form(&body);
        let response = self.send(request).await?;

        Ok(response)
    }

    pub async fn delete<E, B, R>(&self, endpoint: E, body: B) -> Result<R, TVError>
    where
        E: AsRef<str>,
        B: Serialize,
        R: for<'de> Deserialize<'de>,
    {
        let request = self.request(endpoint, Method::DELETE).form(&body);
        let response = self.send(request).await?;

        Ok(response)
    }

    pub async fn post<E, B, R>(&self, endpoint: E, body: B) -> Result<R, TVError>
    where
        E: AsRef<str>,
        B: Serialize,
        R: for<'de> Deserialize<'de>,
    {
        let request = self.request(endpoint, Method::POST).form(&body);
        let response = self.send(request).await?;

        Ok(response)
    }

    pub async fn get<E, R>(&self, endpoint: E) -> Result<R, TVError>
    where
        E: AsRef<str>,
        R: for<'de> Deserialize<'de>,
    {
        let request = self.request(endpoint, Method::GET);
        let response = self.send(request).await?;

        Ok(response)
    }

    fn request<E>(&self, endpoint: E, method: Method) -> RequestBuilder
    where
        E: AsRef<str>,
    {
        let url = format!("https://www.tradingview.com/api/v1{}", endpoint.as_ref());

        self.client.request(method, url)
    }

    async fn send<T>(&self, request: RequestBuilder) -> Result<T, TVError>
    where
        for<'de> T: Deserialize<'de>,
    {
        Ok(request.send().await?.error_for_status()?.json().await?)
    }
}

impl From<TVArgs> for TVClient {
    fn from(_: TVArgs) -> Self {
        // let api_key = value.get_api_key().to_owned();
        // let website = value.get_website().to_owned();

        let client = Client::new();

        Self {
            client,
        }
    }
}

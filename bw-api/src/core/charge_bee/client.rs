use reqwest::{Client, Method, RequestBuilder};
use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::core::charge_bee::{CBArgs, CBError};

#[derive(Serialize, Deserialize, Debug)]
#[serde(untagged)]
pub enum CBResponse<T = Value> {
    Error {
        api_error_code: String,
        error_code: String,
        error_msg: String,
        http_status_code: i32,
        message: String,
        #[serde(rename = "type")]
        type_: String,
    },
    Data(T),
}

#[derive(Clone)]
pub struct CBClient {
    pub(crate) client: Client,
    website: String,
    api_key: String,
}

#[allow(unused)]
impl CBClient {
    pub async fn put<E, B, R>(&self, endpoint: E, body: B) -> Result<R, CBError>
    where
        E: AsRef<str>,
        B: Serialize,
        R: for<'de> Deserialize<'de>,
    {
        let request = self.request(endpoint, Method::PUT).form(&body);
        let response = self.send(request).await?;

        Ok(response)
    }

    pub async fn patch<E, B, R>(&self, endpoint: E, body: B) -> Result<R, CBError>
    where
        E: AsRef<str>,
        B: Serialize,
        R: for<'de> Deserialize<'de>,
    {
        let request = self.request(endpoint, Method::PATCH).form(&body);
        let response = self.send(request).await?;

        Ok(response)
    }

    pub async fn delete<E, B, R>(&self, endpoint: E, body: B) -> Result<R, CBError>
    where
        E: AsRef<str>,
        B: Serialize,
        R: for<'de> Deserialize<'de>,
    {
        let request = self.request(endpoint, Method::DELETE).form(&body);
        let response = self.send(request).await?;

        Ok(response)
    }

    pub async fn post<E, B, R>(&self, endpoint: E, body: B) -> Result<R, CBError>
    where
        E: AsRef<str>,
        B: Serialize,
        R: for<'de> Deserialize<'de>,
    {
        let request = self.request(endpoint, Method::POST).form(&body);
        let response = self.send(request).await?;

        Ok(response)
    }

    pub async fn get<E, R>(&self, endpoint: E) -> Result<R, CBError>
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
        let url = format!(
            "https://{}.chargebee.com{}",
            self.website,
            endpoint.as_ref()
        );

        self.client
            .request(method, url)
            .basic_auth(self.api_key.clone(), None::<String>)
    }

    async fn send<T>(&self, request: RequestBuilder) -> Result<T, CBError>
    where
        for<'de> T: Deserialize<'de>,
    {
        let response: CBResponse<T> = request.send().await?.error_for_status()?.json().await?;

        match response {
            CBResponse::Data(res) => Ok(res),
            CBResponse::Error {
                error_code,
                error_msg,
                message,
                ..
            } => Err(CBError::Request {
                message,
                error_code,
                error_msg,
            }),
        }
    }
}

impl From<CBArgs> for CBClient {
    fn from(value: CBArgs) -> Self {
        let api_key = value.get_api_key().to_owned();
        let website = value.get_website().to_owned();

        let client = Client::new();

        Self {
            client,
            website,
            api_key,
        }
    }
}

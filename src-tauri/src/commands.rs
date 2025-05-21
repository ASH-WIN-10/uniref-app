use crate::api_types::ClientsResponse;

#[tauri::command]
pub async fn fetch_clients() -> Result<ClientsResponse, String> {
    let api_url = std::env::var("API_URL").expect("API_URL environment variable not set");

    let response = reqwest::get(format!("{}/clients", api_url))
        .await
        .map_err(|e| format!("Failed to fetch clients: {}", e))?;

    if response.status().is_success() {
        let clients = response
            .json()
            .await
            .map_err(|e| format!("Failed to parse JSON: {}", e))?;
        Ok(clients)
    } else {
        let status_code = response.status();
        let error_message = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown error".to_string());
        Err(format!(
            "Error fetching clients: {} with status code {}",
            error_message, status_code
        ))
    }
}

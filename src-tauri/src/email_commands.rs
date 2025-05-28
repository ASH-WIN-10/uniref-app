#[tauri::command]
pub async fn send_file_email(file_id: u32, client_id: u32) -> Result<(), String> {
    let api_url = std::env::var("API_URL").expect("API_URL environment variable not set");
    let endpoint = format!("{}/clients/{}/files/{}/send", api_url, client_id, file_id);

    let client = reqwest::Client::new();
    let response = client
        .post(endpoint)
        .send()
        .await
        .map_err(|e| format!("Failed to delete file: {}", e))?;

    if response.status().is_success() {
        Ok(())
    } else {
        let status_code = response.status();
        let error_message = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown error".to_string());
        Err(format!(
            "Error sending file: {} with status code {}",
            error_message, status_code
        ))
    }
}

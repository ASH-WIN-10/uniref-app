use dotenv::dotenv;
mod api_types;
mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    dotenv().ok();
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::fetch_clients,
            commands::create_client,
            commands::fetch_client,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

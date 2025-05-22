use dotenv::dotenv;
mod api_types;
mod client_commands;
mod file_commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    dotenv().ok();
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            client_commands::fetch_clients,
            client_commands::create_client,
            client_commands::fetch_client,
            client_commands::update_client,
            client_commands::delete_client,
            file_commands::delete_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

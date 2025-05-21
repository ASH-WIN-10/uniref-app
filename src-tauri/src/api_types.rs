use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
pub struct File {
    id: String,
    created_at: String,
    original_file_name: String,
    file_name: String,
    file_path: String,
    category: String,
    client_id: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Client {
    id: u32,
    company_name: String,
    client_name: String,
    email: String,
    phone: String,
    segment: String,
    state: String,
    city: String,
    files: Option<Vec<File>>,
}

#[derive(Deserialize, Serialize, Debug)]
struct Metadata {
    current_page: u32,
    page_size: u32,
    first_page: u32,
    last_page: u32,
    total_records: u32,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct ClientsResponse {
    clients: Vec<Client>,
    metadata: Metadata,
}

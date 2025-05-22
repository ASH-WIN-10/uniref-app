use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
pub struct File {
    id: u32,
    created_at: String,
    original_file_name: String,
    file_name: String,
    file_path: String,
    category: String,
    client_id: u32,
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
pub struct FetchClientsResponse {
    clients: Vec<Client>,
    metadata: Metadata,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateFormData {
    pub company_name: String,
    pub client_name: String,
    pub email: String,
    pub phone: String,
    pub segment: String,
    pub state: String,
    pub city: String,
    pub purchase_order: Option<String>,
    pub invoice: Option<Vec<String>>,
    pub handing_over_report: Option<String>,
    pub pms_report: Option<Vec<String>>,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateResponse {
    client: Client,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct GetClientResponse {
    client: Client,
    files: Option<Vec<File>>,
}

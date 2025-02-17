#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::time::{SystemTime, UNIX_EPOCH};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![on_button_clicked])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

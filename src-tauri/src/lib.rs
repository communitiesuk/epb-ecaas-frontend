use std::io::{BufReader, Cursor};

use hem::input::Input;
use hem::output::SinkOutput;
use hem::{run_project, HemResponse, ProjectFlags};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn fhs_calculate(input: String) -> Result<HemResponse, String> {
    run_project(
        BufReader::new(Cursor::new(input)),
        SinkOutput,
        None,
        None,
        &ProjectFlags::FHS_COMPLIANCE,
    )
    .map_err(|err| format!("{err:?}"))
    .map(Option::unwrap)
}

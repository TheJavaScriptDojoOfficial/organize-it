use std::path::PathBuf;
use std::process::Command;

#[tauri::command]
fn run_python_scan(source_path: String) -> Result<String, String> {
    let project_root = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .ok_or_else(|| "Could not resolve project root".to_string())?
        .to_path_buf();
    let script_path = project_root.join("python").join("organizer.py");
    if !script_path.is_file() {
        return Err(format!(
            "Python script not found at {}",
            script_path.to_string_lossy()
        ));
    }

    let script_path_string = script_path.to_string_lossy().to_string();
    let output = match Command::new("python3")
        .arg(&script_path_string)
        .arg("scan")
        .arg(&source_path)
        .output()
    {
        Ok(result) => result,
        Err(_) => Command::new("python")
            .arg(&script_path_string)
            .arg("scan")
            .arg(&source_path)
            .output()
            .map_err(|err| format!("Failed to start Python process: {err}"))?,
    };

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
    if output.status.success() {
        if stdout.is_empty() {
            return Err("Python scan returned empty output.".to_string());
        }
        Ok(stdout)
    } else if !stderr.is_empty() {
        Err(stderr)
    } else if !stdout.is_empty() {
        Err(stdout)
    } else {
        Err("Python scan failed without an error message.".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![run_python_scan])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

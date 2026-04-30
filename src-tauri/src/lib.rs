use std::path::PathBuf;
use std::process::Command;

fn is_dev_mode() -> bool {
    cfg!(debug_assertions)
}

fn log_dev(message: &str) {
    if is_dev_mode() {
        println!("[python-bridge] {message}");
    }
}

#[tauri::command]
fn run_python_scan(source_path: String) -> Result<String, String> {
    run_python_command("scan", source_path)
}

#[tauri::command]
fn run_python_organize(source_path: String) -> Result<String, String> {
    run_python_command("organize", source_path)
}

fn run_python_command(command_name: &str, source_path: String) -> Result<String, String> {
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
    log_dev(&format!(
        "Executing command={command_name} source_path={source_path} script={script_path_string}"
    ));

    let output = match Command::new("python3")
        .arg(&script_path_string)
        .arg(command_name)
        .arg(&source_path)
        .output()
    {
        Ok(result) => result,
        Err(_) => Command::new("python")
            .arg(&script_path_string)
            .arg(command_name)
            .arg(&source_path)
            .output()
            .map_err(|err| format!("Failed to start Python process: {err}"))?,
    };

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
    log_dev(&format!(
        "Completed command={command_name} status={} stdout_bytes={} stderr_bytes={}",
        output.status,
        output.stdout.len(),
        output.stderr.len()
    ));

    if is_dev_mode() && !stderr.is_empty() {
        log_dev(&format!("stderr for {command_name}: {stderr}"));
    }

    if output.status.success() {
        if stdout.is_empty() {
            return Err(format!("Python {command_name} returned empty output."));
        }
        Ok(stdout)
    } else if !stdout.is_empty() {
        // Python error payloads are emitted as JSON on stdout.
        Ok(stdout)
    } else if !stderr.is_empty() {
        Err(stderr)
    } else {
        Err(format!(
            "Python {command_name} failed without an error message."
        ))
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![run_python_scan, run_python_organize])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use sha2::{Sha256, Digest};
use std::time::{SystemTime, UNIX_EPOCH};

const TIME_STEP: u64 = 30; // 30 seconds

pub fn get_token(key: &str, salt: &str) -> String {
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    let counter = timestamp / TIME_STEP;
    
    let input = format!("{}{}{}", key, salt, counter);
    let mut hasher = Sha256::new();
    hasher.update(input.as_bytes());
    let result = hasher.finalize();
    
    let offset = (result[result.len() - 1] & 0xf) as usize;
    let code = ((result[offset] & 0x7f) as u32) << 24 |
               (result[offset + 1] as u32) << 16 |
               (result[offset + 2] as u32) << 8 |
               (result[offset + 3] as u32);
    
    format!("{:0>6}", code % 1_000_000) // Always returns 6 digits
}

pub fn verify_token(key: &str, salt: &str, token: &str) -> bool {
    if token.len() != 6 {
        return false;
    }
    let current = get_token(key, salt);
    token == current
} 
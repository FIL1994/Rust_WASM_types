use std::ffi::CString;
use std::os::raw::c_char;

#[no_mangle]
pub fn add(a:i32, b:i32) -> i32 {
    a + b
}

#[no_mangle]
pub fn get_string() -> String {
    "string from rust".to_string()
}

#[no_mangle]
pub fn divisible_by_ten(b:i32) -> bool {
    b % 10 == 0
}

static HELLO: &'static str = "hello from rust";

#[no_mangle]
pub fn get_hello() -> *mut c_char {
    let s = CString::new(HELLO).unwrap();
    s.into_raw()
}

#[no_mangle]
pub fn get_hello_len() -> usize {
    HELLO.len()
}
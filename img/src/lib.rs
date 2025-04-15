use wasm_bindgen::prelude::*;
use std::io::Cursor;

#[wasm_bindgen]
pub fn resize(image_data: &[u8], width: u32, height: u32) -> Vec<u8> {
    let image = image::load_from_memory(image_data).expect("Failed to open the file");
    let resized_image = image.resize(width, height, image::imageops::FilterType::Lanczos3);
    let mut buf = Cursor::new(Vec::new());
    resized_image.write_to(&mut buf, image::ImageFormat::Png).expect("Failed to write the image");
    buf.into_inner()
}

#[wasm_bindgen]
pub fn grayscale(image_data: &[u8]) -> Vec<u8> {
    let image = image::load_from_memory(image_data).expect("Failed to open the file");
    let gray_image = image.grayscale();
    let mut buf = Cursor::new(Vec::new());
    gray_image.write_to(&mut buf, image::ImageFormat::Png).expect("Failed to write the image");
    buf.into_inner()
}

#[wasm_bindgen]
pub fn blur(image_data: &[u8], sigma: f32) -> Vec<u8> {
    let image = image::load_from_memory(image_data).expect("Failed to open the file");
    let blurred_image = image.blur(sigma);
    let mut buf = Cursor::new(Vec::new());
    blurred_image.write_to(&mut buf, image::ImageFormat::Png).expect("Failed to write the image");
    buf.into_inner()
}
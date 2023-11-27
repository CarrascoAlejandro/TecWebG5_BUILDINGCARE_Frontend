import axios from 'axios';

export async function uploadImage(image) {
    const url = "http://localhost:3003/upload";
    let uploaded_image_path = "";
    let formData = new FormData();
    formData.append('image', image);
    await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
        uploaded_image_path = response.data.path;
    });

    return uploaded_image_path
}
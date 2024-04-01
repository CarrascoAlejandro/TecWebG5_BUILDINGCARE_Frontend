import axios from 'axios';

export async function uploadImage(image) {
    const url = "http://localhost:3003/upload";
    let uploaded_image_path = "";
    console.log("uploadImage: ");
    let formData = new FormData();
    formData.append('image', image);
    await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
        console.log(response.data);
        uploaded_image_path = response.data.path;
    });

    return uploaded_image_path
}
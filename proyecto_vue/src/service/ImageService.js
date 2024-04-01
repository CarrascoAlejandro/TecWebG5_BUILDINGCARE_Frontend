import axios from 'axios';

export async function uploadImage(image) {
    const url = "http://143.198.78.35:3003/upload";
    let uploaded_image_path = "";
    console.log("uploadImage: ");
    let formData = new FormData();
    formData.append('image', image);
    await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
        //alert("Image uploaded successfully" + response.data.path)
        console.log("Image uploaded successfully" + response.data.path);
        uploaded_image_path = response.data.path;
    }).catch(error => {
//        alert("Error uploading image: " + error);
        console.error("Error uploading image: " + error);
    });

    return uploaded_image_path
}
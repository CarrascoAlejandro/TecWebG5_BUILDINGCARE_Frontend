import axios from 'axios';

export async function uploadImage(image) {
    const url = "http://localhost:3003/upload";
    let uploaded_image_path = "";
    console.log("uploadImage: ", image);
    let formData = new FormData();
    formData.append('image', image);
    console.log("formData: " + formData);
    //confirm before proceed
    let confirm = window.confirm("Do you want to upload this image?");
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
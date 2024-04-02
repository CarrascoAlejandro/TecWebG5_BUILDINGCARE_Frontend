import axios from 'axios';

export async function uploadImage(image) {
    const url = "http://http://143.198.78.35:3003/upload";
    let uploaded_image_path = "";
    console.log("uploadImage: ", image);
    let formData = new FormData();
    formData.append('image', image);
    console.log("formDataImage: " + formData.get('image'));
    //confirm before proceed
    let confirm = window.confirm("Do you want to upload this image?");
    console.log("confirm: " + confirm);
    await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
        //alert("Image uploaded successfully" + response.data.path)
        console.log("Image uploaded successfully" + response.data.path);
        uploaded_image_path = response.data.path;
    }).catch(error => {
        // alert("Error uploading image: " + error);
        window.confirm("Debug break " + error);
        console.error("Error uploading image: " + error);
    });

    return uploaded_image_path
}
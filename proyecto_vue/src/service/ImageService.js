//import axios from 'axios';

export async function uploadImage(image) {
    const url = "http://http://143.198.78.35:3003/upload";
    let uploaded_image_path = "";
    console.log("uploadImage: ", image);
    let formData = new FormData();
    formData.append('image', image);
    console.log("formDataImage: " + formData.get('image'));
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Image uploaded successfully" + data.path);
        uploaded_image_path = data.path;
      } else {
        throw new Error("Error uploading image");
      }
    } catch (error) {
      console.error("Error uploading image: " + error);
    }
    //confirm before proceed
    let confirm = window.confirm("Do you want to upload this image?");
    console.log("confirm: " + confirm);
    
    return uploaded_image_path
}
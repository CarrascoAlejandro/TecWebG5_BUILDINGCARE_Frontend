//import axios from 'axios';

export async function uploadImage(image) {
    const url = "http://localhost:3003/upload";
    let uploaded_image_path = "casaqueso.jpg";
    console.log("uploadImage: ", image);
    let formData = new FormData();
    formData.append('image', image);
    console.log("formDataImage: " + formData.get('image'));
    console.log("uploaded_image_path: " + uploaded_image_path);
    return uploaded_image_path
    /* try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            body: formData
        });
        if (response.ok) {
            const data = await response.json();
            console.log("Image uploaded successfully" + data.path);
            uploaded_image_path = data.path;
        } else {
            throw new Error("Error uploading image: " + response.statusText);
        }
    } catch (error) {
        console.error("Error uploading image: " + error);
    }

    //confirm before proceed
    //let confirm = window.confirm("Do you want to upload this image?");
    //console.log("confirm: " + confirm);
    console.log("uploaded_image_path: " + uploaded_image_path);
    return uploaded_image_path */
}
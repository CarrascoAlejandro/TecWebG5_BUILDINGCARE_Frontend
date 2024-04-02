//import axios from 'axios';

export async function uploadImage(image) {
    //const url = "http://localhost:3003/upload";
    let temp_solution_fix_later = [
        "depto1.jpg",
        "depto2.jpg",
        "depto3.jpg",
        "depto4.jpg",
    ]
    let next_pic_to_upload = localStorage.getItem("next_pic_to_upload");
    let uploaded_image_path = temp_solution_fix_later[parseInt(next_pic_to_upload)];
    console.log("uploadImage: ", image);
    let formData = new FormData();
    formData.append('image', image);
    console.log("formDataImage: " + formData.get('image'));
    console.log("uploaded_image_path: " + uploaded_image_path);
    localStorage.setItem("next_pic_to_upload", parseInt(next_pic_to_upload) + 1);
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
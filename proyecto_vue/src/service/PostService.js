import axios from 'axios';

export default class PostService{
    url = "http://localhost:8080/api/v1/blog";
    token = '1';
    async newPost(title, content, idTypePost) {
        try {
            // Define los datos que se enviarán en el cuerpo de la solicitud
            const data = {
                "title" : title,
                "content" : content,
                "state": "Activo",
                "idTypePost" : idTypePost,
                "idPostRequest" : null
            };
    
            // Define los encabezados, incluyendo el token
            const headers = {
                'Content-Type': 'application/json',
                'token': this.token
            };
    
            // Realiza la solicitud POST utilizando Axios
            const response = await axios.post(this.url, data, { headers });
    
            // Devuelve la respuesta
            return response.data;
        } catch (error) {
            // Maneja cualquier error que ocurra durante la solicitud
            console.error('Error al crear el post:', error);
            throw error;
        }
    }
}
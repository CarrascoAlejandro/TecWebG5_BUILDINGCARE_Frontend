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

    async getPosts() {
        const baseURL = 'http://localhost:8080/api/v1/blog/all';
        try {
            // Define los encabezados para especificar que se espera una respuesta en formato JSON
            const headers = {
                'Accept': 'application/json'
            };
    
            // Realiza la solicitud GET utilizando Axios
            const response = await axios.get(baseURL, { headers });
    
            // Devuelve los datos de la respuesta
            return response.data;
        } catch (error) {
            // Maneja cualquier error que ocurra durante la solicitud
            console.error('Error al obtener los posts:', error);
            throw error;
        }
    }
    async getPostById (postId){
        const baseURL = 'http://localhost:8080/api/v1/blog/';
        try {
            // Define los encabezados para especificar que se espera una respuesta en formato JSON
            const headers = {
                'Accept': 'application/json'
            };
    
            // Realiza la solicitud GET utilizando Axios
            const response = await axios.get(`${baseURL}${postId}`, { headers });
    
            // Devuelve los datos del post específico
            return response.data;
        } catch (error) {
            // Maneja cualquier error que ocurra durante la solicitud
            console.error('Error al obtener el post por ID:', error);
            throw error;
        }
    }
    async deletePostById (postIdToDelete){
        const baseURL = 'http://localhost:8080/api/v1/blog/';
        try {
            // Define los encabezados para especificar que se espera una respuesta en formato JSON
            const headers = {
                'Accept': 'application/json'
            };
    
            // Realiza la solicitud DELETE utilizando Axios
            const response = await axios.delete(`${baseURL}${postIdToDelete}`, { headers });
    
            // Devuelve la respuesta de la eliminación
            return response.data;
        } catch (error) {
            // Maneja cualquier error que ocurra durante la solicitud
            console.error('Error al eliminar el post por ID:', error);
            throw error;
        }
    }
    async updatePostById  ( title, content, state, idTypePost, idPostRequest, postIdToUpdate){
        const baseURL = 'http://localhost:8080/api/v1/blog/';
        const token = 2;
        try {
            const updateData = {
                title: title,
                content: content,
                state: state,
                idTypePost: idTypePost,
                idPostRequest: idPostRequest
            };
            // Define los encabezados, incluyendo el token y el tipo de contenido
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'token': token
            };
    
            // Realiza la solicitud PUT utilizando Axios
            const response = await axios.put(`${baseURL}${postIdToUpdate}`, updateData, { headers });
    
            // Devuelve la respuesta de la actualización
            return response.data;
        } catch (error) {
            // Maneja cualquier error que ocurra durante la solicitud
            console.error('Error al actualizar el post por ID:', error);
            throw error;
        }
    }

    async getPostTypes() {
        try {
            // Define los encabezados para especificar que se espera una respuesta en formato JSON
            const headers = {
                'Accept': 'application/json'
            };
    
            // Realiza la solicitud GET utilizando Axios
            const response = await axios.get(url+'/type', { headers });
            
            // Devuelve los datos de la respuesta
            return response.data;
        } catch (error) {
            // Maneja cualquier error que ocurra durante la solicitud
            console.error('Error al obtener los tipos de post:', error);
            throw error;
        } 
    }

    async getUrgentPosts() {
        try {
            // Define los encabezados para especificar que se espera una respuesta en formato JSON
            const headers = {
                'Accept': 'application/json'
            };
    
            // Realiza la solicitud GET utilizando Axios
            const response = await axios.get(url+'/urgent', { headers });
            
            // Devuelve los datos de la respuesta
            return response.data;
        } catch (error) {
            // Maneja cualquier error que ocurra durante la solicitud
            console.error('Error al obtener los posts urgentes:', error);
            throw error;
        }
    }

    async getDonePosts() {
        try {
            // Define los encabezados para especificar que se espera una respuesta en formato JSON
            const headers = {
                'Accept': 'application/json'
            };
    
            // Realiza la solicitud GET utilizando Axios
            const response = await axios.get(url+'/done', { headers });
            
            // Devuelve los datos de la respuesta
            return response.data;
        } catch (error) {
            // Maneja cualquier error que ocurra durante la solicitud
            console.error('Error al obtener los posts urgentes:', error);
            throw error;
        }
    }

    async markPostAsUrgent(postId) {
        try {
            // Define los encabezados, incluyendo el token
            const headers = {
                'token': this.token
            };
    
            // Realiza la solicitud POST utilizando Axios
            const response = await axios.post(url+'/'+postId+'/urgent', data, { headers });
    
            // Devuelve la respuesta
            return response.data;
        } catch (error) {
            // Maneja cualquier error que ocurra durante la solicitud
            console.error('Error al marcar el post como urgente:', error);
            throw error;
        }
    }

    async markPostAsDone(postId) {
        try {
            // Define los encabezados, incluyendo el token
            const headers = {
                'token': this.token
            };
    
            // Realiza la solicitud POST utilizando Axios
            const response = await axios.post(url+'/'+postId+'/done', data, { headers });
    
            // Devuelve la respuesta
            return response.data;
        } catch (error) {
            // Maneja cualquier error que ocurra durante la solicitud
            console.error('Error al marcar el post como hecho:', error);
            throw error;
        }
    }
    
}
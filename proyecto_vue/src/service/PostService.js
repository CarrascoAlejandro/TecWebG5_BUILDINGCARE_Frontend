import axios from 'axios';

export default class PostService{
    constructor(token='1') {
        this.url = "http://143.198.78.35:8080/api/v1/blog";
        this.token = token;
    }
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

    async updatePost(title, content, idTypePost) {
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
        const baseURL = 'http://143.198.78.35:8080/api/v1/blog/all';
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
        const baseURL = 'http://143.198.78.35:8080/api/v1/blog/';
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
        const baseURL = 'http://143.198.78.35:8080/api/v1/blog/';
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
    async updatePostById  ( title, content, state, idTypePost, idPostRequest, postIdToUpdate, tokenUser){
        const baseURL = 'http://143.198.78.35:8080/api/v1/blog/';
        
        try {
            const updateData = {
                title: title,
                content: content,
                state: state,
                idTypePost: idTypePost,
                idPostRequest: "null"
            };
            // Define los encabezados, incluyendo el token y el tipo de contenido
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'token': tokenUser
            };
            console.log('Datos a enviar:', updateData);
            console.log('Token:', tokenUser);
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
            const response = await axios.get(this.url+'/type', { headers });
            
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
            const response = await axios.get(this.url+'/urgent', { headers });
            
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
            const response = await axios.get(this.url+'/done', { headers });
            
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
            const response = await axios.post(this.url+'/'+postId+'/urgent', { headers });
    
            // Devuelve la respuesta
            return response.data;
        } catch (error) {
            // Maneja cualquier error que ocurra durante la solicitud
            console.error('Error al marcar el post como urgente:', error);
            throw error;
        }
    }

    async markPostAsDoneAxios(postId) {
        try {
            // Define los encabezados, incluyendo el token
            const headers = {
                'token': this.token,
                'Accept': 'application/json'
            };
            console.info(headers);
            // Realiza la solicitud POST utilizando Axios
            console.info(this.url+'/'+postId+'/done');
            const response = await axios.post(this.url+'/'+postId+'/done', { headers });
    
            // Devuelve la respuesta
            return response.data;
        } catch (error) {
            // Maneja cualquier error que ocurra durante la solicitud
            console.error('Error al marcar el post como hecho:', error);
            throw error;
        }
    }

    async markPostAsDone(postId) {
        console.log('entro al updateTask()\n'+' ID'+postId);
        const url = `http://143.198.78.35:8080/api/v1/blog/${postId}/done`;
        console.log('url', url);
        const options = {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            token: this.token
            },
            // body: JSON.stringify(task)
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error: Status ${response.status}`);
            }
            const data = await response.json();
            console.log('Se actualizo data', data);
            return data;
        } catch (error) {
            console.error("Error al actualizar la tarea:", error);
            throw error;
        }
    }    
}
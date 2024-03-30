import axios from 'axios';

export default class UserService{
    constructor(token='1') {
        this.tokenValue = token;
    }
    url = "http://localhost:8080/api/v1/user";
    token = '1';
    async listAllUsers(){
        try{
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': this.tokenValue,
            };
            const response = await axios.get(this.url+'/all', { headers });
            return response;
        }catch(err){
            console.error('Error al listar usuarios:', err);
            throw err;
        }
    }
    async loginUser(username, password){
        try{
            const headers = {
                'Content-Type': 'application/json',
            };
            const data = {
                username: username,
                password: password,
            }
            
            const response = await axios.post(this.url+'/login', data, { headers });
            return response;
        }catch(err){
            console.error('Error al iniciar sesion:', err);
            throw err;
        }
        
    }
    async signUpUser(name, usename, password, email, CI, phone, itTypeUser){
        const url = "http://localhost:8080/api/v1/user/signup";
        try{
            const headers = {
                'Content-Type': 'application/json',
            };
            const data = {
                name: name,
                username: usename,
                password: password,
                email: email,
                ci: CI,
                phone: phone,
                typeUser: itTypeUser,
            }
            console.log("aquiiiii")
            console.log(data)
            const response = await axios.post(url, data, { headers });
            return response.data;
        }catch(err){
            console.error('Error al iniciar sesion:', err);
            throw err;
        }
        
    }

    async listAllUserTypes(){
        try{
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': this.tokenValue,
            };
            const response = await axios.get(this.url+'/type/all', { headers });
            return response;
        }catch(err){
            console.error('Error al listar tipos de usuarios:', err);
            throw err;
        }
    }

    async updateUser(id, name, usename, email, CI, phone, idTypeUser){
        try{
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': this.tokenValue,
            };
            const data = {
                idUser: id,
                name: name,
                usename: usename,
                email: email,
                ci: CI,
                phone: phone,
                typeUser: idTypeUser,
            }
            const response = await axios.put(this.url+'/update', data, { headers });
            return response;
        }catch(err){
            console.error('Error al actualizar usuario:', err);
            throw err;
        }
    }

    async requestResetPassword(username, email){
        try{
            const headers = {
                'Content-Type': 'application/json',
            };
            const data = {
                username: username,
                email: email,
            }
            const response = await axios.post(this.url+'/request_reset_password', null, { headers, params: data });
            return response.data;
        }catch(err){
            console.error('Error al solicitar cambio de contraseña:', err);
            throw err;
        }
    }

    async doResetPassword(username, password){
        try{
            const headers = {
                'Content-Type': 'application/json',
            };
            const data = {
                username: username,
                newPassword: password,
            }
            const response = await axios.patch(this.url+'/reset_password', data, { headers });
            return response.data;
        }catch(err){
            console.error('Error al cambiar contraseña:', err);
            throw err;
        }
    }
}
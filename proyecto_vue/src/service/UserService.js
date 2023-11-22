import axios from 'axios';

export default class UserService{
    url = "http://localhost:8080/api/v1/user";
    token = '1';
    async listAllUsers(){
        try{
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': this.token,
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
        const url = "http://localhost:8080/api/v1/user/signUp";
        try{
            const headers = {
                'Content-Type': 'application/json',
            };
            const data = {
                name: name,
                usename: usename,
                password: password,
                email: email,
                CI: CI,
                phone: phone,
                itTypeUser: itTypeUser,
            }
            const response = await axios.post(url, data, { headers });
            return response;
        }catch(err){
            console.error('Error al iniciar sesion:', err);
            throw err;
        }
        
    }
}
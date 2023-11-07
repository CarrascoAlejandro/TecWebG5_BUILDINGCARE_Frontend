import axios from 'axios';

export default class UserService{
    url = "http://localhost:8080/api/v1/login";
    token = '1';
    async loginUser(username, password){
        try{
            const headers = {
                'Content-Type': 'application/json',
            };
            const data = {
                username: username,
                password: password,
            }
            
            const response = await axios.post(this.url, data, { headers });
            return response;
        }catch(err){
            console.error('Error al iniciar sesion:', error);
            throw error;
        }
        
    }
    async signUpUser(name, usename, password, email, CI, phone, itTypeUser){
        url = "http://localhost:8080/api/v1/signUp";
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
            const response = await axios.post(this.url, data, { headers });
            return response;
        }catch(err){
            console.error('Error al iniciar sesion:', error);
            throw error;
        }
        
    }
}
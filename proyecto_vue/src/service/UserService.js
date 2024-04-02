import axios from 'axios';

export default class UserService{
    constructor(token='1') {
        this.tokenValue = token;
    }
    url = "http://143.198.78.35:8080/api/v1/user";
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
        const url = "http://143.198.78.35:8080/api/v1/user/signup";
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
            const response = await axios.get('http://143.198.78.35:8080/api/v1/roles/list', { headers });
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
        return {
            responseCode: "USER-0006s"
        }
        /* const referralUrl = 'http://143.198.78.35:80';
        const subject = "Recuperar contraseña";
        const text = "<link href='https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap' rel='stylesheet'>"
        + "<body style='margin: 0; padding: 0; font-family: 'Poppins', sans-serif;'>"
        + "<div style='text-align: center; background-color: #F2F1E4; padding: 0px; padding-bottom: 20px;'>"
        + "<div style='background-color: #498C79; color: white; padding: 10px;'>"
        + "<h1 style='margin: 0;'>Recuperar contraseña</h1>"
        + "</div>"
        + "<p style='margin-top: 20px; font-size = 16px;'>Hola " + username + ",</p>"
        + "<p style='font-size = 16px;'>Para recuperar tu contraseña, haz clic en el siguiente enlace:</p>"
        + "<a href='" + referralUrl + "/resetPassword/reset/" + username + "' style='"
        + "background-color: #498C79; color: white; text-decoration: none; padding: 10px 20px; "
        + "border-radius: 5px; display: inline-block; margin-top: 20px;'>Recuperar contraseña</a>"
        + "<p style='margin-top: 20px; font-size = 16px;'>Si no solicitaste recuperar tu contraseña, ignora este mensaje.</p>"
        + "<p style='font-size = 16px;'>Saludos, el equipo de BuildingCare.</p>"
        + "<img src='cid:logo.png' style='display: block; margin: auto; margin-top: 20px;' width='20%'>"
        + "</div>"
        + "<p style='text-align: center; font-size = 7px; margin-top: 20px;'>Este mensaje fue enviado automáticamente, por favor no responder.</p>"
        + "</body>";

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'alecarmailservice@gmail.com',
                pass: 'wenl xybb iuws svna'
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    
        const mailOptions = {
            from: 'alecarmailservice@gmail.com',
            to: email,
            subject: subject,
            text: text
        };
    
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
        } catch (error) {
            console.error('Error occurred while sending email:', error);
        } */
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
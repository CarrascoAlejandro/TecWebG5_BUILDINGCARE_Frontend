import axios from 'axios';

export default class PaymentService {
    constructor() {
        this.url = "http://localhost:8080/api/v1/payment";
        this.token = '1';
    }
    async newPayment(amount, date, concept, detail, idUserPays, idUserReceives) {
        try {
            // Define los datos que se enviarán en el cuerpo de la solicitud
            const data = {
                "amount": amount,
                "date": date,
                "concept": concept,
                "detail": detail,
                "idUserPays": idUserPays,
                "idUserReceives": idUserReceives
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
            console.error('Error al crear el pago:', error);
            throw error;
        }
    }

    async getPayments() {
        try {
            // Define los encabezados para especificar que se espera una respuesta en formato JSON
            const headers = {
                'Accept': 'application/json'
            };
    
            // Realiza la solicitud GET utilizando Axios
            const response = await axios.get(this.url+'/all', { headers });

            // Devuelve los datos de la respuesta
            return response.data;
        } catch (error) {
            // Maneja cualquier error que ocurra durante la solicitud
            console.error('Error al obtener los pagos:', error);
            throw error;
        }
    }

    async getPaymentById (paymentId){
        try {
            // Define los encabezados para especificar que se espera una respuesta en formato JSON
            const headers = {
                'Accept': 'application/json'
            };

            // Realiza la solicitud GET utilizando Axios
            const response = await axios.get(this.url+'/'+paymentId, { headers });

            // Devuelve los datos de la respuesta
            return response.data;
        } catch (error) {
            // Maneja cualquier error que ocurra durante la solicitud
            console.error('Error al obtener el pago:', error);
            throw error;
        }
    }

    async updatePaymentById (paymentId, amount, date, concept, detail, idUserPays, idUserReceives){
        try {
            // Define los datos que se enviarán en el cuerpo de la solicitud
            const data = {
                "amount": amount,
                "date": date,
                "concept": concept,
                "detail": detail,
                "idUserPays": idUserPays,
                "idUserReceives": idUserReceives
              };
    
            // Define los encabezados, incluyendo el token
            const headers = {
                'Content-Type': 'application/json',
                'token': this.token
            };
    
            // Realiza la solicitud PUT utilizando Axios
            const response = await axios.put(this.url+'/'+paymentId, data, { headers });
    
            // Devuelve la respuesta
            return response.data;
        } catch (error) {
            // Maneja cualquier error que ocurra durante la solicitud
            console.error('Error al actualizar el pago:', error);
            throw error;
        }
    }

}
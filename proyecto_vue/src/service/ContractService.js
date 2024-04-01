// import axios from "axios";

export default class ContractService {

    async getAllContracts(token) {
        const url = 'http://143.198.78.35:8080/api/v1/contract';
        const options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: token,
            }
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error: Status: ${response.status}`);
            }
            const contracts = await response.json();
            console.log("contratos en service "+contracts.data);
            console.log("obtuvo contratos"+JSON.stringify(contracts.data));

            return contracts.data;
        } catch (error) {
            console.error('Error al obtener los contratos:', error);
        }
    }

    async getTypeContract(token) {
        const url = 'http://143.198.78.35:8080/api/v1/contract/type';
        const options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: token,
            }
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error: Status: ${response.status}`);
            }
            const type = await response.json();
            console.log("contratos en service "+type.data);
            console.log("obtuvo contratos"+JSON.stringify(type.data));

            return type.data;
        } catch (error) {
            console.error('Error al obtener los contratos:', error);
        }
    }

    async getProperties(token) {
        const url = 'http://143.198.78.35:8080/api/v1/property/all';
        const options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: token,
            }
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error: Status: ${response.status}`);
            }
            const properties = await response.json();
            console.log("properties en service "+properties.data);
            console.log("obtuvo properties en service"+JSON.stringify(properties.data));
            return properties.data;
        } catch (error) {
            console.error('Error al obtener los contratos:', error);
        }
    }

    async getPropertyById(id, token) {
        const url = `http://143.198.78.35:8080/api/v1/property/${id}`;
        const options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Token: token,
            }
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error: Status: ${response.status}`);
            }
            const contract = await response.json();
            return contract;
        } catch (error) {
            console.error('Error al obtener el contrato:', error);
        }
    }

    async getContractById(id, token) {
        const url = `http://143.198.78.35:8080/api/v1/contract/${id}`;
        const options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Token: token,
            }
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error: Status: ${response.status}`);
            }
            const contract = await response.json();
            return contract;
        } catch (error) {
            console.error('Error al obtener el contrato:', error);
        }
    }

    async getTypeContractById(id, token) {
        const url = `http://143.198.78.35:8080/api/v1/contract/type/${id}`;
        const options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Token: token,
            }
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error: Status: ${response.status}`);
            }
            const contract = await response.json();
            return contract.data;
        } catch (error) {
            console.error('Error al obtener el contrato:', error);
        }
    }

    async createContract(contract,token) {//signatureDate,endDate,amount,idProperty,idType,
        console.log("entro a crear contrato");
        const url = 'http://143.198.78.35:8080/api/v1/contract';
        console.log("data"+JSON.stringify(contract));
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Token: token
            },
            body: JSON.stringify(contract)
        };
        
        console.log('options', options);
        // console.log('contract!!!', JSON.stringify(contract));
        try {
            const response = await fetch(url, options);
            console.log('response', response);
            if (!response.ok) {
                throw new Error(`HTTP error: Status ${response.status}`);
            }
            const data = await response.json();
            console.log('data', JSON.stringify(data));
            return data;
        } catch (error) {
            console.error("Error al crear un nuevo contrato:", error);
            throw error;
        }
    }

    async updateContract(id, contract, token) {
        const url = `http://143.198.78.35:8080/api/v1/contract/${id}`;
        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Token: token,
            },
            body: JSON.stringify(contract)
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error: Status ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al actualizar el contrato:", error);
            throw error;
        }
    }

    async deleteContract(id, token) {
        const url = `http://143.198.78.35:8080/api/v1/contract/${id}`;
        const options = {
            method: "DELETE",
            headers: {
                Accept: 'application/json',
                Authorization: token,
            },
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error: Status ${response.status}`);
            }
            // No data to return for DELETE, usually just confirm status code is 204 or similar
            return { success: true };
        } catch (error) {
            console.error("Error al eliminar el contrato:", error);
            throw error;
        }
    }
}

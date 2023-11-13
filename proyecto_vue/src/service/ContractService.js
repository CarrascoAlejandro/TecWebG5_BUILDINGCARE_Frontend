// import axios from "axios";

export default class ContractService {

    async getAllContracts(token) {
        const url = 'http://localhost:8080/api/v1/contract/all';
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
            return contracts;
        } catch (error) {
            console.error('Error al obtener los contratos:', error);
        }
    }

    async getContractById(id, token) {
        const url = `http://localhost:8080/api/v1/contract/${id}`;
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
            const contract = await response.json();
            return contract;
        } catch (error) {
            console.error('Error al obtener el contrato:', error);
        }
    }

    async createContract(contract, token) {
        const url = "http://localhost:8080/api/v1/contract";
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token,
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
            console.error("Error al crear un nuevo contrato:", error);
            throw error;
        }
    }

    async updateContract(id, contract, token) {
        const url = `http://localhost:8080/api/v1/contract/${id}`;
        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token,
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
        const url = `http://localhost:8080/api/v1/contract/${id}`;
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

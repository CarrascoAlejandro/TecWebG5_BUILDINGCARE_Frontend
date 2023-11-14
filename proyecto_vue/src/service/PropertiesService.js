/*import axios from "axios";

 export default class PropertiesService {
  url = "http://localhost:8080/api/v1/property";
  token = "1";

  async fetchProperties() {
    const baseURL = "http://localhost:8080/api/v1/property/all";
    try {
      // Define los encabezados para especificar que se espera una respuesta en formato JSON
      const headers = {
        Accept: "application/json",
      };

      // Realiza la solicitud GET utilizando Axios
      const response = await axios.get(baseURL, { headers });

      // Devuelve los datos de la respuesta
      return response.data;
    } catch (error) {
      // Maneja cualquier error que ocurra durante la solicitud
      console.error("Error al obtener las propiedades:", error);
      throw error;
    }
  }
  /* async createProperty(property) {
    try {
      // Define los encabezados para especificar que se espera una respuesta en formato JSON
      const headers = {
        "Content-Type": "application/json",
        token: this.token,
      };

      // Define los datos a enviar
      const data = {
        ...property,
      };

      // Realiza la solicitud POST utilizando Axios
      const response = await axios.post(this.url, data, { headers });

      // Devuelve la respuesta
      return response.data;
    } catch (error) {
      // Maneja cualquier error que ocurra durante la solicitud
      console.error("Error al crear la propiedad:", error);
      throw error;
    }
  } 
}
*/

// PropertiesService.js
class PropertiesService {
  async fetchProperties() {
    try {
      const response = await fetch("http://localhost:8080/api/v1/property/all");
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      throw error;
    }
  }

  async addProperty(property) {
    try {
      const response = await fetch("http://localhost:8080/api/v1/property", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: "1", // Tu token se establece aquí
        },
        body: JSON.stringify(property),
      });
      return await response.json();
    } catch (error) {
      console.error("Failed to add property:", error);
      throw error;
    }
  }

  async deleteProperty(propertyId) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/property/${propertyId}`,
        { method: "DELETE" }
      );
      return response.ok;
    } catch (error) {
      console.error("Failed to delete property:", error);
      throw error;
    }
  }

  async updateProperty(propertyId, updatedProperty) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/property/${propertyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: "1",
          },
          body: JSON.stringify(updatedProperty),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Failed to update property:", error);
      throw error;
    }
  }
}

export default new PropertiesService();

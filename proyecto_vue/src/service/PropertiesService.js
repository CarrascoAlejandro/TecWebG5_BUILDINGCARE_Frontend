export default class PropertiesService {
  constructor(token='1') {

    this.tokenValue = token;
}
  async fetchProperties() {
    try {
      const response = await fetch("http://143.198.78.35:8080/api/v1/property/all");
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      throw error;
    }
  }

  async addProperty(property) {
    try {
      const response = await fetch("http://143.198.78.35:8080/api/v1/property", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: this.tokenValue, // Tu token se establece aquí
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
        `http://143.198.78.35:8080/api/v1/property/${propertyId}`,
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
        `http://143.198.78.35:8080/api/v1/property/${propertyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: this.tokenValue,
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

  async fetchTypes() {
    try {
      const response = await fetch(
        "http://143.198.78.35:8080/api/v1/property/type"
      );
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch types:", error);
      throw error;
    }
  }
}



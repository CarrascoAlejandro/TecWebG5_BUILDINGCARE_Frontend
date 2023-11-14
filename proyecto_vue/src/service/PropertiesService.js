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

class CommonAreaService {
  async getCommonAreas() {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/commonarea/all"
      );
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch common areas:", error);
      throw error;
    }
  }
  async addCommonArea(commonArea, token) {
    try {
      const response = await fetch("http://localhost:8080/api/v1/commonarea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Token: token, // Asegúrate de que este token sea el correcto o necesario
        },
        body: JSON.stringify({
          description: commonArea.description,
          idSection: commonArea.idSection,
          idTypeArea: commonArea.idTypeArea,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error("Failed to add common area:", error);
      throw error;
    }
  }
  async deleteCommonArea(commonAreaId) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/commonarea/${commonAreaId}`,
        { method: "DELETE" }
      );
      return await response.json();
    } catch (error) {
      console.error("Failed to delete common area:", error);
      throw error;
    }
  }
  async updateCommonArea(commonAreaId, updatedCommonArea, token) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/commonarea/${commonAreaId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Token: token, // Asegúrate de que este token sea el correcto o necesario
          },
          body: JSON.stringify({
            description: updatedCommonArea.description,
            idSection: updatedCommonArea.idSection,
            idTypeArea: updatedCommonArea.idTypeArea,
          }),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Failed to update common area:", error);
      throw error;
    }
  }
}

export default new CommonAreaService();

//import axios from "axios";

export default class RoleService {
  constructor(token = "1") {
    this.tokenValue = token;
  }
  async fetchRoles() {
    try {
      const response = await fetch("http://143.198.78.35:8080/api/v1/roles/list");
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      throw error;
    }
  }

  async addRole(role) {
    try {
      const response = await fetch(
        "http://143.198.78.35:8080/api/v1/roles/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: this.tokenValue,
          },
          body: JSON.stringify(role),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Failed to add role:", error);
      throw error;
    }
  }
  async updateRole(role) {
    try {
      const response = await fetch(
        "http://143.198.78.35:8080/api/v1/roles/assign",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Asegúrate de que este es el nombre correcto del header para el token
            Authorization: `Bearer ${this.tokenValue}`,
          },
          body: JSON.stringify(role),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to update role:", error);
      throw error;
    }
  }

  async deleteRole(roleName) {
    try {
      const response = await fetch(
        `http://143.198.78.35:8080/api/v1/roles?roleName=${encodeURIComponent(
          roleName
        )}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.tokenValue}`, // O "token": this.tokenValue si así lo espera tu backend
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to delete role:", error);
      throw error;
    }
  }
}

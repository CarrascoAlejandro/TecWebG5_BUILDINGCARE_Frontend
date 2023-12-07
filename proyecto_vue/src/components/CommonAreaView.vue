<template>
  <NavigationBar />
  <div class="property-app">
    <div class="utilities">
      <div class="add-area">
        <div class="add-btn">
          <button v-if="typeUser=== 'Administrador'"  class="add-button" @click="openForm">
            Añadir Area Común
          </button>
        </div>
      </div>
      <div class="search-container">
        <input v-model="searchText" type="text" placeholder="Buscar Área..." />
      </div>
    </div>

    <!-- Lista de Propiedades -->
    <div class="area-list">
      <div
        v-for="(area, index) in filteredAreas"
        :key="index"
        class="area-item"
      >
        <!-- Contenido de Propiedad -->
        <div class="area-details">
          <div class="specs">
            <div class="area-type">Tipo de Area: {{ area.type }}</div>
          </div>
        </div>
        <div class="area-content">
          <div class="area-description">
            {{ area.description }}
          </div>
          <div class="actions">
            <button v-if="typeUser == 'Administrador'" @click="editArea(index)">
              Editar
            </button>
            <button
              v-if="typeUser == 'Administrador'"
              @click="deleteArea(index)"
            >
              Borrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario de Area -->
    <div class="popup" v-if="showPopup">
      <div class="popup-content">
        <form>
          <select v-model="selectedType" required>
            <option value="">Selecciona un tipo de área común</option>
            <option v-for="type in types" :key="type.id" :value="type.id">
              {{ type.type }}
            </option>
          </select>

          <textarea
            v-model="description"
            placeholder="Descripción"
            required
          ></textarea>
          <!-- Botones de acción -->
          <div class="form-buttons">
            <button @click="createArea" v-if="!editing">Crear</button>
            <button @click="updateArea" v-if="editing">Actualizar</button>
            <button @click="deleteArea(index)">Eliminar</button>
            <button @click="closeForm">Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationBar from "./NavigationBar.vue";

import CommonAreaService from "../service/CommonAreaService.js";

export default {
  name: "commonAreaView",
  components: {
    NavigationBar,
  },
  data() {
    return {
      commonAreas: [],
      types: [],
      showPopup: false,
      id: null,
      type: "",
      description: "",
      editing: false,
      index: null,
      image: null,
      selectedType: null,
      typeUser: "",
      userName: "",
      idUserHeader: "",
      searchText: "",
    };
  },
  created() {
    try{
    this.typeUser = localStorage.getItem("typeUser");
    const storedData = localStorage.getItem("userID");
    // Parsear el JSON almacenado
    const parsedData = JSON.parse(storedData);
    console.log("parsedData", parsedData);
    // Acceder al campo "name" dentro del objeto parsedData
    this.userName = parsedData.usename;
    this.idUserHeader = parsedData.idUser;
    console.log("typeUser", this.typeUser);
    console.log("userName", this.userName);
    console.log("isUserHeader", this.idUserHeader);
    if (this.typeUser == null) {
      this.$router.push("/");
    }
  }catch(error){
    console.log(error);
    this.$router.push('/');
  }

  },
  computed: {
    filteredAreas() {
      if (!this.searchText) {
        return this.commonAreas;
      }

      const lowercasedSearch = this.searchText.toLowerCase();

      return this.commonAreas.filter((area) => {
        const matchesType = area.type.toLowerCase().includes(lowercasedSearch);
        const matchesDescription = area.description
          .toLowerCase()
          .includes(lowercasedSearch);

        return matchesType || matchesDescription;
      });
    },
  },
  methods: {
    async fetchCommonAreas() {
      try {
        const data = await CommonAreaService.getCommonAreas();
        if (data.responseCode === "CARE-0000" && data.data) {
          this.commonAreas = data.data.map((item) => ({
            id: item.id,
            type: item.commonAreaTypeArea, // Modificado para coincidir con la respuesta de la API
            description: item.commonAreaDescription, // Modificado para coincidir con la respuesta de la API
          }));
          console.log(data);
        } else {
          console.log("Error fetching common areas:", data.errorMessage);
        }
      } catch (error) {
        console.log("Failed fetching common areas:", error);
      }
      console.log(this.commonAreas);
    },
    async fetchTypes() {
      try {
        const data = await CommonAreaService.fetchTypes();
        console.log(data);
        if (data.responseCode === "CARE-0004" && data.data) {
          // Mapear los datos recibidos a la estructura esperada por el componente
          console.log(data.data);
          this.types = data.data;
        } else {
          console.error("Error fetching types:", data.errorMessage);
        }
      } catch (error) {
        console.error("Failed to fetch types:", error);
      }
      console.log("types", this.types);
    },

    openForm() {
      this.type = "";
      this.description = "";
      this.editing = false;
      this.showPopup = true;
    },
    closeForm() {
      this.showPopup = false;
      this.clearForm();
    },
    clearForm() {
      this.type = "";
      this.description = "";
    },
    async createArea() {
      // Asumiendo que tienes alguna forma de obtener idSection y idTypeArea
      const newArea = {
        description: this.description,
        idSection: 1,
        idTypeArea: this.selectedType,
      };

      try {
        const response = await CommonAreaService.addCommonArea(
          newArea,
          this.idUserHeader
        );
        if (response.responseCode === "CARE-0001" && response.data) {
          // Agrega la nueva área a tu lista local
          this.commonAreas.push({
            id: response.data.id,
            type: response.data.commonAreaTypeArea,
            description: response.data.commonAreaDescription,
          });
        } else {
          console.error("Error adding common area:", response.errorMessage);
        }
      } catch (error) {
        console.error("Failed to add common area:", error);
      }

      this.closeForm();
    },
    editArea(index) {
      this.type = this.commonAreas[index].type;
      this.description = this.commonAreas[index].description;
      this.index = index;
      this.editing = true;
      this.showPopup = true;
    },
    async updateArea() {
      const updatedArea = {
        description: this.description,
        idSection: 1,
        idTypeArea: this.selectedType,
      };

      try {
        const response = await CommonAreaService.updateCommonArea(
          this.commonAreas[this.index].id,
          updatedArea,
          this.idUserHeader
        );
        if (response.responseCode === "CARE-0002" && response.data) {
          // Actualiza el área en el array local
          this.commonAreas[this.index] = {
            id: response.data.id,
            type: response.data.commonAreaTypeArea,
            description: response.data.commonAreaDescription,
          };
        } else {
          console.error("Error updating common area:", response.errorMessage);
        }
      } catch (error) {
        console.error("Failed to update common area:", error);
      }

      this.closeForm();
    },
    async deleteArea(index) {
      const areaId = this.commonAreas[index].id;
      console.log(areaId);
      try {
        const response = await CommonAreaService.deleteCommonArea(areaId);
        if (response.responseCode === "CARE-0003" && response.data) {
          // Elimina el área del array local
          this.commonAreas.splice(index, 1);
        } else {
          console.error("Error deleting common area:", response.errorMessage);
        }
      } catch (error) {
        console.error("Failed to delete common area:", error);
      }
    },
  },
  mounted() {
    this.fetchTypes();
    this.fetchCommonAreas();
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&display=swap");

* {
  font-family: "Poppins", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
  overflow-y: auto;
}

.property-app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.utilities {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin: 1rem 0;
}

.add-area {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
}

.add-btn {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin-right: 1rem;
}

.add-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background-color: #498c79;
  color: #101e26;
  font-size: 1rem;
  cursor: pointer;
}

.add-button:hover {
  color: #f2d1b3;
  transition: all 0.5s ease-in-out;
  transform: scale(1.1);
}

.area-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 40px;
}

.area-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 80%;
  min-height: 200px;
  margin: 0.5rem;
  padding: 20px;
  border-radius: 10px;
  background-color: #fffaf1;
  border: #a69b8d 2px solid;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.area-item:hover {
  transition: all 0.5s ease-in-out;
  transform: scale(1.05);
}

.area-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
}

.area-name {
  font-size: 1.5rem;
  font-weight: bold;
}

.specs {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.area-type {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: bold;
}

.area-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
}

.area-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.area-description {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.actions button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 10px;
  background-color: #498c79;
  color: #101e26;
  font-size: 1rem;
  cursor: pointer;
}

.actions button:hover {
  color: #f2d1b3;
  transition: all 0.5s ease-in-out;
  transform: scale(1.1);
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  padding: 1rem;
  border-radius: 10px;
  background-color: #f2f1e4;
  border: #a69b8d 5px solid;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.popup-content form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.popup-content form input {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border: #a69b8d 2px solid;
  border-radius: 10px;
  background-color: #fffaf1;
  color: #101e26;
  font-size: 1rem;
}

.popup-content form textarea {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border: #a69b8d 2px solid;
  border-radius: 10px;
  background-color: #fffaf1;
  color: #101e26;
  font-size: 1rem;
}

.popup-content form select {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border: #a69b8d 2px solid;
  border-radius: 10px;
  background-color: #fffaf1;
  color: #101e26;
  font-size: 1rem;
}

.popup-content form .form-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
  gap: 10px;
  font-size: 1rem;
  padding: 20px;
}

.popup-content form .form-buttons button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 10px;
  background-color: #498c79;
  color: #101e26;
  font-size: 1rem;
  cursor: pointer;
}

.popup-content form .form-buttons button:hover {
  color: #f2d1b3;
  transition: all 0.5s ease-in-out;
  transform: scale(1.1);
}

.search-container {
  width: 80%;
  position: relative;

  input {
    width: 95%;
    padding: 10px;
    border: 3px solid #a69b8d;
    border-radius: 10px;
    background-color: #fffaf1;
  }

  input:focus {
    outline: #a69b8d solid 1px;
  }
}

.utilities {
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;

  .add-button {
    margin-bottom: 10px;
  }

  .search-container {
    width: 100%;
  }
}
.search-container {
  margin-bottom: 10px;
}

@media screen and (max-width: 830px) {
  .utilities {
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
  }
  .add-btn {
    margin-right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .add-area {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .add-button {
    margin-bottom: 10px;
    width: 95%;
  }
  .search-container {
    width: 95%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

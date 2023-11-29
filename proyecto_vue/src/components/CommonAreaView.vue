<template>
  <NavigationBar />
  <div class="property-app">
    <div class="utilities">
      <div class="add-area">
        <div class="add-btn">
          <button class="add-button" @click="openForm">
            Añadir Area Común
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de Propiedades -->
    <div class="area-list">
      <div v-for="(area, index) in commonAreas" :key="index" class="area-item">
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
            <button @click="editArea(index)">Editar</button>
            <button @click="deleteArea(index)">Borrar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario de Area -->
    <div class="popup" v-if="showPopup">
      <div class="popup-content">
        <form>
          <select v-model="type" required>
            <option value="">Selecciona un tipo de area</option>
            <option
              v-for="option in options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}
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
      options: [
        { text: "Piscina", value: "Piscina" },
        { text: "Gimnasio", value: "Gimnasio" },
        { text: "Salón de Eventos", value: "Salón de Eventos" },
      ],
    };
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
        idTypeArea: 1,
      };

      try {
        const response = await CommonAreaService.addCommonArea(newArea);
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
        idTypeArea: 2,
      };

      try {
        const response = await CommonAreaService.updateCommonArea(
          this.commonAreas[this.index].id,
          updatedArea
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
  justify-content: flex-end;
  width: 100%;
}

.add-btn {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.add-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  background-color: #333;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
}

.add-button:hover {
  background-color: #222;
}

.area-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.area-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 300px;
  margin: 0.5rem;
  padding: 1rem;
  border-radius: 0.25rem;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.area-item:hover {
  background-color: #eee;
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
}

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.actions button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  background-color: #333;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
}

.actions button:hover {
  background-color: #222;
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
  border-radius: 0.25rem;
  background-color: #fff;
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
  border: none;
  border-radius: 0.25rem;
  background-color: #eee;
  color: #333;
  font-size: 1rem;
}

.popup-content form textarea {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  background-color: #eee;
  color: #333;
  font-size: 1rem;
}

.popup-content form select {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  background-color: #eee;
  color: #333;
  font-size: 1rem;
}

.popup-content form button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  background-color: #333;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
}

.popup-content form button:hover {
  background-color: #222;
}
</style>
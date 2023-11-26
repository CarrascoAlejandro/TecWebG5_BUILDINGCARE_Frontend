<template>
  <div class="property-app">
    <div class="utilities">
      <div class="filter-add">
        <div class="filter">
          <select v-model="filter" @change="filterProperties">
            <option value="all">Todas las propiedades</option>
            <option v-for="type in types" :key="type.id" :value="type.type">
              {{ type.type }}
            </option>
          </select>
        </div>
        <div class="add-btn">
          <button class="add-button" @click="openForm">Añadir Propiedad</button>
        </div>
      </div>
      <div class="search-container">
        <input
          v-model="searchText"
          type="text"
          placeholder="Buscar Propiedad..."
          @input="searchProperties"
        />
      </div>
    </div>

    <!-- Lista de Propiedades -->
    <div class="property-list">
      <div
        v-for="(property, index) in properties"
        :key="index"
        class="property-post"
      >
        <!-- Contenido de Propiedad -->

        <div class="property-details">
          <div class="header">
            <div class="property-type">{{ property.type }}</div>
            <div class="property-value">$ {{ property.value }}</div>
          </div>
          <div class="specs">
            <div class="property-environments">
              Ambientes: {{ property.environments }}
            </div>
            <div class="property-dimensions">
              Dimensiones: {{ property.dimensions }}
            </div>
          </div>
        </div>
        <div class="property-content">
          <div class="property-image">
            <img :src="property.image" alt="Imagen de la propiedad" />
          </div>
          <div class="property-description">{{ property.description }}</div>
          <div class="actions">
            <button @click="editProperty(index)">Editar</button>
            <button @click="deleteProperty(index)">Borrar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario de Propiedad -->
    <div class="popup" v-if="showPopup">
      <div class="popup-content">
        <form>
          <select v-model="selectedType" required>
            <option value="">Selecciona un tipo de propiedad</option>
            <option v-for="type in types" :key="type.id" :value="type">
              {{ type.type }}
            </option>
          </select>

          <input type="hidden" id="PropertyId" />
          <input
            v-model="value"
            placeholder="Valor de la Propiedad"
            type="number"
            step="0.01"
            required
          />
          <input
            v-model="environments"
            placeholder="Ambientes de la Propiedad"
            type="number"
            required
          />
          <input
            v-model="dimensions"
            placeholder="Dimensiones de la Propiedad"
            type="number"
            step="0.01"
            required
          />
          <textarea
            v-model="description"
            placeholder="Descripción"
            required
          ></textarea>
          <input type="file" @change="handleImageUpload" accept="image/*" />
          <!-- Botones de acción -->
          <div class="form-buttons">
            <button @click="createPost" v-if="!editing">Crear</button>
            <button @click="updatePost" v-if="editing">Actualizar</button>
            <button @click="deletePost(index)">Eliminar</button>
            <button @click="closeForm">Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import PropertiesService from "../service/PropertiesService.js";

export default {
  data() {
    return {
      filter: "all",
      searchText: "",
      properties: [],
      types: [],
      showPopup: false,
      id: null,
      type: "",
      value: "",
      environments: "",
      dimensions: "",
      description: "",
      editing: false,
      index: null,
      image: null,
      selectedType: null,
    };
  },
  computed: {
    filteredProperties() {
      let filtered = this.properties;
      if (this.filter !== "all") {
        filtered = filtered.filter((property) => property.type === this.filter);
      }
      if (this.searchText) {
        const searchTerm = this.searchText.toLowerCase();
        filtered = filtered.filter((property) => {
          const propertyValues = Object.values(property).map((value) =>
            value.toString().toLowerCase()
          );
          return propertyValues.some((value) => value.includes(searchTerm));
        });
      }
      return filtered;
    },
  },
  methods: {
    async fetchProperties() {
      try {
        const data = await PropertiesService.fetchProperties();
        if (data.responseCode === "PROP-0000" && data.data) {
          // Mapear los datos recibidos a la estructura esperada por el componente
          this.properties = data.data.map((item) => ({
            id: item.id,
            type: item.propertyType,
            value: item.propertyValue,
            environments: item.propertyEnvironments,
            dimensions: item.propertyDimensions,
            description: item.propertyDescription,
            image: item.propertyImage,
          }));
        } else {
          console.error("Error fetching properties:", data.errorMessage);
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    },
    async fetchTypes() {
      try {
        const data = await PropertiesService.fetchTypes();
        if (data.responseCode === "PROP-0004" && data.data) {
          // Mapear los datos recibidos a la estructura esperada por el componente
          this.types = data.data.map((item) => ({
            id: item.id,
            type: item.type,
          }));
        } else {
          console.error("Error fetching types:", data.errorMessage);
        }
      } catch (error) {
        console.error("Failed to fetch types:", error);
      }
      console.log("types", this.types);
    },
    openForm() {
      this.showPopup = true;
      this.editing = false;
      this.resetForm();
    },
    resetForm() {
      this.type = "";
      this.value = "";
      this.environments = "";
      this.dimensions = "";
      this.description = "";
      this.image = null;
      this.index = null;
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    async createPost() {
      if (
        !this.selectedType ||
        !this.value ||
        !this.environments ||
        !this.dimensions ||
        !this.description
      ) {
        alert("Por favor, complete todos los campos obligatorios.");
        return;
      }

      const newProperty = {
        propertyEnvironments: parseInt(this.environments),
        propertyDimensions: parseFloat(this.dimensions),
        propertyValue: parseFloat(this.value),
        propertyDescription: this.description,
        propertyImage: "una_imagen.jpg",
        propertyIdSection: 1,
        propertyIdType: this.selectedType ? this.selectedType.id : null,
      };

      try {
        const responseData = await PropertiesService.addProperty(newProperty);
        if (responseData && responseData.responseCode === "PROP-0001") {
          this.properties.push(responseData.data);
        } else {
          console.error("Error adding property:", responseData.errorMessage);
        }
      } catch (error) {
        console.error("Failed to add property:", error);
      } finally {
        this.closeForm();
      }
    },
    editProperty(index) {
      const property = this.properties[index];
      this.propertyId = property.id;
      this.type = property.type;
      this.value = property.value.toString();
      this.environments = property.environments.toString();
      this.dimensions = property.dimensions.toString();
      this.description = property.description;
      this.image = property.image;
      this.index = index;
      this.editing = true;
      this.showPopup = true;
    },
    async updatePost() {
      if (
        !this.type ||
        !this.value ||
        !this.environments ||
        !this.dimensions ||
        !this.description
      ) {
        alert("Por favor, complete todos los campos obligatorios.");
        return;
      }

      const updatedProperty = {
        propertyEnvironments: parseInt(this.environments),
        propertyDimensions: parseFloat(this.dimensions),
        propertyValue: parseFloat(this.value),
        propertyDescription: this.description,
        propertyImage: "una_imagen.jpg",
        propertyIdSection: 1, // Asegúrate de establecer este valor correctamente
        propertyIdType: this.selectedType ? this.selectedType.id : null,
      };

      try {
        const propertyId = this.properties[this.index].id;
        const responseData = await PropertiesService.updateProperty(
          propertyId,
          updatedProperty
        );

        if (responseData.responseCode === "PROP-0002" && responseData.data) {
          const propertyIndex = this.properties.findIndex(
            (p) => p.id === this.propertyId
          );
          this.properties[propertyIndex] = responseData.data;
        } else {
          console.error("Error updating property:", responseData.errorMessage);
        }
      } catch (error) {
        console.error("Failed to update property:", error);
      } finally {
        this.closeForm();
      }
    },
    async deleteProperty(index) {
      const property = this.properties[index];
      if (confirm("¿Seguro que desea eliminar esta propiedad?")) {
        try {
          const success = await PropertiesService.deleteProperty(property.id);
          if (success) {
            this.properties.splice(index, 1);
          } else {
            console.error("Error deleting property");
          }
        } catch (error) {
          console.error("Failed to delete property:", error);
        }
      }
    },
    closeForm() {
      this.showPopup = false;
    },
  },
  mounted() {
    this.fetchProperties();
    this.fetchTypes();
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
}

.utilities {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-direction: row;

  .filter-add {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;

    .filter {
      margin-bottom: 10px;
    }
  }

  .search-container {
    width: 80%;
    position: relative;

    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  }
}

.property-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  padding: 20px;
  background-color: #fea162;
  width: 100%;
  justify-content: center;
  text-align: center;
  height: 100vh;
}

.popup {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

form {
  max-width: 400px;
  margin: 0 auto;
}

input,
textarea,
select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

select {
  height: 40px;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.property-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  flex-direction: column;
}

.property-post {
  width: 95%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  margin: 10px;

  .property-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    width: 100%;

    .header {
      font-weight: bold;
      display: flex;
      flex-direction: row;
      align-items: flex-start;

      .property-type {
        font-size: 25px;
        padding: 5px;
        margin-right: 10px;
      }

      .property-value {
        font-size: 20px;
        color: #fff;
        background-color: #22abb3;
        padding: 10px;
        border-radius: 10px;
      }
    }

    .specs {
      font-weight: 600;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .property-environments {
        margin-right: 10px;
      }
    }
  }

  .property-content {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .property-image {
    flex: 1;
    max-width: 10%;
    margin-right: 20px;

    img {
      width: 100%;
      border-radius: 5px;
    }
  }

  .property-description {
    flex: 3;
    font-size: 14px;
    text-align: start;
  }

  .actions {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    margin-top: 10px;

    button {
      margin-right: 10px;
    }
  }
  &:hover {
    transform: scale(1.05);
  }
}

.form-buttons button {
  margin-right: 10px;
}

@media screen and (max-width: 768px) {
  .announcement-post {
    .post-content {
      flex-direction: column;
    }

    .post-image {
      max-width: 100%;
      margin-right: 0;
      margin-bottom: 20px;

      img {
        height: 100%;
      }
    }
  }
}
</style>

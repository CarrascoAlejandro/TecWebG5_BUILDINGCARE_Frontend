<template>
  <NavigationBar />
  <div class="property-app">
    <div class="utilities">
      <div class="add-btn">
        <button
          class="add-button"
          @click="openForm"
          v-if="typeUser !== 'Inquilino'"
        >
          Añadir Propiedad
        </button>
      </div>
      <div class="search-container">
        <input
          v-model="searchText"
          type="text"
          placeholder="Buscar Propiedad..."
        />
      </div>
    </div>

    <!-- Lista de Propiedades -->
    <div class="property-list">
      <div
        v-for="(property, index) in filteredProperties"
        :key="index"
        class="property-post"
      >
        <!-- Contenido de Propiedad -->

        <div class="property-details">
          <div class="header">
            <div class="property-type">{{ property.type }}</div>
            <div class="property-value">{{ property.value }} Bs.</div>
          </div>
          <div class="specs">
            <div class="property-environments">
              Ambientes: {{ property.environments }}
            </div>
            <div class="property-dimensions">Dimensiones: {{ property.dimensions }} m<sup>2</sup></div>
          </div>
        </div>
        <div class="property-content">
          <div class="property-image">
            <img
              v-if="property.image"
              :src="require(`../../../image_server/img/${property.image}`)"
              alt="Imagen de la propiedad"
            />
          </div>
          <div class="property-description">{{ property.description }}</div>
          <div class="actions">
            <button
              @click="editProperty(index)"
              v-if="
                typeUser != 'Inquilino' &&
                ((typeUser == 'Socio' && nameUser === property.propertyOwner) ||
                  typeUser == 'Administrador')
              "
            >
              Editar
            </button>
            <button
              @click="deleteProperty(index)"
              v-if="typeUser === 'Administrador'"
            >
              Borrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario de  Propiedad -->
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
          <input
            type="file"
            @change="handleImageUpload"
            accept="image/*"
            required
          />
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

import { uploadImage } from "../service/ImageService.js";

import NavigationBar from "./NavigationBar.vue";
export default {
  name: "PropertiesView",
  components: {
    NavigationBar,
  },
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
      idUserHeader: "",
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
  created() {
    try{
      this.typeUser = localStorage.getItem("typeUser");
    const storedData = localStorage.getItem("userID");
    // Parsear el JSON almacenado
    const parsedData = JSON.parse(storedData);
    // Acceder al campo "name" dentro del objeto parsedData
    this.nameUser = parsedData.name;
    this.idUserHeader = parsedData.idUser;
    this.propertiesService = new PropertiesService(this.idUserHeader);
    console.log("typeUser", this.typeUser);
    console.log("nameUser", this.nameUser);
    if (this.typeUser == null) {
      this.$router.push("/");
    }
    }catch(error){
      console.log(error);
      this.$router.push("/");
    }
    
  },
  methods: {
    //temp
    logAndReturnImage(image) {
      console.log(image);
      return require(`../../../image_server/img/${image}`);
    },
    async fetchProperties() {
      try {
        const data = await this.propertiesService.fetchProperties();
        if (data.responseCode === "PROP-0000" && data.data) {
          console.log("data", data);
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
        const data = await this.propertiesService.fetchTypes();
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
      /* const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.image = e.target.result;
        };
        reader.readAsDataURL(file);
      } */
      this.image = event.target.files[0];
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

      let imageUrl = await uploadImage(this.image);
      if (!imageUrl) {
        console.error("Failed to upload image");
        return;
      }

      console.log("Value:", this.value);
      console.log("Environments:", this.environments);
      console.log("Dimensions:", this.dimensions);
      console.log("Description:", this.description);
      console.log("Image:", imageUrl);
      console.log("Selected Type ID:", this.selectedType.id);

      // Detiene la ejecución aquí si las herramientas de desarrollador están abiertas

      const newProperty = {
        propertyEnvironments: this.environments,
        propertyDimensions: this.dimensions,
        propertyValue: this.value,
        propertyDescription: this.description,
        propertyImage: imageUrl,
        propertyIdSection: 1,
        propertyIdType: this.selectedType ? this.selectedType.id : 2,
      };

      try {
        const responseData = await this.propertiesService.addProperty(
          newProperty
        );
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

      let imageUrl = null;
      try {
        if (this.image) {
          imageUrl = await uploadImage(this.image);
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
      }

      const updatedProperty = {
        propertyEnvironments: parseInt(this.environments),
        propertyDimensions: parseFloat(this.dimensions),
        propertyValue: parseFloat(this.value),
        propertyDescription: this.description,
        propertyImage: imageUrl,
        propertyIdSection: 1, // Asegúrate de establecer este valor correctamente
        propertyIdType: this.selectedType ? this.selectedType.id : null,
      };

      try {
        const propertyId = this.properties[this.index].id;
        const responseData = await this.propertiesService.updateProperty(
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
          const success = await this.propertiesService.deleteProperty(
            property.id
          );
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
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow-y: auto;
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
      border: 3px solid #a69b8d;
      border-radius: 10px;
      background-color: #fffaf1;
    }

    input:focus {
      outline: #a69b8d solid 1px;
    }
  }
}

.property-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  min-width: 100%;
  padding: 20px;
  background-color: #f2f1e4;
  width: 100%;
  justify-content: center;
  text-align: center;
  height: 100%;
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
  transition: all 0.5s ease-in-out;
}

.popup-content {
  background: #f2f1e4;
  padding: 20px;
  border-radius: 10px;
  border-color: #a69b8d;
  border: #a69b8d solid 5px;
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
  border: 2px solid #a69b8d;
  border-radius: 10px;
  background-color: #fffaf1;
}

select {
  height: 50px;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
}

button {
  padding: 10px 20px;
  background-color: #498c79;
  color: #101e26;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

button:hover {
  background-color: #498c79;
  color: #f2d1b3;
  transition: all 0.5s ease-in-out;
  transform: scale(1.05);
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
  border: 3px solid #a69b8d;
  border-radius: 10px;
  background-color: #fffaf1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.5s ease-in-out;
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
      color: #101e26;

      .property-type {
        font-size: 25px;
        padding: 5px;
        margin-right: 10px;
      }

      .property-value {
        font-size: 20px;
        color: #101e26;
        background-color: #498c79;
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
      color: #101e26;

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
    color: #101e26;
  }

  .property-image {
    flex: 1;
    max-width: 15%;
    margin-right: 20px;

    img {
      width: 100%;
      border-radius: 10px;
    }
  }

  .property-description {
    flex: 3;
    font-size: 20px;
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
  .property-list {
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  .property-post {
    width: 100%;
    flex-direction: column;
  }

  .property-image {
    max-width: 100%;
    min-width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
    img {
      width: 100%;
      border-radius: 10px;
    }
  }

  .property-content {
    flex-direction: column;
  }

  .property-description {
    flex: 1;
  }

  .actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .actions button {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .popup-content {
    width: 100%;
  }

  .popup {
    align-items: flex-start;
  }

  .utilities {
    flex-direction: column;
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

  .property-details {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 10px;

    .header {
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 10px;

      .property-type {
        margin-bottom: 10px;
      }

      .property-value {
        margin-bottom: 10px;
      }
    }

    .specs {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .property-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .property-image {
    max-width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }

  .property-description {
    flex: 1;
    margin-bottom: 10px;
  }

  .actions {
    flex-direction: row;
    align-items: center;
    margin-top: 0;
  }

  .actions button {
    margin-right: 10px;
    margin-bottom: 0;
  }

  .form-buttons {
    flex-direction: row;
    align-items: flex-start;
  }

  .form-buttons button {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .popup-content {
    padding: 10px;
  }
}
</style>

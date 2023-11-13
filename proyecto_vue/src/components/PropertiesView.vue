<template>
  
    <body>
      <NavigationBar></NavigationBar>
    <div class="container">
      <div class="utilities-container">
        <div class="filter-and-add">
          <select v-model="filter" @change="filterProperties">
            <option value="all">Todas las propiedades</option>
            <option value="typeA">Garzonier</option>
            <option value="typeB">Departamento</option>
          </select>
          <button class="add-btn" @click="openForm">
            <span>Añadir Propiedad</span>
          </button>
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
      <table>
        <thead style="display: none">
          <tr>
            <th>Ambientes</th>
            <th>Dimensiones</th>
            <th>Valor</th>
            <th>Descripcion</th>
            <th>Imagenes</th>
            <th>Tipo</th>
            <th>Seccion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="property in filteredProperties" :key="property.propertyId">
            <td>{{ property.propertyEnvironments }}</td>
            <td>{{ property.propertyDimensions }}</td>
            <td>{{ property.propertyValue }}</td>
            <td>{{ property.propertyDescription }}</td>
            <td>
              <img :src="property.propertyImage" alt="Imagen de la propiedad" />
            </td>
            <td class="propertyType">{{ property.propertyType }}</td>
            <td class="propertySection">{{ property.propertySection }}</td>
            <td>
              <button @click="editProperty(property)">Editar</button>
              <button @click="deleteProperty(property)">Borrar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div id="propertyForm" style="display: none">
      <h1>Añadir Propiedad</h1>
      <form @submit.prevent="addProperty">
        <input
          v-model="environments"
          placeholder="Cantidad de ambientes:"
          type="number"
          required
        />
        <input
          v-model="dimensions"
          placeholder="Dimensiones"
          type="number"
          step="any"
          required
        />
        <input
          v-model="value"
          placeholder="Valor"
          type="number"
          step="any"
          required
        />
        <input
          v-model="description"
          placeholder="Descripcion"
          type="text"
          required
        />
        <input type="file" @change="handleImageUpload" accept="image/*" />
        <select v-model="type" required>
          <option value="0" selected>Seleccione un tipo</option>
          <option value="1">Garzonier</option>
          <option value="2">Departamento</option>
        </select>
        <div class="form-buttons">
          <input class="submitBtn" type="submit" value="Añadir" />
          <input class="resetBtn" type="reset" value="Limpiar Campos" />
          <input
            class="cancelBtn"
            type="button"
            value="Cancelar"
            @click="closeForm"
          />
        </div>
      </form>
    </div>
    <div id="editProperty" style="display: none">
      <h1>Editar Propiedad</h1>
      <form @submit.prevent="updateProperty">
        <input type="hidden" id="propertyIdEdit" />
        <input type="hidden" id="editingPropertyId" />
        <input
          v-model="environmentsEdit"
          placeholder="Cantidad de ambientes:"
          type="number"
          required
        />
        <input
          v-model="dimensionsEdit"
          placeholder="Dimensiones"
          type="number"
          step="any"
          required
        />
        <input
          v-model="valueEdit"
          placeholder="Valor"
          type="number"
          step="any"
          required
        />
        <input
          v-model="descriptionEdit"
          placeholder="Descripcion"
          type="text"
          required
        />
        <input type="file" @change="handleImageUploadEdit" accept="image/*" />
        <select v-model="typeEdit" required>
          <option value="0" selected>Seleccione un tipo</option>
          <option value="1">Garzonier</option>
          <option value="2">Departamento</option>
        </select>
        <div class="form-buttons">
          <input class="submitBtn" type="submit" value="Guardar" />
          <input class="resetBtn" type="reset" value="Limpiar Campos" />
          <input
            class="cancelBtn"
            type="button"
            value="Cancelar"
            @click="closeFormEdit"
          />
        </div>
      </form>
    </div>
  </body>
</template>

<script>
import NavigationBar from "./NavigationBar.vue";
export default {
    data() {
        return {
            properties: [],
            propertyId: null,
            environments: "",
            dimensions: "",
            value: "",
            description: "",
            image: "",
            type: "0",
            section: "0",
            //Edicion
            //editingPropertyId: null,
            environmentsEdit: "",
            dimensionsEdit: "",
            valueEdit: "",
            descriptionEdit: "",
            imageEdit: "",
            typeEdit: "0",
            //Filtros
            filter: "all",
            searchText: "",
            activeNavItem: "Propiedades",
        };
    },
    methods: {
        async fetchProperties() {
            try {
                const response = await fetch("http://localhost:8080/api/v1/property/all");
                const data = await response.json();
                if (data.responseCode === "PROP-0000" && data.data) {
                    this.properties = data.data;
                }
                else {
                    console.error("Error fetching properties:", data.errorMessage);
                }
            }
            catch (error) {
                console.error("Failed to fetch properties:", error);
            }
        },
        async addProperty() {
            // Construir el objeto de propiedad basado en los datos del formulario.
            const newProperty = {
                propertyEnvironments: this.environments,
                propertyDimensions: parseFloat(this.dimensions),
                propertyValue: parseFloat(this.value),
                propertyDescription: this.description,
                propertyImage: "anURL.jpg",
                propertyIdSection: 1,
                propertyIdType: 1,
            };
            try {
                // Realizar una solicitud POST a la API para agregar una nueva propiedad.
                const response = await fetch("http://localhost:8080/api/v1/property", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token: "1", // Tu token se establece aquí
                    },
                    body: JSON.stringify(newProperty),
                });
                // Verificar si la solicitud se completó correctamente.
                if (response.ok) {
                    const responseData = await response.json();
                    if (responseData.responseCode === "PROP-0001" && responseData.data) {
                        // Suponiendo que el servidor devuelve la propiedad creada, la agregamos a nuestra lista.
                        this.properties.push(responseData.data);
                    }
                    else {
                        console.error("Error adding property:", responseData.errorMessage);
                    }
                }
                else {
                    console.error("Failed to add property, server responded with:", response.status);
                }
            }
            catch (error) {
                console.error("Failed to add property:", error);
            }
            finally {
                this.closeForm();
            }
        },
        editProperty(property) {
            this.editingPropertyId = property.id;
            this.environmentsEdit = property.environments;
            this.dimensionsEdit = property.dimensions;
            this.valueEdit = property.value;
            this.descriptionEdit = property.description;
            this.imageEdit = property.image;
            this.typeEdit = property.type;
            this.openFormEdit();
        },
        async deleteProperty(property) {
            console.log(property);
            console.log(property.id); // Esta es la corrección
            try {
                // Realizar una solicitud DELETE a la API para eliminar la propiedad
                const response = await fetch(`http://localhost:8080/api/v1/property/${property.id}`, {
                    method: "DELETE",
                });
                // Verificar si la solicitud se completó correctamente
                if (response.ok) {
                    // Eliminar la propiedad de la lista local
                    const propertyIndex = this.properties.findIndex((p) => p.id === property.id // Aquí también se cambió `propertyId` por `id`
                    );
                    this.properties.splice(propertyIndex, 1);
                }
                else {
                    const data = await response.json();
                    console.error("Error deleting property:", data.errorMessage || "Unknown error");
                }
            }
            catch (error) {
                console.error("Failed to delete property:", error);
            }
        },
        filterProperties(filter) {
            if (filter === "all") {
                this.filteredProperties = this.properties;
            }
            else {
                this.filteredProperties = this.properties.filter((p) => p.type === filter);
            }
        },
        searchProperties() {
            this.filteredProperties = this.properties.filter((p) => p.description.toLowerCase().includes(this.searchText.toLowerCase()));
        },
        resetEditForm() {
            this.environmentsEdit = "";
            this.dimensionsEdit = "";
            this.valueEdit = "";
            this.descriptionEdit = "";
            this.imageEdit = "";
            this.typeEdit = "0";
        },
        async updateProperty() {
            const updatedProperty = {
                propertyEnvironments: parseInt(this.environmentsEdit),
                propertyDimensions: parseFloat(this.dimensionsEdit),
                propertyValue: parseFloat(this.valueEdit),
                propertyDescription: this.descriptionEdit,
                propertyImage: "newURL.jpg",
                propertyIdSection: 1,
                propertyIdType: 1,
            };
            console.log(updatedProperty);
            try {
                // Actualizar una propiedad en la API usando su ID
                const response = await fetch(`http://localhost:8080/api/v1/property/${this.editingPropertyId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        token: "1",
                    },
                    body: JSON.stringify(updatedProperty),
                });
                if (response.ok) {
                    const responseData = await response.json();
                    if (responseData.responseCode === "PROP-0002" && responseData.data) {
                        // Actualizar la propiedad en la lista local
                        const propertyIndex = this.properties.findIndex((p) => p.id === this.editingPropertyId);
                        this.properties[propertyIndex] = responseData.data;
                    }
                    else {
                        console.error("Error updating property:", responseData.errorMessage);
                    }
                }
                else {
                    console.error("Failed to update property, server responded with:", response.status);
                }
            }
            catch (error) {
                console.error("Failed to update property:", error);
            }
            finally {
                this.closeFormEdit();
            }
        },
        handleImageUpload(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                this.image = event.target.result;
            };
        },
        handleTableClick(event) {
            const propertyId = event.target.parentElement.parentElement.children[0].innerText;
            const property = this.properties.find((p) => p.id === Number(propertyId));
            this.editProperty(property);
        },
        openForm() {
            document.getElementById("propertyForm").style.display = "block";
        },
        closeForm() {
            document.getElementById("propertyForm").style.display = "none";
        },
        openFormEdit() {
            document.getElementById("editProperty").style.display = "block";
        },
        closeFormEdit() {
            document.getElementById("editProperty").style.display = "none";
            this.resetEditForm();
        },
    },
    computed: {
        filteredProperties() {
            if (this.filter === "all") {
                return this.properties;
            }
            else {
                return this.properties.filter((p) => p.type === this.filter);
            }
        },
    },
    mounted() {
        this.fetchProperties();
    },
    components: { NavigationBar }
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
  height: 100vh;
  overflow: hidden;
  background-color: #fea162;
}

div {
  box-sizing: border-box;
}

.container {
  padding: 20px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
}

.utilities-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #63f6ff;
  border-radius: 10px;
  margin-bottom: 20px;
  border: 3px solid #22abb3;
}

.utilities-container button {
  margin-left: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: #b36634;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  border: none;
}

.utilities-container button:hover {
  transform: scale(1.1);
}

.utilities-container select {
  padding: 10px;
  border-radius: 5px;
  background-color: #b36634;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  border: none;
}

#propertiesTable {
  width: 100%;
  border-collapse: collapse;
  border: 3px solid #22abb3;
  border-radius: 10px;
  overflow: hidden;
  background-color: #63f6ff;
}

#propertiesTable thead {
  background-color: #22abb3;
  color: #fff;
}

#propertyForm .form-buttons {
  display: flex;
  justify-content: space-between;
}

#propertyForm .form-buttons input {
  padding: 10px;
  border-radius: 5px;
  background-color: #b36634;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  border: none;
}

#propertyForm .form-buttons input:hover {
  transform: scale(1.1);
}

#propertyForm .form-buttons .cancelBtn {
  background-color: #fea162;
}

#propertyForm .form-buttons .cancelBtn:hover {
  background-color: #b36634;
}

#editProperty .form-buttons {
  display: flex;
  justify-content: space-between;
}

#editProperty .form-buttons input {
  padding: 10px;
  border-radius: 5px;
  background-color: #b36634;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  border: none;
}

#editProperty .form-buttons input:hover {
  transform: scale(1.1);
}

#editProperty .form-buttons .cancelBtn {
  background-color: #fea162;
}

#editProperty .form-buttons .cancelBtn:hover {
  background-color: #b36634;
}

.search-container {
  width: 100%;
  text-align: center;
}

.search-container input {
  padding: 10px;
  border-radius: 5px;
  background-color: #fff;
  color: #000;
  font-weight: bold;
  cursor: pointer;
  border: none;
}

.search-container input:hover {
  transform: scale(1.1);
}

.add-btn {
  border-radius: 50px;
  background-color: #fea162;
  border: none;
  color: #fff;
  text-align: center;
  font-size: 20px;
  padding: 10px;
  width: fit-content;
  transition: all 0.5s;
  cursor: pointer;
  margin: 5px;
}

.add-btn span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}

.add-btn span:after {
  position: absolute;
  opacity: 0;
  top: 0;
  right: -20px;
  transition: 0.5s;
}

.add-btn:hover {
  background-color: #b36634;
}

.add-btn:hover span:after {
  opacity: 1;
  right: 0;
}

#propertyForm,
#editProperty {
  display: none;
  border: 3px solid #22abb3;
  border-radius: 10px;
  padding: 2em;
  width: 400px;
  text-align: center;
  position: fixed;
  background: #63f6ff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  animation: slide-in 0.5s forwards;
}

@keyframes slide-in {
  from {
    transform: translateY(-100%);
    left: 40%;
    opacity: 0;
  }

  to {
    left: 40%;
    transform: translateY(-50%);
    opacity: 1;
  }
}

#propertyForm h1,
#editProperty h1 {
  margin-bottom: 1em;
  color: #fff;
}

#propertyForm input,
#propertyForm select,
#editProperty input,
#editProperty select {
  margin: 0.8em auto;
  font-family: inherit;
  text-transform: inherit;
  font-size: inherit;

  display: block;
  width: 280px;
  padding: 0.4em;
  border-radius: 5px;
  border: none;
  background-color: #fff;
  color: #000;
  font-weight: bold;
  cursor: pointer;
}

#propertyForm input:hover,
#propertyForm select:hover,
#editProperty input:hover,
#editProperty select:hover {
  transform: scale(1.1);
}

#propertyForm input:focus,
#propertyForm select:focus,
#editProperty input:focus,
#editProperty select:focus {
  outline: none;
  box-shadow: 0 0 5px #22abb3;
}

#propertyForm .form-buttons input:focus,
#editProperty .form-buttons input:focus {
  outline: none;
  box-shadow: 0 0 5px #22abb3;
}

img {
  max-width: 100%;
  height: auto;
}
</style>

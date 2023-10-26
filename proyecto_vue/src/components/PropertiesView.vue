<template>
<div class="property-app">
    <div class="utilities">
        <div class="filter-add">
            <div class="filter">
                <select v-model="filter" @change="filterProperties">
                    <option value="all">Todas las propiedades</option>
                    <option value="opcion1">Garzonier</option>
                    <option value="opcion2">Departamento</option>
                </select>
            </div>
            <div class="add-btn">
                <button class="add-button" @click="openForm">Añadir Propiedad</button>
            </div>
        </div>
        <div class="search-container">
            <input v-model="searchText" type="text" placeholder="Buscar Propiedad..." @input="searchProperties" />
        </div>
    </div>

    <!-- Lista de Propiedades -->
    <div class="property-list">
        <div v-for="(property, index) in properties" :key="index" class="property-post">
            <!-- Contenido de Propiedad -->

            <div class="property-details">
                <div class="header">
                    <div class="property-type">{{ property.type }}</div>
                    <div class="property-value">$ {{ property.value }} </div>
                </div>
                <div class="specs">
                    <div class="property-environments">Ambientes: {{ property.environments }}</div>
                    <div class="property-dimensions">Dimensiones: {{ property.dimensions }}</div>
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
                <select v-model="type" required>
                    <option value="">Selecciona un tipo de propiedad</option>
                    <option v-for="option in options" :key="option.value" :value="option.value">{{ option.text }}</option>
                </select>
                <input v-model="value" placeholder="Valor de la Propiedad" type="number" step="0.01" required />
                <input v-model="environments" placeholder="Ambientes de la Propiedad" type="number" required />
                <input v-model="dimensions" placeholder="Dimensiones de la Propiedad" type="number" step="0.01" required />
                <textarea v-model="description" placeholder="Descripción" required></textarea>
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
export default {
    data() {
        return {
            filter: 'all',
            searchText: '',
            properties: [{
                type: "Garzonier",
                value: 10000,
                environments: 3,
                dimensions: 125.5,
                image: require("@/assets/images/living1.jpg"),
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tincidunt risus eu porttitor volutpat. Phasellus justo justo, tristique eget elit vel, sodales posuere purus. Fusce id massa ac lorem maximus auctor non eu ante. In sapien leo, scelerisque non venenatis at, ullamcorper eu mauris. Proin id velit vel ipsum commodo hendrerit. Donec eleifend augue ut mi hendrerit, in feugiat lectus tincidunt. Suspendisse quis odio in arcu finibus consectetur sed a dolor. Suspendisse mattis velit in condimentum dictum. Aenean non magna sem."
            }],
            showPopup: false,
            type: '',
            value: '',
            environments: '',
            dimensions: '',
            description: '',
            editing: false,
            index: null,
            image: null,
            options: [{
                    text: 'Garzonier',
                    value: 'Garzonier'
                },
                {
                    text: 'Departamento',
                    value: 'Departamento'
                }
            ]
        };
    },
    methods: {
        filterProperties() {
            // Verifica el valor seleccionado en el filtro
            if (this.filter === 'all') {
                // Si se selecciona "Todas las propiedades", muestra todas las propiedades
                this.filteredProperties = this.properties;
            } else {
                // Filtra las propiedades según el tipo seleccionado
                this.filteredProperties = this.properties.filter(property => property.type === this.filter);
            }
        },
        searchProperties() {
            // Toma el valor de búsqueda desde el campo de búsqueda
            const searchTerm = this.searchText.toLowerCase(); // Convierte a minúsculas para hacer una búsqueda sin distinción entre mayúsculas y minúsculas

            // Realiza la búsqueda y filtra las propiedades que coinciden con el término de búsqueda
            this.filteredProperties = this.properties.filter(property => {
                const propertyValues = Object.values(property).map(value => value.toString().toLowerCase());
                return propertyValues.some(value => value.includes(searchTerm));
            });
        },
        openForm() {
            this.showPopup = true;
        },
        handleImageUpload(event) {
            // Obtiene el archivo de imagen seleccionado por el usuario
            const file = event.target.files[0];

            // Comprueba si se seleccionó un archivo
            if (file) {
                // Crea una URL de objeto (Blob URL) para la imagen
                const imageUrl = URL.createObjectURL(file);

                // Asigna la URL de la imagen al atributo 'image' en los datos del componente
                this.image = imageUrl;
            }
        },
        createPost() {
            // Verifica si los campos obligatorios están completos
            if (!this.type || !this.value || !this.environments || !this.dimensions || !this.description) {
                alert("Por favor, complete todos los campos obligatorios.");
                return;
            }

            // Crea un nuevo objeto de propiedad
            const newProperty = {
                type: this.type,
                value: parseFloat(this.value), // Convierte a número
                environments: parseInt(this.environments), // Convierte a número entero
                dimensions: parseFloat(this.dimensions), // Convierte a número
                description: this.description,
                image: this.image
            };

            // Agrega la nueva propiedad al arreglo
            this.properties.push(newProperty);

            // Limpia los campos del formulario
            this.type = '';
            this.value = '';
            this.environments = '';
            this.dimensions = '';
            this.description = '';
            this.image = null;

            // Cierra el formulario
            this.closeForm();
        },
        editProperty(index) {
            // Cargar los datos de la propiedad a editar en el formulario
            const propertyToEdit = this.properties[index];
            this.type = propertyToEdit.type;
            this.value = propertyToEdit.value.toString(); // Convertir a cadena
            this.environments = propertyToEdit.environments.toString(); // Convertir a cadena
            this.dimensions = propertyToEdit.dimensions.toString(); // Convertir a cadena
            this.description = propertyToEdit.description;
            this.image = propertyToEdit.image;

            // Marcar que estamos editando
            this.editing = true;
            this.index = index;

            // Abrir el formulario
            this.showPopup = true;
        },

        updatePost() {
            // Verificar si los campos obligatorios están completos
            if (!this.type || !this.value || !this.environments || !this.dimensions || !this.description) {
                alert("Por favor, complete todos los campos obligatorios.");
                return;
            }

            // Actualizar la propiedad en el arreglo con los nuevos valores
            const updatedProperty = {
                type: this.type,
                value: parseFloat(this.value),
                environments: parseInt(this.environments),
                dimensions: parseFloat(this.dimensions),
                description: this.description,
                image: this.image
            };

            // Actualizar la propiedad en el arreglo en la posición index
            this.properties[this.index] = updatedProperty;

            // Limpiar los campos del formulario
            this.type = '';
            this.value = '';
            this.environments = '';
            this.dimensions = '';
            this.description = '';
            this.image = null;

            // Restablecer las variables de edición
            this.editing = false;
            this.index = null;

            // Cerrar el formulario
            this.showPopup = false;
        },
        deleteProperty(index) {
            // Asegúrate de confirmar la eliminación
            if (confirm("¿Seguro que deseas eliminar esta propiedad?")) {
                // Eliminar la propiedad del arreglo en la posición index
                this.properties.splice(index, 1);
            }
        },
        closeForm() {
            this.showPopup = false;
        }
    }
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

    .filter-add{
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
    background-color: #007BFF;
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

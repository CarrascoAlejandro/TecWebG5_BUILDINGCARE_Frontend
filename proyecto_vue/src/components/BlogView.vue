<template>
  <NavigationBar></NavigationBar>

  <div class="container">
    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        @input="filterPosts"
        placeholder="Buscar por título..."
      />
    </div>
    <button @click="openForm">Nuevo Post</button>
    <div class="announcement-board">
      <div
        v-for="(post, index) in filteredReceipts"
        :key="index"
        class="announcement-post"
      >
        <div class="header-date">
          <div class="header">
            <div class="post-title">{{ post.postTitle }}</div>
            <div class="post-type">{{ post.postType }}</div>
          </div>
          <div class="date-time">
            <div class="post-date">{{ post.postDateAndHour }}</div>
            <div class="post-time">{{ post.time }}</div>
          </div>
        </div>
        <div class="post-content">
          <div class="post-description">{{ post.postContent }}</div>
          <div class="post-state">{{ post.postState }}</div>

          <div class="actions">
            <button
              v-if="privileges.Posts === 'Modificacion'"
              @click="postStatus(post.id, post.postState)"
            >
              {{ post.postState !== "Done" ? "Completar" : "Completado" }}
            </button>
            <button
              @click="
                editPost(
                  post.id,
                  post.postTitle,
                  post.postContent,
                  post.postType,
                  post.postState
                )
              "
              v-if="privileges.Posts === 'Modificacion' || post.postUser == userName"
            >
              Editar
            </button>
            <button
              @click="deletePost(post.id)"
              v-if="privileges.Posts === 'Modificacion' || post.postUser == userName"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="popup" v-if="showPopup">
    <div class="popup-content">
      <form>
        <input
          v-model="title"
          placeholder="Titulo del Post"
          type="text"
          required
        />
        <textarea
          v-model="description"
          placeholder="Descripción"
          required
        ></textarea>
        <select v-model="type" required>
          <option value="">Selecciona una opción</option>
          <option
            v-for="option in options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </select>
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
</template>

<script>
import PostService from "../service/PostService.js";
import NavigationBar from "./NavigationBar.vue";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      editPostForm: [
        {
          id: "",
          title: "",
          type: "",
          date: "",
          time: "",
          image: "",
          description: "",
          state: "",
        },
      ],
      posts: [],
      showPopup: false,
      editing: false,
      formData: {
        id: "",
        title: "",
        type: "",
        date: "",
        time: "",
        image: "",
        description: "",
      },
      options: [
        {
          value: "1",
          text: "mantenimiento",
        },
        {
          value: "2",
          text: "anuncio",
        },
        {
          value: "3",
          text: "pedido",
        },
        // Agregar más opciones según sea necesario
      ],
      typeUser: "",
      userName: "",
      idUserHeader: "",
      searchQuery: "",
      filteredReceipts: [],
      privileges: {},
    };
  },
  created() {
    try{
    this.typeUser = localStorage.getItem("typeUser");
    if (this.typeUser == null) {
      this.$router.push("/");
    }
    const storedData = localStorage.getItem("userID");
    // Parsear el JSON almacenado
    const parsedData = JSON.parse(storedData);
    console.log("parsedData", parsedData);
    // Acceder al campo "name" dentro del objeto parsedData
    this.userName = parsedData.usename;
    this.isUserHeader = parsedData.idUser;
    // Copiar privilegios de acceso
    this.privileges = parsedData.roleAssignation.privileges;
    this.postService = new PostService(this.isUserHeader);
    console.log("typeUser", this.typeUser);
    console.log("userName", this.userName);
    console.log("isUserHeader", this.isUserHeader);
    if (this.typeUser == null) {
      this.$router.push("/");
    }
  }catch(error){
    console.log(error);
    this.$router.push('/');
  }
  },
  mounted() {
    this.getPosts();
  },
  methods: {
    getTypePosts() {
      try {
        this.postService.getPosts().then((data) => {
          this.posts = data.data;
          this.filteredReceipts = data.data;
          console.log(this.posts);
        });
      } catch (e) {
        console.log("error " + e);
      }
    },
    getPosts() {
      try {
        this.postService.getPosts().then((data) => {
          this.posts = data.data;
          this.filteredReceipts = data.data;
          console.log(this.posts);
        });
      } catch (e) {
        console.log("error " + e);
      }
    },
    openForm() {
      this.showPopup = true;
    },
    closeForm() {
      this.showPopup = false;
    },
    async postStatus(post, status) {
      console.log("post a completar: " + post);
      try {
        if (status !== "Done") {
          await this.postService.markPostAsDone(post).then((data) => {
            console.log("codigo de respuesta http: " + data.responseCode);
            if (data.responseCode == "POST-0002") {
              //se actualizo correctamente el post
              console.log("se actualizó el post correctamente :D");
              Swal.fire(
                "¡Actualizado!",
                "La publicación ha sido actualizada.",
                "success"
              );
              this.getPosts();
            } else {
              console.log("no se pudo actualizar el post :(");
            }
          });
        } else {
          console.log("el post est en done");
        }
      } catch (error) {
        console.error("Error al cambiar el estado de la tarea:", error);
      }
    },
    newPost() {
      console.log("title: " + this.title);
      console.log("description: " + this.description);
      console.log("type: " + this.type);
      try {
        this.postService
          .newPost(this.title, this.description, this.type)
          .then((data) => {
            console.log("codigo de respuesta http: " + data.responseCode);
            if (data.responseCode == "POST-0001") {
              //se insertó correctamente el post :D
              console.log("se creó el post correctamente :D");
              Swal.fire(
                "¡Creado!",
                "La publicación ha sido creada.",
                "success"
              );
              this.closeForm();
              this.getPosts();
            } else {
              console.log("no se pudo crear el post :(");
            }
          });
      } catch (e) {
        console.log("error " + e);
      }
    },
    createPost() {
      // Verificar que los campos estén completos antes de agregar el post
      if (this.title && this.description && this.type) {
        // const newPost = {
        //     title: this.title,
        //     type: this.type,
        //     description: this.description,
        // };
        this.newPost();
        // Limpiar los campos del formulario
        this.title = "";
        this.description = "";
        this.type = "";
        // Cerrar la ventana emergente u ocultar el formulario
        this.showPopup = false;
      } else {
        // Puedes agregar lógica adicional para manejar campos incompletos
        Swal.fire("¡Ups!", "Por favor, complete todos los campos.", "question");
      }
    },
    editPost(id, postTitle, postContent, postType, postState) {
      // Abre el formulario de edición con los detalles del post seleccionado
      console.log("estamos en la edicion del post");
      console.log("id: " + id);
      console.log("title: " + postTitle);
      console.log("description: " + postContent);
      console.log("type: " + postType);

      this.title = postTitle;
      this.description = postContent;
      // Puedes guardar el índice del post que se está editando para actualizarlo después
      const foundOption = this.options.find(
        (option) => option.text === postType
      );
      this.type = foundOption;
      this.state = postState;
      this.editingIndex = id;
      this.editing = true;
      // Abre la ventana emergente o muestra el formulario de edición
      this.showPopup = true;
    },
    updatePost() {
      // Verifica que los campos estén completos antes de actualizar el post
      console.log("estamos en la actualizacion del post");
      console.log("id: " + this.editingIndex);
      console.log("title: " + this.title);
      console.log("description: " + this.description);
      console.log("type: " + this.type);
      console.log("state: " + this.state);
      console.log("isUserHeader", this.isUserHeader);

      this.postService
        .updatePostById(
          this.title,
          this.description,
          this.state,
          this.type,
          "null",
          this.editingIndex,
          this.isUserHeader
        )
        .then((data) => {
          console.log("codigo de respuesta http: " + data.responseCode);
          console.log("codigo de respuesta http: " + data);
          if (data.responseCode == "POST-0002") {
            //se insertó correctamente el post :D
            console.log("se actualizó el post correctamente :D");
            // Restablece los campos del formulario
            this.title = "";
            this.description = "";
            this.type = "";
            Swal.fire(
              "¡Actualizado!",
              "La publicación ha sido actualizada.",
              "success"
            );
            // Cierra la ventana emergente o formulario de edición
            this.closeForm();
            this.getPosts();
          } else {
            console.log("no se pudo actualizar el post :(");
          }
        })
        .catch((error) => {
          console.error("Error en la solicitud:", error);
        });
      this.showPopup = false;
      this.editing = false;
    },
    deletePostDB(deleteId) {
      try {
        this.postService.deletePostById(deleteId).then((data) => {
          console.log("codigo de respuesta http: " + data.responseCode);
          if (data.responseCode == "POST-0003") {
            //se insertó correctamente el post :D
            console.log("se eliminó el post correctamente :D");
            Swal.fire(
              "¡Eliminado!",
              "La publicación ha sido eliminada.",
              "success"
            );
            this.getPosts();
          } else {
            console.log("no se pudo actualizar el post :(");
          }
        });
      } catch (e) {
        console.log("error " + e);
      }
    },
    deletePost(index) {
      // Pregunta al usuario si realmente desea eliminar el post
      const confirmDelete = window.confirm(
        "¿Está seguro de que desea eliminar este post?"
      );
      if (confirmDelete) {
        // Elimina el post de la lista
        this.deletePostDB(index);
      }
    },
    filterPosts() {
      if (this.searchQuery === "") {
        this.filteredReceipts = this.posts;
      } else {
        this.filteredReceipts = this.posts.filter(
          (post) =>
            post.postTitle
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()) //||
          // Puedes añadir más condiciones aquí para filtrar por otras propiedades
        );
      }
    },
  },
  components: { NavigationBar },
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

.container {
  margin-top: 1rem;
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

.search-container {
    width: 93%;
}

.search-container {
    margin-bottom: 10px;
}
.popup {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: #fffaf1;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border: 5px solid #a69b8d;
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
  color: #f2d1b3;
  transition: all 0.5s ease-in-out;
  transform: scale(1.05);
}

.announcement-board {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  flex-direction: column;
}

.announcement-post {
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

  .header-date {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    width: 100%;
    color: #101e26;

    .header {
      font-weight: bold;
      display: flex;
      flex-direction: row;
      align-items: flex-start;

      .post-title {
        margin-right: 10px;
        font-size: 25px;
        padding: 5px;
      }

      .post-type {
        font-size: 20px;
        color: #101e26;
        background-color: #498c79;
        padding: 10px;
        border-radius: 10px;
      }
    }

    .date-time {
      font-weight: 600;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;

      .post-date {
        margin-right: 10px;
      }
    }
  }

  .post-content {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    color: #101e26;
    flex-direction: column;
  }

  .post-description {
    flex: 1;
    font-size: 20px;
    text-align: start;
  }

  .post-state {
    flex: 1;
    font-size: 20px;
    text-align: center;
    background-color: #101e26;
    color: #fffaf1;
    border-radius: 20px;
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
    .header-date {
      flex-direction: column;

      .header {
        flex-direction: column;
        align-items: center;
      }

      .date-time {
        flex-direction: column;
        align-items: flex-start;
        margin-top: 10px;
      }
    }
    .post-content {
      flex-direction: column;
      width: 100%;
      flex-wrap: wrap;
    }

    .actions {
      flex-direction: column;
      align-items: center;
      width: 100%;
      gap: 5px;
    }
  }
}
</style>

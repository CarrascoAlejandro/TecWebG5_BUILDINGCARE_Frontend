<template>
  <div class="container">
    <button @click="openForm"> Nuevo Post + </button>
      <div class="announcement-board">
          
          <div v-for="(post, index) in posts" :key="index" class="announcement-post">
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
                  <div class="post-image">
                      <img :src="this.image" alt="post image" />
                  </div>
                  <div class="post-description">{{ post.postContent }}</div>
                  <div class="actions">
                      <button @click="editPost(index)">Editar</button>
                      <button @click="deletePost(post.id)">Eliminar</button>
                  </div>
              </div>
          </div>
      </div>
  </div>
  
  <div class="popup" v-if="showPopup">
      <div class="popup-content">
          <form>
              <input v-model="title" placeholder="Titulo del Post" type="text" required />
              <textarea v-model="description" placeholder="Descripción" required></textarea>
              <input type="file" @change="handleImageUpload" accept="image/*" />
              <select v-model="type" required>
                  <option value="">Selecciona una opción</option>
                  <option v-for="option in options" :key="option.value" :value="option.value">{{ option.text }}</option>
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
  import Swal from 'sweetalert2';
  
  export default {
      data() {
          return {
              editPostForm:[{
                  id:'',
                  title: '',
                  type: '',
                  date: '',
                  time: '',
                  image: '',
                  description: '',
              }],
              image: require("@/assets/images/living1.jpg"),
              posts: [],
              // posts: [{
              //     title: "Living 1",
              //     type: "Living",
              //     date: "2021-01-01",
              //     time: "10:00",
              //     image: require("@/assets/images/living1.jpg"),
              //     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tincidunt risus eu porttitor volutpat. Phasellus justo justo, tristique eget elit vel, sodales posuere purus. Fusce id massa ac lorem maximus auctor non eu ante. In sapien leo, scelerisque non venenatis at, ullamcorper eu mauris. Proin id velit vel ipsum commodo hendrerit. Donec eleifend augue ut mi hendrerit, in feugiat lectus tincidunt. Suspendisse quis odio in arcu finibus consectetur sed a dolor. Suspendisse mattis velit in condimentum dictum. Aenean non magna sem.",
              // }],
              showPopup: false,
              editing: false,
              formData: {
                  id:'',
                  title: '',
                  type: '',
                  date: '',
                  time: '',
                  image: '',
                  description: '',
              },
              options: [{
                      value: '1',
                      text: 'Mantenimiento'
                  },
                  {
                      value: '2',
                      text: 'Anuncio'
                  },
                  {
                      value: '3',
                      text: 'Pedido'
                  },
                  // Agregar más opciones según sea necesario
              ],
          };
      },
      created(){
          this.postService = new PostService();
      },
      mounted(){
        this.getPosts();
      },
      methods: {
          getTypePosts(){
                try{
                  this.postService.getPosts().then((data) => {
                              this.posts = data.data;
                              console.log(this.posts);
                          });
                }catch(e){
                  console.log("error " + e);
                }
            },
          getPosts(){
              try{
                this.postService.getPosts().then((data) => {
                            this.posts = data.data;
                            console.log(this.posts);
                        });
              }catch(e){
                console.log("error " + e);
              }
          },
          openForm() {
              this.showPopup = true;
          },
          closeForm() {
              this.showPopup = false;
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
          newPost(){
            console.log("title: "+ this.title);
            console.log("description: "+ this.description);
            console.log("type: "+ this.type);
            try{
              this.postService.newPost(this.title, this.description, this.type).then((data) => {
                console.log("codigo de respuesta http: "+ data.responseCode);
                if(data.responseCode == "POST-0001"){
                          //se insertó correctamente el post :D
                          console.log('se creó el post correctamente :D');
                          Swal.fire(
                              '¡Creado!',
                              'La publicación ha sido creada.',
                              'success'
                          )
                          this.closeForm();
                          this.getPosts();
                      }else{
                          console.log('no se pudo crear el post :(');
                      }
              });
            }catch(e){
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
                  this.title = '';
                  this.description = '';
                  this.type = '';
  
                  // Cerrar la ventana emergente u ocultar el formulario
                  this.showPopup = false;
              } else {
                  // Puedes agregar lógica adicional para manejar campos incompletos
                  Swal.fire(
                            '¡Ups!',
                            'Por favor, complete todos los campos.',
                            'question'
                        )
              }
          },
          editPost(index) {
              // Abre el formulario de edición con los detalles del post seleccionado
              this.title = this.posts[index].title;
              this.description = this.posts[index].description;
              this.type = this.posts[index].type;
  
              // Puedes guardar el índice del post que se está editando para actualizarlo después
              this.editingIndex = index;
              this.editing = true;
  
              // Abre la ventana emergente o muestra el formulario de edición
              this.showPopup = true;
          },
  
          updatePost() {
              // Verifica que los campos estén completos antes de actualizar el post
              if (this.title && this.description && this.type) {
                  const updatedPost = {
                      title: this.title,
                      type: this.type,
                      date: this.posts[this.editingIndex].date, // Mantén la fecha original
                      time: this.posts[this.editingIndex].time, // Mantén la hora original
                      image: this.posts[this.editingIndex].image, // Mantén la imagen original
                      description: this.description,
                  };
  
                  // Actualiza el post en la lista
                  this.posts.splice(this.editingIndex, 1, updatedPost);
  
                  // Restablece los campos del formulario
                  this.title = '';
                  this.description = '';
                  this.type = '';
  
                  // Cierra la ventana emergente o formulario de edición
                  this.showPopup = false;
                  this.editing = false;
              } else {
                  // Puedes agregar lógica adicional para manejar campos incompletos
                  alert('Por favor, complete todos los campos.');
              }
          },
          deletePostDB(deleteId){
            try{
              this.postService.deletePostById(deleteId).then((data) => {
                console.log("codigo de respuesta http: "+ data.responseCode);
                if(data.responseCode == "POST-0003"){
                          //se insertó correctamente el post :D
                          console.log('se eliminó el post correctamente :D');
                          Swal.fire(
                              '¡Eliminado!',
                              'La publicación ha sido eliminada.',
                              'success'
                          )
                          this.getPosts();
                      }else{
                          console.log('no se pudo actualizar el post :(');
                      }
              });
            }catch(e){
              console.log("error " + e);
            }
          
        },
          deletePost(index) {
              // Pregunta al usuario si realmente desea eliminar el post
              const confirmDelete = window.confirm('¿Está seguro de que desea eliminar este post?');
  
              if (confirmDelete) {
                  // Elimina el post de la lista
                  this.deletePostDB(index);
              }
          },
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
  
  .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      min-width: 98.9vw;
      padding: 20px;
      background-color: #fea162;
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
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: #fff;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease-in-out;
      margin: 10px;
  
      .header-date {
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
  
              .post-title {
                  margin-right: 10px;
              }
  
              .post-type {
                  font-size: 10px;
                  color: #fff;
                  background-color: #22abb3;
                  padding: 5px;
                  border-radius: 10px;
              }
          }
  
          .date-time {
              font-weight: 600;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
  
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
      }
  
      .post-image {
          flex: 1;
          max-width: 10%;
          margin-right: 20px;
  
          img {
              width: 100%;
              border-radius: 5px;
          }
      }
  
      .post-description {
          flex: 1;
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
<template>
    <NavigationBar />
    <div class="container">
      <!-- <button class="btn btn-primary" @click="addUsers">Añadir Usuarios</button> -->
      <div
        class="profile-card"
        v-for="(user, index) in users"
        :key="user.userId"
      >
        <div class="profile-header">
          <img
            :src="user?.picture"
            alt="User's profile picture"
            class="profile-picture"
          />
          <h2 class="profile-name">{{ user?.name }}</h2>
        </div>
        <div class="profile-info">
          <p>Correo: {{ user?.email }}</p>
          <p>Usuario: {{ user?.usename }}</p>
          <p>Rol: {{ user?.typeUser }}</p>
          <p>CI: {{ user?.ci }}</p>
        </div>
        <div class="actionButtons">
          <button class="btn btn-primary" @click="editUser(index)">
            Editar
          </button>
        </div>
      </div>
      <div class="userForm" v-if="showpopup">
        <div class="popup-content">
          <form @submit.prevent="updateUser">
            <input
              v-model="name"
              placeholder="Nombre de Usuario"
              type="text"
              required
            />
            <input
              v-model="email"
              placeholder="Correo Electrónico"
              type="email"
              required
            />
            <input v-model="nickname" placeholder="Alias" type="text" required />
            <input v-model="carnet" placeholder="Carnet de Identidad" type="text" required />
            <select v-model="role" required>
              <option v-for="role in roles" :key="role" :value="role">
                {{ role }}
              </option>
            </select>
            <input type="file" @change="handleImageUpload" accept="image/*" />
            <!-- Botones de acción -->
            <div class="form-buttons">
              <button type="submit" v-if="userEditing">Actualizar</button>
              <button @click="deleteUser(index)">Eliminar</button>
              <button @click="closeForm">Cerrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  <script>
  import UserService from '@/service/UserService';
  import NavigationBar from './NavigationBar.vue';

  export default {
    data() {
      return {
        users: [],
        adminCredential: false,
        name: "",
        email: "",
        password: "",
        nickname: "",
        carnet: "",
        role: "",
        picture: "",
        userId: "",
        showpopup: false,
        userEditing: false,
        roles: [],
        typeUser: null,
        idUserStore: null,
      };
    },
    created() {
      
      this.typeUser = localStorage.getItem("typeUser");
        const storedData = localStorage.getItem("userID");
        // Parsear el JSON almacenado
        const parsedData = JSON.parse(storedData);
        // Acceder al campo "name" dentro del objeto parsedData
        this.idUserStore = parsedData.idUser;
        this.userService = new UserService(this.idUserStore);
        console.log("typeUser", this.typeUser);
        console.log("idUser", this.idUserStore);
        if (this.typeUser == null) {
            this.$router.push('/');
        }
    },
    mounted() {
      this.loadUsers();
      this.loadRoles();
    },
    methods: {
      loadRoles() {
        // Logic to load all roles
        this.userService
          .listAllUserTypes()
          .then((response) => {
            console.log(response.data.data);
            for (let i = 0; i < response.data.data.length; i++) {
              this.roles.push(response.data.data[i].permission);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      },
      verifyPermission() {
        if (this.typeUser != "Administrador") {
          // Buscar el registro en this.users con idUser igual a this.idUserStore
          this.users = this.users.filter(user => user.idUser === this.idUserStore);
          }
          console.log("estamos en verifyPermission", this.users);
        },
      loadUsers() {
        // Logic to load all users
        this.userService
          .listAllUsers()
          .then((response) => {
            console.log(response.data.data);
            this.users = response.data.data;
            this.verifyPermission();
          })
          .catch((error) => {
            console.log(error);
          });
      },
      createUser() {
        // Logic to create a new user
        const newUser = {
          name: this.name,
          email: this.email,
          password: this.password,
          nickname: this.nickname,
          role: this.role,
          picture: this.picture,
          userId: this.userId,
        };
        this.users.push(newUser);
        this.clearForm();
      },
      editUser(index) {
        // Logic to edit a user
        console.log(this.users[index].idUser);
        this.showpopup = true;
        this.userId = this.users[index].idUser;
        this.name = this.users[index].name;
        this.email = this.users[index].email;
        this.password = this.users[index].password;
        this.nickname = this.users[index].usename;
        this.carnet = this.users[index].ci;
        this.role = this.users[index].typeUser;
        this.picture = this.users[index].picture;
        this.index = index;
        this.userEditing = true;
      },
      updateUser() {
        // Logic to update a user
        const updatedUser = {
          userId: this.userId,
          name: this.name,
          usename: this.nickname,
          email: this.email,
          ci: this.carnet,
          role: this.role,
          picture: this.picture,
          
        };
        console.log(updatedUser);
        this.userService.updateUser(updatedUser.userId, updatedUser.name, updatedUser.usename, updatedUser.email, updatedUser.ci, updatedUser.phone, updatedUser.role)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
        this.clearForm();
        //Reload the page
        location.reload();
      },
      deleteUser(index) {
        // Logic to delete a user
        this.users.splice(index, 1);
      },
      clearForm() {
        // Clear the form fields
        this.name = "";
        this.email = "";
        this.password = "";
        this.nickname = "";
        this.role = "";
        this.userEditing = false;
        this.showpopup = false;
      },
      addUsers() {
        // Show the form to add a new user
        this.showpopup = true;
      },
      closeForm() {
        // Close the form
        this.showpopup = false;
      },
      changeRole() {
        // Change the role of a user
        this.adminCredential = true;
      },
      handleImageUpload() {
        // Logic to upload an image
      },
    },
    components: {
      NavigationBar,
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
    overflow-y: auto;
  }
  .container {
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    flex-direction: row;
    background-color: #F2F1E4;
    padding: 20px;
  }
  .profile-card {
    display: flex;
    margin: 1rem;
    padding: 2rem;
    border: 3px solid #A69B8D;
    border-radius: 10px;
    color: #101E26;
    background-color: FFFAF1;
    flex-direction: column;
  }
  .profile-card:hover {
    transition: all 0.5s ease-in-out;
    scale: 1.1;
  }
  .profile-picture:hover {
    transition: all 0.5s ease-in-out;
    scale: 1.1;
  }
  .profile-picture {
    border-radius: 50%;
    width: 150px;
    height: 150px;
  }
  .profile-name {
    font-weight: 800;
    margin-top: 1rem;
  }
  .profile-header {
    margin-bottom: 1rem;
    padding: 2rem;
    border-radius: 10px;
    flex-direction: column;
    width: 100%;
    text-align: center;
    height: 100%;
  }

  .profile-info {
    margin-bottom: 1rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: self-start;
  }

  .profile-info p {
    font-weight: 500;
  }
  .actionButtons {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .btn-primary {
    color: #101E26;
    background-color: #498C79;
    transition: all 0.5s ease-in-out;
    border-radius: 10px;
    border: 0px;
    padding: 10px;
  }
  .btn-primary:hover {
    color: #F2D1B3;
    background-color: #498C79;
    transform: scale(1.1);
    transition: all 0.5s ease-in-out;
    border: 0px;
  }
  .userForm {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
  }
  .popup-content {
    background-color: #222;
    padding: 2rem;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .popup-content form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .popup-content form input {
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 15px;
    border: 0px;
    width: 100%;
  }
  .popup-content form input[type="file"] {
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 15px;
    border: 0px;
    width: 100%;
    background-color: #dcbe87;
    color: #222;
  }
  .popup-content form input[type="file"]:hover {
    background-color: #222;
    color: #dcbe87;
  }
  .popup-content form select {
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 15px;
    border: 0px;
    width: 100%;
  }
  .popup-content form select:hover {
    background-color: #dcbe87;
    color: #222;
  }
  .popup-content form button {
    margin-top: 1rem;
    padding: 0.5rem;
    border-radius: 15px;
    border: 0px;
    width: 100%;
    background-color: #dcbe87;
    color: #222;
  }
  .popup-content form button:hover {
    background-color: #222;
    color: #dcbe87;
  }
  .popup-content form .form-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .popup-content form .form-buttons button {
    width: 45%;
  }
  .popup-content form .form-buttons button:hover {
    background-color: #222;
    color: #dcbe87;
  }
  </style>
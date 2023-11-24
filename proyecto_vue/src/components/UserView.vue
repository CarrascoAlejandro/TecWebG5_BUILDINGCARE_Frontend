<template>
  <div class="container">
    <h1 class="text-center">Lista de Usuarios</h1>
    <button class="btn btn-primary" @click="addUsers">Añadir Usuarios</button>
    <div
      class="row align-items-center profile-header"
      v-for="(user, index) in users"
      :key="user.userId"
    >
      <div class="col-md-2 mb-3">
        <img
          :src="user?.picture"
          alt="User's profile picture"
          class="square img-fluid profile-picture"
        />
      </div>
      <div class="col-md text-center profile-info">
        <h2>{{ user?.name }}</h2>
        <p>Correo: {{ user?.email }}</p>
        <p>Usuario: {{ user?.nickname }}</p>
        <p>Rol: {{ user?.role }}</p>
      </div>
      <div class="actionButtons">
        <button
          class="btn btn-primary"
          v-if="!adminCredential"
          @click="changeRole"
        >
          Convertir en Administrador
        </button>
        <button class="btn btn-primary" @click="deleteUser(index)">
          Eliminar
        </button>
        <button class="btn btn-primary" @click="editUser(index)">
          Editar
        </button>
      </div>
    </div>
    <div class="userForm" v-if="showpopup">
      <div class="popup-content">
        <form>
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
          <input
            v-model="password"
            placeholder="Contraseña"
            type="password"
            required
          />
          <input v-model="nickname" placeholder="Alias" type="text" required />
          <select v-model="role" required>
            <option v-for="role in roles" :key="role" :value="role">
              {{ role }}
            </option>
          </select>
          <input type="file" @change="handleImageUpload" accept="image/*" />
          <!-- Botones de acción -->
          <div class="form-buttons">
            <button @click="createUser" v-if="!userEditing">Crear</button>
            <button @click="updateUser" v-if="userEditing">Actualizar</button>
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
      users: [],
      adminCredential: false,
      name: "",
      email: "",
      password: "",
      nickname: "",
      role: "",
      picture: "",
      userId: "",
      showpopup: false,
      userEditing: false,
      roles: ["user", "admin"],
    };
  },
  methods: {
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
      this.showpopup = true;
      this.name = this.users[index].name;
      this.email = this.users[index].email;
      this.password = this.users[index].password;
      this.nickname = this.users[index].nickname;
      this.role = this.users[index].role;
      this.picture = this.users[index].picture;
      this.userId = this.users[index].userId;
      this.index = index;
      this.userEditing = true;
    },
    updateUser() {
      // Logic to update a user
      const updatedUser = {
        name: this.name,
        email: this.email,
        password: this.password,
        nickname: this.nickname,
        role: this.role,
        picture: this.picture,
        userId: this.userId,
      };
      this.users.splice(this.index, 1, updatedUser);
      this.clearForm();
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
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile-header {
    margin: 1rem;
  padding: 2rem;
  border: 2px solid #222;
  border-radius: 15px;
  flex-direction: column;
}

.profile-picture:hover {
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
  transition: all 0.2s ease-in-out;
  scale: 1.1;
  filter: grayscale(100%);
}

.profile-picture {
  border-radius: 50%;
  width: 150px;
  height: 150px;
}

.profile-info {
  margin-bottom: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.profile-header {
  margin-bottom: 2rem;
  padding: 2rem;
  border: 2px solid #222;
  border-radius: 15px;
  flex-direction: column;
}
.profile-picture:hover {
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
  transition: all 0.2s ease-in-out;
  scale: 1.1;
  filter: grayscale(100%);
}
.profile-picture {
  border-radius: 50%;
  width: 150px;
  height: 150px;
}
.profile-info {
  margin-bottom: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.profile-info h2 {
  font-weight: 700;
  margin-bottom: 0.5rem;
  background-color: #dcbe87;
  color: #222;
  border-radius: 20px;
  padding: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  width: fit-content;
}
.profile-info p {
  font-weight: 400;
}
.actionButtons {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-primary {
  color: #dcbe87;
  background-color: #222;
  transition: all 0.5s ease-in-out;
  border-radius: 15px;
  border: 0px;
  padding: 0.5rem;
}
.btn-primary:hover {
  color: #222;
  background-color: #dcbe87;
  transform: scale(1.1);
  transition: all 0.2s ease-in-out;
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

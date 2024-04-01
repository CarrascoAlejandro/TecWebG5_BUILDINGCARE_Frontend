<template>
  <NavigationBar />
  <div class="container">
    <div class="utilities">
      <button
        v-if="privileges.Users === 'Modificacion'"
        class="btn btn-primary"
        @click="addRole"
      >
        Añadir Roles
      </button>
    </div>
    <div class="user-list">
      <!-- Itera sobre cada rol usando v-for -->
      <div class="profile-card" v-for="role in roles" :key="role.name">
        <div class="profile-header">
          <!-- Imagina que tienes una imagen predeterminada para cada tipo de rol o puedes añadir una propiedad de imagen a cada rol si es necesario -->
          <img
            class="profile-picture"
            :src="role.name === 'Admin' ? admin_pic : role.name === 'Editor' ? propietario_pic : inquilino_pic"
            alt="profile-pic"
          />
          <!-- Muestra el nombre del rol -->
          <h2 class="profile-name">{{ role.name }}</h2>
        </div>
        <div class="profile-info">
          <!-- Muestra los privilegios; ajusta los textos según necesites -->
          <p>Área Común: {{ role.commonAreas }}</p>
          <p>Anuncios: {{ role.posts }}</p>
          <p>Pagos: {{ role.payments }}</p>
          <p>Usuarios: {{ role.users }}</p>
          <p>Propiedades: {{ role.properties }}</p>
          <p>Contratos: {{ role.contracts }}</p>
        </div>
        <!-- Botones de acción; asumo que querrás manejar estas acciones por rol -->
        <div class="actionButtons">
          <button
            class="btn btn-primary"
            style="margin-right: 10px"
            @click="editRole(role)"
            v-if="role.name !== 'Admin' && role.name !== 'Usuario Base'"
          >
            Editar
          </button>
          <button 
            class="btn btn-primary" 
            @click="deleteRole(role)" 
            v-if="role.name !== 'Admin' && role.name !== 'Usuario Base'"
          >
            Eliminar
          </button>
          <div v-else>
            <p>Este rol no puede ser modificado ni eliminado</p>
          </div>
        </div>
      </div>
    </div>
    <div class="userForm" v-if="showpopup">
      <div class="popup-content">
        <form @submit.prevent="roleEditing ? updateRole() : createRole()">
          <input
            v-model="name"
            placeholder="Nombre del Rol"
            type="text"
            required
            :disabled="roleEditing"
          />
          <p>Área Común</p>
          <select
            v-model="commonAreas"
            :disabled="privileges.Users !== 'Modificacion'"
            required
          >
            <option value="Lectura">Lectura</option>
            <option value="Modificacion">Modificación</option>
            <option value="Ninguno">Ninguno</option>
          </select>
          <p>Anuncios</p>
          <select
            v-model="posts"
            :disabled="privileges.Users !== 'Modificacion'"
            required
          >
            <option value="Lectura">Lectura</option>
            <option value="Modificacion">Modificación</option>
            <option value="Ninguno">Ninguno</option>
          </select>
          <p>Pagos</p>
          <select
            v-model="payments"
            :disabled="privileges.Users !== 'Modificacion'"
            required
          >
            <option value="Lectura">Lectura</option>
            <option value="Modificacion">Modificación</option>
            <option value="Ninguno">Ninguno</option>
          </select>
          <p>Usuarios</p>
          <select
            v-model="users"
            :disabled="privileges.Users !== 'Modificacion'"
            required
          >
            <option value="Lectura">Lectura</option>
            <option value="Modificacion">Modificación</option>
            <option value="Ninguno" disabled>Ninguno</option>
          </select>
          <p>Propiedades</p>
          <select
            v-model="properties"
            :disabled="privileges.Users !== 'Modificacion'"
            required
          >
            <option value="Lectura">Lectura</option>
            <option value="Modificacion">Modificación</option>
            <option value="Ninguno" disabled>Ninguno</option>
          </select>
          <p>Contratos</p>
          <select
            v-model="contracts"
            :disabled="privileges.Users !== 'Modificacion'"
            required
          >
            <option value="Lectura">Lectura</option>
            <option value="Modificacion">Modificación</option>
            <option value="Ninguno">Ninguno</option>
          </select>
          <div class="form-buttons">
            <button type="submit" v-if="!roleEditing">Crear</button>
            <button type="submit" v-if="roleEditing">Actualizar</button>
            <button @click="closeForm">Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import NavigationBar from "./NavigationBar.vue";
import UserService from "@/service/UserService";
import RoleService from "@/service/RoleService";
import Administrador from "@/assets/images/admin.png";
import Inquilino from "@/assets/images/user.png";
import Propietario from "@/assets/images/property.png";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      roles: [],
      adminCredential: false,
      name: "",
      commonAreas: "",
      posts: "",
      payments: "",
      users: "",
      properties: "",
      contracts: "",
      userId: "",
      commonAreaRole: "",
      announcementsRole: "",
      paymentsRole: "",
      usersRole: "",
      propertiesRole: "",
      contractsRole: "",
      showpopup: false,
      roleEditing: false,
      typeUser: null,
      idUserStore: null,
      admin_pic: Administrador,
      inquilino_pic: Inquilino,
      propietario_pic: Propietario,
      privileges: {},
    };
  },
  created() {
    try {
      this.typeUser = localStorage.getItem("typeUser");
      const storedData = localStorage.getItem("userID");
      // Parsear el JSON almacenado
      const parsedData = JSON.parse(storedData);
      // Acceder al campo "name" dentro del objeto parsedData
      this.idUserStore = parsedData.idUser;
      // Copiar privilegios de acceso
      this.privileges = parsedData.roleAssignation.privileges;
      this.userService = new UserService(this.idUserStore);
      this.roleService = new RoleService();
      console.log("typeUser", this.typeUser);
      console.log("idUser", this.idUserStore);
      this.loadRoles();
      this.fetchRoles();
      console.log("whyyy")
      if (this.typeUser == null) {
        this.$router.push("/");
      }
    } catch (error) {
      console.log(error);
      this.$router.push("/");
    }
  },
  mounted() {
    //this.fetchRoles();
  },
  methods: {
    loadRoles() {
      // Logic to load all roles
      this.userService
        .listAllUserTypes()
        .then((response) => {
          let temp = [];
          console.log("loaded roles", response.data.data);
          for (let i = 0; i < response.data.data.length; i++) {
            if(response.data.data[i].name !== 'Admin' && response.data.data[i].name !== 'Usuario Base'){
              //Append at the end of the array
              this.roles.push(response.data.data[i].name);
            } else {
              //temp.push(response.data.data[i].name);
            } 
            this.roles = this.roles.concat(temp);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    verifyPermission() {
      if (this.privileges.Users !== 'Modificacion') {
        // Buscar el registro en this.users con idUser igual a this.idUserStore
        this.users = this.users.filter(
          (user) => user.idUser === this.idUserStore
        );
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
    async fetchRoles() {
      try {
        const data = await this.roleService.fetchRoles();
        if (data.responseCode === "ROLE-0000" && data.data) {
          console.log("data", data.data);
          // Mapeamos los datos para asignar cada privilegio a su variable correspondiente
          this.roles = data.data.map((role) => ({
            name: role.name,
            commonAreas: role.privileges.CommonAreas,
            posts: role.privileges.Posts,
            payments: role.privileges.Payments,
            users: role.privileges.Users,
            properties: role.privileges.Properties,
            contracts: role.privileges.Contracts,
          }));
          // Reassign roles "Admin" and "Usuario Base" to the last two positions
          this.roles = this.roles.sort((a) => {
            if (a.name === "Admin") return 1;
            if (a.name === "Usuario Base") return 1;
            return -1;
          });
        } else {
          console.error("Error fetching roles: ", data.errorMessage);
        }
        console.log("roles", this.roles);
      } catch (error) {
        console.error(
          "Failed to fetch roles:",
          error.message ? error.message : error
        );
      }
    },
    async createRole() {
      // Construye el objeto role con la información necesaria.
      const role = {
        name: this.name, // Asume que this.name contiene el nombre del rol a crear.
        privileges: {
          CommonAreas: this.commonAreas, // Asume que this.commonAreas contiene el privilegio para Áreas Comunes.
          Posts: this.posts, // Asume que this.posts contiene el privilegio para Anuncios.
          Payments: this.payments, // Asume que this.payments contiene el privilegio para Pagos.
          Users: this.users, // Asume que this.users contiene el privilegio para Usuarios.
          Properties: this.properties, // Asume que this.properties contiene el privilegio para Propiedades.
          Contracts: this.contracts, // Asume que this.contracts contiene el privilegio para Contratos.
        },
      };
      console.log(role);
      //Verificar que se hayan asignado todos los permisos
      if (
        !role.name ||
        !role.privileges.CommonAreas ||
        !role.privileges.Posts ||
        !role.privileges.Payments ||
        !role.privileges.Users ||
        !role.privileges.Properties ||
        !role.privileges.Contracts
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Por favor, completa todos los campos.",
        });
        return;
      }
      try {
        // Llama a la función addRole de RoleService y pasa el objeto role.
        const response = await this.roleService.addRole(role);

        // Maneja la respuesta como desees, por ejemplo, mostrando un mensaje de éxito.
        console.log(response.data); // Muestra el mensaje de éxito en la consola.

        // Aquí puedes incluir cualquier lógica adicional tras crear el rol, como recargar la lista de roles.
        this.fetchRoles();
        this.clearForm();
      } catch (error) {
        // Maneja los errores aquí, por ejemplo, mostrando un mensaje de error al usuario.
        console.error("Error creating role:", error.message);
      }
    },
    editRole(role) {
      console.log("role", role);
      this.name = role.name;
      this.commonAreas = role.commonAreas;
      this.posts = role.posts;
      this.payments = role.payments;
      this.users = role.users;
      this.properties = role.properties;
      this.contracts = role.contracts;

      // Abre el formulario y establece el estado para editar
      this.showpopup = true;
      this.roleEditing = true;
    },
    async updateRole() {
      // Construye el objeto updatedRole con la información actualizada.
      const updatedRole = {
        name: this.name, // Asume que this.name contiene el nombre actualizado del rol.
        privileges: {
          CommonAreas: this.commonAreas, // Privilegio actualizado para Áreas Comunes.
          Posts: this.posts, // Privilegio actualizado para Anuncios.
          Payments: this.payments, // Privilegio actualizado para Pagos.
          Users: this.users, // Privilegio actualizado para Usuarios.
          Properties: this.properties, // Privilegio actualizado para Propiedades.
          Contracts: this.contracts, // Privilegio actualizado para Contratos.
        },
      };

      try {
        // Llama a la función updateRole de RoleService y pasa el objeto updatedRole.
        const response = await this.roleService.updateRole(updatedRole);

        // Maneja la respuesta como desees, por ejemplo, mostrando un mensaje de éxito.
        console.log("Role updated successfully", response);

        // Aquí puedes incluir cualquier lógica adicional tras actualizar el rol, como recargar la lista de roles.
        this.fetchRoles();
      } catch (error) {
        // Maneja los errores aquí, por ejemplo, mostrando un mensaje de error al usuario.
        console.error("Error updating role:", error);
      }
    },
    async deleteRole(role) {
      if (
        !confirm(`Estás seguro de que quieres eliminar el rol ${role.name}?`)
      ) {
        return;
      }

      try {
        const response = await this.roleService.deleteRole(role.name);
        console.log(response); // Aquí podrías verificar la respuesta del servidor

        // Si todo sale bien, podrías querer actualizar la lista de roles
        this.fetchRoles();
      } catch (error) {
        alert("No se pudo eliminar el rol. Por favor, inténtalo de nuevo.");
        console.error("Error deleting role:", error);
      }
    },
    clearForm() {
      // Clear the form fields
      this.name = "";
      this.commonAreas = "";
      this.posts = "";
      this.payments = "";
      this.users = "";
      this.properties = "";
      this.contracts = "";
      this.roleEditing = false;
      this.showpopup = false;
    },
    addRole() {
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
  flex-direction: column;
  background-color: #f2f1e4;
  padding: 20px;
}

.utilities {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-direction: row;
  background-color: #f2f1e4;
}

.user-list {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-direction: row;
  background-color: #f2f1e4;
  flex-wrap: wrap;
}
.profile-card {
  display: flex;
  margin: 1rem;
  padding: 2rem;
  border: 3px solid #a69b8d;
  border-radius: 10px;
  color: #101e26;
  background-color: FFFAF1;
  flex-direction: column;
}
.profile-card:hover {
  transition: all 0.5s ease-in-out;
  scale: 1.1;
}
.profile-picture {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 5px solid #a69b8d;
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
  color: #101e26;
  background-color: #498c79;
  transition: all 0.5s ease-in-out;
  border-radius: 10px;
  border: 0px;
  padding: 10px;
}
.btn-primary:hover {
  color: #f2d1b3;
  background-color: #498c79;
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
  background-color: #f2f1e4;
  padding: 2rem;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: #a69b8d 5px solid;
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
  border-radius: 10px;
  border: 0px;
  width: 100%;
  background-color: #fffaf1;
  border: #a69b8d 3px solid;
}
.popup-content form select {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 10px;
  border: 0px;
  width: 100%;
  background-color: #fffaf1;
  border: #a69b8d 3px solid;
}
.popup-content form button {
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 10px;
  border: 0px;
  width: 100%;
  background-color: #498c79;
  color: #101e26;
}
.popup-content form button:hover {
  color: #f2d1b3;
  transition: all 0.5s ease-in-out;
  transform: scale(1.1);
}
.popup-content form .form-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 100%;
}

@media screen and (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .utilities {
    flex-direction: column;
  }

  .user-list {
    flex-direction: column;
  }
  .profile-card {
    width: 90%;
  }

  .profile-picture {
    width: 100px;
    height: 100px;
  }

  .profile-header {
    padding: 1rem;
  }

  .profile-info {
    margin-bottom: 1rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
    color: #101e26;
    background-color: #498c79;
    transition: all 0.5s ease-in-out;
    border-radius: 10px;
    border: 0px;
    padding: 10px;
  }

  .btn-primary:hover {
    color: #f2d1b3;
    background-color: #498c79;
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
    padding: 2rem;
    border-radius: 10px;
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
    border-radius: 10px;
    border: 0px;
    width: 100%;
    background-color: #fffaf1;
    border: #a69b8d 3px solid;
  }

  .popup-content form button {
    margin-top: 1rem;
    padding: 0.5rem;
    border-radius: 10px;
    border: 0px;
    width: 100%;
    background-color: #498c79;
    color: #101e26;
    flex-direction: column;
  }
}
</style>

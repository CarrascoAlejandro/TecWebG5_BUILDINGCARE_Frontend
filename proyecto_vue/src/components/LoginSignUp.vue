<template>
  <div id="container" class="container">
    <div class="row">
      <!-- REGISTRARSE -->
      <div class="col align-items-center flex-col sign-up">
        <div class="form-wrapper align-items-center">
          <div class="form sign-up">
            <div class="head-signUp">
              <img src="@/assets/logos/bcareNegro.png" />
              <h2>Registrarse</h2>
              <div>
                  <b>Bienvenido! Ingresa tu información para completar tu registro.</b>
              </div>
            </div>
            <div class="sign-up-inputs">
              <div class="personal-info">
                <div class="input-group">
                <input
                  type="text"
                  v-model="newUsername"
                  placeholder="Nombre de Usuario"
                  required
                />
                <div>
                  <p>Tu nombre de usuario es un identificador único, no puedes cambiarlo después</p>
                </div>
                </div>
                <div class="input-group">
                  <input
                    type="text"
                    v-model="newName"
                    placeholder="Nombre Completo"
                    required
                  />
                </div>
              </div>
              <!-- <div class="input-group">
                <input
                  type="text"
                  v-model="newCI"
                  placeholder="Cédula de Identidad"
                  required
                />
              </div>
              <div class="input-group">
                <input
                  type="text"
                  v-model="newPhone"
                  placeholder="Teléfono"
                  required
                />
              </div>-->
            </div>
            <div class="site-info">
              <div class="input-group">
                <input
                  type="text"
                  v-model="newEmail"
                  placeholder="email"
                  required
                />
              </div>
              <div class="input-group">
                <input
                  type="password"
                  v-model="newPassword"
                  placeholder="Contraseña"
                  required
                />
              </div>
              <div v-if="passwordwarning">
                <p>{{ passwordwarning }}</p>
              </div>
              <div class="input-group">
                <input
                  type="password"
                  v-model="confirmPassword"
                  placeholder="Confirmar Contraseña"
                  required
                />
              </div>
            </div>
            
            <button @click="signUp">Registrarse</button>
            <div class="footer-sign-up">
              <p>
                <span> Ya está registrado? </span>
                <b @click="toggle" class="pointer"> Iniciar Sesión </b>
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- FIN REGISTRO -->
      <!-- LOGIN -->
      <div class="col align-items-center flex-col sign-in">
        <div class="form-wrapper align-items-center">
          <div class="form sign-in">
            <div class="head-signUp">
              <img src="@/assets/logos/bcareNegro.png" alt="logo" />
              <h2>Iniciar Sesión</h2>
            </div>
            <div class="input-group">
              <input
                type="text"
                v-model="username"
                placeholder="Nombre de Usuario"
                required
              />
            </div>
            <div class="input-group">
              <input
                type="password"
                v-model="password"
                placeholder="Contraseña"
                required
              />
            </div>
            <button @click="signIn">Iniciar Sesión</button>

            <div class="footer-sign-in">
              <p>
                <span> No está registrado? </span>
                <b @click="toggle" class="pointer"> Crear una cuenta </b>
              </p>
              <p>
                <span> Olvidó su contraseña? </span>
                <!-- Redirect to RestorePasswordView -->
                <b 
                  @click="this.$router.push({
                    name: 'resetPassword',
                    params: { toggle: 'request', username: 'None' }
                  })"
                  class="pointer"
                > Restablecer Contraseña </b>
              </p>
            </div>
          </div>
        </div>
        <div class="form-wrapper"></div>
      </div>
      <!-- END LOGIN -->
    </div>

    <div class="row content-row">
      <div class="col align-items-center flex-col">
        <div class="img sign-in"></div>
      </div>

      <div class="col align-items-center flex-col">
        <div class="img sign-up"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import UserService from '../service/UserService';
import Swal from 'sweetalert2';
export default {
  
  data() {
    return {
      newUsername: "",
      newPassword: "",
      confirmPassword: "",
      newName: "",
      newCI: "Sin asignar",
      newPhone: "Sin asignar",
      newEmail: "",
      username: "",
      password: "",
      passwordwarning: "",
      attempts: 0,
    };
  },
  watch: {
    newPassword() {
      this.checkPasswordComplexity();
    }
  },
  created() {
    this.userService= new UserService();
  },
  methods: {
    toggle() {
      this.$el.classList.toggle("sign-in");
      this.$el.classList.toggle("sign-up");
    },
    checkPasswordComplexity() {
      const hasNumber = /\d/.test(this.newPassword);
      const hasUpper = /[A-Z]/.test(this.newPassword);
      const hasLower = /[a-z]/.test(this.newPassword);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword);

      if (this.newPassword.length < 8){
        this.passwordwarning = "La contraseña debe tener al menos 8 caracteres";
      } else if (!hasNumber){
        this.passwordwarning = "La contraseña debe tener al menos un número";
      } else if (!hasUpper){
        this.passwordwarning = "La contraseña debe tener al menos una letra mayúscula";
      } else if (!hasLower){
        this.passwordwarning = "La contraseña debe tener al menos una letra minúscula";
      } else if (!hasSpecial){
        this.passwordwarning = "La contraseña debe tener al menos un caracter especial";
      } else {
        this.passwordwarning = "";
      }
    },
    loginUser() {
      if (this.username === "" || this.password === "") {
        //alert("Uno o más campos están vacíos");
        Swal.fire({
          icon: 'error',
          title: 'Uno o más campos están vacíos'
        })
        return;
      }
      axios
        .post("http://143.198.78.35:8080/api/v1/user/login", {
          username: this.username,
          password: this.password,
        })
        .then(({ data }) => {
          if (
            data.responseCode === null &&
            data.data === null &&
            data.errorMessage === null
          ) {
            /* alert(
              "Los datos ingresados son incorrectos. Por favor, intente nuevamente."
            ); */
            
            
          } else if (data.data) {
            localStorage.setItem("userID", JSON.stringify(data.data));
            /* alert("Ingreso exitoso"); */
            console.log(data.data);
            if (data.data.warnings.length > 0) {
              data.data.warnings.forEach((warning) => {
                /* alert(warning); */
                Swal.fire({
                  icon: 'warning',
                  title: warning,
                  showCancelButton: true,
                  confirmButtonText: 'Reset Password',
                  cancelButtonText: 'Más tarde',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.$router.push("/resetPassword/reset/"+this.username);
                  }
                });
              });
            } else {
              /* alert("Ingreso exitoso"); */
              Swal.fire({
                icon: 'success',
                title: 'Ingreso exitoso'
              })
            }
            //guardamos los datos de data.data en el local storage
            const typeUser = data.data.typeUser;
            localStorage.setItem('typeUser', typeUser);
            //guardando los datos del usuario por si fueran de utilidad 
            localStorage.setItem("userID", JSON.stringify(data.data));
            //redireccionamos a la vista de payments
            const storedTypeUser = localStorage.getItem('typeUser');
            console.log("el tipo de usuario es "+storedTypeUser);
            this.$router.push("/propertyView");
          } else if (data.errorMessage) {
            this.attempts++;
            console.log(this.attempts);
            if(this.attempts >= 3){
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha excedido el número de intentos permitidos. Ha olvidado su contraseña?',
                showCancelButton: true,
                confirmButtonText: 'Restaurar contraseña',
                cancelButtonText: 'Más tarde',
              })
              .then((result) => {
                if (result.isConfirmed) {
                  this.$router.push("/resetPassword/request/None");
                }
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Los datos ingresados son incorrectos.',
                text: 'Por favor, intente nuevamente.'
              })
            }
          }
        })
        .catch((err) => {
          alert("Error en la conexión con el servidor: ", err);
        });
    },
    signUp() {
      if (
        this.newUsername === "" ||
        this.newPassword === "" ||
        this.confirmPassword === ""
      ) {
        /* alert("Uno o más campos están vacíos"); */
        Swal.fire({
          icon: 'error',
          title: 'Uno o más campos están vacíos'
        })
        return;
      } else if (this.newPassword !== this.confirmPassword) {
        /* alert("Las contraseñas no coinciden"); */
        Swal.fire({
          icon: 'error',
          title: 'Las contraseñas no coinciden'
        })
        return;
      } else if (this.passwordwarning){
        /* alert(this.passwordwarning); */
        Swal.fire({
          icon: 'error',
          title: this.passwordwarning
        })
        return;
      } else {
        // Aquí puedes agregar la llamada API para registrar al usuario si lo necesitas.
        this.userService.signUpUser(this.newName, this.newUsername, this.newPassword, this.newEmail, this.newCI, this.newPhone, 3).then((response) => {//se manda el tipo de user como inquilino
          //verificar el codigo de envio
          if(response.responseCode =="USER-0002" ){
            Swal.fire({
              icon: 'success',
              title: 'Registro exitoso'
            }).then(() => {
              this.toggle();
            });
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.errorMessage
            });
          }
        });
        
      }
    },
    signIn() {
      this.loginUser();
    },
  },
  mounted() {
    setTimeout(() => {
      this.$el.classList.add("sign-in");
    }, 200);
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

.head-signUp,
.head-signUp {
  color: #101e26;
}

.head-signUp img {
  width: 100%;
  max-width: 10rem;
  padding-top: 3vh;
}

.head-signUp h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1rem 0;
}
.container {
  position: relative;
  min-height: 100%;
  min-width: 100%;
  overflow: hidden;
  background: radial-gradient(
    circle,
    rgba(73, 140, 121, 1) 0%,
    rgba(16, 30, 38, 1) 70%
  );
}

.row {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
}

.col {
  width: 50%;
}

.align-items-center {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.form-wrapper {
  width: 100%;
  max-width: 28rem;
}

.form {
  padding: 1rem;
  background-color: #F2F1E4;
  border-radius: 1.5rem;
  border: 5px solid #A69B8D;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  transform: scale(0);
  transition: 0.5s ease-in-out;
  transition-delay: 1s;
}

.input-group {
  position: relative;
  width: 100%;
  margin: 10px 0;
}
.input-group input {
  width: 100%;
  padding: 1rem 3rem;
  font-size: 1rem;
  background-color: #fffaf1;
  border-radius: 10px;
  border: 3px solid #A69B8D;
  outline: none;
  text-align: center;
}

.input-group input:focus {
  border: 4px solid #F2D1B3;
}

.form button {
  cursor: pointer;
  width: 100%;
  padding: 0.6rem 0;
  border-radius: 0.5rem;
  border: none;
  background-color: #498C79;
  color: #101E26;
  font-size: 1.2rem;
  outline: none;

  &:hover {
    background-color: #498C79;
    color: #F2D1B3;
    transition: all 0.5s ease-in-out;
    transform: scale(1.05);
  }
}

.footer-sign-in p,
.footer-sign-up p {
  margin: 1rem 0;
  font-size: 0.7rem;
}

.flex-col {
  flex-direction: column;
}

.pointer {
  cursor: pointer;
}

.container.sign-in .form.sign-in,
.container.sign-in .social-list.sign-in,
.container.sign-in .social-list.sign-in > div,
.container.sign-up .form.sign-up,
.container.sign-up .social-list.sign-up,
.container.sign-up .social-list.sign-up > div {
  transform: scale(1);
}

.content-row {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
  width: 100%;
}

.img img {
  width: 100%;
  transition: 1s ease-in-out;
  transition-delay: 0.4s;
}

.text .sign-in h2,
.text .sign-in p,
.img .sign-in img {
  transform: translateX(-250%);
}

.text .sign-up h2,
.text .sign-up p,
.img .sign-up img {
  transform: translateX(250%);
}

.container.sign-in .text.sign-in h2,
.container.sign-in .text.sign-in p,
.container.sign-in .img.sign-in img,
.container.sign-up .text.sign-up h2,
.container.sign-up .text.sign-up p,
.container.sign-up .img.sign-up img {
  transform: translateX(0);
}

/* BACKGROUND */

.container::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100vh;
  transform: translate(35%, 0);
  transition: 1s ease-in-out;
  z-index: 6;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-bottom-right-radius: max(30vh, 30vh);
  border-top-left-radius: max(30vh, 30vh);
}

.container.sign-in::before {
  transform: translate(0, 0);
  right: 50%;
  border-top-left-radius: max(0vh, 0vh);
  border-bottom-right-radius: max(30vh, 30vh);
  background-image: url("@/assets/images/living1.jpg");
  background-size: contain;
  background-repeat: no-repeat;
}

.container.sign-up::before {
  transform: translate(100%, 0);
  right: 50%;
  border-top-left-radius: max(30vh, 30vh);
  border-bottom-right-radius: max(0vh, 0vh);
  background-image: url("@/assets/images/living2.jpg");
  background-size: contain;
  background-repeat: no-repeat;
}

.form.sign-up {
  min-height: 100vh;
}

/* RESPONSIVE */

@media only screen and (max-width: 768px) {
  .container::before,
  .container.sign-in::before,
  .container.sign-up::before {
    height: 100%;
    border-bottom-right-radius: 0;
    border-top-left-radius: 0;
    z-index: 0;
    transform: none;
    right: 0;
  }

  .container.sign-in .col.sign-in,
  .container.sign-up .col.sign-up {
    transform: translateY(0);
  }

  .content-row {
    align-items: flex-start !important;
  }

  .content-row .col {
    transform: translateY(0);
  }

  .col {
    width: 100%;
    position: absolute;
    padding: 1rem;
    border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
    transform: translateY(100%);
    transition: 1s ease-in-out;
  }

  .row {
    align-items: flex-end;
    justify-content: flex-end;
  }
}
</style>

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
            </div>
            <div class="input-group">
              <i class="bx bxs-user"></i>
              <input
                type="text"
                v-model="newUsername"
                placeholder="Nombre de Usuario"
                required
              />
            </div>
            <div class="input-group">
              <i class="bx bxs-lock-alt"></i>
              <input
                type="password"
                v-model="newPassword"
                placeholder="Contraseña"
                required
              />
            </div>
            <div class="input-group">
              <i class="bx bxs-lock-alt"></i>
              <input
                type="password"
                v-model="confirmPassword"
                placeholder="Confirmar Contraseña"
                required
              />
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
              <i class="bx bxs-user"></i>
              <input
                type="text"
                v-model="username"
                placeholder="Nombre de Usuario"
                required
              />
            </div>
            <div class="input-group">
              <i class="bx bxs-lock-alt"></i>
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

export default {
  data() {
    return {
      newUsername: "",
      newPassword: "",
      confirmPassword: "",
      username: "",
      password: "",
    };
  },
  methods: {
    toggle() {
      this.$el.classList.toggle("sign-in");
      this.$el.classList.toggle("sign-up");
    },
    loginUser() {
      if (this.username === "" || this.password === "") {
        alert("Uno o más campos están vacíos");
        return;
      }
      axios
        .post("http://localhost:8080/api/v1/login", {
          username: this.username,
          password: this.password,
        })
        .then(({ data }) => {
          if (
            data.responseCode === null &&
            data.data === null &&
            data.errorMessage === null
          ) {
            alert(
              "Los datos ingresados son incorrectos. Por favor, intente nuevamente."
            );
          } else if (data.data) {
            localStorage.setItem("userID", JSON.stringify(data.data));
            alert("Ingreso exitoso");
            this.$router.push("/paymentsView");
          } else if (data.errorMessage) {
            alert(data.errorMessage);
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
        alert("Uno o más campos están vacíos");
        return;
      } else if (this.newPassword !== this.confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      } else {
        // Aquí puedes agregar la llamada API para registrar al usuario si lo necesitas.
        alert("Registro exitoso");
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
  color: black;
}

.head-signIn img,
.head-signUp img {
  width: 100%;
  max-width: 10rem;
}
.head-signIn h2,
.head-signUp h2 {
  font-size: 2rem;
  font-weight: 600;
  margin: 1rem 0;
}
.container {
  position: relative;
  min-height: 100vh;
  min-width: 98.9vw;
  overflow: hidden;
  background: linear-gradient(
    90deg,
    rgba(179, 102, 52, 1) 0%,
    rgba(255, 177, 125, 1) 50%,
    rgba(254, 161, 98, 1) 100%
  );
}

.row {
  display: flex;
  flex-wrap: wrap;
  height: 100vh;
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
  background-color: #ffff;
  border-radius: 1.5rem;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  transform: scale(0);
  transition: 0.5s ease-in-out;
  transition-delay: 1s;
}

.input-group {
  position: relative;
  width: 100%;
  margin: 1rem 0;
}

.input-group i {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  font-size: 1.4rem;
  color: #757575;
}

.input-group input {
  width: 100%;
  padding: 1rem 3rem;
  font-size: 1rem;
  background-color: #efefef;
  border-radius: 0.5rem;
  border: 0.125rem solid #ffff;
  outline: none;
  text-align: center;
}

.input-group input:focus {
  border: 0.125rem solid #1d6ba0;
}

.form button {
  cursor: pointer;
  width: 100%;
  padding: 0.6rem 0;
  border-radius: 0.5rem;
  border: none;
  background-color: #22abb3;
  color: #ffff;
  font-size: 1.2rem;
  outline: none;
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
  z-index: 6;
  width: 100%;
}

.text {
  margin: 4rem;
  color: #ffff;
}

.text h2 {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 2rem 0;
  transition: 1s ease-in-out;
}
.text p {
  font-weight: 600;
  transition: 1s ease-in-out;
  transition-delay: 0.2s;
}

.img img {
  width: 30vh;
  transition: 1s ease-in-out;
  transition-delay: 0.4s;
}

.text.sign-in h2,
.text.sign-in p,
.img.sign-in img {
  transform: translateX(-250%);
}

.text.sign-up h2,
.text.sign-up p,
.img.sign-up img {
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

/* RESPONSIVE */

@media only screen and (max-width: 425px) {
  .container::before,
  .container.sign-in::before,
  .container.sign-up::before {
    height: 100vh;
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
    background-color: unset;
  }

  .col {
    width: 100%;
    position: absolute;
    padding: 2rem;
    background-color: #ffff;
    border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
    transform: translateY(100%);
    transition: 1s ease-in-out;
  }

  .row {
    align-items: flex-end;
    justify-content: flex-end;
  }

  .form,
  .social-list {
    box-shadow: none;
    margin: 0;
    padding: 0;
  }

  .text {
    margin: 0;
  }

  .text p {
    display: none;
  }

  .text h2 {
    margin: 0.5rem;
    font-size: 2rem;
  }
}
</style>

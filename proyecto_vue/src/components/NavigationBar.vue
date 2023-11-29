<template>
  <div class="nav-container">
    <div class="nav-bar">
      <div class="menu-toggle" @click="toggleMenu">
        <span class="bar bar-top" :class="{ 'bar-top-open': isMenuOpen }"></span>
        <span class="bar bar-mid" :class="{ 'bar-mid-open': isMenuOpen }"></span>
        <span class="bar bar-bottom" :class="{ 'bar-bottom-open': isMenuOpen }"></span>
      </div>
      <nav class="nav-links" :class="{ 'nav-open': isMenuOpen }">
        <div class="logo">
          <img src="@/assets/logos/bcareHorizontalNegro.png" alt="logo" />
        </div>
        <li
          v-for="item in navItems"
          :key="item.name"
          :class="{ 'nav-active': activeNavItem === item.name }"
        >
          <a @click="setActiveNavItem(item.name)">{{ item.label }}</a>
        </li>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeNavItem: "about",
      isMenuOpen: false,
      navItems: [
        { name: "users", label: "Usuarios" },
        { name: "blog", label: "Anuncios" },
        { name: "payments", label: "Pagos" },
        { name: "houses", label: "Propiedades" },
        { name: "contracts", label: "Contratos" },
        { name: "logOut", label: "Cerrar Sesión" },
      ],
    };
  },
  created() {
        this.typeUser = localStorage.getItem("typeUser");
        const storedData = localStorage.getItem("userID");
        // Parsear el JSON almacenado
        const parsedData = JSON.parse(storedData);
        console.log("parsedData", parsedData);
        // Acceder al campo "name" dentro del objeto parsedData
        this.userName = parsedData.usename;
        console.log("typeUser", this.typeUser);
        console.log("userName", this.userName);
        // if (this.typeUser == null) {
        //     this.$router.push('/');
        // }
    },
  methods: {
    setActiveNavItem(item) {
      this.activeNavItem = item;
      if (item === "users") {
        this.$router.push("/userView");
      } else if (item === "blog") {
        this.$router.push("/blogView");
      } else if (item === "payments") {
        this.$router.push("/paymentsView");
      } else if (item === "houses") {
        this.$router.push("/propertyView");
      } else if (item === "logOut") {
        localStorage.clear();
        this.$router.push("/login");
      } else if (item === "contracts") {
        this.$router.push("/contractsView");
      }
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
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

.logo {
  position: relative;

  img {
    width: auto;
    height: auto;
    max-width: 200px;
    transition: all 0.5s ease-in-out;
  }

  &:hover img {
    opacity: 0; // O cualquier otra propiedad que haga que la imagen desaparezca
    transition: all 0.5s ease-in-out;
  }

  &:hover {
    cursor: pointer;
    background-image: url("../assets/logos/bcareHorizontalSand.png");
    background-size: contain;
    background-repeat: no-repeat;
  }
}

nav {
  background: #498c79;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #101e26;
  padding: 1vh;
  top: 0px;
}

.nav-links {
  display: flex;
  justify-content: space-around;
  width: 100%;
}
.nav-links li {
  width: 100%;
  text-align: center;
  list-style: none;
}

.nav-links a {
  display: block;
  text-transform: uppercase;
  text-decoration: none;
  color: #101e26;
  transition: 0.5s ease;
  transform: translateX(0%);
}

.nav-links .nav-active a {
  color: #101e26;
  letter-spacing: 5px;
}

.nav-links a:hover {
  color: #f2d1b3;
  letter-spacing: 5px;
}
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.5s ease-in-out;

  .bar {
    height: 2px;
    width: 25px;
    background: #101e26;
    margin: 5px 0;
    transition: 0.4s;
  }

  .bar-top-open {
    transform: translateY(12px) rotate(-50deg);
  }

  .bar-mid-open {
    opacity: 0;
  }

  .bar-bottom-open {
    transform: translateY(-12px) rotate(50deg);
  }

}

@media screen and (max-width: 768px) {
  .nav-links {
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    background: #498c79;
    display: none;
    z-index: 1;
  }

  .nav-links .nav-open {
    display: flex;
    transition: all 0.5s ease-in-out;
  }

  .nav-links li {
    width: 100%;
    text-align: left;
  }

  .menu-toggle {
    display: flex;
    padding: 20px;
    width: 100%;
    background-color: #498c79;
    align-items: center;
    border-bottom-left-radius: 10%;
    border-bottom-right-radius: 10%;
  }

  .menu-toggle:hover {
    scale: 1.1;
    .bar {
      background: #f2d1b3;
    }
  }

  .nav-open {
    display: flex;
    padding: 20px;
    align-items: center;
    transition: all 0.5s;
  }

  .nav-open li {
    margin: 10px 0;

    a {
      font-size: 20px;
    }

    a:hover {
      color: #f2d1b3;
      letter-spacing: 5px;
    }
  }
}
</style>

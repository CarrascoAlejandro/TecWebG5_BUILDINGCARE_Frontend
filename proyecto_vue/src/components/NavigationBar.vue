<template>
    <div class="nav-bar">
        <nav>
            <div class="logo">
                <img src="@/assets/logos/bcareHorizontalBlanco.png" alt="logo" />
            </div>
            <div class="menu-toggle" @click="toggleMenu">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
            </div>
            <ul class="nav-links" :class="{ 'nav-active': isMenuOpen }">
                <li v-for="item in navItems" :key="item.name" :class="{ 'nav-active': activeNavItem === item.name }">
                    <a @click="setActiveNavItem(item.name)">{{ item.label }}</a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeNavItem: "about",
            isMenuOpen: false,
            navItems: [
                { name: "about", label: "Sobre Nosotros" },
                { name: "blog", label: "Anuncios" },
                { name: "requests", label: "Solicitudes" },
                { name: "houses", label: "Propiedades" },
                { name: "logOut", label: "Cerrar Sesión" },
            ],
        };
    },
    methods: {
        setActiveNavItem(item) {
            this.activeNavItem = item;
            if (item === 'blog'){
                this.$router.push("/blogView");
            } else if (item === 'requests'){
                this.$router.push("/paymentsView");
            } else if (item === 'houses'){
                this.$router.push("/propertyView");
            } else if (item === 'logOut'){
                this.$router.push("/login");
            }
        },
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
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

.logo img {
    width: 100%;
    height: auto;
    max-width: 200px;
}

nav {
    background: #22abb3;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: #ffff;
    padding: 1vh;
}

.nav-links {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    text-transform: uppercase;
    list-style: none;
    background-color: #22abb3;
    position: absolute;
    top: 100%;
    left: 0;
    transition: all 0.5s ease-in-out;
    transform: translateY(-100%);
    opacity: 0;
    z-index: -1;
}

.nav-links li {
    width: 100%;
    text-align: center;
    margin-bottom: 1rem;
}

.nav-links a {
    display: block;
    text-transform: uppercase;
    text-decoration: none;
    color: #ffff;
    border-bottom: 2px solid transparent;
    transition: 0.5s ease;
    transform: translateX(0%);
}

.nav-links .nav-active a {
    border-bottom: 2px solid #ffff;
    color: #ffff;
    letter-spacing: 5px;
}

.nav-links a:hover {
    box-shadow: inset 0 -2px 0 #ffff;
    color: #ffff;
    letter-spacing: 5px;
}

@media only screen and (min-width: 760px) {
    .nav-links {
        position: relative;
        opacity: 1;
        z-index: 1;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width: auto;
        background-color: transparent;
        transform: translateY(0%);
    }

    .nav-links li {
        margin-bottom: 0;
    }

    .nav-links a {
        border-bottom: none;
        margin: 0 1rem;
    }

    .nav-links .nav-active a {
        border-bottom: none;
        color: #ffff;
        letter-spacing: 5px;
    }

    .nav-links a:hover {
        box-shadow: none;
        color: #ffff;
        letter-spacing: 5px;
    }

    .menu-toggle {
        display: none;
    }
}

@media only screen and (max-width: 760px) {
    nav {
        justify-content: space-between;
        padding: 0 5vw;
    }

    .menu-toggle {
        display: block;
    }

    .nav-links {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        opacity: 1;
        z-index: 1;
        background-color: #22abb3;
        transform: translateY(-100%);
        transition: all 0.5s ease-in-out;
    }

    .nav-links li {
        width: 100%;
        text-align: center;
        margin-bottom: 1rem;
    }

    .nav-links a {
        display: block;
        text-transform: uppercase;
        text-decoration: none;
        color: #ffff;
        border-bottom: 2px solid transparent;
        transition: 0.5s ease;
        transform: translateX(0%);
    }

    .nav-links .nav-active a {
        border-bottom: 2px solid #ffff;
        color: #ffff;
        letter-spacing: 5px;
    }

    .nav-links a:hover {
        box-shadow: inset 0 -2px 0 #ffff;
        color: #ffff;
        letter-spacing: 5px;
    }

    .nav-active {
        transform: translateY(0%);
    }

    .bar {
        width: 25px;
        height: 3px;
        background-color: #ffff;
        margin: 4px 0;
        transition: 0.4s;
    }

    .nav-active .bar:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }

    .nav-active .bar:nth-child(2) {
        opacity: 0;
    }

    .nav-active .bar:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
}
</style>

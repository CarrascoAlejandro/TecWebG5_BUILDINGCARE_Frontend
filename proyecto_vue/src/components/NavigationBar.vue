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
            <li :class="{ 'nav-active': activeNavItem === 'About' }">
                <a @click="setActiveNavItem('about')">Sobre Nosotros</a>
            </li>
            <li :class="{ 'nav-active': activeNavItem === 'Blog' }">
                <a @click="setActiveNavItem('blog')">Anuncios</a>
            </li>
            <li :class="{ 'nav-active': activeNavItem === 'Requests' }">
                <a @click="setActiveNavItem('requests')">Pagos</a>
            </li>
            <li :class="{ 'nav-active': activeNavItem === 'Houses' }">
                <a @click="setActiveNavItem('houses')">Propiedades</a>
            </li>
            <li :class="{ 'nav-active': activeNavItem === 'logOut' }">
                <a @click="setActiveNavItem('logOut')">Cerrar Sesión</a>
            </li>
        </ul>
    </nav>
</div>
</template>

  
<script>
export default {
    data() {
        return {
            activeNavItem: 'about',
            isMenuOpen: false
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
        }
    }
};
</script>

  
<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&display=swap');

* {
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.logo img {
    width: 20%;
    height: 20%;
}

nav {
    background: #22abb3;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: #FFFF;
    padding: 1vh;
}

.nav-links {
    display: flex;
    justify-content: space-around;
    width: 50%;
    text-transform: uppercase;
}

.nav-links a {
    display: block;
    text-transform: uppercase;
    text-decoration: none;
    color: #FFFF;
    border-bottom: 2px solid transparent;
    transition: 0.5s ease;
    transform: translateX(0%);
}

.nav-links .nav-active a {
    border-bottom: 2px solid #FFFF;
    color: #FFFF;
    letter-spacing: 5px;
}

.nav-links a:hover {
    box-shadow: inset 0 -2px 0 #FFFF;
    color: #FFFF;
    letter-spacing: 5px;
}

@media only screen and (max-width: 760px) {
    nav {
        justify-content: space-between;
        padding: 0 5vw;
    }

    .nav-links {
        position: absolute;
        right: 0;
        top: 8vh;
        min-height: 92vh;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50%;
        margin: 0;
        padding: 0;
        transform: translateX(100%);
        transition: All 0.5s ease-in;
    }

    .nav-links a {
        opacity: 0;

    }

}

@media only screen and (max-width: 640px) {
    nav {
        justify-content: space-between;
        padding: 0 5vw;
    }
}

.nav-active {
    transform: translateX(0);
}

@media only screen and (max-width: 460px) {
    .nav-links {
        width: 100%;
        transition: All 0.5s ease;
    }
}

.nav-active {
    transform: translateX(0);
}

@keyframes navLinkFade {
    from {
        opacity: 0;
        transform: translateX(50px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@media only screen and (max-width: 760px) {
    .menu-toggle {
        display: block;
    }

    .nav-links {
        position: absolute;
        right: 0;
        top: 8vh;
        min-height: 92vh;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50%;
        margin: 0;
        padding: 0;
        transform: translateX(100%);
        transition: all 0.5s ease-in;
    }

    .nav-links a {
        opacity: 0;
    }

    .nav-active {
        transform: translateX(0);
    }

    .bar {
        width: 25px;
        height: 3px;
        background-color: #FFF;
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

/* Media Query para dispositivos aún más pequeños (opcional) */
@media only screen and (max-width: 460px) {
    .nav-links {
        width: 100%;
        transition: all 0.5s ease;
    }
}
</style>

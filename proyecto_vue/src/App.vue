<template>
  <div id="app">
    <!-- <LoginSignUp/> -->
    
    <!--  
    <CommonAreaView />
    
    <UserView/> -->
    <NavigationBar/>
    <PropertiesView/>

  </div>
</template>

<script>
import NavigationBar from './components/NavigationBar.vue';

//import CommonAreaView from './components/CommonAreaView.vue';
import PropertiesView from './components/PropertiesView.vue';
//import LoginSignUp from './components/LoginSignUp.vue';
//import UserView from './components/UserView.vue';
export default {
  name: "App",
  components: {
    NavigationBar,
    //CommonAreaView,
    PropertiesView,
    //LoginSignUp,
    //UserView,
}
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&display=swap");
body {
    font-family: "Poppins", sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #F2F1E4;
}
</style>

<template>
  <div id="app">
    <!-- <LoginSignUp/>
    <UserView/>
    <PropertiesView/> -->
    <CommonAreaView />
  </div>
</template>

<script>
import CommonAreaView from './components/CommonAreaView.vue';
//import PropertiesView from './components/PropertiesView.vue';
//import LoginSignUp from './components/LoginSignUp.vue';
//import UserView from './components/UserView.vue';
export default {
  name: "App",
  components: {
    CommonAreaView,
    //LoginSignUp
    //PropertiesView
}
};
</script>

<style lang="scss"></style>

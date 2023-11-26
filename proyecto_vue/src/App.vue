<template>
  <div id="app">
    <!-- <LoginSignUp/> -->
    <!-- <UserView/> -->
    <CommonAreaView />
  </div>
</template>

<script>
import CommonAreaView from './components/CommonAreaView.vue';

//import UserView from './components/UserView.vue';
export default {
  name: "App",
  components: {
    CommonAreaView
}
};
</script>

<style lang="scss"></style>

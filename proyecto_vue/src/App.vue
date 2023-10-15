<template>
  <div id="app">
    <LoginSignUp/>
    <NavigationBar/>
  </div>
</template>

<script>
import LoginSignUp from './components/LoginSignUp.vue'
import NavigationBar from './components/NavigationBar.vue'

export default {
  name: 'App',
  components: {
    LoginSignUp,
    NavigationBar
  }
}
</script>

<style lang="scss">

</style>
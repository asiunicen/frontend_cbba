<template>
  <div id="nav">
    <header-page v-if="$route.meta.requireAuth"></header-page>
    <!-- <router-link v-if="$route.meta.requireAuth" to="/">Home</router-link> | -->
    <!-- <router-link v-if="$route.meta.requireAuth" to="/admin">Admin</router-link> -->
  </div>
  <div class="container">
    <router-view />
  </div>
</template>

<script>
import HeaderPage from "@/components/HeaderPage.vue";

export default {
  name: "login",
  components: {
    HeaderPage,
  },
  data() {
    return {
      usuario: {},
    };
  },
};
</script>

<style lang="scss">
//@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@200;400;600&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;600&display=swap");



//@import url('https://fonts.googleapis.com/css?family=Montserrat|Open+Sans|Poppins|Raleway|Roboto');
*{
  font-family: 'Poppins',sans-serif, Arial, Helvetica;
  //font-family: "Roboto", Arial, Helvetica, sans-serif;
  //font-size: 12px;
  
}
#app {
  //font-family: "Roboto", sans-serif;
  font-family: "Poppins", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //text-align: center;
  color: black;
  font-size: 12px;
}

/* body{
  background-color: #f8f9fa;
} */
</style>

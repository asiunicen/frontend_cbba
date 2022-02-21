<template>
  <!-- <nav class="navbar navbar-light bg-dark mb-4">
    <span class="navbar-brand mb-0 h1">
      <router-link :to="`/admin`" class="link">UNICEN</router-link>
    </span>
  </nav> -->
  <div id="nav">
    <nav class="navbar mb-3 navbar-light bg-light"><!-- navbar-light bg-light -->
      <div class="container-fluid">
        <div class="d-flex">
          <!-- <router-link :to="`/admin`" class="link"> -->
          <button @click="inicio()" class="link">
            <img
            src="@/assets/unicenLogo.jpg"
            alt="" width="200" height="100"
            class="img-fluid"
          />
          </button>
          
          <!-- </router-link> -->
          <label class="titulo mt-2">COCHABAMBA</label>        
        </div>
        
                
        <h5 class="tuclase text-center mb-0">UNICEN - COCHABAMBA - SALUD</h5>
        <div>
            <button class="btn btn-sm" title="Volver" onclick="history.back()">
              <i class="far fa-arrow-alt-circle-left fa-lg"></i> 
            </button>

            <button class="btn btn-sm" title="Salir" @click="logout()">
                <i class="fas fa-power-off"></i>
              <!-- <img src="@/assets/cerrar_sesion.png" alt="" width="20"> -->
            </button>            
        </div>        
      </div>
      <span class="fila px-2 mt-2 pt-1" >Bienvenid@ Usuario: <strong>{{name}}  </strong></span>
    </nav>
    <div class="user"></div>

  </div>
  
</template>

<script>
export default {
    name: "header-component",
    components: { },
    data() {
        return {
          user: '',
          name: localStorage.name
        };
    },
    methods: {        
        logout() {
          localStorage.clear()
          localStorage.removeItem('token')
          this.$router.push({name: "Login"});
        },
        inicio(){
          if(localStorage.tipo === 'estudiante'){
            this.$router.push({path: `/estudiante/${localStorage.id}`});  //("/estudiante") redirige a estudiante
          }else{
            this.$router.push({name: "Admin"});  //("/admin") redirige a admin          
          }
        }
    },    
}

</script>

<style lang="scss" scoped>
#nav {  
  .navbar {
    height: 70px;
    padding-left: 20px;
    padding-right: 15px;
  }
  .link {
    text-decoration: none;
    color: rgba(255, 255, 255, 0);
    border: none;
    padding: 0;
    margin-right: 5px;
  }
  .btn:hover {
    background-color: #ff7300;
  }
  .btn {
    /* background-color: #00244e;*/
    border-radius: 20%;
    font-size: .875rem;
  }
  .far, .fas {
   color: #00244e;
  }
  .fila{
    color: #00244e;
    background-color: #ff7300;
    width: 25%;    
  }
  
}
.user{
  background-color: #ff7300;
}
.tuclase {
//font-family: Arial rgb(233, 116, 0); 
font-family: "Poppins", sans-serif; font-size: 30px; 
//font-weight: bold; font-size: 30px; 
background:rgb(0, 36, 75); 
-webkit-background-clip: text; 
-moz-background-clip: text; 
background-clip: text;
color: transparent; 
text-shadow: -1px -1px 1px #ff7300;
}
.titulo {
//font-family: Arial rgb(233, 116, 0); 
font-family: "Poppins", sans-serif; font-size: 30px; 
//font-weight: bold; font-size: 30px; 
background:rgb(0, 36, 75); 
-webkit-background-clip: text; 
-moz-background-clip: text; 
background-clip: text;
color: transparent; 
text-shadow: -1px -1px 1px rgb(0, 36, 75);;
}

</style>

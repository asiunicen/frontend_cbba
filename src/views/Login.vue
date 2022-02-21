<template>
  <div class="home">

    <div class="container">
        <div class="vh-100 row justify-content-center align-items-center text-center">
          <div class="col-auto col-xs-12 col-md-6">
            <h3 class="title mb-5"> UNICEN SALUD - COCHABAMBA</h3>
            <form @submit.prevent="login()">

              <!-- <div class="container d-flex justify-content-center my-4">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" v-model="userData.tipo" value='0' checked>
                  <label class="form-check-label" for="inlineRadio1">Personal Administrativo</label>
                </div>
                <div class="form-check form-check-inline mx-5">
                  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" v-model="userData.tipo" value='1'>
                  <label class="form-check-label" for="inlineRadio2">Estudiante</label>
                </div>
              </div>              
              {{userData.tipo}} -->
              <div class="col-auto">
                <label class="sr-only" for="inlineFormInputGroup">Usuario</label>
                <div class="input-group mb-2">
                  <div class="input-group-prepend">
                    <div class="input-group-text"><span><i class="fa fa-user" aria-hidden="true"></i></span></div>
                  </div>
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    id="login"
                    required placeholder="Usuario"
                    v-model="userData.login" 
                  />
                </div>
              </div>

              <div class="col-auto">
                <label class="sr-only" for="inlineFormInputGroup">Usuario</label>
                <div class="input-group mb-2">
                  <div class="input-group-prepend">
                    <div class="input-group-text"><span><i class="fa fa-lock" aria-hidden="true"></i></span></div>
                  </div>
                  <input
                    type="password" autocomplete="on current-password" 
                    class="form-control form-control-sm"
                    id="pass"
                    required placeholder="Contraseña"
                    v-model="userData.pass"
                  />
                </div>
              </div>             
                
              <h5 class="row justify-content-center mt-2" 
                  style="color:red;"
                  v-if="userData.errorMessage"> 
                  Usuario o contraseña no valido
              </h5>

              <button type="submit" class="btn w-100 mt-5"> 
                INGRESAR
              </button>
              
            </form>  
          </div>
          
        </div>
   
    </div>

    <!-- <div>{{ userData }}</div> -->
  </div>
</template>

<script>
// @ is an alias to /src
import { loginAccess, loginAccessEstudiante, getTipoPersonal } from "@/services/loginService.js";

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      userData: {
        login: "",
        pass: "",
        errorMessage: false
      },
    };
  },
  methods: {
    /* async access() { //ya esta en loginService.js
      try {
        const res = await axios.post(
          "http://localhost:3000/users/signin",
          this.userData
        );
        this.userData = res.data;
        console.log(res);
      } catch (error) {
        console.log("*-*-*-*-", error);
      }
    } */
    async login() {
      try {
        localStorage.clear();
        let res = await loginAccess(this.userData);
        // console.log(res.data.data.data.user);          
        localStorage.setItem("token", btoa(JSON.stringify(res.data.data.data)));
        localStorage.name = res.data.data.data.user.name; 
        localStorage.id = res.data.data.data.user.id
        
        let datos = await getTipoPersonal(res.data.data.data.user.id)
        if(datos.data.length > 0){
          localStorage.tipo = 'personal'
          this.$router.push({name: "Admin"});  //("/admin") redirige a admin          
        }          
        else{
          localStorage.tipo = 'estudiante'
          this.$router.push({path: `/estudiante/${localStorage.id}`});  //("/estudiante") redirige a estudiante
        }
          
        // console.log(this.userData)        
        // if(this.userData.errorMessage){
          
        // }else{
        //   let respuesta = await loginAccessEstudiante(this.userData);
        //   // console.log(respuesta.data.data.data.user)
        //   localStorage.setItem("token", btoa(JSON.stringify(respuesta.data.data.data)));
        //   localStorage.name = respuesta.data.data.data.user.name;
        //   this.$router.push({name: "Estudiante"});  //("/estudiante") redirige a estudiante
        // }

      } catch (error) {
        console.log(error);
        this.userData.errorMessage = true;
        localStorage.clear();
      }
    }
  }
}
</script>

<style scoped>
.btn {
    background-color: #00244e;
    border: none;
    color: white;
    }
.btn:hover {
    background-color: #ff7300;
}
.title{
  color: #ff7300;
}

</style>

<template>
  <div class="container mt-5 d-flex">
     <div class="card p-mr-3 text-center">
        <router-link to="/diat/PerfilEstudiantes" class="texto"> 
            <img src="./../../assets/perfil.png"
                 class="img-fluid" />
            <p class="txt">ADMINISTRAR PERFILES</p>
        </router-link>
    </div>
    <div class="card p-mr-3 text-center">
        <router-link to="/carreras/salud" class="texto"> 
            <img src="./../../assets/tfg.png"
                class="img-fluid" /> 
            <p class="txt">TRABAJO FINAL DE GRADO</p> 
        </router-link>
    </div>

    <div class="card p-mr-3 text-center">
        <router-link to="/diat/opciones" class="texto"> 
            <img src="./../../assets/team.png"
                class="img-fluid" /> 
            <p class="txt">MODALIDAD DE T.F.G.</p> 
        </router-link>
    </div>

    <div class="card p-mr-3 text-center">
        <router-link to="" class="texto"> 
            <img src="./../../assets/team.png"
                class="img-fluid" /> 
            <p class="txt">SEGIMIENTO DE T.F.G.</p> 
        </router-link>
    </div>

  </div> 

</template>

<style lang="scss" scoped>

.card {
  width: 100px;
  background-color: rgb(250, 250, 250);
  img { 
     width: 70px; padding: .4rem;
  }
  .texto{ text-decoration: none; color: rgb(21, 48, 199)} 
}
.card:hover{
   transform: translateY(0) scale(0.8);
}



</style>
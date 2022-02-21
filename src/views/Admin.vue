<template>  
  
  <div class="container mt-5 d-flex">    

    <div class="card p-mr-3 text-center">
        <router-link to="/administrar/aulas" class="texto"> 
            <img src="./../assets/aulas.png"
                 class="img-fluid" />
            <p class="txt">ADM AULAS</p>
        </router-link>
    </div>
    <div class="card p-mr-3 text-center">
        <router-link to="/carreras/salud" class="texto"> 
            <img src="./../assets/adm.png"
                class="img-fluid" /> 
            <p class="txt">PLANIFICACIÓN ACADÉMICA</p> 
        </router-link>
    </div>

    <div class="card p-mr-3 text-center">
        <router-link to="/diat/opciones" class="texto"> 
            <img src="./../assets/diat.png"
                class="img-fluid" /> 
            <p class="txt">DIAT</p> 
        </router-link>
    </div>

    <div class="card p-mr-3 text-center">
        <!-- <router-link to="/inscripciones" class="texto"> -->
        <router-link to="/listaEstudiantes" class="texto">
            <img src="./../assets/inscripciones.png"
                class="img-fluid" /> 
            <p class="txt">INSCRIPCIONES</p> 
        </router-link>
    </div>

    <div class="card p-mr-3 text-center">
        <router-link to="/admin" class="texto"> 
            <img src="./../assets/programa.png"
                class="img-fluid" /> 
            <p class="txt">PROGRAMA</p> 
        </router-link>
    </div>

    <div class="card p-mr-3 text-center">
        <router-link to="/tablas/tablatest" class="texto"> 
            <img src="./../assets/planificacion.png"
                class="img-fluid" /> 
            <p class="txt">CARRERAS Y RESOLUCIONES</p> 
        </router-link>
    </div>

    <div class="card p-mr-3 text-center">
        <router-link to="/reportes" class="texto"> 
            <img src="./../assets/reportes.png"
                class="img-fluid" /> 
            <p class="txt">REPORTES</p> 
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
  .texto{ text-decoration: none; color: rgb(0,36,75)} 
}
.card:hover{
   transform: translateY(0) scale(0.8);
}
</style>
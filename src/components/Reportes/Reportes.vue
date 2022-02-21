<template>
  <div class="container mt-5 d-flex">
     <div class="card p-mr-3 text-center">
        <router-link to="/reportes/reporte_carrera" class="texto"> 
            <img src="./../../assets/reporte.png"
                 class="img-fluid" />
            <p class="txt">CARRERA MATERIAS</p>
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
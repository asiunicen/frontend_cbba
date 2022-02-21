<template>  
  
  <div class="container mt-5 d-flex">    

    <div class="card p-mr-3 text-center">
        <!-- <router-link to="/inscripciones" class="texto"> -->
        <span @click="validarEstudiante()" style="cursor:pointer;">
            <img src="./../assets/inscripciones.png"
                class="img-fluid" /> 
            <p class="txt">INSCRIPCIONES</p> 
        </span>            
        
    </div>

  </div> 

</template>


<script>

import * as gestionService from '@/services/gestionService.js'
import * as estudianteService from '@/services/estudianteService.js'
import * as tomaMaterias from '@/services/tomaMaterias.js'

export default {
    name: "Estudiante",
    components: {},
    data() {
        return {
            id_datos_estudiante: this.$route.params.iddatosestudiante,
            gestion: {},
            estudiante: {},
            estudiante_plan_estudio: {},
            v_carrera: {}
        }
    },
    methods:{
        async cargarDatos(){
            try {
                // console.log(this.id_datos_estudiante)
                let res = await estudianteService.obtenerEstudiante(this.id_datos_estudiante)
                this.estudiante = res.data[0]
                // console.log(this.estudiante)
                this.obtenerEstudiantePlanEstudio(this.estudiante.id_estudiante)
                // console.log(this.estudiante)
            } catch (error) {
                console.log(error)
            }
        },
        async obtenerGestionActual() {
            try {
                let res = await gestionService.getGestionActual();
                this.gestion = res.data.data;                
                // console.log(this.gestionActual)
            } catch (error) {
                console.log(error);
            }
        },
        async obtenerEstudiantePlanEstudio(id_estudiante){
            try {
                if(this.estudiante){
                    let res = await estudianteService.getEstudiantePlanEstudio(id_estudiante)
                    this.estudiante_plan_estudio = res.data.data[0] 
                    let datos = await estudianteService.getV_Carrera(this.estudiante_plan_estudio.id_plan_estudio)
                    this.v_carrera = datos.data[0]
                    // console.log(this.v_carrera)
                }                
            } catch (error) {
                console.log(error)
            }
        },
        async validarEstudiante(){
            try {
                let res3 = await estudianteService.getEstudianteInscrito(this.estudiante.id_estudiante, this.gestion.id_gestion)
                let datos3 = res3.data[0]
                // console.log(datos3)
                if(datos3 && datos3.estado == 0){
                    this.deudas = []
                    let res = await tomaMaterias.getDeudaEstudiante(this.estudiante.id_estudiante, this.gestion.id_gestion)
                    let datos = res.data.data
                    this.deudas = datos

                    let res1 = await tomaMaterias.getDocumentosPendientes(this.estudiante.id_estudiante)
                    let datos1 = res1.data.data
                    this.documentos = datos1
                    // console.log(this.documentos)

                    let res2 = await tomaMaterias.getPlanVencido(this.estudiante.id_estudiante)
                    let datos2 = res2.data.data
                    let plan_vencido = -1
                    if(datos2 && datos2[0].detalle.search("CONTADO") >= 0){
                        plan_vencido = datos2[0].detalle.search("CONTADO")
                    }
                    // console.log(this.v_carrera)

                    if(datos.length > 0 || datos1.length > 0){
                        this.$router.push({ path: `/retenerEstudiantes/${this.estudiante.id_datos_estudiante}/${this.gestion.id_gestion}/${this.estudiante.id_estudiante}/${this.gestion.descripcion.replace('/','-')}/${this.estudiante.paterno} ${this.estudiante.materno} ${this.estudiante.nombres}/${plan_vencido}`})
                    }else{
                        this.$router.push({ path: `/inscripcionesEstudiante/${this.estudiante.id_datos_estudiante}/${this.gestion.id_gestion}/${this.gestion.descripcion.replace('/','-')}/${this.estudiante.id_estudiante}/${this.v_carrera.id_plan_estudio}/${this.estudiante.paterno} ${this.estudiante.materno} ${this.estudiante.nombres}/${this.v_carrera.cod_carrera}/${this.v_carrera.nombre} (${this.v_carrera.plan_estudio})/${plan_vencido}`})
                    }
                }else{
                    let nombre_completo = this.estudiante.paterno + ' ' + this.estudiante.materno + ' ' + this.estudiante.nombres
                    this.$swal({
                        position: 'center',
                        icon: 'success',
                        title: `Estimad@ Estudiante: ${this.estudiante.paterno} ${this.estudiante.materno} ${this.estudiante.nombres}  usted ya esta inscrito en la gestion actual.`,
                        text: `inscrito correctamente en la gestion: ${this.gestion.descripcion}`,
                        showConfirmButton: true,
                        // timer: 1500
                    })
                    this.$router.push({ path: `/imprimirInscripcion/${this.gestion.id_gestion}/${this.gestion.descripcion.replace('/', '-')}/${this.estudiante.id_estudiante}/${this.estudiante_plan_estudio.id_plan_estudio}/${nombre_completo}/${this.v_carrera.nombre}`})
                    
                }
                
            } catch (error) {
                console.log(error)
            }
        }
    },
    
    mounted(){
        this.cargarDatos()
        this.obtenerGestionActual()        
    },  
}
</script>

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

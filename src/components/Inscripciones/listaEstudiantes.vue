<template>
  <div class="container text-center">
      <h4>LISTA DE ESTUDIANTES</h4>
  </div>

  <div>
    <nav class="navbar navbar-light bg-light">
      <div class="container-fluid justify-content-start">
        <div class="form-group">
            <label for="campo_busqueda"><span class="navbar-text">filtrar por gestion al estudiante</span></label>
            <select class="form-select" style="width: 200px" aria-label="seleccion_grupos" v-model="gestion" @click="listarEstudiante()">
                <option selected :value="gestion === {}  || null">Eliga una Gestión</option>                
                <option v-for="(gestion, index) in gestiones" :key="index" :value="gestion">{{gestion.descripcion}}</option>
            </select>
        </div>
          <!-- {{gestion}} -->
        <div class="d-flex mx-4">
            <div class="form-group">
                <label for="campo_busqueda"><span class="navbar-text">buscar por: (Nombres - Apellido Paterno - Apellido Materno - Codigo - Carrera)</span></label>
                <input id="campo_busqueda"
                v-model="filtro"             
                class="form-control me-2"
                type="search"            
                placeholder="busqueda del estudiante..."
                aria-label="buscar"
                @keyup.enter="buscarEstudiante()"
                autofocus/>                                
            </div>            
            <button class="btn btn-warning mx-2 mt-3" @click="buscarEstudiante()"><i class="fa fa-search"><span class="mx-3">Buscar</span></i></button> 
        </div>
        
      </div>
    </nav>
  </div>
  <div class="container">
    <table class="table table-sm table-bordered table-hover">
        <thead class="table-dark">
        <tr>
            <th class="text-center">Nº</th>
            <th class="text-center">Nombre del Estudiante</th>
            <th class="text-center">Codigo</th>
            <th class="text-center">Carrera</th>
            <th class="text-center">Estado</th>
            <th class="text-center">Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(estudiante, index) in datosPaginados" :key="index">
            <td class="text-center">{{getIndicePagina() + index + 1}}</td>
            <td>{{estudiante.paterno}} {{estudiante.materno}} {{estudiante.nombres}}</td>
            <td class="text-center">{{estudiante.cod_carrera}}</td>
            <td>{{estudiante.carrera}} ({{estudiante.descripcion}})</td>
            <td v-if="estudiante.estado === 0" class="text-center">NO INSCRITO</td>
            <td v-else-if="estudiante.estado === 1" class="text-center">PRE INSCRITO</td>
            <td v-else class="text-center">INSCRITO</td>
            <td v-if="estudiante.estado === 0" class="text-center">
                <!-- <router-link :to="`/inscripciones/${gestion.id_gestion}/${gestion.descripcion}/${estudiante.id_estudiante}/${estudiante.id_plan_estudio}/${estudiante.paterno} ${estudiante.materno} ${estudiante.nombres}/${estudiante.cod_carrera}/${estudiante.carrera} (${estudiante.descripcion})`" class="link"> -->
                    <button type="button" class="btn btn-success btn-sm" @click="validarEstudiante(estudiante, gestion)"><i class="fa fa-plus"></i></button>
                <!-- </router-link> -->
            </td>
            <td v-else class="text-center">
                <router-link :to="`/modificarInscripcion/${gestion.id_gestion}/${gestion.descripcion}/${estudiante.id_estudiante}/${estudiante.id_plan_estudio}/${estudiante.paterno} ${estudiante.materno} ${estudiante.nombres}/${estudiante.cod_carrera}/${estudiante.carrera} (${estudiante.descripcion})`" class="link">
                    <button type="button" class="btn btn-warning btn-sm"><i class="fa fa-pencil" ></i></button>
                </router-link>
            </td>
        </tr>
        </tbody>
    </table>
    <nav class="paginacion" aria-label="Page navigation example">
      <ul class="pagination justify-content-start">
        <li v-if="paginaActual != 1" class="page-item" @click="getPreviousPage()"><a class="page-link" href="#/listaEstudiantes">Previous</a></li>
        <li v-if="paginaActual != 1" class="page-item" ><a class="page-link" href="#/listaEstudiantes">...</a></li>

        <li v-for="pagina in pages.slice(paginaActual - 1, paginaActual + limite_paginados)" :key="pagina" @click="getDataPagina(pagina)" class="page-item" v-bind:class="isActive(pagina)">
            <a class="page-link" href="#/listaEstudiantes">{{pagina}}</a>
        </li>
        
        <li v-if="mostrar_boton" class="page-item"><a class="page-link" href="#/listaEstudiantes">...</a></li>
        <li v-if="mostrar_boton" class="page-item" @click="getNextPage()"><a class="page-link" href="#/listaEstudiantes">Next</a></li>        
      </ul>
    </nav>
  </div>
  
</template>

<script>

import * as inscripcionService from '@/services/estudiantes.js'
import * as tomaMaterias from '@/services/tomaMaterias.js'

export default {
    data() {
        return {            
            filtro: '',            
            mostrar_boton: false,
            limite_paginados: 6,            
            elementosPorPagina: 14,
            datosPaginados: [],
            pages: [],      
            paginaActual: 1, 

            gestion: {},
            gestiones: [],
            estudiantes: [],
            estudiante: {
                id_estudiante: 0,
                matricula: '',
                paterno: '',
                materno: '',
                nombres: '',
                cod_carrera: '',
                carrera: '',
                descripcion: '',
                id_plan_estudio: 0,
                estado: ''
            },
            deudas: [],
        }
    },
    methods:{
        async obtenerGestiones(){
            try {
                //obtiene las gestion con un limit 6
                let res = await inscripcionService.getGestiones(6)
                this.gestiones = res.data.data
                this.gestion = null                
            } catch (error) {
                console.log(error)
            }
        },        
        async listarEstudiante(){
            try {
                if(this.gestion){
                    if(this.gestion.id_gestion > 0){                    
                        this.estudiantes = []
                        let res = await inscripcionService.getEstudiantes(this.gestion.id_gestion)
                        this.estudiantes = res.data                                    
                        this.getDataPagina(1)             
                    }                    
                }                                
            } catch (error) {
                console.log(error)
            }
        },
        async buscarEstudiante(){
            try {
                if(this.gestion){
                    if(this.gestion.id_gestion > 0){
                        this.estudiantes = []
                        let res = await inscripcionService.getEstudiantesEncontrados(this.filtro, this.gestion.id_gestion)
                        this.estudiantes = res.data                
                        this.getDataPagina(1)             
                    }
                }else{
                    this.$swal({
                        position: 'center',
                        icon: 'warning',                        
                        title: 'Elija una GESTION...!',
                        text: 'seleccione la gestion correspondiente.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }                                
            } catch (error) {
                console.log(error)
            }
        },        
        getIndicePagina(){
            let indicePagina = 0
            if(this.paginaActual > 1){
                indicePagina = (this.paginaActual * this.elementosPorPagina) - this.elementosPorPagina
            }
            return indicePagina
        },
        totalPaginas() {
            this.pages = []
            let cant_paginas = Math.ceil(this.estudiantes.length / this.elementosPorPagina)
            
            if(this.limite_paginados < cant_paginas)
                this.mostrar_boton = true
            else
                if(this.paginaActual < this.limite_paginados)
                    this.mostrar_boton = false
                else
                    this.mostrar_boton = false
            
            
            for (let index = 1; index <= cant_paginas; index++) {
                this.pages.push(index)                
            }
        },
        getDataPagina(nroPagina){
            this.paginaActual = nroPagina;
            this.datosPaginados = [];
            let ini = (nroPagina * this.elementosPorPagina) - this.elementosPorPagina;
            let fin = (nroPagina * this.elementosPorPagina);
            this.datosPaginados = this.estudiantes.slice(ini, fin)
        },
        getPreviousPage(){
            if(this.paginaActual > 1){
                this.paginaActual--;
            }
            this.getDataPagina(this.paginaActual);
        },
        getNextPage(){
            if(this.paginaActual < this.pages.length){
                this.paginaActual++;
            }
            this.getDataPagina(this.paginaActual);
        },
        isActive(nroPagina){
            return nroPagina == this.paginaActual ? 'active': '';
        },
        async validarEstudiante(estudiante, gestion){            
            try {
                this.deudas = []
                let res = await tomaMaterias.getDeudaEstudiante(estudiante.id_estudiante, gestion.id_gestion)
                let datos = res.data.data
                this.deudas = datos

                let res1 = await tomaMaterias.getDocumentosPendientes(estudiante.id_estudiante)
                let datos1 = res1.data.data
                this.documentos = datos1
                // console.log(this.documentos)

                let res2 = await tomaMaterias.getPlanVencido(estudiante.id_estudiante)
                let datos2 = res2.data.data
                let plan_vencido = -1
                if(datos2 && datos2[0].detalle.search("CONTADO") >= 0){
                    plan_vencido = datos2[0].detalle.search("CONTADO")
                }                
                // console.log(plan_vencido)

                if(datos.length > 0 || datos1.length > 0){
                    this.$router.push({ path: `/restricciones/${gestion.id_gestion}/${estudiante.id_estudiante}/${gestion.descripcion}/${estudiante.paterno} ${estudiante.materno} ${estudiante.nombres}/${plan_vencido}`})
                }else{
                    this.$router.push({ path: `/inscripciones/${gestion.id_gestion}/${gestion.descripcion}/${estudiante.id_estudiante}/${estudiante.id_plan_estudio}/${estudiante.paterno} ${estudiante.materno} ${estudiante.nombres}/${estudiante.cod_carrera}/${estudiante.carrera} (${estudiante.descripcion})/${plan_vencido}`})
                }
            } catch (error) {
                console.log(error)
            }
        },        
    },
    
    watch:{
        datosPaginados(){
            this.totalPaginas()
        }
    },
    mounted(){
        this.obtenerGestiones()
    },  
}
</script>

<style lang="scss">    
</style>

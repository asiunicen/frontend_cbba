<template>  
<div class="pt-3 d-flex justify-content-end"><button type="button" class="btn btn-info mb-2" @click="exportToPDF()">DESCARGAR HORARIO E INSCRIPCIÓN</button></div>
  <div class="bg-body rounded" ref="document">
    <div class="card bg-light mb-3" >
    <div class="card-header bg-w text-center d-flex">
        <img
            src="@/assets/unicenLogo.jpg"
            alt="" width="200" height="100"
            class="img-fluid"
          /><h3 class="mx-2 text-center mt-3">UNICEN - COCHABAMBA - SALUD</h3>
    </div>
      <div class="card-body p-0">
        <div class="container d-flex justify-content-around py-2">
          <div>
            <h6 class="card-title">Estudiante: <strong>{{nombre_completo}}</strong></h6>
            <h6 class="card-text">Carrera: <strong>{{carrera}}</strong></h6>
            <h6 class="card-text">Gestión: <strong>{{descripcion}}</strong></h6>
          </div>
          <div>
            <h6 class="card-text">Materias Ofertadas: <strong>{{materias.length}}</strong></h6>
            <h6 class="card-text">Nivel: <strong>{{semestre}}</strong></h6>
            <h6 class="card-text">Materias Mínimas a Tomar: <strong>{{cant_minima_inscritos}}</strong></h6>
          </div>          
        </div>
        <div class="mt-2">
              <table class="fuente table table-sm table-bordered text-left">
              <thead class="table-dark">
                <tr>
                <th scope="col" style="width: 90px">INICIO - FIN</th>
                <th scope="col"
                    v-for="(dia, id_dia) in dias" :key="id_dia">
                    {{dia.descripcion}}
                </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(horario, index) in horarios_pre_inscritos" :key="index">
                <th scope="col">{{horario.hora_inicio}} - {{horario.hora_fin}}</th>                    
                <!-- <th v-for="( ida, id_dia) in dias" :key="id_dia">{{mostrarTeoricos(horario.id_franja_horaria, ida.id_dia)}} {{mostrarPracticos(horario.id_franja_horaria, ida.id_dia)}}</th> -->
                <!-- {{horario.miercoles ? mostrarHorarioMiercoles(horario.miercoles) : ''}} -->
                <th v-html="mostrarHoraClases(horario.lunes)"></th>
                <th v-html="mostrarHoraClases(horario.martes)"></th>
                <th v-html="mostrarHoraClases(horario.miercoles)"></th>
                <th v-html="mostrarHoraClases(horario.jueves)"></th>
                <th v-html="mostrarHoraClases(horario.viernes)"></th>
                <th v-html="mostrarHoraClases(horario.sabado)"></th>
                <th v-html="mostrarHoraClases(horario.domingo)"></th>
                </tr>
              </tbody>
              </table>
          </div>
            <div id="inscrito">
              <div class="py-2">
                <h5 class="text-center">MATERIAS Y GRUPOS PARA LA  PRE-INSCRIPCIÓN</h5>
                <table class="table table-hover table-sm table-bordered">
                    <thead class="table-dark text-center">
                    <tr>
                        <th scope="col">Nro</th>
                        <th scope="col">COD MATERIA</th>                
                        <th scope="col">NOMBRE MATERIA</th>
                        <th scope="col">RECURSADA</th>
                        <th scope="col">GRUPO TEÓRICO</th>
                        <th scope="col">PRÁCTICA</th>
                        <th scope="col">GRUPO PRÁCTICO</th>
                        
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(materia, index) in materias" :key="index">
                        <td class="text-center">{{index + 1}}</td>
                        <td class="text-center">{{materia.cod_materia}}</td>                
                        <td class="text-left">{{materia.materia}}</td>      
                        <td v-if="materia.recursada === 0" class="text-center">NO</td>
                        <td v-else class="text-center">SI</td>          
                        <td class="text-left" v-if="materia.grupo_teorico_seleccionado">
                          gr: ({{materia.grupo_teorico_seleccionado.grupo}}) - {{materia.grupo_teorico_seleccionado.nombres}} {{materia.grupo_teorico_seleccionado.paterno}} {{materia.grupo_teorico_seleccionado.materno}} - {{materia.grupo_teorico_seleccionado.turno}}                        
                        </td>
                        <td v-else></td>
                        <td class="text-center" v-if="noEstaVacio(materia.grupos_practicos)">SI</td>
                        <td class="text-center" v-else></td>
                        <td class="text-left" v-if="materia.grupo_practico_seleccionado">
                          gr: ({{materia.grupo_practico_seleccionado.grupo_practico}}) - {{materia.grupo_practico_seleccionado.nombres}} {{materia.grupo_practico_seleccionado.paterno}} {{materia.grupo_practico_seleccionado.materno}}                        
                        </td>     
                        <td v-else></td>
                    </tr>              
                    </tbody>            
                </table>        
            </div>
          </div>
      </div>   
    </div>
  </div>   
</template>

<script>

import * as inscripcionService from '@/services/inscripcionService.js'
import * as estudiantesService from '@/services/estudiantes.js'
import * as tomaMaterias from '@/services/tomaMaterias.js'
const moment = require('moment');
import html2pdf from 'html2pdf.js'

export default {
    
    components:{

    },

    provide(){
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        id_gestion: this.$route.params.id_gestion,
        descripcion: this.$route.params.descripcion,
        nombre_completo: this.$route.params.nombre_completo,
        carrera: this.$route.params.carrera,
        id_estudiante: this.$route.params.id_estudiante,
        id_plan_estudio: this.$route.params.id_plan_estudio,
        id_datos_personal: localStorage.id,

        estado_botones: true,
        choque_horario: 'si',

        cant_minima_inscritos: 2,
        semestre: '',
        existe_choque_materias: false,
        pre_inscripcion_validada: true,
        recursadasTomadas: true,
        materia_choque: {},
        temporales: [],
        temporal: {
          id_temporal: 0,
          id_estudiante: 0, 
          id_materia: 0,
          id_plan_estudios: 0,
          id_gestion: 0,
          id_grupo: 0,
          id_grupo_practico: 0,
          id_franja_horaria: 0,
          id_dia: 0,
          id_aula: 0,
        },
        horarios_pre_inscritos: [],
        dias: [
          {"id_dia" : 1, "descripcion": "LUNES"},
          {"id_dia" : 2, "descripcion": "MARTES"},
          {"id_dia" : 3, "descripcion": "MIÉRCOLES"},
          {"id_dia" : 4, "descripcion": "JUEVES"},
          {"id_dia" : 5, "descripcion": "VIERNES"},
          {"id_dia" : 6, "descripcion": "SÁBADO"},
          {"id_dia" : 7, "descripcion": "DOMINGO"},
        ],

        colores: [
          {'color': 'rojo'},
          {'color': 'azul'},
          {'color': 'verde'},
          {'color': 'amarillo'},
          {'color': 'naranja'},
          {'color': 'morado'},
          {'color': 'negro'},
          {'color': 'cafe'},
          {'color': 'blanco'},
          {'color': 'fuxia'},
        ],

        materias_solicitadas: [],
        id_materia_solicitada: 0,
        materia_solicitada: {},

        puntero: -1,
        materias: [],
        materia: { 
          indice: 0,         
          id_materia: 0,
          cod_materia: '',
          materia: '',
          creditos: 0,
          horas_teoria: 0,
          horas_practica: 0,
          semestre: '',
          id_semestre: 0,
          recursada: 0,
          cantidad_max_materias: 0,          
          id_grupo_teorico: 0,
          id_grupo_practico: 0,
          grupos_teoricos: [],               
          grupos_practicos: [],
          existeGrupoPractico: false,
          asignacion_grupos_teoricos: [],
          asignacion_grupos_practicos: [],
          grupo_teorico_seleccionado: {},
          grupo_practico_seleccionado: {},
          pre_inscrito: 1,
          estado: 1,
          color: '',
          permitir_choque: true
        }, 
        materias_choquantes: [],    
        id_inscripcion: 0,
        inscripciones: [],   
        gruposTeoricos: [],
        gruposPracticos: [],
        practica: {}
      }
    },
    methods:{ 
      exportToPDF() {
				html2pdf(this.$refs.document, {
					margin: 0.2,
					filename: 'horario.pdf',
					image: { type: 'jpeg', quality: 0.98 },
					html2canvas: { dpi: 192, letterRendering: true, scale: 1, useCORS: true },          
					jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' },
                    //pagebreak: { before: '#inscrito', after: '#inscrito', avoid: '' } portrait
				})
                
			},
      noEstaVacio(array){        
        if(array)
          return array.length > 0
        else
          return false
      },
      async cargarGruposPracticos(item){
        try {
          let respGrupoPracticos = await inscripcionService.getAllGruposPracticos(item.id_materia, item.id_grupo_teorico, this.id_gestion)
          this.gruposPracticos = respGrupoPracticos.data.data
          this.materia = item

        } catch (error) {
          console.log(error)
        }
      },
      async cambiarGrupoPractico(){
        try {
          this.materia.grupo_practico_seleccionado = this.materia.grupos_practicos.find( grup => grup.id_g_practica === this.materia.id_grupo_practico)
          console.log(this.materia)
          console.log(this.inscripciones)

          let res2 = await estudiantesService.getIdPersonal(this.id_datos_personal)
          let idPersonal = res2.data.data[0]

          let inscripcion = this.inscripciones.find( item => item.cod_materia === this.materia.cod_materia && item.tipo_materia === 1)
          console.log('la inscripcion: ', inscripcion)

          if(inscripcion){
            console.log('aqui se modificara la inscripcion del grupo')
            let resp_modificacion = inscripcionService.modifyGrupoPractico({
              id_inscripcion: inscripcion.id_inscripcion,
              id_inscrip_pmgd: inscripcion.id_inscrip_pmgd,
              id_plan_materia_gestion_docente: this.materia.grupo_practico_seleccionado.id_plan_materia_gestion_docente,
              fecha_transaccion: moment(new Date()).local().format('YYYY-MM-DD'),
              id_personal: idPersonal.id_personal,
              estado_final: 'A',
              recursado: this.materia.recursada === 0 ? 'NO': 'SI',
              tipo_materia: inscripcion.tipo_materia
            })
            this.validarInscripcion()
            setTimeout(() => {
              this.cargarHorarioPreInscritos()
            }, 200);
            //console.log(resp_modificacion)
            this.$swal({
                position: 'center',
                icon: 'success',
                title: 'Correcto...!',
                text: 'se ha MODIFICADO LA MATERIA CORRECTAMENTE...!',
                showConfirmButton: false,
                timer: 1500
              })
          }else{
            
            if(this.materia.id_grupo_teorico > 0 ){
              this.$swal({
                position: 'center',
                icon: 'success',
                title: 'Correcto...!',
                text: 'se ha MODIFICADO LA MATERIA CORRECTAMENTE...!',
                showConfirmButton: false,
                timer: 1500
              })
              
              if(this.materia.pre_inscrito === 2){
                let res4 = await estudiantesService.getIdInscripPmgdUltimo()
                let pmgd = res4.data[0]
                let id_inscrip_pmgd = pmgd.id_inscrip
                
                let res2 = await estudiantesService.getIdPersonal(this.id_datos_personal)
                let idPersonal = res2.data.data[0]

                let inscripcion = this.inscripciones.find( item => item.cod_materia === this.materia.cod_materia && item.tipo_materia === 0)
                console.log('la inscripcion: ', inscripcion)
                                            
                if(this.materia.id_grupo_practico > 0){
                  let id_plan_materia_gestion_docente = this.findIDPMGDPractica(this.materia.id_grupo_practico, this.materia.grupos_practicos)                  
                  
                  let save_inscrip_pmgd = await estudiantesService.create_inscrip_plan_materia_gestion_docente({
                    id_inscrip_pmgd: id_inscrip_pmgd,
                    id_plan_materia_gestion_docente: id_plan_materia_gestion_docente,
                    id_inscripcion: this.id_inscripcion,
                    fecha_transaccion: moment(new Date()).local().format('YYYY-MM-DD'),
                    id_personal: idPersonal.id_personal,
                    estado_final: 'A',
                    recursado: this.materia.recursada === 0 ? 'NO': 'SI',
                    tipo_materia: 1,
                  })                  
                }
                this.getInscripcionMaterias()
                /*setTimeout(() => {
                  console.log(this.inscripciones.length)
                  let createDeuda = tomaMaterias.saveDeudaInscripcion({
                    id_estudiante: this.id_estudiante,
                    id_gestion: this.id_gestion
                  })   
                }, 200);*/
                
              }

              this.validarInscripcion()
              setTimeout(() => {
                this.cargarHorarioPreInscritos()
              }, 200);
            }else{
              this.$swal({
                position: 'center',
                icon: 'warning',
                title: 'FALLO!',
                text: 'Debe elegir un grupo de practica',
                showConfirmButton: false,
              })
              this.validarInscripcion()
              this.materia.estado = 1
              this.materia.pre_inscrito = 1
            }
          }  
        } catch (error) {
          console.log(error)
        }
        //console.log(this.materia.id_grupo_practico)
        
      },
      async eliminarHorario(){
        try {
          let res = await inscripcionService.deleteHorario(this.id_estudiante, this.id_plan_estudio, this.id_gestion)
          // console.log(res)
        } catch (error) {
          console.log(error)
        }
      },   
      async obtenerMateriasSolicitadas(){
        try {
          this.materia_solicitada = null          
          let res = await tomaMaterias.getMateriasSolicitadas(this.id_estudiante, this.id_plan_estudio, this.id_gestion)
          this.materias_solicitadas = res.data          
          if(this.materias){
            // cada vez que requiera una materia solicitada, no volvera a cargar la materia que ya selecciono antes, esto evita materias duplicadas en la seleccion y la materia establecida
            this.materias_solicitadas = this.materias_solicitadas.filter( item => {
              let contador = 0
              let encontrado = false
              while(contador < this.materias.length && !encontrado){
                let materia = this.materias[contador]
                if(materia.id_materia === item.id_materia)
                  encontrado = true
                contador++
              }
              if(!encontrado)
                return item
            })
          }       
          // console.log(this.materias_solicitadas)
        } catch (error) {
          console.log(error)
        }
      },
      async obtenerIdInscripcion(){        
        try {
            let res = await inscripcionService.getIdInscripcion(this.id_estudiante, this.id_gestion)
            let respuesta = res.data
            this.id_inscripcion = respuesta[0].id_inscripcion  
            // console.log(this.id_inscripcion)
        } catch (error) {
            console.log(error)
        }        
      },
      async getInscripcionMaterias(){
        try {
          let resp = await inscripcionService.getInscripcion(this.id_estudiante, this.id_gestion)
          this.inscripciones = resp.data.data
           //console.log('getInscripcion()', this.inscripciones)
        } catch (error) {
          console.log(error)
        }
      },  
      async getMateriasOfertadas(){
        try {
          this.materia_choque = null
          this.materias_choquantes = []
          let resp = await inscripcionService.getAllMateriasRecuperadas(this.id_estudiante, this.id_plan_estudio, this.id_gestion)
          this.materias = resp.data.data

          let materias_filtradas = []
          if(!this.inscripciones){
            //console.log(this.inscripciones)
            this.inscripciones.forEach( item => {
              let materia_buscada = this.materias.find( elemento  => {
                return elemento.cod_materia == item.cod_materia
              })
              materias_filtradas.push(materia_buscada)
            })
            this.materias = materias_filtradas
          }else{
            // if(this.inscripciones.length <= 0){
              this.materias = this.materias.filter( (item, index) => {
                return index < item.cantidad_max_materias
              })
            // }
          }
          
          //console.log(this.materias)
          this.materias.length > 0 ? this.semestre = this.materias[0].semestre : ''

          this.materias.forEach(async(item, index) => { 
            item.permitir_choque = true
           this.establacerMateria(item, index) 
          })

        } catch (error) {
          console.log(error)
        }
      },
      async establacerMateria(item, index){
        let res = await inscripcionService.getAllGruposTeoricos(item.id_materia, this.id_plan_estudio, this.id_gestion)
        let datos = res.data.data
        item.indice = index
        item.grupos_teoricos = datos
        item.asignacion_grupos_teoricos = []
        item.asignacion_grupos_practicos = []        
        item.grupo_teorico_seleccionado = null,
        item.grupo_practico_seleccionado = null,
        this.temporal = {}
        item.id_grupo_teorico = this.getIdGrupoTeorico(datos)
        this.puntero = item.indice        
        index < this.colores.length ? item.color = this.colores[index].color : item.color = 'fondo'

        if(item.id_grupo_teorico > 0){
          item.estado = 2
          item.pre_inscrito = 2

          item.grupo_teorico_seleccionado = item.grupos_teoricos.find( grup => grup.id_grupo === item.id_grupo_teorico)
          
          let respGrupoPracticos = await inscripcionService.getAllGruposPracticos(item.id_materia, item.id_grupo_teorico, this.id_gestion)
          let gruposPracticos = respGrupoPracticos.data.data
          item.grupos_practicos = gruposPracticos
          
          let respAsignacionGruposTeoricos = await inscripcionService.getAsignacionHorario(item.id_grupo_teorico, this.id_gestion)                              
          let asignacionTeoricos = respAsignacionGruposTeoricos.data.data
          
          item.id_grupo_practico = this.getIdGrupoPractico(gruposPracticos) 
          // console.log('el grupo practico es : ', item.grupos_practicos)
          item.grupo_practico_seleccionado = item.grupos_practicos.find( grup => grup.id_g_practica === item.id_grupo_practico)
          // console.log(item.id_grupo_practico)             

          item.asignacion_grupos_teoricos = asignacionTeoricos             
          
          this.gruposTeoricos = asignacionTeoricos              
          if(item.id_grupo_practico > 0)
            item.existeGrupoPractico = true
          else
            item.existeGrupoPractico = false

          // elegir grupos teoricos correspondiente a la materia
          // console.log('grupo teorico de la materia: ', item.materia, ' grupo teorico: ', item.grupo_teorico_seleccionado)
          // console.log('grupo practico de la materia: ', item.materia, ' grupo practico: ', item.grupo_practico_seleccionado)
          // console.log('**************************************')
          /************************************************ */
          let pre = []
          await this.eliminarGrupos(item.id_materia)

          if(item.asignacion_grupos_teoricos.length > 0){
            let asigGrupTeo = item.asignacion_grupos_teoricos
            asigGrupTeo.forEach(asig => {
              pre.push({
                id_temporal: 0,
                id_estudiante: this.id_estudiante,
                id_materia: item.id_materia,
                cod_materia: item.cod_materia,
                id_plan_estudio: this.id_plan_estudio,
                id_gestion: this.id_gestion,
                id_grupo: asig.id_grupo,
                id_grupo_practico: 0,
                id_franja_horaria: asig.id_franja_horaria,
                id_dia: asig.id_dia,
                id_aula: asig.id_aula,
                nombre: item.materia,
                color: item.color
              })
            })
            
            pre.forEach( async item => {
              try {
                let resp = await inscripcionService.savePreInscritos(item)
                // console.log(resp) 
              } catch (error) {
                console.log(error)
              }
            })                
          }
          /****************************************************/

          pre = []
          if(item.id_grupo_practico > 0){
            let res = await inscripcionService.getAsignacionPracticos(item.id_grupo_practico)
            let asignacionPracticos = res.data.data
            this.gruposPracticos = asignacionPracticos
            item.asignacion_grupos_practicos = asignacionPracticos
            
            // elegir grupos practicos correspondiente a la materia
            /*********************************************************/
            this.eliminarGrupoPractico(item.id_materia)
            if(item.asignacion_grupos_practicos.length > 0){
              let asigGrupPra = item.asignacion_grupos_practicos
              // console.log('*********************************************************************')
              // console.log(item.asignacion_grupos_teoricos)
              // console.log(item.asignacion_grupos_practicos)
              // console.log('*********************************************************************')
              
              asigGrupPra.forEach(async asig => {
                pre.push({
                  id_temporal: 0,
                  id_estudiante: this.id_estudiante,
                  id_materia: item.id_materia,
                  cod_materia: item.cod_materia,
                  id_plan_estudio: this.id_plan_estudio,
                  id_gestion: this.id_gestion,
                  id_grupo: 0,
                  id_grupo_practico: asig.id_g_practica,
                  id_franja_horaria: asig.id_franja_horaria,
                  id_dia: asig.id_dia,
                  id_aula: asig.id_aula,
                  nombre: item.materia,
                  color: item.color
                })
              })
              // console.log('grupos practicos', pre)
              setTimeout(() => {
                pre.forEach( async tem => {
                  try {
                    let resp = await inscripcionService.savePreInscritos(tem)  
                    // console.log(resp) 
                  } catch (error) {
                    console.log(error)
                  }
                })
              }, 300);
            }
          /***************************************************/
          }else{
            this.gruposPracticos = []
            this.eliminarGrupoPractico(item.id_materia)                
          }
          // console.log(item)
        }else{
          item.estado = 1
          item.pre_inscrito = 1            
          item.existeGrupoPractico = false
          this.eliminarGrupos(item.id_materia)              
        }            
        if(item.id_grupo_teorico > 0 || item.id_grupo_practico > 0){
          item.estado = 3
        }
      },
      getIdGrupoTeorico(gruposTeoricos){
        let contador = 0
        let encontrado = false
        let idGrupoTeorico = 0
        while(contador < gruposTeoricos.length && !encontrado){
          let grupo = gruposTeoricos[contador]
          let index = 0
          let existe = false

          while(index < this.inscripciones.length && !existe){
            let fila_inscripcion = this.inscripciones[index]
            if(grupo.id_pmgd === fila_inscripcion.id_plan_materia_gestion_docente){
              idGrupoTeorico = grupo.id_grupo
              existe = true
            }
            index++
          }
          if(existe)
            encontrado = true
          contador++
        }
        return idGrupoTeorico
      },
      getIdGrupoPractico(gruposPracticos){
        let contador = 0
        let encontrado = false
        let idGrupoPractico = 0
        while(contador < gruposPracticos.length && !encontrado){
          let grupo = gruposPracticos[contador]
          let index = 0
          let existe = false

          while(index < this.inscripciones.length && !existe){
            let fila_inscripcion = this.inscripciones[index]
            if(grupo.id_plan_materia_gestion_docente === fila_inscripcion.id_plan_materia_gestion_docente){
              idGrupoPractico = grupo.id_g_practica
              existe = true
            }
            index++
          }
          if(existe)
            encontrado = true
          contador++
        }        
        return idGrupoPractico
      },
      async elegirGrupoTeorico(materia){
        try {          
          let respGrupoPracticos = await inscripcionService.getAllGruposPracticos(materia.id_materia, materia.id_grupo_teorico, this.id_gestion)
          let gruposPracticos = respGrupoPracticos.data.data          
          
          let respAsignacionGruposTeoricos = await inscripcionService.getAsignacionHorario(materia.id_grupo_teorico, this.id_gestion)                              
          let asignacionTeoricos = respAsignacionGruposTeoricos.data.data

          materia.grupos_practicos = gruposPracticos
          materia.id_grupo_practico = 0
          materia.asignacion_grupos_teoricos = asignacionTeoricos

          this.puntero = materia.indice
          this.gruposTeoricos = asignacionTeoricos
          this.gruposPracticos = []
          
          if(materia.id_grupo_teorico > 0){
            materia.grupos_practicos.find( grup => materia.id_grupo_teorico === grup.id_grupo ? materia.existeGrupoPractico = true : materia.existeGrupoPractico = false)
            this.gruardarGruposTeorico()
          }else{
            materia.existeGrupoPractico = false
            this.eliminarGrupos(materia.id_materia)
            setTimeout(() => {              
              this.cargarHorarioPreInscritos()
            }, 100);
          }

        } catch (error) {
          console.log(error)
        }
      },
      async eliminarMateriaTomada(id_materia){

        let materia = await this.materias.find( item => item.id_materia === id_materia)
        if(materia){
          if(materia.grupo_teorico_seleccionado){
            if(materia.grupo_teorico_seleccionado.id_pmgd > 0){
              this.inscripciones = this.inscripciones.filter( inscrip => inscrip.id_plan_materia_gestion_docente != materia.grupo_teorico_seleccionado.id_pmgd)
              //console.log('eliminando la fila de INSCRIP_PMGD con el id_incrip_pmgd: ', materia.grupo_teorico_seleccionado.id_pmgd)
              let resp = await tomaMaterias.deleteMateriaTomada(materia.grupo_teorico_seleccionado.id_pmgd)
              this.actualizarDeudaEstudiante()
              //console.log(this.inscripciones.length)
            }              
          }          
          if(materia.grupo_practico_seleccionado){
            if(materia.grupo_practico_seleccionado.id_plan_materia_gestion_docente > 0){              
              this.inscripciones = this.inscripciones.filter( inscrip => inscrip.id_plan_materia_gestion_docente != materia.grupo_practico_seleccionado.id_plan_materia_gestion_docente)
              let resp = await tomaMaterias.deleteMateriaTomada(materia.grupo_practico_seleccionado.id_plan_materia_gestion_docente)
              this.actualizarDeudaEstudiante()
              //console.log(this.inscripciones.length)
            }
          }
        }
      },
      async eliminarGrupos(id_materia){        
        try {
          let res = await inscripcionService.deleteGrupos(id_materia)          
        } catch (error) {
          console.log(error)
        }
      },
      async eliminarGrupoTeorico(id_materia){
        try {
          let res = await inscripcionService.deleteGrupoTeorico(id_materia, this.id_estudiante, this.id_plan_estudio, this.id_gestion)                     
          // console.log(res)
        } catch (error) {
          console.log(error)
        }
      },
      async eliminarGrupoPractico(id_materia){
        try {
          let res = await inscripcionService.deleteGrupoPractico(id_materia, this.id_estudiante, this.id_plan_estudio, this.id_gestion)
        } catch (error) {
          console.log(error)
        }
      },
      async gruardarGruposTeorico(){
        
        let pre = []
        let materia = this.materias[this.puntero]
        // console.log(materia.id_materia, materia.id_grupo_teorico)
        await this.eliminarGrupos(materia.id_materia)

        if(materia.asignacion_grupos_teoricos.length > 0){
          let asigGrupTeo = materia.asignacion_grupos_teoricos
          asigGrupTeo.forEach(item => {
            pre.push({
              id_temporal: 0,
              id_estudiante: this.id_estudiante,
              id_materia: materia.id_materia,
              cod_materia: materia.cod_materia,
              id_plan_estudio: this.id_plan_estudio,
              id_gestion: this.id_gestion,
              id_grupo: item.id_grupo,
              id_grupo_practico: 0,
              id_franja_horaria: item.id_franja_horaria,
              id_dia: item.id_dia,
              id_aula: item.id_aula,
              nombre: materia.materia,
              color: materia.color
            })
          })          
        } 
        pre.forEach( async item => {
          try {
            let resp = await inscripcionService.savePreInscritos(item)
            // console.log(resp) 
          } catch (error) {
            console.log(error)
          }
        })        
        setTimeout(() => {
          this.cargarHorarioPreInscritos()
        }, 100);
      },
      async guardarGrupoPractico(){
        let pre = []
        let materia = this.materias[this.puntero]
        this.eliminarGrupoPractico(materia.id_materia)
        
        if(materia.asignacion_grupos_practicos.length > 0){
          let asigGrupPra = materia.asignacion_grupos_practicos
          asigGrupPra.forEach(asig => {
            pre.push({
              id_temporal: 0,
              id_estudiante: this.id_estudiante,
              id_materia: materia.id_materia,
              cod_materia: materia.cod_materia,
              id_plan_estudio: this.id_plan_estudio,
              id_gestion: this.id_gestion,
              id_grupo: 0,
              id_grupo_practico: asig.id_g_practica,
              id_franja_horaria: asig.id_franja_horaria,
              id_dia: asig.id_dia,
              id_aula: asig.id_aula,
              nombre: materia.materia,
              color: materia.color
            })
          })
        }        
        pre.forEach( async tem => {
          try {
            let resp = await inscripcionService.savePreInscritos(tem)  
            // console.log(resp) 
          } catch (error) {
            console.log(error)
          }
        })
        // console.log(pre)
        this.grupos_teoricos = []
        this.grupos_practicos = []

        setTimeout(() => {
          this.cargarHorarioPreInscritos()
        }, 100);
      },
      async elegirGrupoPractico(materia){
        this.puntero = materia.indice
        try {   
          if(materia.id_grupo_practico > 0){            
            let res = await inscripcionService.getAsignacionPracticos(materia.id_grupo_practico)
            let asignacionPracticos = res.data.data
            this.gruposPracticos = asignacionPracticos
            // this.materias[this.puntero].asignacion_grupos_practicos = asignacionPracticos
            materia.asignacion_grupos_practicos = asignacionPracticos
            this.guardarGrupoPractico()
            // console.log(asignacionPracticos)
          }else{
            this.gruposPracticos = []
            this.eliminarGrupoPractico(materia.id_materia)
            setTimeout(() => {
              this.cargarHorarioPreInscritos()
            }, 100);
          }
        } catch (error) {
          console.log(error)
        }
      },      
      async cargarHorarioPreInscritos(){
        try {

          let resp = await inscripcionService.getHorarioPreInscritos(this.id_estudiante, this.id_plan_estudio, this.id_gestion)
          let datos1 = resp.data.data
          let preinscritos = datos1

          let res = await inscripcionService.getFranjaHoraria()
          let franjaHoraria = res.data.data          

          console.log('----------------------------------------------------------------')
          console.log('horarios pre-inscritos', preinscritos)
          console.log('----------------------------------------------------------------')
          
          // console.log(this.materias_choquantes)
          let arreglo = []
          if(this.materias_choquantes.length > 0){            
            this.materias_choquantes.forEach( element =>{              
              let array = preinscritos.filter( item => item.id_materia === element.id_materia)
              if(arreglo.length > 0)
                arreglo.push(array)
              else
                arreglo = array
            })
          }
          
          //busca la materia con choque de horarios          
          let chocantes = []
          let encontro = false          
          let i = 0
          
          while(!encontro && i < preinscritos.length){
            for (let index = i; index < preinscritos.length - 1; index++) {                
              const element = preinscritos[index + 1];
              if( preinscritos[i].id_franja_horaria === element.id_franja_horaria && preinscritos[i].id_dia === element.id_dia){                
                this.materia_choque = element
                chocantes.push(element)
                encontro = true
              }
            }
            i++
          }
          if(chocantes.length > 0 && arreglo){            
            if(arreglo.find( item => {
              if(item.length > 0){
                return item.find( element => element.id_franja_horaria === this.materia_choque.id_franja_horaria && element.id_dia === this.materia_choque.id_dia)
              }else{
                return item.id_franja_horaria === this.materia_choque.id_franja_horaria && item.id_dia === this.materia_choque.id_dia
              }              
            }))
              encontro = false  
            console.log(chocantes, arreglo, this.materias_choquantes)
          }
            
          if(encontro){            
            this.cambiarEstado(this.materias[this.puntero], 'ERROR')
            this.existe_choque_materias = true
            // alert('tiene choque de horarios con el grupo que ha escogido.   id_franja_horaria = ' + this.materia_choque.id_franja_horaria + '  id_dia = '+this.materia_choque.id_dia)
            this.$swal({
              position: 'center',
              icon: 'error',
              title: 'CHOQUE DE HORARIOS!',
              text: `tiene un choque de horarios con la materia: ${this.materia_choque.cod_materia} - grupo que ha elegido.!`,
              showConfirmButton: true,
            })
          }else{
            this.existe_choque_materias = false
          }               
          
          setTimeout(() => {
            this.horarios_pre_inscritos = []
                      
            franjaHoraria.forEach( (franja) => {
              this.horarios_pre_inscritos.push({
                id_franja_horaria: franja.id_franja_horaria,
                hora_inicio: franja.hora_inicio.substring(0, 5),
                hora_fin: franja.hora_fin.substring( 0, 5),
                lunes: preinscritos.find(temporal => temporal.id_franja_horaria === franja.id_franja_horaria && temporal.id_dia === 1),
                martes: preinscritos.find(temporal => temporal.id_franja_horaria === franja.id_franja_horaria && temporal.id_dia === 2),
                miercoles: preinscritos.find(temporal => temporal.id_franja_horaria === franja.id_franja_horaria && temporal.id_dia === 3),
                jueves: preinscritos.find(temporal => temporal.id_franja_horaria === franja.id_franja_horaria && temporal.id_dia === 4),
                viernes: preinscritos.find(temporal => temporal.id_franja_horaria === franja.id_franja_horaria && temporal.id_dia === 5),
                sabado: preinscritos.find(temporal => temporal.id_franja_horaria === franja.id_franja_horaria && temporal.id_dia === 6),
                domingo: preinscritos.find(temporal => temporal.id_franja_horaria === franja.id_franja_horaria && temporal.id_dia === 7),
              })
            })
          }, 100); 
          // console.log('los horarios pre inscritos: ', this.horarios_pre_inscritos)         
        } catch (error) {
          console.log(error)
        }
      },  
      existeMateriasRecursadas(){
        let encontro = false
        let contador = 0
        while(contador < this.materias.length && !encontro){
          let materia = this.materias[contador]
          if(materia.recursada === 1 && materia.pre_inscrito !== 2){
            encontro = true
          }
          contador++
        }
        return encontro
      },  
      validarInscripcion(){
        let error = false
        let contador = 0
        while(contador < this.materias.length && !error){
          let materia = this.materias[contador]
          if(materia.pre_inscrito === 3){
            error = true
          }
          contador++
        }
        if(error){
          this.pre_inscripcion_validada = false          
        }else{          
          //verificar si se ha preinscrito la cantidad necesaria
          let cant_inscritos = 0
          for (let index = 0; index < this.materias.length; index++) {
            const materia = this.materias[index];
            if(materia.pre_inscrito === 2){
              cant_inscritos++
            }
          }

          //las materias recursadas se ha tomado todas...? verificando...!          
          let veces = 0
          while(veces < this.materias.length && this.recursadasTomadas){
            let materia = this.materias[veces]
            if(materia.recursada === 1 && materia.pre_inscrito !== 2 ){
              this.recursadasTomadas = false
            }
            veces++
          }
          if(cant_inscritos >= this.cant_minima_inscritos){            
            this.pre_inscripcion_validada = true
          }else{
            this.pre_inscripcion_validada = false
          }

          if(this.existeMateriasRecursadas()){
            this.pre_inscripcion_validada = false
          } 
        }
      },
      /*confirmarInscripcion(){
        this.eliminarHorario()
        this.$swal({
          position: 'center',
          icon: 'success',
          title: 'Adios...!',
          text: 'ha ABANDONADO la toma de materias!',
          showConfirmButton: false,
          timer: 1500
        })        
      },*/ 
      confirmarInscripcion(){
        
        const swalWithBootstrapButtons = this.$swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success mx-4',
            cancelButton: 'btn btn-danger mx-4'
          },
          buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
          title: 'Esta Seguro Confirmar la Inscripcion?',
          text: "No podra revertir la inscripcion!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si, confirmar!',
          cancelButtonText: 'No, cancelar!',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.estado_botones = false
            this.saveInscripcion()            
            swalWithBootstrapButtons.fire(
              'Correcto!',
              'Se ha guardado la Inscripcion Correctamente.',
              'success'
            )            
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === this.$swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire(
              'Cancelado',
              'Se ha cancelado la confirmacion de inscripcion :)',
              'error'
            )
          }
        })        
      },
      volverListaEstudiantes(){
        this.eliminarHorario()
        this.$swal({
          position: 'center',
          icon: 'success',
          title: 'Adios...!',
          text: 'ha ABANDONADO la toma de materias!',
          showConfirmButton: false,
          timer: 1500
        })
      },
      async saveInscripcion(){
        try {
          if(this.pre_inscripcion_validada){

            let resp = await estudiantesService.getIdInscripcionUltimo()
            let idInscripcion = resp.data.data[0]
            // console.log(idInscripcion)

            let res2 = await estudiantesService.getIdPersonal(this.id_datos_personal)
            let idPersonal = res2.data.data[0]
            // console.log(idPersonal)            
            
            /*let res3 = await estudiantesService.postInscripcion({
              id_inscripcion: idInscripcion.id_inscripcion,
              id_estudiante: parseInt(this.id_estudiante),
              fecha_transaccion: moment(new Date()).local().format('YYYY-MM-DD'),
              id_gestion: this.id_gestion,
              id_visible: '1',
              id_personal: idPersonal.id_personal,
              id_turno: 1,
              estado: 0,
              baja: null
            })*/
            // console.log(res3)
            
            let res4 = await estudiantesService.getIdInscripcion(this.id_estudiante, this.id_gestion)
            let pmgd = res4.data[0]            
            //let idPMGD = pmgd.id_inscrip
             console.log(pmgd)

            /*for (let index = 0; index < this.materias.length; index++) {
              const materia = this.materias[index];
              if(materia.pre_inscrito === 2){
                
                let id_plan_materia_gestion_docente = this.findIdPMGD(materia.id_grupo_teorico, materia.grupos_teoricos)
            
                let save_inscrip_pmgd = await estudiantesService.create_inscrip_plan_materia_gestion_docente({
                  id_inscrip_pmgd: idPMGD,
                  id_plan_materia_gestion_docente: id_plan_materia_gestion_docente,
                  id_inscripcion: idInscripcion.id_inscripcion,                  
                  fecha_transaccion: moment(new Date()).local().format('YYYY-MM-DD'),
                  id_personal: idPersonal.id_personal,
                  estado_final: 'A',
                  recursado: materia.recursada === 0 ? 'NO': 'SI',
                  tipo_materia: 0,
                })                
                idPMGD++ 
                // console.log(save_inscrip_pmgd)

                if(materia.id_grupo_practico > 0){
                  let id_plan_materia_gestion_docente = this.findIDPMGDPractica(materia.id_grupo_practico, materia.grupos_practicos)
                  let save_inscrip_pmgd = await estudiantesService.create_inscrip_plan_materia_gestion_docente({
                    id_inscrip_pmgd: idPMGD,
                    id_plan_materia_gestion_docente: id_plan_materia_gestion_docente,
                    id_inscripcion: idInscripcion.id_inscripcion,
                    fecha_transaccion: moment(new Date()).local().format('YYYY-MM-DD'),
                    id_personal: idPersonal.id_personal,
                    estado_final: 'A',
                    recursado: materia.recursada === 0 ? 'NO': 'SI',
                    tipo_materia: 1,
                  })                
                  idPMGD++ 
                  // console.log(save_inscrip_pmgd)
                }                
              }
            } 
            let createDeuda = await tomaMaterias.saveDeudaInscripcion({
              id_estudiante: this.id_estudiante,
              id_gestion: this.id_gestion
            })*/ 

          }
        } catch (error) {
          console.log(error)
        }
      },     
      findIdPMGD(id_grupo, grupos_teoricos){  
        // console.log(id_grupo, grupos_teoricos)
        let grupo = grupos_teoricos.find( item => item.id_grupo === id_grupo)
        return grupo.id_pmgd
      },
      findIDPMGDPractica(id_g_practica, grupos_practicas){
        let grupo = grupos_practicas.find( item => item.id_g_practica === id_g_practica)        
        return grupo.id_plan_materia_gestion_docente
      },

      async actualizarDeudaEstudiante(){
        try {
          let dato = await estudiantesService.updateDeudaEstudiante(this.id_estudiante, this.id_gestion, this.inscripciones.length)
          console.log(dato)
        } catch (error) {
          console.log(error)
        }
      },
      async cambiarEstado(materia, opcion){
        if(materia){
          switch (opcion) {
            case 'INSCRIBIRSE':
              //materia.estado = 2
              this.materias[materia.indice].estado = 2
            break;
            
            case 'HABILITAR':// PRESIONO BOTON ELIMINAR

              const swalWithBootstrapButtons = this.$swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success mx-2',
                  cancelButton: 'btn btn-danger mx-2'
                },
                buttonsStyling: false
              })

              swalWithBootstrapButtons.fire({
                title: 'Esta Seguro Eliminar la Inscripcion?',
                text: "No podra revertir la eliminacion!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
                reverseButtons: true
              }).then((result) => {
                if (result.isConfirmed) {                  
                  
                  materia.estado = 1
                  materia.pre_inscrito = 1
                  materia.asignacion_grupos_teoricos = []
                  materia.asignacion_grupos_practicos = []
                  materia.id_grupo_practico = 0
                  materia.id_grupo_teorico = 0
                  materia.existeGrupoPractico = false
                  materia.pre_inscrito = 1
                  this.puntero = materia.indice

                  this.eliminarGrupos(materia.id_materia)              

                  this.validarInscripcion()
                                    
                  setTimeout(()=>{
                    this.eliminarMateriaTomada(materia.id_materia)
                    this.cargarHorarioPreInscritos()                    
                  },200);                
		  			
                  swalWithBootstrapButtons.fire(
                    'Eliminado!',
                    'Se ha eliminado la Inscripcion Correctamente.',
                    'success'
                  )            
                } else if (                  
                  result.dismiss === this.$swal.DismissReason.cancel
                ) {
                  swalWithBootstrapButtons.fire(
                    'Cancelado',
                    'Se ha cancelado la confirmacion de inscripcion :)',
                    'error'
                  )
                }
              })
              
            break;

            case 'ELIMINAR': //PRESIONO BOTON INSCRIBIR MATERIA
              if(materia.id_grupo_teorico > 0 ){
                this.$swal({
                  position: 'center',
                  icon: 'success',
                  title: 'Correcto...!',
                  text: 'se ha INSCRITO correctamente...!',
                  showConfirmButton: false,
                  timer: 1500
                })
                materia.pre_inscrito = 2
                materia.estado = 3
                if(materia.id_grupo_teorico > 0){
                  if(this.gruposTeoricos){
                    materia.asignacion_grupos_teoricos = this.gruposTeoricos          
                  }
                }          
                if(materia.id_grupo_practico > 0){
                  if(this.gruposPracticos){
                    materia.asignacion_grupos_practicos = this.gruposPracticos
                  }
                }
                
                if(materia.pre_inscrito === 2){
                  let res4 = await estudiantesService.getIdInscripPmgdUltimo()
                  let pmgd = res4.data[0]
                  let idPMGD = pmgd.id_inscrip
                  
                  let res2 = await estudiantesService.getIdPersonal(this.id_datos_personal)
                  let idPersonal = res2.data.data[0]

                  let id_plan_materia_gestion_docente = this.findIdPMGD(materia.id_grupo_teorico, materia.grupos_teoricos)
                  //console.log('el id_plan_materia_gestion_docente: ', id_plan_materia_gestion_docente)
                  let save_inscrip_pmgd = await estudiantesService.create_inscrip_plan_materia_gestion_docente({
                    id_inscrip_pmgd: idPMGD,
                    id_plan_materia_gestion_docente: id_plan_materia_gestion_docente,
                    id_inscripcion: this.id_inscripcion,
                    fecha_transaccion: moment(new Date()).local().format('YYYY-MM-DD'),
                    id_personal: idPersonal.id_personal,
                    estado_final: 'A',
                    recursado: materia.recursada === 0 ? 'NO': 'SI',
                    tipo_materia: 0,
                  })                  
                  idPMGD++                   
                  
                  if(materia.id_grupo_practico > 0){
                    let id_plan_materia_gestion_docente = this.findIDPMGDPractica(materia.id_grupo_practico, materia.grupos_practicos)
                    let save_inscrip_pmgd = await estudiantesService.create_inscrip_plan_materia_gestion_docente({
                      id_inscrip_pmgd: idPMGD,
                      id_plan_materia_gestion_docente: id_plan_materia_gestion_docente,
                      id_inscripcion: this.id_inscripcion,
                      fecha_transaccion: moment(new Date()).local().format('YYYY-MM-DD'),
                      id_personal: idPersonal.id_personal,
                      estado_final: 'A',
                      recursado: materia.recursada === 0 ? 'NO': 'SI',
                      tipo_materia: 1,
                    })
                    
                  }
                  this.getInscripcionMaterias()
                  setTimeout(() => {
                    console.log(this.inscripciones.length)
                    let createDeuda = tomaMaterias.saveDeudaInscripcion({
                      id_estudiante: this.id_estudiante,
                      id_gestion: this.id_gestion
                    })   
                  }, 200);
                  
                }

                this.validarInscripcion()
                setTimeout(() => {
                  this.cargarHorarioPreInscritos()
                }, 200);
              }else{
                this.$swal({
                  position: 'center',
                  icon: 'warning',
                  title: 'FALLO!',
                  text: 'Debe elegir un GRUPO TEORICO al menos.!',
                  showConfirmButton: false,
                })
                this.validarInscripcion()
                materia.estado = 1
                materia.pre_inscrito = 1
              }              
            break;

            case 'ERROR':              
              if(materia.id_grupo_teorico > 0 ){
                materia.pre_inscrito = 3
                materia.estado = 3
                this.validarInscripcion()
              }
            break;

            default:
              break;
          }
        }        
      },
      async existeChoqueMaterias(){
        let resp = await inscripcionService.getHorarioPreInscritos(this.id_estudiante, this.id_plan_estudio, this.id_gestion)
        let datos1 = resp.data.data
        let preinscritos = datos1

        //busca la materia con choque de horarios
        let encontro = false
        let materia_choque = null
        let i = 0
        while(!encontro && i < preinscritos.length){
          for (let index = i; index < preinscritos.length - 1; index++) {
            const element = preinscritos[index + 1];
            if( preinscritos[i].id_franja_horaria === element.id_franja_horaria && preinscritos[i].id_dia === element.id_dia){
              materia_choque = element
              encontro = true              
            }
          }
          i++
        }
        return materia_choque
      },
      mostrarHoraClases(dia){
        let plantilla_horaria  = ''        
        // console.log(dia)
        if(dia){          
          switch (dia.id_dia) {
            case 1:
              dia.id_grupo === 0 ?
              plantilla_horaria = `<strong class="${dia.color}">${dia.nombre} - gr: ${dia.grupo_practico} - lugar: ${dia.bloque}</strong>`
              :
              plantilla_horaria = `<strong class="${dia.color}">${dia.nombre} - gr: ${dia.grupo} - aula: ${dia.aula}</strong>`

            break;

            case 2:
              dia.id_grupo === 0 ?
              plantilla_horaria = `<strong class="${dia.color}">${dia.nombre} - gr: ${dia.grupo_practico} - lugar: ${dia.bloque}</strong>`
              :
              plantilla_horaria = `<strong class="${dia.color}">${dia.nombre} - gr: ${dia.grupo} - aula: ${dia.aula}</strong>`
            break;

            case 3:              
              dia.id_grupo === 0 ?
              plantilla_horaria = `<strong class="${dia.color}">${dia.nombre} - gr: ${dia.grupo_practico} - lugar: ${dia.bloque}</strong>`
              :
              plantilla_horaria = `<strong class="${dia.color}">${dia.nombre} - gr: ${dia.grupo} - aula: ${dia.aula}</strong>`
            break;

            case 4:              
              dia.id_grupo === 0 ?
              plantilla_horaria = `<strong class="${dia.color}">${dia.nombre} - gr: ${dia.grupo_practico} - lugar: ${dia.bloque}</strong>`
              :
              plantilla_horaria = `<strong class="${dia.color}">${dia.nombre} - gr: ${dia.grupo} - aula: ${dia.aula}</strong>`
            break;

            case 5:              
              dia.id_grupo === 0 ?
              plantilla_horaria = `<strong class="${dia.color}">${dia.nombre} - gr: ${dia.grupo_practico} - lugar: ${dia.bloque}</strong>`
              :
              plantilla_horaria = `<strong class="${dia.color}">${dia.nombre} - gr: ${dia.grupo} - aula: ${dia.aula}</strong>`
            break;

            case 6:              
              dia.id_grupo === 0 ?
              plantilla_horaria = `<strong class="${dia.color}">${dia.nombre} - gr: ${dia.grupo_practico} - lugar: ${dia.bloque}</strong>`
              :
              plantilla_horaria = `<strong class="${dia.color}">${dia.nombre} - gr: ${dia.grupo} - aula: ${dia.aula}</strong>`

            case 7:              
              dia.id_grupo === 0 ?
              plantilla_horaria = `<strong class="${dia.color}">${dia.nombre} - gr: ${dia.grupo_practico} - lugar: ${dia.bloque}</strong>`
              :
              plantilla_horaria = `<strong class="${dia.color}">${dia.nombre} - gr: ${dia.grupo} - aula: ${dia.aula}</strong>`
            break;
          
            default:
              break;
          }
        }
        if(this.existe_choque_materias){          
          try {
            if(this.materia_choque && dia){
              if(this.materia_choque.id_franja_horaria === dia.id_franja_horaria && this.materia_choque.id_dia === dia.id_dia) {
                this.materia_choque.id_grupo === 0 ?
                plantilla_horaria = plantilla_horaria + `<br><strong class="choque">${this.materia_choque.nombre} - gr: ${this.materia_choque.id_grupo_practico} - aula: ${this.materia_choque.aula}</strong>`
                :
                plantilla_horaria = plantilla_horaria + `<br><strong class="choque">${this.materia_choque.nombre} - gr: ${this.materia_choque.id_grupo} - aula: ${this.materia_choque.aula}</strong>`                
              }              
            }
            return plantilla_horaria

          } catch (error) {
            console.log(error)
          }          
        }else{
          return plantilla_horaria
        }       
      },
      actualizarPagina(){
        this.cargarHorarioPreInscritos()
      },
      async agregarMateriaSolicitada(){
        if(this.materia_solicitada){
          try {          
            let res = await inscripcionService.getAllGruposTeoricos(this.materia_solicitada.id_materia, this.id_plan_estudio, this.id_gestion)
            let gruposTeoricosSolicitados = res.data.data
            // console.log(gruposTeoricosSolicitados)
            let materia = {
              id_materia: this.materia_solicitada.id_materia,
              cod_materia: this.materia_solicitada.cod_materia,
              materia: this.materia_solicitada.materia,
              indice : this.materias.length-1,
              grupos_teoricos : gruposTeoricosSolicitados,
              id_grupo_teorico : 0,
              asignacion_grupos_teoricos : [],
              asignacion_grupos_practicos : [],
              temporal : {},
              puntero : -1,
              estado : 1,
              recursada: 0,
              pre_inscrito : 1,              
              color: 'fondo',
              permitir_choque: this.choque_horario === 'si' ? true : false,
            }         
            
            setTimeout(() => {
              if(gruposTeoricosSolicitados && gruposTeoricosSolicitados.length > 0){
                // console.log('antes', this.materias)
                if(!materia.permitir_choque)
                  this.materias_choquantes.push(materia)
                this.materias.push(materia)
                this.establacerMateria(materia, this.materias.length-1)
                // console.log(materia)
                // console.log('despues: ',this.materias)
              }else{
                this.$swal({
                  position: 'center',
                  icon: 'warning',
                  title: 'NO TIENE GRUPOS ASIGNADOS!',
                  text: `La Materia: ${this.materia_solicitada.materia}, NO tiene ningun grupo asignado.`,
                  showConfirmButton: true,
                })
              }
            }, 200);
          } catch (error) {
            console.log(error)
          }
        }                
      }
    },  
      
    computed:{
    },
    mounted(){      
      //this.cargarHorarioPreInscritos()      
      // this.actualizarPagina()
      //this.eliminarHorario()
      //this.obtenerIdInscripcion()
      this.getInscripcionMaterias()
      this.getMateriasOfertadas()
      this.cargarHorarioPreInscritos()
    },
    created(){
      // this.eliminarHorario()
      // this.obtenerIdInscripcion()
      // this.getInscripcionMaterias()
      // this.getMateriasOfertadas()
    }
}
</script>

<style lang="scss" scope>
    .fuente{
        font-size: 10px;
        background-color: #fff;
    }
   .colorSI {
    font-size: 1.2rem; 
    font-weight: 500;
    color: #00244e;
    background-color: #ff7300;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 20px;
  }
  .fondo {
    color: #00244e;
    background-color: #ff7300;
    // padding: 3px;
    // border-radius: 60px;
    font-size: 10px;
  }
  .colorERROR{
    font-size: 1.2rem;
    font-weight: 500;
    color: #ad1010;
  }
  .choque{
    color: #ffffff;
    background-color: #000000d5;
    padding: 3px;
    border-radius: 60px;
  }
  .rojo{
    color: #b10303;
    /* background-color: #f0ff23;
    padding: 3px;
    border-radius: 60px;  */
    text-align: left;
    font-size: 10px;
  }
  .azul{
    color: #00244e;
    /* background-color: #72c740;
    padding: 3px;
    border-radius: 60px;     */
    text-align: left;
    font-size: 10px;
  }
  .verde{
    color: #d2ffb5;
    /* background-color: #4a379ec2;
    padding: 3px;
    border-radius: 60px;     */
    text-align: left;
    font-size: 10px;
  }
  .amarillo{
    color: #dbcd00;
    /* background-color: #1d4075;
    padding: 3px;
    border-radius: 60px;     */
    text-align: left;
    font-size: 10px;
  }       
  .naranja{
    color: #f57104;
    /* background-color: #f1ece0;
    padding: 3px;
    border-radius: 60px;     */
    text-align: left;
    font-size: 10px;
  }
  .morado{
    color: #3e0992;
    /* background-color: #fd4f4fb9;
    padding: 3px;
    border-radius: 60px;     */
    text-align: left;
    font-size: 10px;
  }
  .negro{
    color: #110b0b;
    /* background-color: #53ff78;
    padding: 3px;
    border-radius: 60px;     */
    text-align: left;
    font-size: 10px;
  }
  .cafe{
    color: #413a28;
    /* background-color: #caecf7;
    padding: 3px;
    border-radius: 60px;     */
    text-align: left;
    font-size: 10px;
  }
  .blanco{
    color: #f7f7f7;
    /* background-color: #1000a5;
    padding: 3px;
    border-radius: 60px;     */
    text-align: left;
    font-size: 10px;
  }
  .fuxia{
    color: #770071;
    /* background-color: #ffc38b;
    padding: 3px;
    border-radius: 60px;     */
    text-align: left;
    font-size: 10px;
  }
</style>

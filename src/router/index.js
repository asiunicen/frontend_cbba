import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue';
import Test from '../views/test.vue';
import AdministarAulas from '@/components/AdministrarAula/IndexAula.vue'
import PerfilEstudiantes from '@/components/Diat/PerfilEstudiantes'

import OpcionesDiat from '@/components/Diat/Opciones'

import Reportes from '@/components/Reportes/Reportes'
import Reporte_Carrera from '@/components/Reportes/Reporte_Carrera/Reporte_Carrera_Materia'

import datosTablas from '@/components/Tablas/TablaTest.vue'

import Inscripcion from '@/components/Inscripciones/Inscripcion.vue'
import InscripcionEstudiante from '@/components/Inscripciones/inscripcionesEstudiante.vue'
import Restriccion from '@/components/Inscripciones/restriccionEstudiantes.vue'
import RestriccionEstudiante from '@/components/Inscripciones/retenerEstudiante.vue'
import ModificarInscripcion from '@/components/Inscripciones/ModificarInscripcion.vue'
import ImprimirInscripcion from '@/components/Inscripciones/imprimirInscripcion.vue'
import ImprimirCarreraMaterias from '@/components/Reportes/Reporte_Carrera/ImprimirReporteCarreraMateria.vue'

import listaEstudiantes from '@/components/Inscripciones/listaEstudiantes.vue'

import Carreras from '@/components/Planificacion/Carreras.vue'
import Materias from '@/components/Planificacion/Materias.vue'
import Teorica from '@/components/Planificacion/Teorica.vue'
import Practica from '@/components/Planificacion/Practica.vue'
import AulasTeorica from '@/components/Planificacion/AulasTeoricas.vue'
import AulasPractica from '@/components/Planificacion/AulasPracticas.vue'
import HorarioAulaTeorico from '@/components/Planificacion/HorarioAula.vue'
import HorarioAulaPractica from '@/components/Planificacion/HorarioAulaPractica.vue'
import Estudiante from '../views/Estudiante.vue'
import DocentesAll from '../views/DocentesSalud.vue';

//GUARD 
function authGuard(to, from, next){
    try{
        const authToken = JSON.parse(atob(localStorage.getItem("token")))
        //console.log(authToken.token)
        if(authToken && authToken.token ){
            next();
        }else{
            next({name: 'Login'})
        }
    }catch(error){
        localStorage.clear();
        next({name: 'Login'});
    }
}


const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/test', name: 'test', component: Test },
  { path: '/admin', name: 'Admin',component: () => import('../views/Admin.vue'), beforeEnter: authGuard, meta: {requireAuth: true}, }, //meta: {requireAuth: true}, 
  { path: '/estudiante/:iddatosestudiante', name: 'Estudiante', component: Estudiante, beforeEnter: authGuard, meta: {requireAuth: true}, },  //Docentes All
  { path: '/docentes', name: 'DocentesSalud', component: DocentesAll, beforeEnter: authGuard, meta: {requireAuth: true}, },  //Docentes All

  { path: '/administrar/aulas', name: 'AdministrarAulas', component: AdministarAulas, beforeEnter: authGuard, meta: {requireAuth: true}, },
  { path: '/materias/:id/:nombre/:carrera/:idgestion', name: 'Materias', component: Materias, beforeEnter: authGuard, meta: {requireAuth: true},},
  { path: '/carreras/salud', name: 'Carreras', component: Carreras, beforeEnter: authGuard, meta: {requireAuth: true},},

  //Asignacion de perfiles ESTUDIANTES
  { path: '/diat/PerfilEstudiantes', name: 'PerfilEstudiantes', component: PerfilEstudiantes, beforeEnter: authGuard, meta: {requireAuth: true}, },

  //Mostrar las Opciones del Diat
  { path: '/diat/opciones', name: 'OpcionesDiat', component: OpcionesDiat, beforeEnter: authGuard, meta: {requireAuth: true}, },

  /**************************************REPORTES**********************************/
  //Reportes
  { path: '/reportes', name: 'Reportes', component: Reportes, beforeEnter: authGuard, meta: {requireAuth: true}, },
  { path: '/reportes/reporte_carrera', name: 'Reporte_Carrera', component: Reporte_Carrera, beforeEnter: authGuard, meta: {requireAuth: true}, },
  /*************************************FIN REPORTES********************************************/

  //Inscripciones para coordinadores
  { path: '/inscripciones/:id_gestion/:descripcion/:id_estudiante/:id_plan_estudio/:nombre_estudiante/:cod_carrera/:nombre_carrera/:planVencido', name: 'Inscripcion', component: Inscripcion, beforeEnter: authGuard, meta: {requireAuth: true}, },

  //Inscripciones para estudiantes
  { path: '/inscripcionesEstudiante/:id_datos_estudiante/:id_gestion/:descripcion/:id_estudiante/:id_plan_estudio/:nombre_estudiante/:cod_carrera/:nombre_carrera/:planVencido', name: 'InscripcionEstudiante', component: InscripcionEstudiante, beforeEnter: authGuard, meta: {requireAuth: true}, },

  //Restringe las deudas y documentos que debe el estudiante
  { path: '/restricciones/:id_gestion/:id_estudiante/:descripcion/:nombre/:planVencido', name: 'Restriccion', component: Restriccion, beforeEnter: authGuard, meta: {requireAuth: true}, },

  //Restringe las deudas y documentos que debe el estudiante
  { path: '/retenerEstudiantes/:id_datos_estudiante/:id_gestion/:id_estudiante/:descripcion/:nombre/:planVencido', name: 'RestriccionEstudiante', component: RestriccionEstudiante, beforeEnter: authGuard, meta: {requireAuth: true}, },

  //Inscripciones de Estudiantes Modificar
  { path: '/modificarInscripcion/:id_gestion/:descripcion/:id_estudiante/:id_plan_estudio/:nombre_estudiante/:cod_carrera/:nombre_carrera', name: 'ModificarInscripcion', component: ModificarInscripcion, beforeEnter: authGuard, meta: {requireAuth: true}, },

  //Imprimir Horario e Inscripcion del Estudiante
  { path: '/imprimirInscripcion/:id_gestion/:descripcion/:id_estudiante/:id_plan_estudio/:nombre_completo/:carrera', name: 'ImprimirInscripcion', component: ImprimirInscripcion, beforeEnter: authGuard, meta: {requireAuth: true}, },

  //Imprimir Reporte Carrera Materias
  { path: '/imprimirReporteCarreraMaterias/:idgestion/:idplanestudio/:descripcion/:carrera', name: 'ImprimirCarreraMaterias', component: ImprimirCarreraMaterias, beforeEnter: authGuard, meta: {requireAuth: true}, },

  //Lista de Estudiantes
  { path: '/listaEstudiantes', name: 'Estudiantes', component: listaEstudiantes, beforeEnter: authGuard, meta: {requireAuth: true}, },

  //test de datatables
  { path: '/tablas/tablatest', name: 'TablaTest', component: datosTablas, beforeEnter: authGuard, meta: {requireAuth: true}, },

  { path: '/adicion/grupo/teorico/:idgestionactual/:practica/:idplanmateria/:nombrecarrera/:idgestion', name: 'Teorica', component: Teorica, beforeEnter: authGuard, meta: {requireAuth: true}, },
  { path: '/adicion/grupo/practica/:idgestionactual/:idgrupo/:cant/:numgrupo/:idgestion/:idplanmateria/:idmateria/:idplanestudio/:carrera', name: 'Practica', component: Practica, beforeEnter: authGuard, meta: {requireAuth: true},},
  { path: '/ver/aulas/teoricas/:nombrecompleto/:carrera/:numgrupo/:idgestion/:idplanmateria/:codmateria/:idmateria/:idpersonal/:cant/:fechainicio/:fechafin', name: 'AulasTeoricas', component: AulasTeorica, beforeEnter: authGuard, meta: {requireAuth: true},},
  { path: '/ver/aulas/practicas/:idgpractica/:numgrupo/:nombrecompleto/:carrera/:cantidad/:fechainicio/:fechafin/:rotacion/:frotacioninicio/:frotacionfin/:idpersonal/:idgestion', name: 'AulasPracticas', component: AulasPractica, beforeEnter: authGuard, meta: {requireAuth: true},},
  { path: '/horario/aula/teorico/:idgrupo/:idgestion/:idplanestudio/:idpersonal', name: 'HorarioTeorico', component: HorarioAulaTeorico, beforeEnter: authGuard, meta: {requireAuth: true},},
  { path: '/horario/aula/practica/:idgpractica/:idgpadre/:idgestion/:idpersonal/:idplanestudio', name: 'HorarioPractica', component: HorarioAulaPractica, beforeEnter: authGuard, meta: {requireAuth: true},}
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
    //console.log(to)
    //console.log(from)
    if(to.meta.requireAuth){
      try{
            const authToken = JSON.parse(atob(localStorage.getItem("token")))
            //console.log(authToken.token)
            if(authToken && authToken.token){
                next();
            }else{
                next({name: 'Login'})  //this.$router.push({name: "Login"})
            }
        }catch(error){
            localStorage.clear();
            //next({name: 'Login'});
        }
    }
    else next()
  })  

export default router

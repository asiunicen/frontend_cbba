import { http } from "./httpService.js";

export function getIdPlan_Materia_Gestion_Docente(id_materia){
    return http().get(`/api/estudiantes/pmgd/${id_materia}`)
}

export function getIdInscripcionUltimo(){
    return http().get(`/api/estudiantes/ultimoIdInscripcion`)
}

export function getIdInscripPmgdUltimo(){
    return http().get(`/api/estudiantes/ultimoIdInscripPMGD`)
}

export function getIdInscripcion(id_estudiante, id_gestion){
    return http().get(`/api/estudiantes/idInscripcion/${id_estudiante}/${id_gestion}`)
}

export function getIdPersonal(id_datos_personal){
    return http().get(`/api/estudiantes/idPersonal/${id_datos_personal}`)
}

export function postInscripcion(data){
    return http().post(`/api/estudiantes/saveInscripcion`, data)    
}

export function create_inscrip_plan_materia_gestion_docente(data){
    return http().post(`/api/estudiantes/saveinscripPlanMateriaGestionDocente`, data)
}

export function getEstudiantes(id_gestion) {
  return http().get(`/api/estudiantes/${id_gestion}`);
}

export function getEstudiantesEncontrados(filtro, id_gestion){
    return http().get(`/api/buscarEstudiantes/${filtro}/${id_gestion}`)
}

export function getGestiones(limit){
    return http().get(`/api/gestiones/${limit}`)
}

export function updateDeudaEstudiante(id_estudiante, id_gestion, cantidad){
    return http().put(`/api/deudas/update/${id_estudiante}/${id_gestion}/${cantidad}`)
}

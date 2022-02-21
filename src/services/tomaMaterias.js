import { http } from './httpService.js'

export function deleteMateriaTomada(id_plan_materia_gestion_docente){
    return http().delete(`/api/inscripciones/deleteMateria/${id_plan_materia_gestion_docente}`)
}

export function getMateriasSolicitadas(id_estudiante, id_plan_estudio, id_gestion){
    return http().get(`/api/inscripciones/materiasSolicitadas/${id_estudiante}/${id_plan_estudio}/${id_gestion}`)
}

export function getDeudaEstudiante(id_estudiante, id_gestion){
    return http().get(`/api/deudas/${id_estudiante}/${id_gestion}`)
}

export function getDocumentosPendientes(id_estudiante){
    return http().get(`/api/documentos/${id_estudiante}`)
}

export function getPlanVencido(id_estudiante){
    return http().get(`/api/planVencido/${id_estudiante}`)
}
export function getPlanVencidoEstudiante(id_estudiante, id_gestion){
    return http().get(`/api/planVencidoEstudiante/${id_estudiante}/${id_gestion}`)
}

export function saveDeudaInscripcion(data){
    return http().post(`/api/inscripciones/saveDeuda`, data)
}

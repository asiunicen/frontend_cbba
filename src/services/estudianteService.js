import { http } from './httpService.js'

export function obtenerEstudiante(id_datos_estudiante){
    return http().get(`/api/buscarEstudiante/${id_datos_estudiante}`)
}

export function getEstudiantePlanEstudio(id_estudiante){
    return http().get(`/api/estudiantePlanEstudio/${id_estudiante}`)
}

export function getV_Carrera(id_plan_estudio){
    return http().get(`/api/v_carrera/${id_plan_estudio}`)
}

export function getEstudianteInscrito(id_estudiante, id_gestion){
    return http().get(`/api/inscripcion/estudiante/${id_estudiante}/${id_gestion}`)
}
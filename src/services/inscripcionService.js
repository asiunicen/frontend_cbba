import { http } from './httpService.js'

export function getAllMateriasOfertadas(id_estudiante, id_plan_estudio, id_gestion){
    return http().get(`/api/inscripciones/${id_estudiante}/${id_plan_estudio}/${id_gestion}`);
}

export function getAllMateriasRecuperadas(id_estudiante, id_plan_estudio, id_gestion){
    return http().get(`/api/recuperaciones/${id_estudiante}/${id_plan_estudio}/${id_gestion}`);
}

export function getAllGruposTeoricos(id_materia, id_plan_estudio, id_gestion){
    return http().get(`/api/grupos/${id_materia}/${id_plan_estudio}/${id_gestion}`)
}

export function getAllGruposPracticos(id_materia, id_grupo, id_gestion){
    return http().get(`/api/practicas/${id_materia}/${id_grupo}/${id_gestion}`)
}

export function getFranjaHoraria(){
    return http().get('/api/horario')
}

export function getAsignacionHorario(id_grupo, id_gestion){
    return http().get(`/api/inscripciones/grupos_teoricos/${id_grupo}/${id_gestion}`)
}

export function getAsignacionPracticos(id_grupo){
    return http().get(`/api/inscripciones/grupos_practicos/${id_grupo}`)
}

export function getHorarioPreInscritos(id_estudiante, id_plan_estudio, id_gestion){
    return http().get(`/api/inscripciones/temporales/${id_estudiante}/${id_plan_estudio}/${id_gestion}`)
}

export function getIdInscripcion(id_estudiante, id_gestion){
    return http().get(`/api/inscripciones/TomaMaterias/${id_estudiante}/${id_gestion}`)
}

export function getInscripcion(id_estudiante, id_gestion){
    return http().get(`/api/inscripciones/getInscripcion/${id_estudiante}/${id_gestion}`)
}

export function modifyGrupoPractico(data){
    return http().put('/api/inscripciones/modificar', data)
}

export function savePreInscritos(data){
    return http().post(`/api/inscripciones/saveTemporal`, data)
}

export function deleteHorario(id_estudiante, id_plan_estudio, id_gestion){
    return http().delete(`/api/inscripciones/deleteHorario/${id_estudiante}/${id_plan_estudio}/${id_gestion}`)
}

export function deleteGrupoTeorico(id_materia, id_estudiante, id_plan_estudio, id_gestion){
    return http().delete(`/api/inscripciones/deleteGrupoTeorico/${id_materia}/${id_estudiante}/${id_plan_estudio}/${id_gestion}`)
}

export function deleteGrupoPractico(id_materia, id_estudiante, id_plan_estudio, id_gestion){
    return http().delete(`/api/inscripciones/deleteGrupoPractico/${id_materia}/${id_estudiante}/${id_plan_estudio}/${id_gestion}`)
}

export function deleteGrupos(id_materia){
    return http().delete(`/api/inscripciones/deleteGrupos/${id_materia}`)
}
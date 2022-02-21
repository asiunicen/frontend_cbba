import { http } from "./httpService.js";

export function modifyData(id, data) { 
    return http().patch(`/cantidad/lista/${id}`, data);
}

export function getMateriasByIdPlanEstudio(id) {      //materias by id_plan_estudio
    return http().get(`/api/materias/carrera/${id}`)
}

export function getAllMaterias() {
    return http().get('/api/materias/carrera/')
}

export function updatePracticaHospitalaria(id_plan_materia, practica_hospitalaria){
    return http().put(`/api/materias/carrera/modificar/${id_plan_materia}/${practica_hospitalaria}`)
}


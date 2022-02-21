import { http } from "./httpService.js";

// PLANIFICACION TEORICA
export function getDetallesPlanificacion () {
    return http().get('/api/planificar')
}

export function getDetallesPlanificacionTeoricaById(id, id_gestion) {
    return http().get(`/api/planificar/${id}/${id_gestion}`)
}

export function savePlanificacionTeorica (data) {
    return http().post('/api/planificar', data)
}

export function updatePlanificacionTeorica(data) {
    return http().put('/api/planificar', data)
}

//PLANIFICACION PRACTICA
export function getDetallesPlanificacionPractica(id, id_gestion){
    return http().get(`/api/planificacion/practica/${id}/${id_gestion}`)
}

export function savePlanificacionPractica(data){
    return http().post(`/api/planificacion/practica`, data)
}

export function deletePlanificacionPractica(id) {
    return http().delete(`/api/planificacion/practica/${id}`)
}

export function updateDocentePractica(id, data) {
    return http().put(`/api/planificacion/practica/${id}`, data)
}

import { http } from "./httpService.js";

//programas Service
export function getProgramaCarrera() {
  return http().get(`/api/admprogramas`);
}

//obtener todas las carreras de medicina
export function getAllCarreras() {
    return http().get('/api/carreras/salud');
}

//obtiene todos los tipo de carrera
export function getAllTiposCarrera() {
    return http().get('/api/tipos');
}

//crea una nueva tabla plan_estudio
export function createPlanEstudios(data){
    return http().post('/api/programa/planEstudio', data);
}

//modifica la tabla plan_estudio
export function updatePlanEstudios(data){
    return http().put('/api/programa/modify', data);
}

//obtener ultimo id plan estudio
export function getLastIdPlanEstudio(){
    return http().get('/api/programa/ultimoId');
}

//obtener todos los planes de estudio
export function getTiposPlan(id){
    return http().get(`/api/programa/tiposPlanEstudio/${id}`);
}

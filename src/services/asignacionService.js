import { http } from "./httpService.js";

//franja horaria
export function franjaHorarioAula() {
  return http().get("/api/franja/horaria/docente");
}

//la franja horario aula determinada
export function determinadoFranjaHorarioAula(id_personal, id_gestion){
  return http().get(`/api/franja/horaria/docente/determinado/${id_personal}/${id_gestion}`)
}

//ASIGNACION TEORICA
export function createAsignacion(data) {
  return http().post(`/api/asignacion`, data)
}

export function deleteAsignacion(id, data) {
  return http().delete(`/api/asignacion/${id}`, data)
} 

//Detalles Aula-Franja-Dia  TEORICA
export function getDetallesAula(id_gestion, id_aula, id_plan_estudio) {
  return http().get('/api/asignacion/' + id_gestion + '/' + id_aula + '/' + id_plan_estudio)  //88/71
}

//Verificacion de Horario libre
export function getHorarioDisponible(id_gestion, id_personal, id_plan_estudio, id_franja, id_dia){
  return http().get(`/api/asignacion/verificacion/${id_gestion}/${id_personal}/${id_plan_estudio}/${id_franja}/${id_dia}`)
}

//Verificar horario libre en practica
export function getHorarioPracticaDisponible(id_gestion, id_personal, id_franja, id_dia){
  return http().get(`/api/asignacion/practica/verificacion/${id_gestion}/${id_personal}/${id_franja}/${id_dia}`)
}

//ASIGNACION PRACTICA
export function createAsignacionPractica(data) {
  return http().post(`/api/asignaciones/practica`, data)
}

//Delete asignacion_practica PRACTICA
export function deleteAsignacionPractica(id){
  return http().delete(`/api/asignaciones/practica/${id}`)
}

//Detalles Aula-Franja-Dia  PRACTICA
export function getDetallesAulaPractica(id, id_gestion, id_materia){
  return http().get(`/api/asignaciones/practica/${id}/${id_gestion}/${id_materia}`)
}

//Obtiene todas los horarios de los docentes que dictan clases en practica
export function getHorarioAulaDocenteGestion(id_personal, id_gestion){
  return http().get(`/api/asignaciones/practica/${id_personal}/${id_gestion}`)
}


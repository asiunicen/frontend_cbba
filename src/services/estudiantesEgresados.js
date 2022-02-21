import { http } from "./httpService.js";

//Obtiene a todos los Estudiantes Egresados
export function getAllEstudiantesEgresados() {
  return http().get('/api/estudiantesEgresados');
}

//Obtiene todas las Carreras
export function getTodasCarreras() {
  return http().get('/api/carrerasAll');
}

//crearPerfilEstudiante
export function crearPerfilEstudiante(data) {
  return http().post('/api/estudiantesEgresados', data)
}
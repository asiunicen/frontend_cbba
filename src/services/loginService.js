import { http } from "./httpService.js";

export function loginAccess(loginData) {
  return http().post("/api/users/login", loginData);
}

export function loginAccessEstudiante(loginData) {
  return http().post("/api/users/loginEstudiante", loginData);
}

export function getTipoPersonal(id_datos_personal){
  return http().get(`/api/users/datos/${id_datos_personal}`)
}

export function verificaAuthToken(){
  return http().get('/api/verificar');
}
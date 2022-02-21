import { http } from "./httpService.js";

//Obtiene a todas las Areas de Trabajo
export function getAreasTrabajo() {
  return http().get('/api/areas');
}

//Obtiene a todos los Campos de trabajo
export function getCamposTrabajo(id) {
    return http().get(`/api/campos/${id}`);
}

//Obtiene a todos los Sub Campos de trabajo
export function getSubCamposTrabajo(id, tipo) {
    return http().get(`/api/subcampos/${id}`, tipo);
}

//guarda la nueva area
export function crearNuevaAreaTrabajo(data) {
  return http().post('/api/areas/', data);
}
import { http } from "./httpService.js";

//gestiones
export function getGestiones() {
  return http().get('/api/gestiones');
}

//gestionActual
export function getGestionActual () {
  return http().get('/api/gestion/actual')  
}
  
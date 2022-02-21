import { http } from "./httpService.js";

//Aula Service
export function getAulasTorre() {
  return http().get('/api/admaulas');
}

export function createAulaTorre(data) {
  return http().post(`/api/admaulas`, data)
}

export function updateAulaTorre(id, data) {
  return http().put(`/api/admaulas/${id}`, data)
}

//Bloque Service
export function getBloquesTorre() {
  return http().get('/api/bloque')
}

//TipoAula service
export function getTipoAulasTorre() {
  return http().get('/api/tipo')
}


//Aulas Practica Hospitalaria Service
export function getAulasPractica() {
  return http().get('/api/aulas/hospitales')
}

export function getAulasTeorica(){
  return http().get('api/aula/teoricas')
}

export function getAulasTeoricas(id_gestion, cod_materia){
  return http().get(`api/aula/ver/teoricas/${id_gestion}/${cod_materia}`)
}
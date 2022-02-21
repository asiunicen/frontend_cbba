import { http } from "./httpService.js";

export function getAllMateriasCarrera(id_plan_estudio, id_gestion) {      //materias by id_plan_estudio
    return http().get(`/api/reportes/carrera_materia/${id_plan_estudio}/${id_gestion}`)
}
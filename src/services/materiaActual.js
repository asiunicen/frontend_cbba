import { http } from "./httpService.js";

export function getMateriaByIdPlanMateria(id) {      //materias by id_plan_estudio
    return http().get(`/api/materia/actual/${id}`)
}

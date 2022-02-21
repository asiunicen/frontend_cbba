import { http } from "./httpService.js";

export function getDocentesSalud(id_materia) {
  return http().get(`/api/docentes/salud/${id_materia}`);
}

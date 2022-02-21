import { http } from "./httpService.js";

export function getCarrerasSalud() {
  return http().get("/api/carreras/salud");
}

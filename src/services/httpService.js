import axios from "axios";
import { url, getHeader } from '../config.js'; 

//const url = "http://localhost:3000";

axios.defaults.headers.common["Authorization"] =
  "Bearer" + localStorage.getItem("token");

export function http() {
  return axios.create({
    baseURL: url,
    headers: getHeader()
    /* headers: {
      "Content-type": "application/json",
      'Accept': 'application/json',
    } */
  });
}

export function httpFiles() {
  return axios.create({
    baseURL: url,
    headers: {
      "content-Type": "multipart/form-data"
    }
  });
}

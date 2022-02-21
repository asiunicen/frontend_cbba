// BASE URL
export const url = "http://localhost:3001";

//Envio de token por cabecera
export const getHeader = () => {
    try{
        const auth = JSON.parse(atob(localStorage.getItem('token')));
        const headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + auth.token
        }
        return headers;
    }catch(error){
        localStorage.clear();
    }
}

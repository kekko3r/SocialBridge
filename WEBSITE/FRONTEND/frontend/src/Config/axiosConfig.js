import axios from "axios";
import { jwtDecode } from "jwt-decode";

const instance = axios.create({
    baseURL: "http://127.0.0.1:42052/", 
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Tempo attuale in secondi
        if (decoded.exp < currentTime) {
            // Token scaduto, effettua il logout
            localStorage.removeItem("jwtToken");
        } else {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        // Token non valido o scaduto, effettua il logout
        localStorage.removeItem("jwtToken");
        window.location.href = "/login";
    }
    return Promise.reject(error);
});

export default instance;

import axios from "axios";

// In production the frontend and backend share an origin behind the vercel.json
// rewrites, so a relative path is what works. Only dev needs the absolute URL --
// falling back to localhost in a production build ships a site that calls the
// visitor's own machine.
const baseURL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "http://localhost:3000/api" : "/api");

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});


// ===============================
// Request Interceptor
// ===============================

api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


// ===============================
// Response Interceptor
// ===============================

api.interceptors.response.use(

    (response) => {
        return response;
    },

    (error) => {

        if (error.response?.status === 401) {
            localStorage.removeItem("token");
        }

        return Promise.reject(error);
    }
);


export default api;
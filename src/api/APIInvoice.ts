import axiosClient  , { InternalAxiosRequestConfig } from "axios";
import type { AxiosRequestConfig } from "axios";
import useAuthStore from "../store/authStore";


const token = JSON.parse(localStorage.getItem('invoice-token') || "null")  || null;

const APIInvoice = axiosClient.create({
    baseURL:`${process.env.REACT_APP_BASE_API_URL}/invoice`,
    headers: {
        Authorization:`Bearer ${token}`
    }
});


export default APIInvoice;
import axios , { AxiosInstance } from "axios";

const APIAuth : AxiosInstance = axios.create({
    baseURL:`${process.env.REACT_APP_BASE_API_URL}/auth`
});

export default APIAuth;
import Axios from "axios";

import { API_URL } from "../../../config/frontend";

export * from "./endpoints";

const api = Axios.create({
    baseURL : API_URL,
    headers : {}
});

export default api;

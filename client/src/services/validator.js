import axios from "axios";

export const validator = () => {
    return axios.post('/api/validator')
}

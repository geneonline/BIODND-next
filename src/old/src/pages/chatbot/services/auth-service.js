import axios from "axios";
const BASIC_API = import.meta.env.VITE_Effect_API + '/api/Account';

class AuthService {
    getCurrentUser() {
        let token = localStorage.getItem("token") || "";

        return axios.get(`${BASIC_API}`, {
            headers: {Authorization: `Bearer ${token}`}
        });
    }

    // logout() {
    //     localStorage.clear();
    // }

    loginByData() {
        let data;
        if (JSON.parse(localStorage.getItem("biodnd_user"))) {
            data = JSON.parse(localStorage.getItem("biodnd_user"));
        } else {
            data = {};
        }

        return axios.post(`${BASIC_API}/MemberLoginByUserData`, {
            jobTitle: data?.job_title,
            country: data?.country,
            email: data?.email,
            bioDNDUserId: data?.user_id,
            userName: data?.email,
            company: data?.company,
            name: data?.user_name,
        });
    }
}

const NewAuthService = new AuthService();
export default NewAuthService;
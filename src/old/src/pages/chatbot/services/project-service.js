import axios from "axios";
const BASIC_API = import.meta.env.VITE_Effect_API + '/api/Project';

class ProjectService {
    create(requestBody) {
        let token = localStorage.getItem("token") || "";

        return axios.post(`${BASIC_API}`,
            requestBody, {
            headers: {Authorization: `Bearer ${token}`}
        });
    }

    getDetails(id) {
        let token = localStorage.getItem("token") || "";

        return axios.get(`${BASIC_API}/${id}`, {
            headers: {Authorization: `Bearer ${token}`}
        });
    }

    async search(search = "", isReturnAllDataAndNoPage = false, targetPage = 1, showCount = 10) {
        console.log("search method");
        let token = localStorage.getItem("token") ||"";

        try {
            const response = await axios.post(`${BASIC_API}/Search`, {
                search,
                "pageRequestParameter": {
                    isReturnAllDataAndNoPage,
                    targetPage,
                    showCount
                }
            }, {headers: {Authorization: `Bearer ${token}`}});
            
            return response;
        } catch (error) {
            console.error('Search API error:', error);
            // 返回一個符合預期格式的錯誤響應
            return { data: { data: [] } };
        }
    }

    update(id, requestBody) {
        let token = localStorage.getItem("token") || "";

        return axios.put(`${BASIC_API}/${id}`,
            requestBody, {
            headers: {Authorization: `Bearer ${token}`}
        });
    }

    delete(id) {
        let token = localStorage.getItem("token") || "";

        return axios.delete(`${BASIC_API}/${id}`, {
            headers: {Authorization: `Bearer ${token}`}
        });
    }
}

const NewProjectService = new ProjectService();
export default NewProjectService;
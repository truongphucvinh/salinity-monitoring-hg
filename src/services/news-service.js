import axios from "axios";

const BASE_URL = process.env.REACT_APP_POST_HOST_API_URL

export default {

    //POST
    getAllNews: async function() {
        try {
            const response = await axios.get(`${BASE_URL}/posts`)
            console.log("posts: ", response.data);
            return response.data;
        } catch(error) {
            throw error;
        }
    },

    getNewsById: async function(newsId) {
        try {
            const response = await axios.get(`${BASE_URL}/posts/${newsId}`)
            console.log("posts id: ", response.data);
            return response.data;
        } catch(error) {
            throw error;
        }
    }
}
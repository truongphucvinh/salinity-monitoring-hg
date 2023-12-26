import axios from "axios";

const BASE_URL = "http://103.221.220.183:8088/"

export default {
    getThingList: async function() {
        try {
            const response = await axios.get(BASE_URL+'ctu/geo/things')
            return response.data;
        } catch(error) {
            throw error;
        }
    },

    getThingById: async function(thingId) {
        try {
            const response = await axios.get(BASE_URL+`ctu/geo/things/${thingId}`)
            return response.data;
        } catch(error) {
            throw error;
        }
    },

    createThing: async function(thingInfo) {
        try {
            const response = await axios.post(BASE_URL+'ctu/geo/things', thingInfo);
            return response;
        } catch(error) {
            throw error;
        }
    },

    deleteThing: async function(thingId) {
        try {
            const response = await axios.delete(BASE_URL+`ctu/geo/things/${thingId}`);
            return response;
        } catch(error) {
            throw error;
        }
    }
}
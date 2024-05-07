import axios from "axios";
import { useState } from "react";

const BASE_URL = "http://103.221.220.183:8026/"


export default {

    getStationList: async function() {
        try {
            const response = await axios.get(BASE_URL+'things')
            return response.data;
        } catch(error) {
            throw error;
        }
    },

    createStation: async function(thingId, stationInfo) {
        try {
            const response = await axios.post(BASE_URL+`stations/thing/${thingId}`, stationInfo);
            return response;
        } catch(error) {
            throw error;
        }
    },

    deleteStation: async function(stationId) {
        try {
            const response = await axios.delete(BASE_URL+`stations/${stationId}`);
            return response;
        } catch(error) {
            throw error;
        }
    },

    //Rynan
    login: async function() {
        try {
            const response = await axios.post("https://api-mekong.rynangate.com/api/v1/auth", {
                "user_name" : "myi.partner",
                "password" : "Myi@2024"
            }, {
                headers: {
                    "x-api-key" : "Qy1z8uyQoVC603KLov9vxC5J"
                }
            });
            sessionStorage.setItem("rynanToken", response.data.token);
            console.log("login: ", response.data);
            return response.data;
        } catch(error) {
            throw error
        }
    }, 

    getStationListByRyan: async function() { // inclding stations are gotten by Ryan api
        try {
            var rynanToken = sessionStorage.getItem("rynanToken");
            console.log("abc: ", rynanToken);
            if(!rynanToken) {
                console.log("xyz");
                const responseRynanAPI = await this.login();
                sessionStorage.setItem("rynanToken", responseRynanAPI.token);
                rynanToken = responseRynanAPI.token;
            }
            const response = await axios.get("https://api-mekong.rynangate.com/api/v1/get-list-stations",
                {
                    headers: {
                        "x-access-token" : rynanToken,
                        "x-api-key" : "Qy1z8uyQoVC603KLov9vxC5J"
                    }
                }
            );
            console.log("sensor list: ", response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
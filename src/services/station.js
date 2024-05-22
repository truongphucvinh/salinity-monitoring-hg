import axios from "axios";

const BASE_URL = "http://103.221.220.183:8026/"
const RYNAN_URL = "https://api-mekong.rynangate.com/api/v1/"
const RYNAN_ACCOUNT = {
    apiKey: process.env.REACT_APP_RYNAN_X_API_KEY,
    username: process.env.REACT_APP_RYNAN_USERNAME,
    password: process.env.REACT_APP_RYNAN_PASSWORD,
}

export default {

    //Rynan
    login: async function() {
        try {
            const response = await axios.post(`${RYNAN_URL}auth`, {
                "user_name" : RYNAN_ACCOUNT.username,
                "password" : RYNAN_ACCOUNT.password
            }, {
                headers: {
                    "x-api-key" : RYNAN_ACCOUNT.apiKey
                }
            });
            sessionStorage.setItem("isRynanAuthentication", response.data.token);
            return response.data;
        } catch(error) {
            throw error
        }
    }, 

    getStationListByRyan: async function() {
        try {
            const ryaneToken = await this.returnRynanToken();
            const response = await axios.get(`${RYNAN_URL}get-list-stations`,
                {
                    headers: {
                        "x-access-token" : ryaneToken,
                        "x-api-key" : RYNAN_ACCOUNT.apiKey
                    }
                }
            );
            return response.data;
        } catch (error) {
            if(error.response.data.errorCode === "002") {
                sessionStorage.clear("isRynanAuthentication");
                const reloadCount = sessionStorage.getItem('reloadCount');
                if(reloadCount < 2) {
                sessionStorage.setItem('reloadCount', String(reloadCount + 1));
                window.location.reload();
                } else {
                    sessionStorage.removeItem('reloadCount');
                }
            }
            throw error;
        }
    },

    returnRynanToken: async function () {
        if(!sessionStorage.getItem('isRynanAuthentication')) {
            await this.login();
        }
        return sessionStorage.getItem('isRynanAuthentication');
    },



    loginNewVersion: async function() {
        const username = process.env.REACT_APP_RYNAN_USERNAME
        const password = process.env.REACT_APP_RYNAN_PASSWORD
        const xApiKey = process.env.REACT_APP_RYNAN_X_API_KEY
        try {
            const response = await axios.post("https://api-mekong.rynangate.com/api/v1/auth", {
                "user_name" : username,
                "password" : password
            }, {
                headers: {
                    "x-api-key" : xApiKey
                }
            });
            return response.data;
        } catch(error) {
            throw error
        }
    }, 

    getStationListByRynanNewVersion: async function() {
        try {
            const xApiKey = process.env.REACT_APP_RYNAN_X_API_KEY
            const responseLogin = await this.loginNewVersion();
            const response = await axios.get("https://api-mekong.rynangate.com/api/v1/get-list-stations",
                {
                    headers: {
                        "x-access-token" : responseLogin.token,
                        "x-api-key" : xApiKey
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
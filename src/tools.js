import { cilLockLocked, cilLockUnlocked } from "@coreui/icons";

export const isDecimal = (n) => {
    // This regex matches any number, including integers, decimals, floats, and doubles
    var regex = /^-?[0-9]*\.?[0-9]+$/;
    return regex.test(n);
}

export const formatDate = (response) => {
    let date = new Date(response[0],response[1] - 1 >= 0 ? response[1] - 1 : 11,response[2],response[3],response[4],response[5] ? response[5] : 0) 
    let year = date.getFullYear()
    let month = ("0" + (date.getMonth() + 1)).slice(-2)
    let day = ("0" + date.getDate()).slice(-2)
    let hours = ("0" + date.getHours()).slice(-2)
    let minutes = ("0" + date.getMinutes()).slice(-2)
    return `${year}-${month}-${day}T${hours}:${minutes}`
}

export const damStatusConverter = (dam) => {
    if (dam?.damCurrentStatus?.damStatusName === "OPEN") {
        return {
            icon: cilLockUnlocked,
            class: "primary",
            status: "Đang mở"
        }
    }
    return {
        icon: cilLockLocked,
        class: "secondary",
        status: "Đang đóng"
    }
}

export const getLoggedUserRole = () => {
    const loggedUser = JSON.parse(localStorage.getItem('_authenticatedUser'))
    return loggedUser?.permission?.role
}

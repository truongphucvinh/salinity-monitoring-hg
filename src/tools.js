import { cilLockLocked, cilLockUnlocked } from "@coreui/icons";

export const searchRelatives = (sourceValue, searchValue) => {
    const processedSearch = removeVietnameseAccents(searchValue?.trim()).toLowerCase()
    const processedSource = removeVietnameseAccents(sourceValue?.trim()).toLowerCase()
    return processedSource?.includes(processedSearch)
}

export const removeVietnameseAccents = (str) => {
    const from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ";
    const to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";

    for (let i = 0; i < from.length; i++) {
        str = str.replace(new RegExp(from[i], "gi"), to[i]);
    }

    return str;
}


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
            class: "success",
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


export const getLoggedUserInformation = () => {
    const information = JSON.parse(localStorage.getItem('_authenticatedUser'))
    return information
}



export const checkItemCode = (code, modules) => {
  let flag = false
  modules?.forEach(element => {
    if (element?.URL === code) {
      flag = true
    }
  });
  return flag
}

export const authorizationChecker = (code, modules) => {
    let flag = false
    if (modules) {
        flag = checkItemCode(code, modules)
    }
    return flag
}

export const splitCoordinates = (val) => {
    const coordinates = val.split(',')
    const splitCoordinates = {
        lat: coordinates[0]?.trim(),
        lng: coordinates[1]?.trim()
    }
    return splitCoordinates
}

export const addZeroToDate = (day, month, year) => {
    let strDate = ""
    while (year.length < 4) {
        year = "0"+year
    }
    if (month.length < 2) {
        month = "0"+month
    }
    if (day.length < 2) {
        day = "0"+day
    }
    return `${year}-${month}-${day}`
}

    // To prevent update current user's role
export const checkCurrentRoleOfUser = (roleId) => {
    const user = getLoggedUserInformation()
    const currentRoleId = user?.permission?.role
    return roleId === currentRoleId
}

export const checkCurrentUser = (userId) => {
    const user = getLoggedUserInformation()
    const currentUserId = user?._id
    return currentUserId === userId
}
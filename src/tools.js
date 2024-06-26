import { cilLockLocked, cilLockUnlocked } from "@coreui/icons";

export const getSpecificGeneralInformation = (projectCode, pageCode, projects) => {
    if (projects) {
        let filteredProjects = projects?.filter(project => {
            return project?.projectCode === projectCode
        })
        let specificProject = filteredProjects[0]
        if (specificProject) {
            return {
                page: specificProject?.projectPages?.filter(page => {
                    return page?.pageCode === pageCode
                })[0],
                status: true
            }
        }
    }
    return {
        status: false,
        page: null
    }
}

export const getProjectByCode = (projectCode, projects) => {
    if (projects) {
        let filteredProjects = projects?.filter(project => {
            return project?.projectCode === projectCode
        })
        if (filteredProjects) {
            return filteredProjects[0]
        }else {
            return null
        }
    }
    return null 
}

export const onFilterUsers = (listUsers, domainId) => {
    return listUsers.filter(user => {
        return user?.permission?.domain === domainId
    })
}

export const onFilterUsersByRole = (listUsers, roleId) => {
    return listUsers.filter(user => {
        return user?.permission?.role === roleId
    })
}

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

export const formatDateToDay = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const damStatusConverter = (dam) => {
    if (dam?.damCurrentStatus?.damStatusName === "OPEN") {
        return {
            icon: cilLockUnlocked,
            class: "success",
            status: "MỞ"
        }
    }
    return {
        icon: cilLockLocked,
        class: "secondary",
        status: "ĐÓNG"
    }
}

export const damStatusConverterV2 = (damStatusName) => {
    if (damStatusName === "OPEN") {
        return {
            icon: cilLockUnlocked,
            class: "success",
            status: "MỞ"
        }
    }
    return {
        icon: cilLockLocked,
        class: "secondary",
        status: "ĐÓNG"
    }
}

export const  convertDateFormat = (dateString) => {
    let date = new Date(dateString);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();

    return day + '/' + month + '/' + year;
}

// export const getDamScheduleBeginAt = (damSchedule) => {
//     return `${damSchedule?.damScheduleBeginAt[3]}:${damSchedule?.damScheduleBeginAt[4] ? damSchedule?.damScheduleBeginAt[4] : '00'}:${damSchedule?.damScheduleBeginAt[5] ? damSchedule?.damScheduleBeginAt[5] : '00'} ${damSchedule?.damScheduleBeginAt[2]}/${damSchedule?.damScheduleBeginAt[1]}/${damSchedule?.damScheduleBeginAt[0]}`
// }
export const getDamScheduleBeginAt = (damSchedule) => {
    const hour = damSchedule?.damScheduleBeginAt[3];
    const minute = damSchedule?.damScheduleBeginAt[4] || '00';
    const second = damSchedule?.damScheduleBeginAt[5] || '00';
    const day = damSchedule?.damScheduleBeginAt[2];
    const month = damSchedule?.damScheduleBeginAt[1];
    const year = damSchedule?.damScheduleBeginAt[0];

    // Pad single-digit values with leading zeros
    const formattedHour = hour < 10 ? `0${hour}` : hour;
    const formattedMinute = minute < 10 ? `0${minute}` : minute;
    const formattedSecond = second < 10 ? `0${second}` : second;
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedHour}h${formattedMinute} ngày ${formattedDay}/${formattedMonth}/${year}`;
}


// export const getDamScheduleEndAt = (damSchedule) => {
//     return `${damSchedule?.damScheduleEndAt[3]}:${damSchedule?.damScheduleEndAt[4] ? damSchedule?.damScheduleEndAt[4] : '00'}:${damSchedule?.damScheduleEndAt[5] ? damSchedule?.damScheduleEndAt[5] : '00'} ${damSchedule?.damScheduleEndAt[2]}/${damSchedule?.damScheduleEndAt[1]}/${damSchedule?.damScheduleEndAt[0]}`
// }

export const getDamScheduleEndAt = (damSchedule) => {
    const hour = damSchedule?.damScheduleEndAt[3];
    const minute = damSchedule?.damScheduleEndAt[4] || '00';
    const second = damSchedule?.damScheduleEndAt[5] || '00';
    const day = damSchedule?.damScheduleEndAt[2];
    const month = damSchedule?.damScheduleEndAt[1];
    const year = damSchedule?.damScheduleEndAt[0];

    // Pad single-digit values with leading zeros
    const formattedHour = hour < 10 ? `0${hour}` : hour;
    const formattedMinute = minute < 10 ? `0${minute}` : minute;
    const formattedSecond = second < 10 ? `0${second}` : second;
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedHour}h${formattedMinute} ngày ${formattedDay}/${formattedMonth}/${year}`;
}



export const getDatetimeFromDB = (response) => {
    return `${response[2]}/${response[1]}/${response[0]}`
}

export const getPostCreatedAt = (post) => {
    return `${post?.postCreatedAt[3]}:${post?.postCreatedAt[4] ? post?.postCreatedAt[4] : '00'}:${post?.postCreatedAt[5] ? post?.postCreatedAt[5] : '00'} ${post?.postCreatedAt[2]}/${post?.postCreatedAt[1]}/${post?.postCreatedAt[0]}`
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

export const checkRoleCanNotChange = (roleId) => {
    const user = getLoggedUserInformation()
    const currentRoleId = user?.permission?.role 
    const defaultRoleQuest = "661544f6b77939e48d030119" || process.env.HG_ROLE_ID_DEFAULT
    const defaultRoleHighestUser = "65b74ca2526ef32c8be0ca07" || process.env.HG_ROLE_ID_ADMIN_DEFAULT
    let res = {
        status: true,
        msg: "Có thể thao tác"
    }
    if (roleId === defaultRoleHighestUser) {
        res["status"] = false
        res["msg"] = "Vai trò cao nhất"
        return res 
    }
    if (roleId === defaultRoleQuest) {
        res["status"] = false
        res["msg"] = "Vai trò mặc định"
        return res
    }
    if (roleId === currentRoleId) {
        res["status"] = false
        res["msg"] = "Vai trò hiện tại"
    }
    return res
}

export const checkUserCanNotChange = (userId) => {
    const user = getLoggedUserInformation()
    const currentUserId = user?._id
    const defaultAdminId = "660bb6c18ace51aaeccec0fb" || process.env.HG_USER_ID_ADMIN_DEFAULT
    let res = {
        status: true,
        canEdit: true,
        msg: "Có thể thao tác"
    }
    if (userId === defaultAdminId) {
        res["status"] = false
        res["canEdit"] = false
        res["msg"] = "Người dùng quản trị"
        return res
    }
    if (userId === currentUserId) {
        res["status"] = false
        res["msg"] = "Người dùng hiện tại"
        return res
    }
    return res
}

export const checkCurrentUser = (userId) => {
    const user = getLoggedUserInformation()
    const currentUserId = user?._id
    return currentUserId === userId
}

export const googleMapLink = (lat, lng) => {
    return `https://www.google.com/maps/?q=${lat},${lng}`
}

export const checkInitElement = (code) => {
    const defaultInitCode = process.env.REACT_APP_HG_CODE || "init"
    console.log(code);
    return code === defaultInitCode
}

export const generateSensorName = (rawName) => {
    var generatedName = '';
    switch(rawName) {
      case 'do_pH':
        generatedName = "Độ pH";
        break;
      case 'muc_nuoc':
        generatedName = "Mực nước";
        break;
      case 'nhiet_do':
        generatedName = "Nhiệt độ";
        break;
      case 'do_man':
        generatedName = "Độ mặn";
        break;
      default:
        generatedName = rawName;
        break;    
    }
    return generatedName;
  }
import React, { useEffect } from "react"
import { getAllModulesOfPermission } from "src/services/authentication-services"
import { getLoggedUserInformation } from "src/tools"

const CustomAuthorizationCheckerChildren = ({parentCode, checkingCode, setExternalState}) => {
    const checkChildrenCode = (modules, parentCode, checkingCode) => {
        let flag = false
        if (modules) {
            modules.forEach(module => {
                if (module?.URL === parentCode) {   
                    module?.children?.forEach(childModule => {
                        if (childModule?.URL === checkingCode) {
                            flag = true
                        }
                    })
                }
            })
        }
        return flag
    }
    useEffect(() => {
        const userLogged = getLoggedUserInformation()
        const permissionId = userLogged?.permission?._id
        getAllModulesOfPermission(permissionId)
        .then(res => {
            const modules = res?.data?.data?.result
            setExternalState(checkChildrenCode(modules, parentCode, checkingCode))
        })
        .catch(err => {
            // Do nothing
        })
    }, [])
    
    return (
        <>
        </>
    )
}

export default CustomAuthorizationCheckerChildren
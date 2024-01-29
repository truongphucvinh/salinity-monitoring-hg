import React, {useEffect} from "react"
import { useNavigate } from "react-router-dom"
import { getAllModulesOfPermission } from "src/services/authentication-services"
import { checkItemCode, getLoggedUserInformation } from "src/tools"

const CustomAuthorizationChecker = ({code}) => {
    const adminRoleId = process.env.ADMIN_ROLE_ID || '6505d988bf135169cd320e8c'
    const superAdminRoleId = process.env.SUPER_ADMIN_ROLE_ID || '6588e34a6f4d6dd9d37c8a01'
    const clientRoleId = process.env.CLIENT_ROLE_ID || '6588e2806f4d6dd9d37c89bd'
    const navigate = useNavigate()
    const authorizationChecker = (code, modules) => {
        let flag = false
        if (modules) {
            flag = checkItemCode(code, modules)
        }
        return flag
    }
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('_isAuthenticated')
        if (isAuthenticated) {
            const user = getLoggedUserInformation()
            const permissionId = user?.permission?._id
            getAllModulesOfPermission(permissionId)
            .then(res => {
                const modules = res?.data?.data?.result
                if (modules && !authorizationChecker(code, modules)) {
                    navigate("/")
                }
            })
            .catch(err => {
                navigate("/")
            })
        }
    }, [])
    return (
        <>
        </>
    )
}

export default CustomAuthorizationChecker
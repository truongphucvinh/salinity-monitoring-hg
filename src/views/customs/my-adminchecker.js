import React, {useEffect} from "react"
import { useNavigate } from "react-router-dom"

const CustomAdminChecker = () => {
    const adminRoleId = process.env.ADMIN_ROLE_ID || '6505d988bf135169cd320e8c'
    const superAdminRoleId = process.env.SUPER_ADMIN_ROLE_ID || '6588e34a6f4d6dd9d37c8a01'
    const clientRoleId = process.env.CLIENT_ROLE_ID || '6588e2806f4d6dd9d37c89bd'
    const navigate = useNavigate()
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('_isAuthenticated')
        if (isAuthenticated) {
            const loggedUser = JSON.parse(localStorage.getItem('_authenticatedUser'))
            if (loggedUser?.permission?.role === adminRoleId || loggedUser?.permission?.role === superAdminRoleId) {

            }else {
                navigate("/")
            }
        }
    }, [])
    return (
        <>
        </>
    )
}

export default CustomAdminChecker
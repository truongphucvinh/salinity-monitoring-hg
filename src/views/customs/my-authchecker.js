import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const CustomAuthChecker = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('_isAuthenticated')
        if (!isAuthenticated) {
            navigate('/login')
        }
    }, [])

    return (
        <>
        </>
    )
}

export default CustomAuthChecker
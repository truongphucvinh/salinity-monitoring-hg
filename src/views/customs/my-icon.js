import React from "react"
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle } from "@coreui/icons"


export const createSuccessIcon = () => {
    return (
        <CIcon icon={cilCheckCircle} className={'text-success'}/>
    )
} 

export const createFailIcon = () => {
    return (
        <CIcon icon={cilXCircle} className={'text-danger'}/>
    )
}
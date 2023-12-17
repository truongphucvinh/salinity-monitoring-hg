import React from "react"
import {
    CToast,
    CToastHeader,
    CToastBody
} from "@coreui/react"

const  createToast = ({title, content, icon}) => {

    return (
        <CToast>
            <CToastHeader closeButton>
            {icon}
            <div className="fw-bold ms-3 me-auto">{title}</div>
            </CToastHeader>
            <CToastBody>{content}</CToastBody>
        </CToast>
    )
}

export default createToast
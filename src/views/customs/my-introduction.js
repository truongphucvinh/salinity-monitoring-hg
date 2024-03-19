import { CCol, CRow } from "@coreui/react"
import React from "react"

const CustomIntroduction = ({title,content}) => {
    return (<>
        <CRow>
            <CCol xs>
                <p className="text-center fs-2 fw-bold">{title}</p>
                <p className="text-center fs-5">{content}</p>
            </CCol>
        </CRow>
    </>)
}

export default CustomIntroduction
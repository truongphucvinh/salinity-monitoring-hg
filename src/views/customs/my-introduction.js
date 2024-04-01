import { cilPencil } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import { CButton, CCol, CRow } from "@coreui/react"
import React, { useState } from "react"
import CustomAuthorizationCheckerChildren from "./my-authorizationchecker-children"

const CustomIntroduction = ({title,content}) => {

    const defaultAuthorizationCode = process.env.HG_MODULE_GENERAL_INFORMATION_MANAGEMENT || "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_general_information_management"
    // Checking feature's module
    const defaultModuleUpdateHeader = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_general_information_management_update_header_information"
    const [havingUpdateHeader, setHavingUpdateHeader] = useState(false)

    return (<>
        <CustomAuthorizationCheckerChildren parentCode={defaultAuthorizationCode} checkingCode={defaultModuleUpdateHeader} setExternalState={setHavingUpdateHeader}/>
        <CRow>
            <CCol xs>
                <p className="text-center fs-2 fw-bold">{title}</p>
                <p className="text-center fs-5">{content}</p>
            </CCol>
        </CRow>
        {
            havingUpdateHeader && <CRow>
                <CCol sx>
                    <div className="d-flex justify-content-center mb-4">
                        <CButton className="btn btn-primary">
                            <CIcon icon={cilPencil} className="me-2"/>
                            Cập nhật
                        </CButton>
                    </div>
                </CCol>
            </CRow>
        }

    </>)
}

export default CustomIntroduction
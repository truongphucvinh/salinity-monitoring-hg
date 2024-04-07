import { cilPencil } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import { CButton, CCol, CForm, CFormInput, CRow, CSpinner, CToaster } from "@coreui/react"
import React, { useEffect, useRef, useState } from "react"
import CustomAuthorizationCheckerChildren from "./my-authorizationchecker-children"
import { getAllProjects, updatePageById } from "src/services/general-services"
import { getSpecificGeneralInformation } from "src/tools"
import CustomModal from "./my-modal"
import createToast from "./my-toast"
import { createFailIcon, createSuccessIcon } from "./my-icon"

const CustomIntroduction = ({title,content,pageCode}) => {
    const defaultProjectCode = process.env.HG_GENERAL_PROJECT || "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dms_project"
    const defaultAuthorizationCode = process.env.HG_MODULE_GENERAL_INFORMATION_MANAGEMENT || "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_general_information_management"
    // Checking feature's module
    const defaultModuleUpdateHeader = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_general_information_management_update_header_information"
    const [havingUpdateHeader, setHavingUpdateHeader] = useState(false)
    const [page, setPage] = useState(null)
    // State + Handlers to update
    const updatePageData = {
        pageId: "",
        pageHeaderTitle: "",
        pageHeaderBody: ""
    }
    const [updatePageState, setUpdatePageState] = useState(updatePageData)
    const {pageId, pageHeaderTitle, pageHeaderBody} = updatePageState
    const [updateFormValidate, setUpdateFormValidate] = useState(false)
    const handleSetPageId = (value) => {
        setUpdatePageState(prev => {
            return {...prev, pageId: value}
        })
    }
    const handleSetPageHeaderTitle = (value) => {
        setUpdatePageState(prev => {
            return {...prev, pageHeaderTitle: value}
        })
    }
    const handleSetPageHeaderBody = (value) => {
        setUpdatePageState(prev => {
            return {...prev, pageHeaderBody: value}
        })
    }
    const getProjectInformation = (projectCode, pageCode) => {
        getAllProjects()
        .then(res => {
            const pageObj = getSpecificGeneralInformation(projectCode, pageCode, res?.data)
            if (pageObj) {
                if (pageObj?.status === true) {
                    setPage(pageObj?.page)
                }
            }
        })
        .catch(err => {
            // Do nothing
        })
    }
    // Modal to update header of page
    const [updateHeaderVisible, setUpdateHeaderVisible] = useState(false)
    const openUpdateHeaderModal = () => {
        setUpdateHeaderVisible(true)
        setUpdatePageState(page)
        setUpdateFormValidate(false)
    }
    
    const updateHeaderPage = (e) => {
        const form = e.currentTarget
        e.preventDefault()
        if (form.checkValidity() === false) {
            e.stopPropagation()
        }else {
            if (updatePageState) {
                let updateData = {
                    pageId: pageId
                }
                if (pageHeaderTitle) {
                    updateData["pageHeaderTitle"] = pageHeaderTitle?.trim()
                }
                if (pageHeaderBody) {
                    updateData["pageHeaderBody"] = pageHeaderBody?.trim()
                }
                updatePageById(updateData)
                .then(res => {
                    getProjectInformation(defaultProjectCode, pageCode)
                    setUpdateHeaderVisible(false)
                    addToast(createToast({
                        title: 'Cập nhật tiêu đề',
                        content: 'Cập nhật tiêu đề thành công !',
                        icon: createSuccessIcon()
                    }))
                })
                .catch(err => {
                    // Do nothing
                    addToast(createToast({
                        title: 'Cập nhật tiêu đề',
                        content: 'Cập nhật tiêu đề không thành công !',
                        icon: createFailIcon()
                    }))
                })
            }
        }
        setUpdateFormValidate(true)
    }
    const updateHeaderForm = (isLoaded) => {
        return (<>
            {
                isLoaded ?
                <CForm 
                    onSubmit={e => updateHeaderPage(e)} 
                    noValidate
                    validated={updateFormValidate}
                >
                    <CRow>
                        <CCol lg={12}>
                            <CFormInput
                                className="mt-4"
                                type="text"
                                required
                                placeholder="Tiêu đề trang Web"
                                feedbackInvalid="Chưa nhập tiêu đề!"
                                onChange={(e) => handleSetPageHeaderTitle(e.target.value)}
                                value={pageHeaderTitle}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12}>
                            <CFormInput
                                className="mt-4"
                                type="text"
                                required
                                placeholder="Mô tả tiêu đề trang Web"
                                feedbackInvalid="Chưa nhập mô tả!"
                                onChange={(e) => handleSetPageHeaderBody(e.target.value)}
                                value={pageHeaderBody}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12} className="d-flex justify-content-end">
                            <CButton type="submit" className="mt-4" color="primary">Xác nhận</CButton>
                        </CCol>
                    </CRow>
                </CForm> : <CSpinner />
            }
        </>)
    }
    useEffect(() => {
        getProjectInformation(defaultProjectCode, pageCode)
    }, [])
    const [toast, addToast] = useState(0)
    const toaster = useRef()
    return (<>
        <CToaster ref={toaster} push={toast} placement="top-end" />
        <CustomAuthorizationCheckerChildren parentCode={defaultAuthorizationCode} checkingCode={defaultModuleUpdateHeader} setExternalState={setHavingUpdateHeader}/>
        <CustomModal visible={updateHeaderVisible} title={'Cập nhật tiêu đề'} body={updateHeaderForm(page)} setVisible={(value) => setUpdateHeaderVisible(value)}/>
        <CRow>
            <CCol xs>
                <p className="text-center fs-2 fw-bold">{page && page?.pageHeaderTitle}</p>
                <p className="text-center fs-5">{page && page?.pageHeaderBody}</p>
            </CCol>
        </CRow>
        {
            havingUpdateHeader && <CRow>
                <CCol sx>
                    <div className="d-flex justify-content-center mb-4">
                        <CButton className="btn btn-primary" onClick={openUpdateHeaderModal}>
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
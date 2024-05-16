import { cilPencil } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import { CButton, CCol, CForm, CFormInput, CRow, CSpinner, CToaster } from "@coreui/react"
import React, { useEffect, useRef, useState } from "react"
import CustomAuthorizationCheckerChildren from "./my-authorizationchecker-children"
import { createPage, getAllProjects, updatePageById } from "src/services/general-services"
import { getProjectByCode, getSpecificGeneralInformation } from "src/tools"
import CustomModal from "./my-modal"
import createToast from "./my-toast"
import { createFailIcon, createSuccessIcon } from "./my-icon"

const CustomIntroduction = ({title = "Tiêu đề",content = "Lời giới thiệu", pageCode}) => {
    const defaultProjectCode = process.env.HG_GENERAL_PROJECT || "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dms_project"
    const defaultAuthorizationCode = process.env.REACT_APP_HG_MODULE_GENERAL_INFORMATION_MANAGEMENT || "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_general_information_management"
    // Checking feature's module
    const defaultModuleUpdateHeader = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_general_information_management_update_header_information"
    const [havingUpdateHeader, setHavingUpdateHeader] = useState(false)
    const [page, setPage] = useState(null)
    const [isApiWorked, setIsApiWorked] = useState(true)
    // State + Handlers to update
    const updatePageData = {
        pageId: "",
        pageHeaderTitle: "",
        pageHeaderBody: ""
    }
    const addPageData = {
        addPageHeaderTitle: '',
        addPageHeaderBody: '',
        addPageProjectId: ''
    }
    const [addPageState, setAddPageState] = useState(addPageData)
    const {addPageHeaderTitle, addPageHeaderBody, addPageProjectId} = addPageState
    const handleSetAddProjectId = (value) => {
        setAddPageState((prev) => {
            return {...prev, addPageProjectId: value}
        })
    }
    const handleSetAddPageTitle = (value) => {
        setAddPageState((prev) => {
            return {...prev, addPageHeaderTitle: value}
        })
    }
    const handleSetAddPageBody = (value) => {
        setAddPageState((prev) => {
            return {...prev, addPageHeaderBody: value}
        })
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
                    setIsApiWorked(true)
                }
            }
            const projectObj = getProjectByCode(projectCode, res?.data)
            if (projectObj) {
                handleSetAddProjectId(projectObj?.projectId)
            }
        })
        .catch(err => {
            // Do nothing
            setIsApiWorked(false)
        })
    }
    // Modal to update header of page
    const [updateHeaderVisible, setUpdateHeaderVisible] = useState(false)
    const openUpdateHeaderModal = () => {
        setUpdateHeaderVisible(true)
        if (page) {
            setUpdatePageState(page)    
        }
        setUpdateFormValidate(false)
    }
    
    const updateHeaderPage = (e) => {
        const form = e.currentTarget
        e.preventDefault()
        if (form.checkValidity() === false) {
            e.stopPropagation()
        }else {
            if (page) {
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
            } else {
                let addPage = {
                    pageName: "Quản lý bài viết",
                    pageCode: pageCode,
                    pageProjectId: addPageProjectId,
                    pageHeaderTitle: addPageHeaderTitle,
                    pageHeaderBody: addPageHeaderBody
                }
                console.log(addPage);
                createPage(addPage)
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
                </CForm> : <CForm 
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
                                onChange={(e) => handleSetAddPageTitle(e.target.value)}
                                value={addPageHeaderTitle}
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
                                onChange={(e) => handleSetAddPageBody(e.target.value)}
                                value={addPageHeaderBody}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12} className="d-flex justify-content-end">
                            <CButton type="submit" className="mt-4" color="primary">Xác nhận</CButton>
                        </CCol>
                    </CRow>
                </CForm>
            }
        </>)
    }
    useEffect(() => {
        getProjectInformation(defaultProjectCode, pageCode)
    }, [])
    const [toast, addToast] = useState(0)
    const toaster = useRef()
    return (
        <>
            {isApiWorked ? <>
                <CToaster ref={toaster} push={toast} placement="top-end" />
                <CustomAuthorizationCheckerChildren parentCode={defaultAuthorizationCode} checkingCode={defaultModuleUpdateHeader} setExternalState={setHavingUpdateHeader}/>
                <CustomModal visible={updateHeaderVisible} title={'Cập nhật tiêu đề'} body={updateHeaderForm(page)} setVisible={(value) => setUpdateHeaderVisible(value)}/>
                <CRow>
                    <CCol xs>
                        <p className="text-center fs-2 fw-bold">{page ? page?.pageHeaderTitle : title}</p>
                        <p className="text-center fs-5">{page ? page?.pageHeaderBody : content}</p>
                    </CCol>
                </CRow>
                {
                    havingUpdateHeader && <CRow>
                        <CCol sx={12}>
                            <div className="d-flex justify-content-center mb-4">
                                <CButton className="btn btn-primary" onClick={openUpdateHeaderModal}>
                                    <CIcon icon={cilPencil} className="me-2"/>
                                    Cập nhật
                                </CButton>
                            </div>
                        </CCol>
                    </CRow>
                }
            </> : <>
                <CRow>
                    <CCol xs>
                        <p className="text-center fs-2 fw-bold">{title}</p>
                        <p className="text-center fs-5">{content}</p>
                    </CCol>
                </CRow>
            </>}
        </>
    )
}

export default CustomIntroduction
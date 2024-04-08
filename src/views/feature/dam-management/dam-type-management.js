import React, { useEffect, useState, useRef } from "react"
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CTableDataCell,
    CButton,
    CFormInput,
    CForm,
    CToaster,
    CSpinner,
    CFormTextarea
  } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilPencil,
    cilTrash,
    cilMagnifyingGlass,
    cilReload,
    cilPlus
  } from '@coreui/icons'
import CustomPagination from "src/views/customs/my-pagination"
import CustomModal from "src/views/customs/my-modal"
import createToast from "src/views/customs/my-toast"
import { createFailIcon, createSuccessIcon } from "src/views/customs/my-icon"
import { createDamType, deleteDamType, getAllDamTypes, getDamTypeById, updateDamType } from "src/services/dam-services"
import CustomSpinner from "src/views/customs/my-spinner"
import CustomAuthorizationChecker from "src/views/customs/my-authorizationchecker"
import CustomAuthorizationCheckerChildren from "src/views/customs/my-authorizationchecker-children"
import { searchRelatives } from "src/tools"
import CustomAuthChecker from "src/views/customs/my-authchecker"
import CustomIntroduction from "src/views/customs/my-introduction"

const DamTypeManagement = () => {

    const defaultAuthorizationCode = process.env.HG_MODULE_DAM_TYPE_MANAGEMENT || "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dam_type_management"
    // Checking feature's module
    const defaultModuleAddFeature = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dam_type_management_add_dam_type"
    const defaultModuleUpdateFeature = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dam_type_management_update_dam_type"
    const defaultModuleDeleteFeature = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dam_type_management_delete_dam_type"
    const [haveAdding, setHaveAdding] = useState(false)
    const [haveUpdating, setHaveUpdating] = useState(false)
    const [haveDeleting, setHaveDeleting] = useState(false)
    // Dam Type Management
    const [listDamTypes, setListDamTypes] = useState([])
    const [isLoadedDamTypes, setIsLoadedDamTypes] = useState(false)
    const handleSetIsLoadedDamTypes = (value) => {
        setIsLoadedDamTypes(prev => {
            return { ...prev, isLoadedDamTypes: value }
        })
    }
    useEffect(() => {
        handleSetIsLoadedDamTypes(true)
    }, [listDamTypes])
    
    // Call inital APIs
    const rebaseAllData = () => {
        getAllDamTypes()
        .then(res => {
            // Install filter users here
            const damTypes = res?.data
            setListDamTypes(damTypes)
            setFilteredDamTypes(damTypes)
        })
        .catch(err => {
            // Do nothing
        })
    }
    useEffect(() => {
       rebaseAllData()
    },[])

    // Searching data
    const [filteredDamTypes, setFilteredDamTypes] = useState([])
    const initSearch = {
        damTypeName: "",
        damTypeDescription: ""
    }
    const [searchState, setSearchState] = useState(initSearch)
    const {damTypeName, damTypeDescription} = searchState
    const handleSetDamTypeName = (value) => {
        setSearchState(prev => {
            return {...prev, damTypeName: value}
        })
    }
    const handleSetDamTypeDescription = (value) => {
        setSearchState(prev => {
            return {...prev, damTypeDescription: value}
        })
    }
    const onFilter = () => {
        if (damTypeName || damTypeDescription) {
            setFilteredDamTypes(listDamTypes)
            if (damTypeName) {
                setFilteredDamTypes(prev => {
                    return prev.filter(damType => damType?.damTypeName && searchRelatives(damType?.damTypeName, damTypeName))
                })
            }
            if (damTypeDescription) {
                setFilteredDamTypes(prev => {
                    return prev.filter(damType => damType?.damTypeDescription && searchRelatives(damType?.damTypeDescription, damTypeDescription))
                })
            }
        }else {
            onReset()
        }
    }
    const onReset = () => {
        setFilteredDamTypes(listDamTypes)
    }
    // Toast
    const [toast, addToast] = useState(0)
    const toaster = useRef()


    // Pagination + Filtering
    const showFilteredTable = (filteredDamTypes, duration, isLoaded) => {
        return (
            <>
                {
                    !isLoaded ? <CustomSpinner /> :
                    <CTable bordered align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '5%'}}>#</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '30%'}}>Tên loại đập</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '50%'}}>Mô tả</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '15%'}}>Thao tác</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        filteredDamTypes?.length !== 0 ? filteredDamTypes.map((damType, index) => {
                            return (
                                <CTableRow key={damType?.damTypeId}>
                                    <CTableDataCell>{index + 1 + duration}</CTableDataCell>
                                    <CTableDataCell>{damType?.damTypeName}</CTableDataCell>
                                    <CTableDataCell>{damType?.damTypeDescription}</CTableDataCell>
                                    <CTableDataCell>
                                        {haveUpdating && <CIcon icon={cilPencil} onClick={() => openUpdateModal(damType?.damTypeId)} className="text-success mx-1" role="button"/>}
                                        {haveDeleting && <CIcon icon={cilTrash} onClick={() => openDeleteModal(damType?.damTypeId)}  className="text-danger" role="button"/>}
                                    </CTableDataCell>
                                </CTableRow>    
                            )
                        }) : <CTableRow>
                            <CTableDataCell colSpan={4}><p className="text-center">{'Không có dữ liệu'}</p></CTableDataCell>
                        </CTableRow>
                    }
                </CTableBody>
              </CTable>
                }
            </>
            
        )
    }
    // Adding Modal
    const addData = {
        addDamTypeName: "",
        addDamTypeDescription: ""
    }
    const [addState, setAddState] = useState(addData)
    const { addDamTypeName, addDamTypeDescription } = addState
    const [addValidated, setAddValidated] = useState(false)
    const handleSetAddDamTypeName = (value) => {
        setAddState(prev => {
            return { ...prev, addDamTypeName: value }
        })
    }
    const handleSetAddDamTypeDescription = (value) => {
        setAddState(prev => {
            return { ...prev, addDamTypeDescription: value }
        })
    }

    const createNewDamType = (e) => {
        // validation
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
        } else {
            const damType = {
                damTypeName: addDamTypeName.trim(),
                damTypeDescription: addDamTypeDescription.trim()
            }
            createDamType(damType)
            .then(res => {
                setAddVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Thêm loại đập',
                    content: 'Thêm loại đập thành công',
                    icon: createSuccessIcon()
                }))
                setAddValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Thêm loại đập',
                    content: "Thêm loại đập không thành công",
                    icon: createFailIcon()
                }))
            })
        }
        setAddValidated(true)
    }

    const [addVisible, setAddVisible] = useState(false)
    const addForm = () => {
        return <>
                <CForm 
                    onSubmit={e => createNewDamType(e)} 
                    noValidate
                    validated={addValidated}
                >
                    <CRow>
                        <CCol lg={12}>
                            <CFormInput
                                className="mt-4"
                                type="text"
                                placeholder="Tên loại đập"
                                maxLength={50}
                                feedbackInvalid="Không bỏ trống và phải ít hơn 50 ký tự"
                                onChange={(e) => handleSetAddDamTypeName(e.target.value)}
                                value={addDamTypeName}
                                aria-describedby="exampleFormControlInputHelpInline"
                                required
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12}>
                            <CFormTextarea
                                className="mt-4"
                                type="text"
                                placeholder="Mô tả loại đập"
                                maxLength={250}
                                feedbackInvalid="Không bỏ trống và ít hơn 250 ký tự"
                                onChange={(e) => handleSetAddDamTypeDescription(e.target.value)}
                                value={addDamTypeDescription}
                                rows={3}
                                aria-describedby="exampleFormControlInputHelpInline"
                            ></CFormTextarea>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12} className="d-flex justify-content-end">
                            <CButton type="submit" className="mt-4" color="primary">Hoàn tất</CButton>
                        </CCol>
                    </CRow>
                </CForm> 
        </>

    }
 
    // Updating Model
    const updateData = {
        updateDamTypeId: '',
        updateDamTypeName: '',
        updateDamTypeDescription: ''
    }
    const [updateState, setUpdateState] = useState(updateData)
    const { updateDamTypeId, updateDamTypeName, updateDamTypeDescription } = updateState
    const [updateValidated, setUpdateValidated] = useState(false)
    const getDamTypeDataById = (damTypeId) => {
        if (damTypeId) {
            getDamTypeById(damTypeId)
            .then(res => {
                const damType = res?.data
                if (damType) {
                    const updateDamTypeFetchData = {
                        updateDamTypeId: damType?.damTypeId,
                        updateDamTypeName: damType?.damTypeName,
                        updateDamTypeDescription: damType?.damTypeDescription
                    }
                    setUpdateState(updateDamTypeFetchData)
                }else {
                    addToast(createToast({
                        title: 'Cập nhật loại đập',
                        content: "Thông tin loại đập không đúng",
                        icon: createFailIcon()
                    }))
                }
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Cập nhật loại đập',
                    content: "Thông tin loại đập không đúng",
                    icon: createFailIcon()
                }))
            })
        }
    }
    const handleSetUpdateDamTypeId = (value) => {
        setUpdateState(prev => {
            return { ...prev, damTypeId: value }
        })
    }
    const openUpdateModal = (damTypeId) => {
        handleSetUpdateDamTypeId(damTypeId)
        getDamTypeDataById(damTypeId)
        setUpdateVisible(true)
    }
    const handleSetUpdateDamTypeName = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateDamTypeName: value }
        })
    }
    const handleSetUpdateDamTypeDescription = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateDamTypeDescription: value }
        })
    }
    const updateADamType = (e) => {
        // validation
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
        } else {
            const damType = {
                damTypeId: updateDamTypeId,
                damTypeName: updateDamTypeName,
                damTypeDescription: updateDamTypeDescription
            }
            updateDamType(damType)
            .then(res => {
                setUpdateVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Cập nhật loại đập',
                    content: 'Cập nhật loại đập thành công',
                    icon: createSuccessIcon()
                }))
                setUpdateValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Cập nhật loại đập',
                    content: "Cập nhật loại đập không thành công",
                    icon: createFailIcon()
                }))
            })  
        }
        setUpdateValidated(true)
    }
    const [updateVisible, setUpdateVisible] = useState(false)
    const updateForm = (isLoaded) => { 
        return (
            <>
                {  isLoaded ? 
                    <CForm 
                        onSubmit={e => updateADamType(e)} 
                        noValidate
                        validated={updateValidated}
                    >
                        <CRow>
                            <CCol lg={12}>
                                <CFormInput
                                    className="mt-4"
                                    type="text"
                                    placeholder="Tên loại đập"
                                    maxLength={50}
                                    feedbackInvalid="Ít hơn 50 ký tự"
                                    onChange={(e) => handleSetUpdateDamTypeName(e.target.value)}
                                    value={updateDamTypeName}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol lg={12}>
                                <CFormTextarea
                                    className="mt-4"
                                    type="text"
                                    placeholder="Mô tả loại đập"
                                    onChange={(e) => handleSetUpdateDamTypeDescription(e.target.value)}
                                    value={updateDamTypeDescription}
                                    rows={3}
                                    maxLength={250}
                                    feedbackInvalid="Ít hơn 250 ký tự"
                                    aria-describedby="exampleFormControlInputHelpInline"
                                ></CFormTextarea>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol lg={12} className="d-flex justify-content-end">
                                <CButton type="submit" className="mt-4" color="primary">Hoàn tất</CButton>
                            </CCol>
                        </CRow>
                    </CForm> : <CSpinner />
                }
            </>
        )
    }

    // Delete
    const deleteADamType = (damTypeId) => {
        if (damTypeId) {
            deleteDamType(damTypeId)
            .then(res => {
                setDeleteVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Xóa loại đập',
                    content: 'Xóa loại đập thành công',
                    icon: createSuccessIcon()
                }))
                setUpdateValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Xóa loại đập',
                    content: "Xóa loại đập không thành công",
                    icon: createFailIcon()
                }))
            })
        }
    }
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [deleteIdDamTypeId, setDeleteDamTypeId] = useState(0)
    const deleteForm = (damTypeId) => {
        return (
            <>
                {   
                    damTypeId ? 
                    <CForm onSubmit={() => deleteADamType(damTypeId)}>
                        <CRow>
                            <CCol md={12}>
                                <p>Bạn có chắc muốn xóa loại đập này ?</p>
                            </CCol>
                            <CCol md={12} className="d-flex justify-content-end">
                                <CButton color="primary" type="submit">Xác nhận</CButton>
                                <CButton color="danger" onClick={() => setDeleteVisible(false)} className="text-white ms-3">Hủy</CButton>
                            </CCol>
                        </CRow>
                    </CForm> : <CSpinner />
                }
            </>
        )
    }
    const openDeleteModal = (damTypeId) => {
        setDeleteDamTypeId(damTypeId)
        setDeleteVisible(true)
    }

    useEffect(() => {
        // To reset all add state
        setAddState(addData)
        setUpdateState(updateData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addVisible, updateVisible])
    const defaultPageCode = 'U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dms_page_dam_type_management'
    return (
        <>
        <CustomIntroduction 
            pageCode={defaultPageCode}
        />
        <CRow>
        <CustomAuthChecker />
        <CustomAuthorizationChecker isRedirect={true} code={defaultAuthorizationCode}/>
        <CustomAuthorizationCheckerChildren parentCode={defaultAuthorizationCode} checkingCode={defaultModuleAddFeature} setExternalState={setHaveAdding}/>
        <CustomAuthorizationCheckerChildren parentCode={defaultAuthorizationCode} checkingCode={defaultModuleUpdateFeature} setExternalState={setHaveUpdating}/>
        <CustomAuthorizationCheckerChildren parentCode={defaultAuthorizationCode} checkingCode={defaultModuleDeleteFeature} setExternalState={setHaveDeleting}/>
        <CCol xs>
          <CCard className="mb-4">
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CCardHeader>Danh sách loại đập</CCardHeader>
            <CCardBody>
                <CustomModal visible={addVisible} title={'Thêm loại đập'} body={addForm()} setVisible={(value) => setAddVisible(value)}/>
                <CustomModal visible={updateVisible} title={'Cập nhật loại đập'} body={updateForm(updateDamTypeId)} setVisible={(value) => setUpdateVisible(value)}/>
                <CustomModal visible={deleteVisible} title={'Xóa loại đập'} body={deleteForm(deleteIdDamTypeId)} setVisible={(value) => setDeleteVisible(value)}/>
                <CForm onSubmit={onFilter}>
                    <CRow>
                        <CCol md={12} lg={3}>
                            <CFormInput
                                className="mb-2"
                                type="text"
                                placeholder="Tên loại đập"
                                onChange={(e) => handleSetDamTypeName(e.target.value)}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                        <CCol md={12} lg={3}>
                            <CFormInput
                                className="mb-2"
                                type="text"
                                placeholder="Mô tả loại đập"
                                onChange={(e) => handleSetDamTypeDescription(e.target.value)}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                        <CCol md={12} lg={3}>
                            <CButton color="primary" className="me-2 " type="submit">
                                <CIcon icon={cilMagnifyingGlass} className="text-white"/>                             
                            </CButton>
                            <CButton color="success" onClick={onReset}>
                                <CIcon icon={cilReload} className="text-white"/>   
                            </CButton>
                        </CCol>
                    </CRow>
              </CForm>
              <br />
              <CRow>
                <CCol xs={12}>
                    {haveAdding && <CButton type="button" color="primary" onClick={() => setAddVisible(true)}>Thêm <CIcon icon={cilPlus}/></CButton>}
                </CCol>
              </CRow>
              <br />
              <CustomPagination listItems={filteredDamTypes} showData={showFilteredTable} isLoaded={isLoadedDamTypes} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      </>
    )
}

export default DamTypeManagement
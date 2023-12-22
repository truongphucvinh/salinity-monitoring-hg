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
    CSpinner
  } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilPencil,
    cilTrash,
    cilMagnifyingGlass,
    cilReload,
    cilPlus
  } from '@coreui/icons'
import { setAuthApiHeader } from "src/services/global-axios"
import CustomPagination from "src/views/customs/my-pagination"
import CustomModal from "src/views/customs/my-modal"
import createToast from "src/views/customs/my-toast"
import { createFailIcon, createSuccessIcon } from "src/views/customs/my-icon"
import { createDamType, getAllDamTypes, getDamTypeById, updateDamType } from "src/services/dam-services"

const DamTypeManagement = () => {

    // User Management Data
    const [listDamTypes, setListDamTypes] = useState([])
    
    // Call inital APIs
    const rebaseAllData = () => {
        if (JSON.parse(localStorage.getItem("_isAuthenticated"))) {
            // Setting up access token
            setAuthApiHeader()
            getAllDamTypes()
            .then(res => {
                // Install filter users here
                console.log(res)
                const damTypes = res?.data
                setListDamTypes(damTypes)
                setFilteredDamTypes(damTypes)
            })
            .catch(err => {
                // Do nothing
            })
        }
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
                    return prev.filter(damType => damType?.damTypeName?.includes(damTypeName.trim()))
                })
            }
            if (damTypeDescription) {
                setFilteredDamTypes(prev => {
                    return prev.filter(damType => damType?.damTypeDescription?.includes(damTypeDescription.trim()))
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
    const showFilteredTable = (filteredDamTypes, duration) => {
        return (
            <CTable bordered align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '5%'}}>#</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '30%'}}>Tên loại đặp</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '50%'}}>Mô tả</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '15%'}}>Thao tác</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        filteredDamTypes.map((damType, index) => {
                            return (
                                <CTableRow key={damType?.damTypeId}>
                                    <CTableDataCell>{index + 1 + duration}</CTableDataCell>
                                    <CTableDataCell>{damType?.damTypeName}</CTableDataCell>
                                    <CTableDataCell>{damType?.damTypeDescription}</CTableDataCell>
                                    <CTableDataCell>
                                        <CIcon icon={cilPencil} onClick={() => openUpdateModal(damType?.damTypeId)} className="text-success mx-1" role="button"/>
                                        <CIcon icon={cilTrash} onClick={() => openDeleteModal(damType?.damTypeId)}  className="text-danger" role="button"/>
                                    </CTableDataCell>
                                </CTableRow>    
                            )
                        })
                    }
                </CTableBody>
              </CTable>
        )
    }
    // Adding Modal
    const addData = {
        addDamTypeName: "",
        addDamTypeDescription: "",
        addDamTypeLoaded: true
    }
    const [addState, setAddState] = useState(addData)
    const { addDamTypeName, addDamTypeDescription, addDamTypeLoaded } = addState
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
    const handleSetAddDamTypeLoaded = (value) => {
        setAddState(prev => {
            return { ...prev, addDamTypeLoaded: value }
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
                    title: 'Thêm loại đặp',
                    content: 'Thêm loại đặp thành công',
                    icon: createSuccessIcon()
                }))
                handleSetAddDamTypeLoaded(false)
                setAddValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Thêm loại đặp',
                    content: "Thêm loại đặp không thành công",
                    icon: createFailIcon()
                }))
            })  
            // To reset all add state
            setAddState(addData)
        }
        setAddValidated(true)
    }

    const [addVisible, setAddVisible] = useState(false)
    const addForm = (isLoaded) => {
        return (
            <>
                {
                !isLoaded ?
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
                                placeholder="Tên loại đặp"
                                feedbackInvalid="Chưa nhập tên loại đặp!"
                                onChange={(e) => handleSetAddDamTypeName(e.target.value)}
                                value={addDamTypeName}
                                aria-describedby="exampleFormControlInputHelpInline"
                                required
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12}>
                            <CFormInput
                                className="mt-4"
                                type="text"
                                placeholder="Mô tả loại đặp"
                                onChange={(e) => handleSetAddDamTypeDescription(e.target.value)}
                                value={addDamTypeDescription}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
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
                // if (res?.data.success) {
                //     const user = res?.data?.data
                //     setUpdateState(prev => {
                //         return {
                //             ...prev, 
                //             updateUsername: user.username,
                //             updateFullname: user.fullName,
                //             updateEmail: user.email,
                //             updateDomainId: user?.permission?.domain,
                //             updateRoleId: user?.permission?.role
                //         }
                //     })
                // }else {
                //     addToast(createToast({
                //         title: 'Cập nhật người dùng',
                //         content: res?.data.message,
                //         icon: createFailIcon()
                //     }))
                // }
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Cập nhật loại đặp',
                    content: "Thông tin loại đặp không đúng",
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
                // if (res?.data?.success)  {
                //     setUpdateVisible(false)
                //     rebaseAllData()
                //     addToast(createToast({
                //         title: 'Cập nhật người dùng',
                //         content: 'Cập nhật người dùng thành công',
                //         icon: createSuccessIcon()
                //     }))
                //     setUpdateValidated(false)
                // }else {
                //     addToast(createToast({
                //         title: 'Cập nhật người dùng',
                //         content: res?.data?.message,
                //         icon: createFailIcon()
                //     }))
                // }

            })
            .catch(err => {
                addToast(createToast({
                    title: 'Cập nhật loại đặp',
                    content: "Cập nhật loại đặp không thành công",
                    icon: createFailIcon()
                }))
            })  
            setUpdateState(updateData)
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
                                    placeholder="Tên loại đặp"
                                    onChange={(e) => handleSetUpdateDamTypeName(e.target.value)}
                                    value={updateDamTypeName}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol lg={12}>
                                <CFormInput
                                    className="mt-4"
                                    type="password"
                                    placeholder="Mô tả loại đặp"
                                    onChange={(e) => handleSetUpdateDamTypeDescription(e.target.value)}
                                    value={updateDamTypeDescription}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                />
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
            deleteADamType(damTypeId)
            .then(res => {
                // if (res?.data?.success)  {
                //     setDeleteVisible(false)
                //     rebaseAllData()
                //     addToast(createToast({
                //         title: 'Xóa người dùng',
                //         content: 'Xóa người dùng thành công',
                //         icon: createSuccessIcon()
                //     }))
                //     setUpdateValidated(false)
                // }else {
                //     addToast(createToast({
                //         title: 'Xóa người dùng',
                //         content: res?.data?.message,
                //         icon: createFailIcon()
                //     }))
                // }
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Xóa loại đặp',
                    content: "Xóa loại đặp không thành công",
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
                                <p>Bạn có chắc muốn xóa loại đặp này ?</p>
                            </CCol>
                            <CCol md={12} className="d-flex justify-content-end">
                                <CButton color="primary" type="submit">Xác nhận</CButton>
                                <CButton color="danger" className="text-white ms-3">Hủy</CButton>
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

    return (
        <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CCardHeader>Danh sách loại đặp</CCardHeader>
            <CCardBody>
                <CustomModal visible={addVisible} title={'Thêm người dùng'} body={addForm(addDamTypeLoaded)} setVisible={(value) => setAddVisible(value)}/>
                <CustomModal visible={updateVisible} title={'Cập nhật người dùng'} body={updateForm(updateDamTypeName)} setVisible={(value) => setUpdateVisible(value)}/>
                <CustomModal visible={deleteVisible} title={'Xóa người người dùng'} body={deleteForm(deleteIdDamTypeId)} setVisible={(value) => setDeleteVisible(value)}/>
                <CForm onSubmit={onFilter}>
                    <CRow>
                        <CCol md={12} lg={3}>
                            <CFormInput
                                className="mb-2"
                                type="text"
                                placeholder="Tên loại đặp"
                                onChange={(e) => handleSetDamTypeName(e.target.value)}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                        <CCol md={12} lg={3}>
                            <CFormInput
                                className="mb-2"
                                type="text"
                                placeholder="Mô tả loại đặp"
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
                    <CButton type="button" color="primary" onClick={() => setAddVisible(true)}>Thêm <CIcon icon={cilPlus}/></CButton>
                </CCol>
              </CRow>
              <br />
              <CustomPagination listItems={filteredDamTypes} showData={showFilteredTable} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
}

export default DamTypeManagement
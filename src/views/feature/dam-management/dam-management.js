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
    CFormTextarea,
    CFormSelect
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
import { createDam, createDamType, deleteDamType, getAllDamTypes, getAllDams, getAllRivers, getDamTypeById, updateDamType } from "src/services/dam-services"
import CustomSpinner from "src/views/customs/my-spinner"
import CustomDateTimePicker from "src/views/customs/my-datetimepicker/my-datetimepicker"

const DamManagement = () => {

    // Dam Type Management
    const [listDams, setListDams] = useState([])
    const [listDamTypes, setListDamTypes] = useState([])
    const [listRivers, setListRivers] = useState([])
    const [isLoadedDams, setIsLoadedDams] = useState(false)
    const handleSetIsLoadedDams = (value) => {
        setIsLoadedDams(prev => {
            return { ...prev, isLoadedDams: value }
        })
    }
    useEffect(() => {
        handleSetIsLoadedDams(true)
    }, [listDams])
    
    // Call inital APIs
    const rebaseAllData = () => {
        if (JSON.parse(localStorage.getItem("_isAuthenticated"))) {
            // Setting up access token
            setAuthApiHeader()
            getAllDams()
            .then(res => {
                // Install filter users here
                const dams = res?.data
                setListDams(dams)
                setFilteredDams(dams)
            })
            .catch(err => {
                // Do nothing
            })

            getAllDamTypes()
            .then(res => {
                const damTypes = res?.data
                setListDamTypes(damTypes)
            })
            .catch(err => {
                // Do nothing
            })

            getAllRivers()
            .then(res => {
                const rivers = res?.data
                setListRivers(rivers)
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
    const [filteredDams, setFilteredDams] = useState([])
    const initSearch = {
        damName: "",
        damConstructedAt: "",
        damDescription: "",
        damHeight: 0,
        damCapacity: 0,
        damLongtitude: 0,
        damLatitude: 0,
        damTypeId: "",
        damRiverId: ""
    }
    const [searchState, setSearchState] = useState(initSearch)
    const {damName, damConstructedAt, damDescription, damHeight, damCapacity, damTypeId, damRiverId} = searchState
    const handleSetDamName = (value) => {
        setSearchState(prev => {
            return {...prev, damName: value}
        })
    }
    const handleSetDamDescription = (value) => {
        setSearchState(prev => {
            return {...prev, damDescription: value}
        })
    }
    const handleSetDamConstructedAt = (value) => {
        setSearchState(prev => {
            return {...prev, damConstructedAt: value}
        })
    }
    const handleSetDamHeight = (value) => {
        setSearchState(prev => {
            return {...prev, damHeight: value}
        })
    }
    const handleSetDamCapacity = (value) => {
        setSearchState(prev => {
            return {...prev, damCapacity: value}
        })
    }
    const handleSetDamTypeId = (value) => {
        setSearchState(prev => {
            return {...prev, damTypeId: value}
        })
    }
    const handleSetDamRiverId = (value) => {
        setSearchState(prev => {
            return {...prev, damRiverId: value}
        })
    }
    const onFilter = () => {
        if (damName || damDescription || damConstructedAt || damHeight || damCapacity) {
            setFilteredDams(listDams)
            if (damName) {
                setFilteredDams(prev => {
                    return prev.filter(dam => dam?.damName?.includes(damName.trim()))
                })
            }
            if (damDescription) {
                setFilteredDams(prev => {
                    return prev.filter(dam => dam?.damDescription?.includes(damDescription.trim()))
                })
            }
            if (damConstructedAt) {
                setFilteredDams(prev => {
                    return prev.filter(dam => dam?.damConstructedAt?.includes(damConstructedAt.trim()))
                })
            }
            if (damHeight) {
                setFilteredDams(prev => {
                    return prev.filter(dam => dam?.damHeight?.includes(damHeight.trim()))
                })
            }
            if (damCapacity) {
                setFilteredDams(prev => {
                    return prev.filter(dam => dam?.damCapacity?.includes(damCapacity.trim()))
                })
            }
        }else {
            onReset()
        }
    }
    const onReset = () => {
        setFilteredDams(listDams)
    }
    // Toast
    const [toast, addToast] = useState(0)
    const toaster = useRef()


    // Pagination + Filtering + Fix here
    const showFilteredTable = (filteredDams, duration, isLoaded) => {
        return (
            <>
                {
                    !isLoaded ? <CustomSpinner /> :
                    <CTable bordered align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '5%'}}>#</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '30%'}}>Tên đập</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '20%'}}>Thuộc sông, kênh, rạch</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '20%'}}>Kích thước</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '25%'}}>Thao tác</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        filteredDams?.length !== 0 ? filteredDams.map((dam, index) => {
                            return (
                                <CTableRow key={dam?.damId}>
                                    <CTableDataCell>{index + 1 + duration}</CTableDataCell>
                                    <CTableDataCell>{dam?.damName}</CTableDataCell>
                                    <CTableDataCell>{dam?.damRiver?.riverName}</CTableDataCell>
                                    <CTableDataCell>{`${dam?.damCapacity} x ${dam?.damHeight} (mét)`}</CTableDataCell>
                                    <CTableDataCell>
                                        <CIcon icon={cilPencil} onClick={() => openUpdateModal(dam?.damId)} className="text-success mx-1" role="button"/>
                                        <CIcon icon={cilTrash} onClick={() => openDeleteModal(dam?.damId)}  className="text-danger" role="button"/>
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
        addDamName: "",
        addDamConstructedAt: "",
        addDamDescription: "",
        addDamHeight: '',
        addDamCapacity: '',
        addDamLongtitude: '',
        addDamLatitude: '',
        addDamTypeId: "",
        addDamRiverId: ""
    }
    const [addState, setAddState] = useState(addData)
    const { addDamName, addDamConstructedAt, addDamDescription, addDamHeight, addDamCapacity, addDamLatitude, addDamLongtitude, addDamTypeId, addDamRiverId } = addState
    const [addValidated, setAddValidated] = useState(false)
    const handleSetAddDamName = (value) => {
        setAddState(prev => {
            return { ...prev, addDamName: value }
        })
    }
    const handleSetAddDamConstructedAt = (value) => {
        setAddState(prev => {
            return { ...prev, addDamConstructedAt: value }
        })
    }
    const handleSetAddDamDescription = (value) => {
        setAddState(prev => {
            return { ...prev, addDamDescription: value }
        })
    }
    const handleSetAddDamHeight = (value) => {
        setAddState(prev => {
            return { ...prev, addDamHeight: value }
        })
    }
    const handleSetAddDamCapacity = (value) => {
        setAddState(prev => {
            return { ...prev, addDamCapacity: value }
        })
    }
    const handleSetAddDamLatitude = (value) => {
        setAddState(prev => {
            return { ...prev, addDamLatitude: value }
        })
    }
    const handleSetAddDamLongtitude = (value) => {
        setAddState(prev => {
            return { ...prev, addDamLongtitude: value }
        })
    }
    const handleSetAddDamTypeId = (value) => {
        setAddState(prev => {
            return { ...prev, addDamTypeId: value }
        })
    }
    const handleSetAddDamRiverId = (value) => {
        setAddState(prev => {
            return { ...prev, addDamRiverId: value }
        })
    }
    const createNewDam = (e) => {
        // validation
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
        } else {
            const dam = {
                damName: addDamName.trim(),
                damConstructedAt: addDamConstructedAt.trim(),
                damHeight: addDamHeight,
                damCapacity: addDamCapacity,
                damLongtitude: addDamLongtitude.trim(),
                damLatitude: addDamLatitude.trim(),
                damDescription: addDamDescription.trim(),
                damRiverId: addDamRiverId.trim(),
                damTypeId: addDamTypeId.trim()
            }
            createDam(dam)
            .then(res => {
                setAddVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Thêm đập',
                    content: 'Thêm đập thành công',
                    icon: createSuccessIcon()
                }))
                setAddValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Thêm đập',
                    content: "Thêm đập không thành công",
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
                    onSubmit={e => createNewDam(e)} 
                    noValidate
                    validated={addValidated}
                >
                    <CRow>
                        <CCol lg={6}>
                            <CFormInput
                                className="mt-4"
                                type="text"
                                placeholder="Tên đập"
                                maxLength={50}
                                feedbackInvalid="Không bỏ trống và phải ít hơn 50 ký tự"
                                onChange={(e) => handleSetAddDamName(e.target.value)}
                                value={addDamName}
                                aria-describedby="exampleFormControlInputHelpInline"
                                required
                            />
                        </CCol>
                        <CCol lg={6}>
                            <CustomDateTimePicker 
                                classes='mt-4' 
                                value={addDamConstructedAt}
                                setValue={handleSetAddDamConstructedAt}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12}>
                            <CFormTextarea
                                className="mt-4"
                                type="text"
                                placeholder="Mô tả"
                                maxLength={250}
                                feedbackInvalid="Không bỏ trống và ít hơn 250 ký tự"
                                onChange={(e) => handleSetAddDamDescription(e.target.value)}
                                value={addDamDescription}
                                rows={3}
                                required
                                aria-describedby="exampleFormControlInputHelpInline"
                            ></CFormTextarea>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12}>
                            <CFormInput
                                className="mt-4"
                                type="number"
                                placeholder="Chiều cao"
                                feedbackInvalid="Không bỏ trống và phải là số lớn hơn 0"
                                onChange={(e) => handleSetAddDamHeight(e.target.value)}
                                value={addDamHeight}
                                aria-describedby="exampleFormControlInputHelpInline"
                                required
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12}>
                            <CFormInput
                                className="mt-4"
                                type="number"
                                placeholder="Chiều rộng"
                                feedbackInvalid="Không bỏ trống và phải là số lớn hơn 0"
                                onChange={(e) => handleSetAddDamCapacity(e.target.value)}
                                value={addDamCapacity}
                                aria-describedby="exampleFormControlInputHelpInline"
                                required
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12}>
                            <CFormInput
                                className="mt-4"
                                type="number"
                                placeholder="Kinh độ"
                                feedbackInvalid="Không bỏ trống và phải là số lớn hơn 0"
                                onChange={(e) => handleSetAddDamLongtitude(e.target.value)}
                                value={addDamLongtitude}
                                aria-describedby="exampleFormControlInputHelpInline"
                                required
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12}>
                            <CFormInput
                                className="mt-4"
                                type="number"
                                placeholder="Vĩ độ"
                                feedbackInvalid="Không bỏ trống và phải là số lớn hơn 0"
                                onChange={(e) => handleSetAddDamLatitude(e.target.value)}
                                value={addDamLatitude}
                                aria-describedby="exampleFormControlInputHelpInline"
                                required
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                <CCol lg={12}>
                    <CFormSelect 
                        aria-label="Default select example" 
                        className="mt-4"
                        onChange={(e) => handleSetAddDamRiverId(e.target.value)}
                        value={addDamRiverId}
                        required
                        feedbackInvalid="Chưa chọn sông!"
                    >
                        <option selected="" value="" >Sông, kênh, rạch</option>
                        {
                            listRivers.map((river) => {
                                return  <option key={river?.riverId} value={river?.riverId}>{river?.riverName}</option>
                            })
                        }
                    </CFormSelect>
                </CCol>
            </CRow>
            <CRow>
                <CCol lg={12}>
                    <CFormSelect 
                        aria-label="Default select example" 
                        className="mt-4"
                        onChange={(e) => handleSetAddDamTypeId(e.target.value)}
                        value={addDamTypeId}
                        required
                        feedbackInvalid="Chưa chọn loại đập!"
                    >
                        <option selected="" value="" >Loại đập</option>
                        {
                            listDamTypes.map((damType) => {
                                return  <option key={damType?.damTypeId} value={damType?.damTypeId}>{damType?.damTypeName}</option>
                            })
                        }
                    </CFormSelect>
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
    const getDamTypeDataById = (damId) => {
        if (damId) {
            getDamTypeById(damId)
            .then(res => {
                const dam = res?.data
                if (dam) {
                    const updateDamTypeFetchData = {
                        updateDamTypeId: dam?.damId,
                        updateDamTypeName: dam?.damName,
                        updateDamTypeDescription: dam?.damDescription
                    }
                    setUpdateState(updateDamTypeFetchData)
                }else {
                    addToast(createToast({
                        title: 'Cập nhật đập',
                        content: "Thông tin đập không đúng",
                        icon: createFailIcon()
                    }))
                }
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Cập nhật đập',
                    content: "Thông tin đập không đúng",
                    icon: createFailIcon()
                }))
            })
        }
    }
    const handleSetUpdateDamTypeId = (value) => {
        setUpdateState(prev => {
            return { ...prev, damId: value }
        })
    }
    const openUpdateModal = (damId) => {
        handleSetUpdateDamTypeId(damId)
        getDamTypeDataById(damId)
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
            const dam = {
                damId: updateDamTypeId,
                damName: updateDamTypeName,
                damDescription: updateDamTypeDescription
            }
            updateDamType(dam)
            .then(res => {
                setUpdateVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Cập nhật đập',
                    content: 'Cập nhật đập thành công',
                    icon: createSuccessIcon()
                }))
                setUpdateValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Cập nhật đập',
                    content: "Cập nhật đập không thành công",
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
                                    placeholder="Tên đập"
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
                                    placeholder="Mô tả đập"
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
    const deleteADamType = (damId) => {
        if (damId) {
            deleteDamType(damId)
            .then(res => {
                setDeleteVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Xóa đập',
                    content: 'Xóa đập thành công',
                    icon: createSuccessIcon()
                }))
                setUpdateValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Xóa đập',
                    content: "Xóa đập không thành công",
                    icon: createFailIcon()
                }))
            })
        }
    }
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [deleteIdDamTypeId, setDeleteDamTypeId] = useState(0)
    const deleteForm = (damId) => {
        return (
            <>
                {   
                    damId ? 
                    <CForm onSubmit={() => deleteADamType(damId)}>
                        <CRow>
                            <CCol md={12}>
                                <p>Bạn có chắc muốn xóa đập này ?</p>
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
    const openDeleteModal = (damId) => {
        setDeleteDamTypeId(damId)
        setDeleteVisible(true)
    }

    useEffect(() => {
        // To reset all add state
        setAddState(addData)
        setUpdateState(updateData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addVisible, updateVisible])

    return (
        <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CCardHeader>Danh sách đập</CCardHeader>
            <CCardBody>
                <CustomModal visible={addVisible} title={'Thêm đập'} body={addForm()} setVisible={(value) => setAddVisible(value)}/>
                <CustomModal visible={updateVisible} title={'Cập nhật đập'} body={updateForm(updateDamTypeName)} setVisible={(value) => setUpdateVisible(value)}/>
                <CustomModal visible={deleteVisible} title={'Xóa người đập'} body={deleteForm(deleteIdDamTypeId)} setVisible={(value) => setDeleteVisible(value)}/>
                <CForm onSubmit={onFilter}>
                    <CRow>
                        <CCol md={12} lg={3}>
                            <CFormInput
                                className="mb-2"
                                type="text"
                                placeholder="Tên đập"
                                onChange={(e) => handleSetDamName(e.target.value)}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                        <CCol md={12} lg={3}>
                            <CFormInput
                                className="mb-2"
                                type="text"
                                placeholder="Mô tả đập"
                                onChange={(e) => handleSetDamDescription(e.target.value)}
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
              <CustomPagination listItems={filteredDams} showData={showFilteredTable} isLoaded={isLoadedDams} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
}

export default DamManagement
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
    CInputGroup
  } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilPencil,
    cilTrash,
    cilMagnifyingGlass,
    cilReload,
    cilPlus,
    cilLocationPin
  } from '@coreui/icons'
import { setAuthApiHeader } from "src/services/global-axios"
import CustomPagination from "src/views/customs/my-pagination"
import CustomModal from "src/views/customs/my-modal"
import createToast from "src/views/customs/my-toast"
import { createFailIcon, createSuccessIcon } from "src/views/customs/my-icon"
import { createRiver,  deleteRiver,  getAllRivers,  getRiverById,  updateRiver } from "src/services/dam-services"
import CustomSpinner from "src/views/customs/my-spinner"
import { splitCoordinates } from "src/tools"

const RiverManagement = () => {

    // Dam Type Management
    const [listRivers, setListRivers] = useState([])
    const [isLoadedRivers, setIsLoadedRivers] = useState(false)
    const handleSetIsLoadedRivers = (value) => {
        setIsLoadedRivers(prev => {
            return { ...prev, isLoadedRivers: value }
        })
    }
    useEffect(() => {
        handleSetIsLoadedRivers(true)
    }, [listRivers])
    
    // Call inital APIs
    const rebaseAllData = () => {
        getAllRivers()
        .then(res => {
            // Install filter users here
            const rivers = res?.data
            setListRivers(rivers)
            setFilteredRivers(rivers)
        })
        .catch(err => {
            // Do nothing
        })
    }
    useEffect(() => {
       rebaseAllData()
    },[])

    // Searching data
    const [filteredRivers, setFilteredRivers] = useState([])
    const initSearch = {
        riverName: "",
        riverLocation: ""
    }
    const [searchState, setSearchState] = useState(initSearch)
    const {riverName, riverLocation} = searchState
    const handleSetRiverName = (value) => {
        setSearchState(prev => {
            return {...prev, riverName: value}
        })
    }
    const handleSetRiverLocation = (value) => {
        setSearchState(prev => {
            return {...prev, riverLocation: value}
        })
    }
    const onFilter = () => {
        if (riverName || riverLocation) {
            setFilteredRivers(listRivers)
            if (riverName) {
                setFilteredRivers(prev => {
                    return prev.filter(river => river?.riverName?.includes(riverName.trim()))
                })
            }
            if (riverLocation) {
                setFilteredRivers(prev => {
                    return prev.filter(river => river?.riverLocation?.includes(riverLocation.trim()))
                })
            }
        }else {
            onReset()
        }
    }
    const onReset = () => {
        setFilteredRivers(listRivers)
    }
    // Toast
    const [toast, addToast] = useState(0)
    const toaster = useRef()


    // Pagination + Filtering
    const showFilteredTable = (filteredRivers, duration, isLoaded) => {
        return (
            <>
                {
                    !isLoaded ? <CustomSpinner /> :
                    <CTable bordered align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '5%'}}>#</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '30%'}}>Tên sông, kênh, rạch</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '50%'}}>Mô tả</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '15%'}}>Thao tác</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        filteredRivers?.length !== 0 ? filteredRivers.map((river, index) => {
                            return (
                                <CTableRow key={river?.riverId}>
                                    <CTableDataCell>{index + 1 + duration}</CTableDataCell>
                                    <CTableDataCell>{river?.riverName}</CTableDataCell>
                                    <CTableDataCell>{river?.riverLocation}</CTableDataCell>
                                    <CTableDataCell>
                                        <a href={`https://www.google.com/maps/?q=${river?.riverLatitude},${river?.riverLongitude}`} rel="noopener noreferrer" target="_blank">
                                            <CIcon icon={cilLocationPin} className="text-danger mx-1" role="button"/>
                                        </a>
                                        <CIcon icon={cilPencil} onClick={() => openUpdateModal(river?.riverId)} className="text-success mx-1" role="button"/>
                                        <CIcon icon={cilTrash} onClick={() => openDeleteModal(river?.riverId)}  className="text-danger" role="button"/>
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
        addRiverName: "",
        addRiverLocation: "",
        addRiverLatitude: "",
        addRiverLongitude: ""
    }
    const [addState, setAddState] = useState(addData)
    const { addRiverName, addRiverLocation, addRiverLatitude, addRiverLongitude } = addState
    const [addValidated, setAddValidated] = useState(false)
    const handleSetAddRiverName = (value) => {
        setAddState(prev => {
            return { ...prev, addRiverName: value }
        })
    }
    const handleSetAddRiverLocation = (value) => {
        setAddState(prev => {
            return { ...prev, addRiverLocation: value }
        })
    }
    const handleSetAddRiverLatitude = (value) => {
        setAddState(prev => {
            return { ...prev, addRiverLatitude: value }
        })
    }
    const handleSetAddRiverLongitude = (value) => {
        setAddState(prev => {
            return { ...prev, addRiverLongitude: value }
        })
    }
    const handleSetAddLatLngAutomatically = (value) => {
        const coordinates = splitCoordinates(value)
        setAddState(prev => {
            return { ...prev, addRiverLatitude:  coordinates?.lat, addRiverLongitude: coordinates?.lng }
        })
    }

    const createNewRiverRecord = (e) => {
        // validation
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
        } else {
            const river = {
                riverName: addRiverName.trim(),
                riverLocation: addRiverLocation.trim(),
                riverLatitude: addRiverLatitude,
                riverLongitude: addRiverLongitude
            }
            createRiver(river)
            .then(res => {
                setAddVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Thêm sông, kênh, rạch',
                    content: 'Thêm sông, kênh, rạch thành công',
                    icon: createSuccessIcon()
                }))
                setAddValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Thêm sông, kênh, rạch',
                    content: "Thêm sông, kênh, rạch không thành công",
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
                    onSubmit={e => createNewRiverRecord(e)} 
                    noValidate
                    validated={addValidated}
                >
                    <CRow>
                        <CCol lg={12}>
                            <CFormInput
                                className="mt-4"
                                type="text"
                                placeholder="Tên sông, kênh, rạch"
                                maxLength={50}
                                feedbackInvalid="Không bỏ trống và phải ít hơn 50 ký tự"
                                onChange={(e) => handleSetAddRiverName(e.target.value)}
                                value={addRiverName}
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
                                placeholder="Mô tả vị trí sông, kênh, rạch"
                                feedbackInvalid="Không bỏ trống và phải ít hơn 250 ký tự"
                                maxLength={250}
                                onChange={(e) => handleSetAddRiverLocation(e.target.value)}
                                value={addRiverLocation}
                                required
                                rows={3}
                                aria-describedby="exampleFormControlInputHelpInline"
                            >
                            </CFormTextarea>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs={12} lg={12}>
                            <CInputGroup className="mt-4">
                                <CFormInput 
                                    type="text"
                                    placeholder="Tọa độ"
                                    feedbackInvalid="Không bỏ trống và phải là một cặp số gồm vĩ độ và kinh độ"
                                    onChange={(e) => handleSetAddLatLngAutomatically(e.target.value)}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                    required
                                    id="button-addon2"
                                />
                                <CButton type="button" className="text-white" color="primary" id="button-addon2">
                                    <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">
                                        <CIcon icon={cilLocationPin} style={{color: "white", width: "18px",  height: "18px"}}/>
                                    </a>
                                </CButton>
                            </CInputGroup>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs={12} lg={6}>
                            <CFormInput
                                className="mt-4"
                                type="number"
                                placeholder="Vĩ độ"
                                readOnly
                                feedbackInvalid="Không bỏ trống và phải là số lớn hơn 0"
                                value={addRiverLatitude}
                                aria-describedby="exampleFormControlInputHelpInline"
                                required
                            />
                        </CCol>
                        <CCol xs={12} lg={6}>
                            <CFormInput
                                className="mt-4"
                                type="number"
                                placeholder="Kinh độ"
                                readOnly
                                feedbackInvalid="Không bỏ trống và phải là số lớn hơn 0"
                                value={addRiverLongitude}
                                aria-describedby="exampleFormControlInputHelpInline"
                                required
                            />
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
        updateRiverId: '',
        updateRiverName: '',
        updateRiverLocation: '',
        updateRiverLatitude: '',
        updateRiverLongitude: ''
    }
    const [updateState, setUpdateState] = useState(updateData)
    const { updateRiverId, updateRiverName, updateRiverLocation, updateRiverLatitude, updateRiverLongitude } = updateState
    const [updateValidated, setUpdateValidated] = useState(false)
    const geRiverDataById = (riverId) => {
        if (riverId) {
            getRiverById(riverId)
            .then(res => {
                const river = res?.data
                if (river) {
                    const updateRiverFetchData = {
                        updateRiverId: river?.riverId,
                        updateRiverName: river?.riverName,
                        updateRiverLocation: river?.riverLocation,
                        updateRiverLatitude: river?.riverLatitude,
                        updateRiverLongitude: river?.riverLongitude
                    }
                    setUpdateState(updateRiverFetchData)
                }else {
                    addToast(createToast({
                        title: 'Cập nhật sông, kênh, rạch',
                        content: "Thông tin sông, kênh, rạch không đúng",
                        icon: createFailIcon()
                    }))
                }
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Cập nhật sông, kênh, rạch',
                    content: "Thông tin sông, kênh, rạch không đúng",
                    icon: createFailIcon()
                }))
            })
        }
    }
    const handleSetUpdateRiverId = (value) => {
        setUpdateState(prev => {
            return { ...prev, riverId: value }
        })
    }
    const openUpdateModal = (riverId) => {
        handleSetUpdateRiverId(riverId)
        geRiverDataById(riverId)
        setUpdateVisible(true)
    }
    const handleSetUpdateRiverName = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateRiverName: value }
        })
    }
    const handleSetUpdateRiverLocation = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateRiverLocation: value }
        })
    }
    const handleSetUpdateLatLngAutomatically = (value) => {
        const coordinates = splitCoordinates(value)
        setUpdateState(prev => {
            return { ...prev, updateRiverLatitude:  coordinates?.lat, updateRiverLongitude: coordinates?.lng }
        })
    }
    const updateARiver = (e) => {
        // validation
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
        } else {
            const river = {
                riverId: updateRiverId,
                riverName: updateRiverName,
                riverLocation: updateRiverLocation,
                riverLatitude: updateRiverLatitude,
                riverLongitude: updateRiverLongitude
            }
            updateRiver(river)
            .then(res => {
                setUpdateVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Cập nhật sông, kênh, rạch',
                    content: 'Cập nhật sông, kênh, rạch thành công',
                    icon: createSuccessIcon()
                }))
                setUpdateValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Cập nhật sông, kênh, rạch',
                    content: "Cập nhật sông, kênh, rạch không thành công",
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
                        onSubmit={e => updateARiver(e)} 
                        noValidate
                        validated={updateValidated}
                    >
                        <CRow>
                            <CCol lg={12}>
                                <CFormInput
                                    className="mt-4"
                                    type="text"
                                    placeholder="Tên sông, kênh, rạch"
                                    onChange={(e) => handleSetUpdateRiverName(e.target.value)}
                                    value={updateRiverName}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol lg={12}>
                                <CFormTextarea
                                    className="mt-4"
                                    type="text"
                                    placeholder="Mô tả vị trí sông, kênh, rạch"
                                    onChange={(e) => handleSetUpdateRiverLocation(e.target.value)}
                                    value={updateRiverLocation}
                                    feedbackInvalid="Phải ít hơn 250 ký tự"
                                    maxLength={250}
                                    rows={3}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                ></CFormTextarea>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol xs={12} lg={12}>
                                <CInputGroup className="mt-4">
                                    <CFormInput 
                                        type="text"
                                        placeholder="Tọa độ"
                                        feedbackInvalid="Không bỏ trống và phải là một cặp số gồm vĩ độ và kinh độ"
                                        onChange={(e) => handleSetUpdateLatLngAutomatically(e.target.value)}
                                        aria-describedby="exampleFormControlInputHelpInline"
                                        required
                                        id="button-addon2"
                                    />
                                    <CButton type="button" className="text-white" color="primary" id="button-addon2">
                                        <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">
                                            <CIcon icon={cilLocationPin} style={{color: "white", width: "18px",  height: "18px"}}/>
                                        </a>
                                    </CButton>
                                </CInputGroup>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol xs={12} lg={6}>
                                <CFormInput
                                    className="mt-4"
                                    type="number"
                                    placeholder="Vĩ độ"
                                    readOnly
                                    feedbackInvalid="Là một số"
                                    value={updateRiverLatitude}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                />
                            </CCol>
                            <CCol xs={12} lg={6}>
                                <CFormInput
                                    className="mt-4"
                                    type="number"
                                    placeholder="Kinh độ"
                                    readOnly
                                    feedbackInvalid="Là một số"
                                    value={updateRiverLongitude}
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
    const deleteARiver = (riverId) => {
        if (riverId) {
            deleteRiver(riverId)
            .then(res => {
                setDeleteVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Xóa sông, kênh, rạch',
                    content: 'Xóa sông, kênh, rạch thành công',
                    icon: createSuccessIcon()
                }))
                setUpdateValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Xóa sông, kênh, rạch',
                    content: "Xóa sông, kênh, rạch không thành công",
                    icon: createFailIcon()
                }))
            })
        }
    }
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [deleteRiverId, setDeleteRiverId] = useState(0)
    const deleteForm = (riverId) => {
        return (
            <>
                {   
                    riverId ? 
                    <CForm onSubmit={() => deleteARiver(riverId)}>
                        <CRow>
                            <CCol md={12}>
                                <p>Bạn có chắc muốn xóa sông, kênh, rạch này ?</p>
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
    const openDeleteModal = (riverId) => {
        setDeleteRiverId(riverId)
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
            <CCardHeader>Danh sách sông, kênh, rạch</CCardHeader>
            <CCardBody>
                <CustomModal visible={addVisible} title={'Thêm sông, kênh, rạch'} body={addForm()} setVisible={(value) => setAddVisible(value)}/>
                <CustomModal visible={updateVisible} title={'Cập nhật sông, kênh, rạch'} body={updateForm(updateRiverName)} setVisible={(value) => setUpdateVisible(value)}/>
                <CustomModal visible={deleteVisible} title={'Xóa người sông, kênh, rạch'} body={deleteForm(deleteRiverId)} setVisible={(value) => setDeleteVisible(value)}/>
                <CForm onSubmit={onFilter}>
                    <CRow>
                        <CCol md={12} lg={3}>
                            <CFormInput
                                className="mb-2"
                                type="text"
                                placeholder="Tên sông, kênh, rạch"
                                onChange={(e) => handleSetRiverName(e.target.value)}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                        <CCol md={12} lg={3}>
                            <CFormInput
                                className="mb-2"
                                type="text"
                                placeholder="Mô tả sông, kênh, rạch"
                                onChange={(e) => handleSetRiverLocation(e.target.value)}
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
              <CustomPagination listItems={filteredRivers} showData={showFilteredTable} isLoaded={isLoadedRivers} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
}

export default RiverManagement
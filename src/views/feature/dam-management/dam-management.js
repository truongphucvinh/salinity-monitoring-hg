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
    CFormSelect,
    CInputGroup
  } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilPencil,
    cilTrash,
    cilMagnifyingGlass,
    cilReload,
    cilPlus,
    cilTouchApp,
    cilLocationPin
  } from '@coreui/icons'
import CustomPagination from "src/views/customs/my-pagination"
import CustomModal from "src/views/customs/my-modal"
import createToast from "src/views/customs/my-toast"
import { createFailIcon, createSuccessIcon } from "src/views/customs/my-icon"
import { createDam, deleteDam, getAllDamTypes, getAllDams, getAllRivers, getDamById, updateDam } from "src/services/dam-services"
import CustomSpinner from "src/views/customs/my-spinner"
import CustomDateTimePicker from "src/views/customs/my-datetimepicker/my-datetimepicker"
import { useNavigate } from "react-router-dom"
import { addZeroToDate, damStatusConverter, googleMapLink, searchRelatives, splitCoordinates } from "src/tools"
import CustomAuthorizationChecker from "src/views/customs/my-authorizationchecker"
import { red } from "@mui/material/colors"
import CustomAuthorizationCheckerChildren from "src/views/customs/my-authorizationchecker-children"
import CustomAuthChecker from "src/views/customs/my-authchecker"
import CustomIntroduction from "src/views/customs/my-introduction"

const DamManagement = () => {
    const defaultAuthorizationCode = process.env.REACT_APP_HG_MODULE_DAM_MANAGEMENT || "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dam_management"
    const defaultModuleAddFeature = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dam_management_add_dam"
    const defaultModuleUpdateFeature = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dam_management_update_dam"
    const defaultModuleDeleteFeature = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dam_management_delete_dam"
    const [haveAdding, setHaveAdding] = useState(false)
    const [haveUpdating, setHaveUpdating] = useState(false)
    const [haveDeleting, setHaveDeleting] = useState(false)
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
    useEffect(() => {
       rebaseAllData()
    },[])

    // Searching data
    const [filteredDams, setFilteredDams] = useState([])
    const initSearch = {
        damName: "",
        damDescription: "",
        damHeight: 0,
        damSize: 0,
        damLongtitude: 0,
        damLatitude: 0,
        damTypeName: "",
        damRiverName: ""
    }
    const [searchState, setSearchState] = useState(initSearch)
    const {damName, damSize, damRiverName} = searchState
    const handleSetDamName = (value) => {
        setSearchState(prev => {
            return {...prev, damName: value}
        })
    }
    const handleSetDamSize = (value) => {
        setSearchState(prev => {
            return {...prev, damSize: value}
        })
    }
    const handleSetDamRiverName = (value) => {
        setSearchState(prev => {
            return {...prev, damRiverName: value}
        })
    }
    const onFilter = () => {
        if (damName || damRiverName || damSize) {
            setFilteredDams(listDams)
            if (damName) {
                setFilteredDams(prev => {
                    return prev.filter(dam => dam?.damName && searchRelatives(dam?.damName, damName))
                })
            }
            if (damRiverName) {
                setFilteredDams(prev => {
                    return prev.filter(dam => dam?.damRiver?.riverName && searchRelatives(dam?.damRiver?.riverName, damRiverName))
                })
            }
            if (damSize) {
                setFilteredDams(prev => {
                    return prev.filter(dam => {
                        return dam?.damHeight === parseFloat(damSize) || dam?.damCapacity === parseFloat(damSize)
                    })
                })
            }
        }else {
            onReset()
        }
    }
    const onReset = () => {
        setFilteredDams(listDams)
    }

    // Change Page Route
    const navigate = useNavigate()
    const openDamDetail = (damId) => {
        navigate(`dam-detail/${damId}`)
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
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '15%'}}>Tên đập</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '20%'}}>Thuộc sông, kênh, rạch</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '20%'}}>Kích thước</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '15%'}}>Trạng thái</CTableHeaderCell>
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
                                    <CTableDataCell className={`text-${damStatusConverter(dam)?.class}`}><CIcon icon={damStatusConverter(dam)?.icon} className="me-2"/>{damStatusConverter(dam)?.status}</CTableDataCell>
                                    <CTableDataCell>
                                        <CIcon icon={cilTouchApp} onClick={() => openDamDetail(dam?.damId)} className="text-primary mx-1" role="button"/>
                                        {haveUpdating && <CIcon icon={cilPencil} onClick={() => openUpdateModal(dam?.damId)} className="text-success mx-1" role="button"/>}
                                        {haveDeleting && <CIcon icon={cilTrash} onClick={() => openDeleteModal(dam?.damId)}  className="text-danger" role="button"/>}
                                    </CTableDataCell>
                                </CTableRow>    
                            )
                        }) : <CTableRow>
                            <CTableDataCell colSpan={6}><p className="text-center">{'Không có dữ liệu'}</p></CTableDataCell>
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
    const handleSetLatLngAutomatically = (value) => {
        const coordinates = splitCoordinates(value)
        setAddState(prev => {
            return { ...prev, addDamLongtitude: coordinates?.lng, addDamLatitude: coordinates?.lat }
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
        e.preventDefault()
        if (form.checkValidity() === false) {
            e.stopPropagation()
        } else {
            const dam = {
                damName: addDamName ? addDamName.trim() : addDamName,
                damConstructedAt: addDamConstructedAt,
                damHeight: addDamHeight,
                damCapacity: addDamCapacity,
                damLongitude: addDamLongtitude,
                damLatitude: addDamLatitude,
                damDescription: addDamDescription ? addDamDescription.trim() : addDamDescription,
                damRiverId: addDamRiverId,
                damTypeId: addDamTypeId
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
                                placeholder={'Ngày xây dựng'}
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
                        <CCol xs={12} lg={6}>
                            <CFormInput
                                className="mt-4"
                                type="number"
                                placeholder="Chiều cao"
                                min={0}
                                feedbackInvalid="Không bỏ trống và phải là số lớn hơn 0"
                                onChange={(e) => handleSetAddDamHeight(e.target.value)}
                                value={addDamHeight}
                                aria-describedby="exampleFormControlInputHelpInline"
                                required
                                step={0.01}
                            />
                        </CCol>
                        <CCol xs={12} lg={6}>
                            <CFormInput
                                className="mt-4"
                                type="number"
                                placeholder="Chiều rộng"
                                min={0}
                                feedbackInvalid="Không bỏ trống và phải là số lớn hơn 0"
                                onChange={(e) => handleSetAddDamCapacity(e.target.value)}
                                value={addDamCapacity}
                                aria-describedby="exampleFormControlInputHelpInline"
                                required
                                step={0.01}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs={12} lg={12}>
                            <CInputGroup className="mt-4">
                                <CFormInput 
                                    type="text"
                                    placeholder="Tọa độ"
                                    feedbackInvalid="Không bỏ trống và phải là một cặp số gồm vĩ độ và kinh độ"
                                    onChange={(e) => handleSetLatLngAutomatically(e.target.value)}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                    required
                                    id="button-addon2"
                                />
                                <a href="https://www.google.com/maps" className="btn btn-primary text-white" target="_blank" rel="noopener noreferrer">
                                    <CIcon icon={cilLocationPin} style={{color: "white", width: "18px",  height: "18px"}}/>
                                </a>
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
                                // onChange={(e) => handleSetAddDamLatitude(e.target.value)}
                                value={addDamLatitude}
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
                                // onChange={(e) => handleSetAddDamLongtitude(e.target.value)}
                                value={addDamLongtitude}
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
        updateId: '',
        updateDamName: "",
        updateDamConstructedAt: "",
        updateDamDescription: "",
        updateDamHeight: '',
        updateDamCapacity: '',
        updateDamLongtitude: '',
        updateDamLatitude: '',
        updateDamTypeId: "",
        updateDamRiverId: ""
    }
    const [updateState, setUpdateState] = useState(updateData)
    const { 
        updateId,
        updateDamName,
        updateDamConstructedAt,
        updateDamDescription,
        updateDamHeight,
        updateDamCapacity,
        updateDamLongtitude,
        updateDamLatitude,
        updateDamTypeId,
        updateDamRiverId 
    } = updateState
    const [updateValidated, setUpdateValidated] = useState(false)
    const getDamDataById = (damId) => {
        if (damId) {
            getDamById(damId)
            .then(res => {
                const dam = res?.data
                if (dam) {
                    let year = dam?.damConstructedAt[2].toString()
                    let month = dam?.damConstructedAt[1].toString()
                    let day = dam?.damConstructedAt[0].toString()
                    const constructedAt = addZeroToDate(year, month, day)
                    const updateDamFetchData = {
                        updateId: dam?.damId,
                        updateDamName: dam?.damName,
                        updateDamConstructedAt: constructedAt,
                        updateDamDescription: dam?.damDescription,
                        updateDamHeight: dam?.damHeight,
                        updateDamCapacity: dam?.damCapacity,
                        updateDamLongtitude: dam?.damLongitude,
                        updateDamLatitude: dam?.damLatitude,
                        updateDamTypeId: dam?.damType?.damTypeId,
                        updateDamRiverId: dam?.damRiver?.riverId 
                    }
                    setUpdateState(updateDamFetchData)
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
    const openUpdateModal = (damId) => {
        getDamDataById(damId)
        setUpdateVisible(true)
    }
    const handleSetUpdateDamName = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateDamName: value }
        })
    }
    const handleSetUpdateDamConstructedAt = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateDamConstructedAt: value }
        })
    }
    const handleSetUpdateDamDescription = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateDamDescription: value }
        })
    }
    const handleSetUpdateDamHeight = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateDamHeight: value }
        })
    }
    const handleSetUpdateDamCapacity = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateDamCapacity: value }
        })
    }
    const handleSetUpdateLatLngAutomatically = (value) => {
        const coordinates = splitCoordinates(value)
        setUpdateState(prev => {
            return { ...prev, updateDamLatitude:  coordinates?.lat, updateDamLongtitude: coordinates?.lng }
        })
    }
    const handleSetUpdateDamTypeId = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateDamTypeId: value }
        })
    }
    const handleSetUpdateDamRiverId = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateDamRiverId: value }
        })
    }
    const updateADam = (e) => {
        // validation
        const form = e.currentTarget
        e.preventDefault()
        if (form.checkValidity() === false) {
            e.stopPropagation()
        } else {
            const dam = {
                damId: updateId,
                damName: updateDamName ? updateDamName.trim() : updateDamName,
                damConstructedAt: updateDamConstructedAt,
                damDescription: updateDamDescription ? updateDamDescription.trim() : updateDamDescription,
                damHeight: updateDamHeight,
                damCapacity: updateDamCapacity,
                damLongitude: updateDamLongtitude,
                damLatitude: updateDamLatitude,
                damTypeId: updateDamTypeId,
                damRiverId: updateDamRiverId 
            }
            updateDam(dam)
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
                        onSubmit={e => updateADam(e)} 
                        noValidate
                        validated={updateValidated}
                    >
                        <CRow>
                            <CCol lg={6}>
                                <CFormInput
                                    className="mt-4"
                                    type="text"
                                    required
                                    placeholder="Tên đập"
                                    maxLength={50}
                                    feedbackInvalid="Ít hơn 50 ký tự"
                                    onChange={(e) => handleSetUpdateDamName(e.target.value)}
                                    value={updateDamName}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                />
                            </CCol>
                            <CCol lg={6}>
                                <CustomDateTimePicker 
                                    classes='mt-4' 
                                    value={updateDamConstructedAt}
                                    setValue={handleSetUpdateDamConstructedAt}
                                    isRequired={false}
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
                                    feedbackInvalid="It hơn 250 ký tự"
                                    onChange={(e) => handleSetUpdateDamDescription(e.target.value)}
                                    value={updateDamDescription}
                                    rows={3}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                ></CFormTextarea>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol xs={12} lg={6}>
                                <CFormInput
                                    className="mt-4"
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    placeholder="Chiều cao"
                                    feedbackInvalid="Lớn hơn 0"
                                    onChange={(e) => handleSetUpdateDamHeight(e.target.value)}
                                    value={updateDamHeight}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                />
                            </CCol>
                            <CCol xs={12} lg={6}>
                                <CFormInput
                                    className="mt-4"
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    placeholder="Chiều rộng"
                                    feedbackInvalid="Lớn hơn 0"
                                    onChange={(e) => handleSetUpdateDamCapacity(e.target.value)}
                                    value={updateDamCapacity}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                />
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
                                        id="button-addon2"
                                    />
                                    <a href={googleMapLink(updateDamLatitude, updateDamLongtitude)} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                                        <CIcon icon={cilLocationPin} style={{color: "white", width: "18px",  height: "18px"}}/>
                                    </a>
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
                                    value={updateDamLatitude}
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
                                    value={updateDamLongtitude}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol lg={12}>
                                <CFormSelect 
                                    aria-label="Default select example" 
                                    className="mt-4"
                                    onChange={(e) => handleSetUpdateDamRiverId(e.target.value)}
                                    value={updateDamRiverId}
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
                                    onChange={(e) => handleSetUpdateDamTypeId(e.target.value)}
                                    value={updateDamTypeId}
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
                    </CForm> : <CSpinner />
                }
            </>
        )
    }

    // Delete
    const deleteADam = (damId) => {
        if (damId) {
            deleteDam(damId)
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
    const [deleteIdDamId, setDeleteDamId] = useState(0)
    const deleteForm = (damId) => {
        return (
            <>
                {   
                    damId ? 
                    <CForm onSubmit={(e) => {
                        e.preventDefault()
                        deleteADam(damId)
                    }}>
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
        setDeleteDamId(damId)
        setDeleteVisible(true)
    }

    useEffect(() => {
        // To reset all add state
        setAddState(addData)
        setUpdateState(updateData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addVisible, updateVisible])

    const defaultPageCode = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dms_page_dam_management"
    return (<>
        <CustomIntroduction 
            pageCode={defaultPageCode}
            title="QUẢN LÝ CỐNG / ĐẬP"
            content="Hỗ trợ quản lý các thông tin chung về hệ thống cống / đập trực thuộc tỉnh Hậu Giang"
        />
            <CRow>
        {/* Checking the authentication here */}
        <CustomAuthChecker />
        {/* Checking the authorization here */}
        <CustomAuthorizationChecker isRedirect={true} code={defaultAuthorizationCode} />
        <CustomAuthorizationCheckerChildren parentCode={defaultAuthorizationCode} checkingCode={defaultModuleAddFeature} setExternalState={setHaveAdding}/>
        <CustomAuthorizationCheckerChildren parentCode={defaultAuthorizationCode} checkingCode={defaultModuleUpdateFeature} setExternalState={setHaveUpdating}/>
        <CustomAuthorizationCheckerChildren parentCode={defaultAuthorizationCode} checkingCode={defaultModuleDeleteFeature} setExternalState={setHaveDeleting}/>
        <CCol xs>
          <CCard className="mb-4">
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CCardHeader>Danh sách đập</CCardHeader>
            <CCardBody>
                <CustomModal visible={addVisible} title={'Thêm đập'} body={addForm()} setVisible={(value) => setAddVisible(value)}/>
                <CustomModal visible={updateVisible} title={'Cập nhật đập'} body={updateForm(updateId)} setVisible={(value) => setUpdateVisible(value)}/>
                <CustomModal visible={deleteVisible} title={'Xóa người đập'} body={deleteForm(deleteIdDamId)} setVisible={(value) => setDeleteVisible(value)}/>
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
                                placeholder="Tên sông, kênh, rạch"
                                onChange={(e) => handleSetDamRiverName(e.target.value)}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                        <CCol md={12} lg={3}>
                            <CFormInput
                                className="mb-2"
                                type="text"
                                placeholder="Kích thước"
                                onChange={(e) => {
                                    // Present for height and capacity
                                    handleSetDamSize(e.target.value)
                                }}
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
              <CustomPagination listItems={filteredDams} showData={showFilteredTable} isLoaded={isLoadedDams} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>

    )
}

export default DamManagement
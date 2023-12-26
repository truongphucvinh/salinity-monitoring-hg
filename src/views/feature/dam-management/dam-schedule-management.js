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
import { setAuthApiHeader } from "src/services/global-axios"
import CustomPagination from "src/views/customs/my-pagination"
import CustomModal from "src/views/customs/my-modal"
import createToast from "src/views/customs/my-toast"
import { createFailIcon, createSuccessIcon } from "src/views/customs/my-icon"
import { createDamSchedule, createDamType, defaultDamStatusId, deleteDamType, getAllDamSchedules, getAllDamTypes, getDamScheduleId, getDamTypeById, updateDamSchedule, updateDamType } from "src/services/dam-services"
import CustomSpinner from "src/views/customs/my-spinner"
import CustomDateTimePicker from "src/views/customs/my-datetimepicker/my-datetimepicker"

const DamTypeManagement = ({damInstance}) => {
    

    // Dam Schedule Management
    const [listDamSchedules, setListDamSchedules] = useState([])
    const [isLoadedDamSchedules, setIsLoadedDamSchedules] = useState(false)
    const handleSetIsLoadedDamSchedules = (value) => {
        setIsLoadedDamSchedules(prev => {
            return { ...prev, isLoadedDamSchedules: value }
        })
    }
    useEffect(() => {
        handleSetIsLoadedDamSchedules(true)
    }, [listDamSchedules])
    
    // Call inital APIs
    const rebaseAllData = () => {
        if (JSON.parse(localStorage.getItem("_isAuthenticated"))) {
            // Setting up access token
            setAuthApiHeader()
            getAllDamSchedules()
            .then(res => {
                // Install filter users here
                const damSchedules = res?.data
                setListDamSchedules(damSchedules)
                setFilteredDamSchedules(damSchedules)
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
    const [filteredDamSchedules, setFilteredDamSchedules] = useState([])
    const initSearch = {
        damScheduleDay: "",
        damScheduleMonth: "",
        damScheduleYear: ""
    }
    const [searchState, setSearchState] = useState(initSearch)
    const {damScheduleDay,damScheduleMonth, damScheduleYear} = searchState
    const handleSetDamScheduleDay = (value) => {
        setSearchState(prev => {
            return {...prev, damScheduleDay: value}
        })
    }
    const handleSetDamScheduleMonth = (value) => {
        setSearchState(prev => {
            return {...prev, damScheduleMonth: value}
        })
    }
    const handleSetDamScheduleYear = (value) => {
        setSearchState(prev => {
            return {...prev, damScheduleYear: value}
        })
    }
    const onFilter = () => {
        if (damScheduleDay || damScheduleMonth || damScheduleYear) {
            setFilteredDamSchedules(listDamSchedules)
            if (damScheduleYear) {
                setFilteredDamSchedules(prev => {
                    return prev.filter(damSchedule => damSchedule?.damScheduleBeginAt[0] === parseFloat(damScheduleYear))
                })
            }
            if (damScheduleMonth) {
                setFilteredDamSchedules(prev => {
                    return prev.filter(damSchedule => damSchedule?.damScheduleBeginAt[1] === parseFloat(damScheduleMonth))
                })
            }
            if (damScheduleDay) {
                setFilteredDamSchedules(prev => {
                    return prev.filter(damSchedule => damSchedule?.damScheduleBeginAt[2] === parseFloat(damScheduleDay))
                })
            }
        }else {
            onReset()
        }
    }
    const onReset = () => {
        setFilteredDamSchedules(listDamSchedules)
    }
    // Toast
    const [toast, addToast] = useState(0)
    const toaster = useRef()


    // Pagination + Filtering
    const showFilteredTable = (filteredDamSchedules, duration, isLoaded) => {
        return (
            <>
                {
                    !isLoaded ? <CustomSpinner /> :
                    <CTable bordered align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '5%'}}>#</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '30%'}}>Diễn giải</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '20%'}}>Ngày mở</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '20%'}}>Ngày đóng</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '25%'}}>Thao tác</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        filteredDamSchedules?.length !== 0 ? filteredDamSchedules.map((damSchedule, index) => {
                            return (
                                <CTableRow key={damSchedule?.damScheduleId}>
                                    <CTableDataCell>{index + 1 + duration}</CTableDataCell>
                                    <CTableDataCell>{damSchedule?.damScheduleDescription}</CTableDataCell>
                                    <CTableDataCell>{`${damSchedule?.damScheduleBeginAt[0]}-${damSchedule?.damScheduleBeginAt[1]}-${damSchedule?.damScheduleBeginAt[2]} lúc ${damSchedule?.damScheduleBeginAt[3]}:${damSchedule?.damScheduleBeginAt[4]}:${damSchedule?.damScheduleBeginAt[5]}`}</CTableDataCell>
                                    <CTableDataCell>{`${damSchedule?.damScheduleEndAt[0]}-${damSchedule?.damScheduleEndAt[1]}-${damSchedule?.damScheduleEndAt[2]} lúc ${damSchedule?.damScheduleEndAt[3]}:${damSchedule?.damScheduleEndAt[4]}:${damSchedule?.damScheduleEndAt[5]}`}</CTableDataCell>
                                    <CTableDataCell>
                                        <CIcon icon={cilTouchApp} 
                                            // onClick={() => openDamDetail(damSchedule?.damScheduleId)} 
                                            className="text-primary mx-1" role="button"
                                        />
                                        <CIcon icon={cilPencil} 
                                            // onClick={() => openUpdateModal(damSchedule?.damScheduleId)} 
                                            className="text-success mx-1" role="button"
                                        />
                                        <CIcon icon={cilTrash} 
                                            // onClick={() => openDeleteModal(damSchedule?.damScheduleId)}  
                                            className="text-danger" role="button"
                                        />
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
        addDamScheduleBeginAt: "",
        addDamScheduleEndAt: "",
        addDamScheduleDescription: "",
        addDamScheduleDamId: damInstance?.damScheduleId,
        addDamScheduleDamStatusId: defaultDamStatusId
    }
    const [addState, setAddState] = useState(addData)
    const {
        addDamScheduleBeginAt,
        addDamScheduleEndAt,
        addDamScheduleDescription,
        addDamScheduleDamId,
        addDamScheduleDamStatusId
    } = addState
    const [addValidated, setAddValidated] = useState(false)
    const handleSetAddDamScheduleBeginAt = (value) => {
        setAddState(prev => {
            return { ...prev, addDamScheduleBeginAt: value }
        })
    }
    const handleSetAddDamScheduleDescription = (value) => {
        setAddState(prev => {
            return { ...prev, addDamScheduleDescription: value }
        })
    }
    const handleSetAddDamScheduleEndAt = (value) => {
        setAddState(prev => {
            return { ...prev, addDamScheduleEndAt: value }
        })
    }
    const handleSetAddDamScheduleDamId = (value) => {
        setAddState(prev => {
            return { ...prev, addDamScheduleDamId: value }
        })
    }
    const handleSetAddDamScheduleDamStatusId = (value) => {
        setAddState(prev => {
            return { ...prev, addDamScheduleDamStatusId: value }
        })
    }

    const createNewDamSchedule = (e) => {
        // validation
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
        } else {
            const damSchedule = {
                damScheduleBeginAt: addDamScheduleBeginAt,
                damScheduleEndAt: addDamScheduleEndAt,
                damScheduleDescription: addDamScheduleDescription?.trim(),
                damScheduleDamId: addDamScheduleDamId,
                damScheduleDamStatusId: addDamScheduleDamStatusId 
            }
            createDamSchedule(damSchedule)
            .then(res => {
                setAddVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Thêm lịch mở đập',
                    content: 'Thêm lịch mở đập thành công',
                    icon: createSuccessIcon()
                }))
                setAddValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Thêm lịch mở đập',
                    content: "Thêm lịch mở đập không thành công",
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
                    onSubmit={e => createNewDamSchedule(e)} 
                    noValidate
                    validated={addValidated}
                >
                    <CRow>
                        <CCol lg={12}>
                            <CustomDateTimePicker 
                                value={addDamScheduleBeginAt}
                                setValue={handleSetAddDamScheduleBeginAt}
                                placeholder={'Ngày mở'}
                            /> 
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12}>
                            <CustomDateTimePicker 
                                value={addDamScheduleEndAt}
                                setValue={handleSetAddDamScheduleEndAt}
                                placeholder={'Ngày đóng'}
                            /> 
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12}>
                            <CFormTextarea
                                className="mt-4"
                                type="text"
                                placeholder="Mô tả lịch mở đập"
                                maxLength={250}
                                feedbackInvalid="Không bỏ trống và ít hơn 250 ký tự"
                                onChange={(e) => handleSetAddDamScheduleDescription(e.target.value)}
                                value={addDamScheduleDescription}
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
        updateDamScheduleId: "",
        updateDamScheduleBeginAt: "",
        updateDamScheduleEndAt: "",
        updateDamScheduleDescription: "",
        updateDamScheduleDamId: damInstance?.damScheduleId,
        updateDamScheduleDamStatusId: defaultDamStatusId
    }
    const [updateState, setUpdateState] = useState(updateData)
    const { 
        updateDamScheduleId,
        updateDamScheduleBeginAt,
        updateDamScheduleEndAt,
        updateDamScheduleDescription,
        updateDamScheduleDamIdmInstance,
        updateDamScheduleDamStatusId
    } = updateState
    const [updateValidated, setUpdateValidated] = useState(false)
    const getDamScheduleDataById = (damScheduleId) => {
        if (damScheduleId) {
            getDamScheduleId(damScheduleId)
            .then(res => {
                const damSchedule = res?.data
                if (damSchedule) {
                    const updateDamScheduleFetchData = {
                        updateDamScheduleId: damSchedule?.damScheduleId,
                        updateDamScheduleBeginAt: damSchedule?.damScheduleBeginAt,
                        updateDamScheduleEndAt: damSchedule?.damScheduleEndAt,
                        updateDamScheduleDescription: damSchedule?.damScheduleDescription,
                        updateDamScheduleDamId: damInstance?.damScheduleId,
                        updateDamScheduleDamStatusId: defaultDamStatusId
                    }
                    setUpdateState(updateDamScheduleFetchData)
                }else {
                    addToast(createToast({
                        title: 'Cập nhật lịch mở đập',
                        content: "Thông tin lịch mở đập không đúng",
                        icon: createFailIcon()
                    }))
                }
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Cập nhật lịch mở đập',
                    content: "Thông tin lịch mở đập không đúng",
                    icon: createFailIcon()
                }))
            })
        }
    }
    const openUpdateModal = (damScheduleId) => {
        getDamScheduleDataById(damTypeId)
        setUpdateVisible(true)
    }
    const handleSetUpdateDamScheduleBeginAt = (value) => {
        setAddState(prev => {
            return { ...prev, updateDamScheduleBeginAt: value }
        })
    }
    const handleSetUpdateDamScheduleDescription = (value) => {
        setAddState(prev => {
            return { ...prev, updateDamScheduleDescription: value }
        })
    }
    const handleSetUpdateDamScheduleEndAt = (value) => {
        setAddState(prev => {
            return { ...prev, updateDamScheduleEndAt: value }
        })
    }
    const updateADamSchedule = (e) => {
        // validation
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
        } else {
            const damSchedule = {
                damScheduleId: updateDamScheduleId,
                damScheduleBeginAt: updateDamScheduleBeginAt,
                damScheduleEndAt: updateDamScheduleEndAt,
                damScheduleDescription: updateDamScheduleDescription,
                damScheduleDamIdmInstance: updateDamScheduleDamIdmInstance,
                damScheduleDamStatusI: updateDamScheduleDamStatusId
            }
            updateDamSchedule(damSchedule)
            .then(res => {
                setUpdateVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Cập nhật lịch mở đập',
                    content: 'Cập nhật lịch mở đập thành công',
                    icon: createSuccessIcon()
                }))
                setUpdateValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Cập nhật lịch mở đập',
                    content: "Cập nhật lịch mở đập không thành công",
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
                        onSubmit={e => updateADamSchedule(e)} 
                        noValidate
                        validated={updateValidated}
                    >
                        <CRow>
                            <CCol lg={12}>
                                <CustomDateTimePicker 
                                    value={updateDamScheduleBeginAt}
                                    setValue={handleSetUpdateDamScheduleBeginAt}
                                    placeholder={'Ngày mở'}
                                /> 
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol lg={12}>
                                <CustomDateTimePicker 
                                    value={updateDamScheduleEndAt}
                                    setValue={handleSetUpdateDamScheduleEndAt}
                                    placeholder={'Ngày đóng'}
                                /> 
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol lg={12}>
                                <CFormTextarea
                                    className="mt-4"
                                    type="text"
                                    placeholder="Mô tả lịch mở đập"
                                    maxLength={250}
                                    feedbackInvalid="Không bỏ trống và ít hơn 250 ký tự"
                                    onChange={(e) => handleSetUpdateDamScheduleDescription(e.target.value)}
                                    value={updateDamScheduleDescription}
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
                    </CForm> : <CSpinner />
                }
            </>
        )
    }

    // Delete - fix here
    const deleteADamType = (damTypeId) => {
        if (damTypeId) {
            deleteDamType(damTypeId)
            .then(res => {
                setDeleteVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Xóa lịch mở đập',
                    content: 'Xóa lịch mở đập thành công',
                    icon: createSuccessIcon()
                }))
                setUpdateValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Xóa lịch mở đập',
                    content: "Xóa lịch mở đập không thành công",
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
                                <p>Bạn có chắc muốn xóa lịch mở đập này ?</p>
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

    return (
        <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CCardHeader>Danh sách lịch mở đập</CCardHeader>
            <CCardBody>
                <CustomModal visible={addVisible} title={'Thêm lịch mở đập'} body={addForm()} setVisible={(value) => setAddVisible(value)}/>
                <CustomModal visible={updateVisible} title={'Cập nhật lịch mở đập'} body={updateForm(updateDamTypeName)} setVisible={(value) => setUpdateVisible(value)}/>
                <CustomModal visible={deleteVisible} title={'Xóa người lịch mở đập'} body={deleteForm(deleteIdDamTypeId)} setVisible={(value) => setDeleteVisible(value)}/>
                <CForm onSubmit={onFilter}>
                    <CRow>
                        <CCol md={12} lg={3}>
                            <CFormInput
                                className="mb-2"
                                type="text"
                                placeholder="Tên lịch mở đập"
                                onChange={(e) => handleSetDamScheduleDay(e.target.value)}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                        <CCol md={12} lg={3}>
                            <CFormInput
                                className="mb-2"
                                type="text"
                                placeholder="Mô tả lịch mở đập"
                                onChange={(e) => handleSetDamScheduleMonth(e.target.value)}
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
              <CustomPagination listItems={filteredDamSchedules} showData={showFilteredTable} isLoaded={isLoadedDamSchedules} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
}

export default DamTypeManagement
import { cilLocationPin, cilMagnifyingGlass, cilReload } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react"
import React, { useEffect, useState } from "react"
import { getAllDamScheduleBySelectedDate } from "src/services/dam-services"
import { damStatusConverter, damStatusConverterV2, getDamScheduleBeginAt, getDamScheduleEndAt, searchRelatives } from "src/tools"
import CustomDateTimePicker from "src/views/customs/my-datetimepicker/my-datetimepicker"
import CustomPagination from "src/views/customs/my-pagination"
import CustomSpinner from "src/views/customs/my-spinner"

const HomePage = () => {

    const damListData = {
        listDams: [],
        isLoadedListDams: false,
        filteredListDams: []
    }
    const [damListState, setDamListState] = useState(damListData)
    const {listDams, isLoadedListDams, filteredListDams} = damListState
    const handleFilteredListDams = (value) => {
        setDamListState((prev) => {
            return {...prev, filteredListDams: value}
        })
    }
    const handleListDams = (value) => {
        setDamListState((prev) => {
            return {...prev, listDams: value}
        })
    }
    const handleIsLoadedDams = (value) => {
        setDamListState((prev) => {
            return {...prev, isLoadedListDams: value}
        })
    }
    const searchData = {
        damName: '',
        pickedDate: null
    }
    const [searchState, setSearchState] = useState(searchData)
    const {damName, pickedDate} = searchState
    const handleSetDamName = (value) => {
        setSearchState(prev => {
            return {...prev, damName: value}
        })
    }
    const handleSetPickedDate = (value) => {
        setSearchState(prev => {
            return {...prev, pickedDate: value}
        })
    }
    const rebaseAllData = () => {
        let currentDate = new Date()
        if (!pickedDate) {
            currentDate = currentDate.toISOString().split('T')[0]
            handleSetPickedDate(currentDate)
        }else {
            currentDate = pickedDate
        }
        getAllDamScheduleBySelectedDate(currentDate)
        .then((res) => {
            handleListDams(res?.data)
            handleFilteredListDams(res?.data)
            handleIsLoadedDams(true)
        })
        .catch((err) => {
            // Do nothing
        })
    }
    const onFilter = () => {
        if (damName) {
            handleFilteredListDams(listDams?.filter(dam => dam?.damName && searchRelatives(dam?.damName, damName)))
        }else {
            onReset()
        }
    }
    const onReset = () => {
        handleFilteredListDams(listDams)
    }
    useEffect(() => {
        rebaseAllData()
    }, [pickedDate]) // eslint-disable-line react-hooks/exhaustive-deps
    
    const searchComponent = () => {
        return (
            <CForm onSubmit={onFilter}>
                <CRow>
                    <CCol md={12} lg={3}>
                        <CustomDateTimePicker 
                            classes='mb-2' 
                            placeholder={'Ngày xây dựng'}
                            value={pickedDate}
                            setValue={handleSetPickedDate}
                        />
                    </CCol>
                    <CCol md={12} lg={3}>
                        <CFormInput
                            className="mb-2"
                            type="text"
                            placeholder="Tên đập"
                            onChange={(e) => handleSetDamName(e.target.value)}
                            aria-describedby="exampleFormControlInputHelpInline"
                            value={damName}
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
        )
    }
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
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '15%'}}>Trạng thái</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '40%'}}>Thời gian</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '25%'}}>Vị trí</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        filteredDams?.length !== 0 ? filteredDams.map((dam, index) => {
                            return (
                                <CTableRow key={dam?.damId}>
                                    <CTableDataCell>{index + 1 + duration}</CTableDataCell>
                                    <CTableDataCell>{dam?.damName}</CTableDataCell>
                                    <CTableDataCell className={`text-${damStatusConverterV2(dam?.damCurrentStatus)?.class}`}><CIcon icon={damStatusConverterV2(dam?.damCurrentStatus)?.icon} className="me-2"/>{damStatusConverterV2(dam?.damCurrentStatus)?.status}</CTableDataCell>
                                    <CTableDataCell>
                                        {
                                            dam?.damSchedulesAtThisDate && dam?.damSchedulesAtThisDate.map((damSchedule, index) => {
                                                return (
                                                    <div key={index}>
                                                        Từ <strong>{getDamScheduleBeginAt(damSchedule)}</strong> đến <strong>{getDamScheduleEndAt(damSchedule)}</strong>
                                                    </div>
                                                )
                                            }) 
                                        }
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        <a href={`https://www.google.com/maps/search/?api=1&query=${dam?.damLatitude},${dam?.damLongitude}`} target="_blank" rel="noopener noreferrer">
                                            Xem vị trí
                                        </a>
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
    
    return (
        <CRow>
            <CCol xs>
                <CCard className="mb-4">
                    <CCardHeader>
                        Lịch mở cống / đập
                    </CCardHeader>
                    <CCardBody>
                        { searchComponent() }
                        <br/>
                        {
                            // Viết API 
                            // Ráp Pagination vô
                            // Làm hàm search theo ngày
                            // Mới vô là ngày hôm nay --> rebase
                            // Chọn ngày riêng với tìm tên
                            // 
                        }
                        <CustomPagination
                            listItems={filteredListDams}
                            showData={showFilteredTable} 
                            isLoaded={isLoadedListDams}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default HomePage
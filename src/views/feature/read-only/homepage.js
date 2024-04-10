import { cilLocationPin, cilMagnifyingGlass, cilReload } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react"
import React, { useEffect, useState } from "react"
import { getAllDamScheduleBySelectedDate, getAllDamSchedules } from "src/services/dam-services"
import { damStatusConverter, damStatusConverterV2, getDamScheduleBeginAt, getDamScheduleEndAt, searchRelatives } from "src/tools"
import CustomDateTimePicker from "src/views/customs/my-datetimepicker/my-datetimepicker"
import CustomIntroduction from "src/views/customs/my-introduction"
import CustomModal from "src/views/customs/my-modal"
import CustomPagination from "src/views/customs/my-pagination"
import CustomSpinner from "src/views/customs/my-spinner"

//service 
import station from "src/services/station"
import observation from "src/services/observation"

const HomePage = () => {
    const defaultPageCode="U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dms_page_homepage"
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
    const onFilter = (e) => {
        e.preventDefault()
        if (damName) {
            handleFilteredListDams(listDams?.filter(dam => dam?.damName && searchRelatives(dam?.damName, damName)))
        }else {
            onReset()
        }
    }
    const onReset = () => {
        handleFilteredListDams(listDams)
    }
    const [damVisible, setDamVisible] = useState(false)
    const [openedDam, setOpenedDam] = useState(null)
    const [openedDamSchedules, setOpenedDamSchedules] = useState([])
    const [isLoadedOpenedDamSchedules, setIsLoadedOpenedDamSchedules] = useState(false)
    const getAllDamSchedulesByDamId = (damId) => {
        getAllDamSchedules(damId)
        .then((res) => {
            if (res?.data) {
                setOpenedDamSchedules(res?.data)
            }
        })
        .catch((err) => {
            // Do nothing
        })
    }
    const openDamModal = (dam) => {
        setOpenedDam(dam)
        getAllDamSchedulesByDamId(dam?.damId)
        setDamVisible(true)
    }
    const damScheduleInfo = (damSchedules) => {
        return (<>
            <CTable>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Lịch mở cống / đập</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        damSchedules?.length > 0 ? damSchedules?.filter((damSchedule) => {
                            return damSchedule?.damScheduleIsLock === false
                        }).map((damSchedule, index) => {
                            return <CTableRow key={index}>
                                <CTableDataCell>
                                    Từ
                                    <strong className="text-success">
                                        {' '}{getDamScheduleBeginAt(damSchedule)}
                                    </strong> đến 
                                    <strong className="text-success">
                                        {' '}{getDamScheduleEndAt(damSchedule)}
                                    </strong>
                                </CTableDataCell>
                            </CTableRow>
                        }) : <CTableRow>
                            <CTableDataCell>Không có</CTableDataCell>
                        </CTableRow>
                    }
                </CTableBody>
            </CTable>
        </>)
    }
    const damInfo = () => {
        return (
            <>{
                openedDam ?<> <CTable>
                    <CTableBody>
                        <CTableRow>
                            <CTableHeaderCell>Tên cống / đập</CTableHeaderCell>
                            <CTableDataCell>{openedDam?.damName}, {openedDam?.damRiverName}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                            <CTableHeaderCell>Kích thước</CTableHeaderCell>
                            <CTableDataCell>{openedDam?.damHeight} (m) x {openedDam?.damCapacity} (m)</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                            <CTableHeaderCell>Mô tả</CTableHeaderCell>
                            <CTableDataCell>{openedDam?.damDescription}</CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                </CTable> 
                <CustomPagination 
                    listItems={openedDamSchedules}
                    showData={damScheduleInfo}
                    isLoaded={isLoadedOpenedDamSchedules}
                />
                </>: <CSpinner/>
            }</>
        )
    }
    useEffect(() => {
        rebaseAllData()
    }, [pickedDate]) // eslint-disable-line react-hooks/exhaustive-deps
    
    const searchComponent = () => {
        return (
            <CForm onSubmit={e => onFilter(e)}>
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
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '20%'}}>Tên đập</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '15%'}}>Trạng thái</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '45%'}}>Thời gian</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '15%'}}>Vị trí</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        filteredDams?.length !== 0 ? filteredDams.map((dam, index) => {
                            return (
                                <CTableRow key={dam?.damId}>
                                    <CTableDataCell>{index + 1 + duration}</CTableDataCell>
                                    <CTableDataCell>
                                        <a className="link-opacity-100" role="button" onClick={() => openDamModal(dam)}>
                                            {dam?.damName}, {dam?.damRiverName}
                                        </a>
                                    </CTableDataCell>
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
                                        {
                                            dam?.damSchedulesAtThisDate?.length === 0 ? "Không có" : ""
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

    const addZero = (no) => {
        return no < 10 ? '0' + no : no;
    }

    // SENSOR STATION
    const [rynanStationList, setRynanStationList] = useState([]);
    useEffect(() => {
        //get Rynan station list 
        station.getStationListByRyan()
            .then((res) => {
                setRynanStationList(res.data);
                res.data.map((station) => {
                    var currentDate = new Date();
                    var dateStr = `${currentDate.getFullYear()}/${addZero(currentDate.getMonth()+1)}/${addZero(currentDate.getDate())}`;
                    observation.getDataStation(station?.so_serial, "2024/01/01", dateStr, 1, 100000000)
                        .then((seperatedRes) => {
                            var sensorList = [];
                            for(const sensor in seperatedRes.data[0]) {
                                if(sensor !== "trang_thai" && !isNaN(seperatedRes.data[0][sensor]) && seperatedRes.data[0][sensor] !== null) {
                                    var ltsTime = new Date(seperatedRes.data[seperatedRes.data.length-1].ngay_gui)
                                    var dateStr = addZero(ltsTime.getHours()) + ":" + addZero(ltsTime.getMinutes()) + ":" + addZero(ltsTime.getSeconds()) + ", " + addZero(ltsTime.getDate()) + '/' + addZero(ltsTime.getMonth()+1) + "/" + ltsTime.getFullYear();
                                    let sensorInfo = {
                                        name: sensor, 
                                        value: seperatedRes.data[seperatedRes.data.length-1][sensor],
                                        time: dateStr
                                    }
                                    sensorList.push(sensorInfo);
                                }
                            }
                            var x=seperatedRes;
                            x.sensor = sensorList;
                            return x;
                        })
                        .then((sensor) => {
                            station.sensor = sensor;
                            return station;
                        })
                        .then((station) => {
                            setRynanStationList([station]);
                        })
                    
                })
            })
    }, [])

    const showSensorStationList = () => {
        return <>
            <CTable bordered align="middle" className="mb-0 border" hover responsive>
                <CTableHead  className="text-nowrap">
                    <CTableRow>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '5%'}}>STT</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '25%'}}>Tên trạm</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '30%'}}>Cảm biến</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '25%'}}>Giá trị </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '20%'}}>Thời gian</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        rynanStationList.map((station, stationIndex) => {
                            return station?.sensor?.sensor?.map((sensor, sensorIndex) => {
                                if(sensorIndex==0) {
                                    return <CTableRow key={sensorIndex}>
                                        <CTableDataCell rowSpan={station?.sensor?.sensor?.length}>{ stationIndex+1 }</CTableDataCell>
                                        <CTableDataCell rowSpan={station?.sensor?.sensor?.length}>{ station.ten_thiet_bi }</CTableDataCell>
                                        <CTableDataCell>{ sensor.name }</CTableDataCell>
                                        <CTableDataCell>{ sensor.value }</CTableDataCell>
                                        <CTableDataCell>{ sensor.time }</CTableDataCell>
                                    </CTableRow>
                                } else {
                                    return <CTableRow key={sensorIndex}>
                                        <CTableDataCell>{ sensor.name }</CTableDataCell>
                                        <CTableDataCell>{ sensor.value }</CTableDataCell>
                                        <CTableDataCell>{ sensor.time }</CTableDataCell>
                                    </CTableRow>
                                }
                            })
                        })
                    }
                {/* {
                        rynanStationList.map((station, index) => {
                            return <CTableRow key={index}>
                            <CTableDataCell rowSpan={2}>{index}</CTableDataCell>
                            <CTableDataCell rowSpan={2}>Tên trạm</CTableDataCell>
                            <CTableDataCell>12</CTableDataCell>
                            <CTableDataCell>Giá trị </CTableDataCell>
                            <CTableDataCell>Thời gian</CTableDataCell>
                        </CTableRow>
                        })
                } */}
                    {/* <CTableRow>
                        <CTableDataCell>d</CTableDataCell>
                        <CTableDataCell>12</CTableDataCell>
                        <CTableDataCell>3</CTableDataCell>
                    </CTableRow> */}
                </CTableBody>
            </CTable>
        </>
    }
    
    return (
        <>
        <CustomIntroduction 
            pageCode={defaultPageCode}
        />
        <CRow>
            <CCol xs>
                <CCard className="mb-4">
                    <CCardHeader>
                        Lịch mở cống / đập
                    </CCardHeader>
                    <CCardBody>
                        <CustomModal visible={damVisible} title={'Thông tin cống / đập'} body={damInfo()} setVisible={(value) => setDamVisible(value)}/>
                        { searchComponent() }
                        <br/>
                        <CustomPagination
                            listItems={filteredListDams}
                            showData={showFilteredTable} 
                            isLoaded={isLoadedListDams}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>

        {/* SENSOR STATION */}
        <CRow>
            <CCol xs>
                <CCard className="mb-4">
                    <CCardHeader>
                        Thông tin trạm cảm biến
                    </CCardHeader>
                    <CCardBody>
                        { showSensorStationList() }
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
        </>
    )
}

export default HomePage
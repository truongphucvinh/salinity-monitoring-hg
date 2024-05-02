import { cilLocationPin, cilMagnifyingGlass, cilReload } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CModal } from "@coreui/react"
import React, { useEffect, useState } from "react"
import { getAllDamScheduleBySelectedDate, getAllDamSchedules } from "src/services/dam-services"
import { damStatusConverter, damStatusConverterV2, getDamScheduleBeginAt, getDamScheduleEndAt, searchRelatives } from "src/tools"
import CustomDateTimePicker from "src/views/customs/my-datetimepicker/my-datetimepicker"
import CustomIntroduction from "src/views/customs/my-introduction"
import CustomModal from "src/views/customs/my-modal"
import CustomPagination from "src/views/customs/my-pagination"
import CustomSpinner from "src/views/customs/my-spinner"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom';
import './homepage.scss';

//service 
import stationService from "src/services/station"
import observationService from "src/services/observation"
import newsService from "src/services/news-service"

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
        stationService.getStationListByRyan()
            .then((res) => {
                setRynanStationList(res.data);
                res.data.map((station) => {
                    var currentDate = new Date();
                    var dateStr = `${currentDate.getFullYear()}/${addZero(currentDate.getMonth()+1)}/${addZero(currentDate.getDate())}`;
                    observationService.getDataStation(station?.so_serial, "2024/01/01", dateStr, 1, 100000000)
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

    const navigate = useNavigate()
    const handelDirectToDetail = (serialStation) => {
        navigate(`/station-list/station-detail/${serialStation}`);
    }

    // homepage interface after back from detailed news
    useEffect(() => {
        var openedCode = sessionStorage.getItem("openedCode");
        if(openedCode) {
            const element = document.getElementById("news");
            element?.scrollIntoView({ behavior: 'smooth' });
            if(openedCode === '1') {
                setVisibleAllNews(true);
            }
            sessionStorage.removeItem("openedCode");
        }
    }, [])

    const showSensorStationList = () => {
        return <>
            <CTable bordered align="middle" className="mb-0 border" responsive>
                <CTableHead  className="text-nowrap">
                    <CTableRow>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '5%'}}>STT</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '30%'}}>Trạm</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '25%'}}>Cảm biến</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '20%'}}>Giá trị </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '25%'}}>Thời gian</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        rynanStationList.map((station, stationIndex) => {
                            return station?.sensor?.sensor?.map((sensor, sensorIndex) => {
                                if(sensorIndex==0) {
                                    return <CTableRow key={sensorIndex}>
                                        <CTableDataCell rowSpan={station?.sensor?.sensor?.length}>{ stationIndex+1 }</CTableDataCell>
                                        <CTableDataCell rowSpan={station?.sensor?.sensor?.length}>
                                            <span 
                                                style={{cursor: 'pointer'}}
                                                onClick={() => handelDirectToDetail(station?.so_serial)}
                                            >
                                                <b>{ station.ten_thiet_bi }</b>
                                            </span> <br/>
                                            { station.khu_vuc_lap_dat }
                                        </CTableDataCell>
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
                </CTableBody>
            </CTable>
        </>
    }


    //NEWS
    const [newsList, setNewsList] = useState([]);
    const [latestNews, setLatestNews] = useState([]);
    const [visibleAllNews, setVisibleAllNews] = useState(true);

    useEffect(() => {
        newsService.getAllNews()
            .then((res) => {
                console.log("this is posts api", res);
                setNewsList(res);
                setLatestNews([...res].splice(1, 5));
                
                //fake data
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    const handleVisibleAllnews = () => {
        setVisibleAllNews(true);
    }

    const handleDirectNewsDetail = (newsId, openedCode) => { //openedCode: 0: open from show, 1 open from all-news
        navigate(`news/${newsId}`);
        sessionStorage.setItem('openedCode', openedCode);
    }

    const renderNews = () => {
        return <>
            <CRow >
                <CCol>
                    <CCard className="mb-4">
                        <CCardHeader className="news-header">
                            <div className="news-header__title">Tin tức mới nhất</div>
                            {
                                newsList.length >= 0 && 
                                    <div className="news-header__view-more" 
                                        onClick={() => handleVisibleAllnews()}
                                    >
                                        Xem tất cả
                                    </div>
                            }
                        </CCardHeader>
                        <CCardBody>
                            {/* { showNews() } */}
                            <div className="news" id="news">
                                {
                                    newsList.length !== 0 ? 
                                        <div className="news__image-list">
                                            <div className="news__image-list__item" onClick={() => {handleDirectNewsDetail(1, 0)}}>
                                                {/* <div className="news__image-list__item__image"> */}
                                                <div>
                                                    <img src="https://vcdn1-dulich.vnecdn.net/2022/04/01/MaPiLengHaGiangVnExpress-16488-3513-7729-1648806038.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=lFRvWQkOmXNG_PtKd7ylvw" alt="image error" />
                                                {/* </div> */}
                                                </div>
                                                <div className="news__image-list__item__title">
                                                    Tin tức 1
                                                </div>
                                                <div className="news__image-list__item__brief">
                                                    Tóm tắt tin tức 1
                                                </div>
                                            </div>
                                            <div className="news__image-list__item" onClick={() => {handleDirectNewsDetail(1, 0)}}>
                                                {/* <div className="news__image-list__item__image"> */}
                                                <div>
                                                    <img src="https://vcdn1-dulich.vnecdn.net/2022/04/01/MaPiLengHaGiangVnExpress-16488-3513-7729-1648806038.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=lFRvWQkOmXNG_PtKd7ylvw" alt="image error" />
                                                {/* </div> */}
                                                </div>
                                                <div className="news__image-list__item__title">
                                                    Tin tức 1
                                                </div>
                                                <div className="news__image-list__item__brief">
                                                    Tóm tắt tin tức 1
                                                </div>
                                            </div>
                                            <div className="news__image-list__item" onClick={() => {handleDirectNewsDetail(1, 0)}}>
                                                {/* <div className="news__image-list__item__image"> */}
                                                <div>
                                                    <img src="https://vcdn1-dulich.vnecdn.net/2022/04/01/MaPiLengHaGiangVnExpress-16488-3513-7729-1648806038.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=lFRvWQkOmXNG_PtKd7ylvw" alt="image error" />
                                                {/* </div> */}
                                                </div>
                                                <div className="news__image-list__item__title">
                                                    Tin tức 1
                                                </div>
                                                <div className="news__image-list__item__brief">
                                                    Tóm tắt tin tức 1
                                                </div>
                                            </div>
                                            <div className="news__image-list__item" onClick={() => {handleDirectNewsDetail(1, 0)}}>
                                                {/* <div className="news__image-list__item__image"> */}
                                                <div>
                                                    <img src="https://vcdn1-dulich.vnecdn.net/2022/04/01/MaPiLengHaGiangVnExpress-16488-3513-7729-1648806038.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=lFRvWQkOmXNG_PtKd7ylvw" alt="image error" />
                                                {/* </div> */}
                                                </div>
                                                <div className="news__image-list__item__title">
                                                    Tin tức 1
                                                </div>
                                                <div className="news__image-list__item__brief">
                                                    Tóm tắt tin tức 1
                                                </div>
                                            </div>
                                        </div>
                                    :
                                        <div style={{textAlign: 'center'}}>Chưa có tin tức được cập nhật</div>
                                }
                                
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    }

    const renderNewsListModal = () => {
        return <>
            <CModal
                backdrop="static"
                alignment="center"
                visible={visibleAllNews}
                onClose={() => setVisibleAllNews(false)}
                aria-labelledby="StaticBackdropExampleLabel"
                size="xl"
            >
                <div className="all-news-modal">
                    <div className="all-news-modal__header">
                        <div className="all-news-modal__header__title">
                            <span>Tin tức</span>
                            {/* <div className="all-news-modal__header__title__search-input">
                                <FontAwesomeIcon icon={faMagnifyingGlass} /> |
                                <input type="text" />
                            </div> */}
                        </div>
                        <div className="all-news-modal__header__close" onClick={() => setVisibleAllNews(false)}>
                            <FontAwesomeIcon icon={faXmark}/>
                        </div>
                    </div>
                    <div className="all-news-modal__list">
                        <div className="virtual">
                            <div className="all-news-modal__list__item" onClick={() => {handleDirectNewsDetail(1, 1)}}>
                                <div className="all-news-modal__list__item__image">
                                    <img src="https://vcdn1-dulich.vnecdn.net/2022/04/01/MaPiLengHaGiangVnExpress-16488-3513-7729-1648806038.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=lFRvWQkOmXNG_PtKd7ylvw" alt="image error" />
                                </div>
                                <div className="all-news-modal__list__item__info">
                                    <div className="all-news-modal__list__item__info__title">Tin tức</div>
                                    <div className="all-news-modal__list__item__info__brief">Tóm tắt tin tức 1</div>
                                </div>
                            </div>
                            <div className="all-news-modal__list__item">
                                <div className="all-news-modal__list__item__image">
                                    <img src="https://vcdn1-dulich.vnecdn.net/2022/04/01/MaPiLengHaGiangVnExpress-16488-3513-7729-1648806038.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=lFRvWQkOmXNG_PtKd7ylvw" alt="image error" />
                                </div>
                                <div className="all-news-modal__list__item__info">
                                    <div className="all-news-modal__list__item__info__title">Tin tức</div>
                                    <div className="all-news-modal__list__item__info__brief">Tóm tắt tin tức 1</div>
                                </div>
                            </div>
                            <div className="all-news-modal__list__item">
                                <div className="all-news-modal__list__item__image">
                                    <img src="https://vcdn1-dulich.vnecdn.net/2022/04/01/MaPiLengHaGiangVnExpress-16488-3513-7729-1648806038.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=lFRvWQkOmXNG_PtKd7ylvw" alt="image error" />
                                </div>
                                <div className="all-news-modal__list__item__info">
                                    <div className="all-news-modal__list__item__info__title">Tin tức</div>
                                    <div className="all-news-modal__list__item__info__brief">Tóm tắt tin tức 1</div>
                                </div>
                            </div>
                            <div className="all-news-modal__list__item">
                                <div className="all-news-modal__list__item__image">
                                    <img src="https://vcdn1-dulich.vnecdn.net/2022/04/01/MaPiLengHaGiangVnExpress-16488-3513-7729-1648806038.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=lFRvWQkOmXNG_PtKd7ylvw" alt="image error" />
                                </div>
                                <div className="all-news-modal__list__item__info">
                                    <div className="all-news-modal__list__item__info__title">Tin tức</div>
                                    <div className="all-news-modal__list__item__info__brief">Tóm tắt tin tức 1</div>
                                </div>
                            </div>
                            <div className="all-news-modal__list__item">
                                <div className="all-news-modal__list__item__image">
                                    <img src="https://vcdn1-dulich.vnecdn.net/2022/04/01/MaPiLengHaGiangVnExpress-16488-3513-7729-1648806038.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=lFRvWQkOmXNG_PtKd7ylvw" alt="image error" />
                                </div>
                                <div className="all-news-modal__list__item__info">
                                    <div className="all-news-modal__list__item__info__title">Tin tức</div>
                                    <div className="all-news-modal__list__item__info__brief">Tóm tắt tin tức 1</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CModal>
        </>
    }
    
    return (
        <>
        <CustomIntroduction 
            title={'HỆ THỐNG GIÁM SÁT ĐỘ MẶN VÀ LỊCH ĐÓNG MỞ CỐNG / ĐẬP'}
            content={'Hệ thống hỗ trợ quản lý các thông tin về lịch đóng / mở của hệ thống cống / đập và cảm biến trên địa bàn tỉnh Hậu Giang'}
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

        {/* NEWS */}
        { renderNews() }

        {/* MORE NEWS */}
        { renderNewsListModal() }

        </>
    )
}

export default HomePage
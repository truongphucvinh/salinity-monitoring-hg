import { cilLocationPin, cilMagnifyingGlass, cilReload } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CModal, CFormCheck } from "@coreui/react"
import React, { useEffect, useRef, useState } from "react"
import { getAllDamScheduleBySelectedDate, getAllDamSchedules, getAllDams } from "src/services/dam-services"
import { convertDateFormat, damStatusConverter, damStatusConverterV2, getDamScheduleBeginAt, getDamScheduleEndAt, getDatetimeFromDB, searchRelatives } from "src/tools"
import CustomDateTimePicker from "src/views/customs/my-datetimepicker/my-datetimepicker"
import CustomIntroduction from "src/views/customs/my-introduction"
import CustomModal from "src/views/customs/my-modal"
import CustomPagination from "src/views/customs/my-pagination"
import CustomSpinner from "src/views/customs/my-spinner"
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import './homepage.scss';
import clsx from "clsx";
import styles from "./homepage.module.css";

// Icons for Sticky Menu
import mapItem from "../../../icons/mapItem.png";
import scheduleItem from "../../../icons/scheduleItem.png";
import sensorItem from "../../../icons/sensorItem.png";
import newsItem from "../../../icons/newsItem.png";
import menu from "../../../icons/menu.png";

//service 
import station from "src/services/station"
import observation from "src/services/observation"
import newsService from "src/services/news-service"
import CustomAPIMap from "src/views/customs/my-google-map-api"

import { generateSensorName } from "src/tools"

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
    const [damList, setDamList] = useState(null)
    const [damMarkers, setDamMarkers] = useState(null)
    const [mapViewMode, setMapViewMode] = useState(1)
    const [sensorList, setSensorList] = useState(null)
    const [sensorMarkers, setSensorMarkers] = useState(null)
    const [commonMarkers, setCommonMarkers] = useState(null)
    // 1 -> All, 2 -> Just dams, 3 -> Just stations
    const handleSetMapViewMode = (value) => {
        if ([1,2,3]?.includes(value)) {
            setMapViewMode(value)
            if (value === 1) {
                setCommonMarkers([...damMarkers, ...sensorMarkers])
            } else if (value === 2) {
                setCommonMarkers([...damMarkers])
            } else {
                setCommonMarkers([...sensorMarkers])
            }
        }
    }
    const damToMarker = (dam) => {
        let renderDamMarker = <>
            <h4>{dam?.damName}</h4>
            <div>{dam?.damRiver?.riverName}</div>
            <div>Trạng thái: <strong>{damStatusConverterV2(dam?.damCurrentStatus?.damStatusName)?.status}</strong></div>
            <div>Ngày xây dựng: <strong>{getDatetimeFromDB(dam?.damConstructedAt)}</strong></div>
            <div>Chiều dài: <strong>{dam?.damHeight}</strong> mét</div>
            <div>Chiều rộng: <strong>{dam?.damCapacity}</strong> mét</div>
            <div>Địa điểm: <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${dam?.damLatitude},${dam?.damLongitude}`}>Xem vị trí</a></div>
        </>
        let damMarker = {
            id: dam?.damId,
            name: renderDamMarker,
            position: {lat: dam?.damLatitude, lng: dam?.damLongitude},
            customMarker: "dam"
        }
        return damMarker
    }
    const sensorToMarker = (sensor) => {
        let renderMarker = <>
            <h4>{sensor?.ten_thiet_bi}</h4>
            <div>{sensor?.khu_vuc_lap_dat}</div>
            <div>Trạng thái: <strong>{sensor?.trang_thai === 1 ? 'THỰC THI' : 'TẠM DỪNG'}</strong></div>
            <div>Ngày lặp đặt: <strong>{convertDateFormat(sensor?.ngay_lap_dat)}</strong></div>
            <div>Địa điểm: <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${sensor?.vi_do},${sensor?.kinh_do}`}>Xem vị trí</a></div>
        </>
        let marker = {
            id: sensor?.ma_thiet_bi,
            name: renderMarker,
            position: {lat: sensor?.vi_do, lng: sensor?.kinh_do},
            customMarker: ".station"
        }
        return marker
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
        getAllDams()
        .then(res => {
            const dams = res?.data
            if (dams) {
                setDamList(dams)
                let damMarkersList = dams?.map(dam => {
                    return damToMarker(dam)
                }) 
                setDamMarkers(dams)
                setDamMarkers(damMarkersList)
                station.getStationListByRynanNewVersion()
                .then(res => {
                    const sensors = res?.data
                    let sensorMarkerList = sensors?.map(sensor => {
                        return sensorToMarker(sensor)
                    })
                    setSensorList(sensors)
                    setSensorMarkers(sensorMarkerList)
                    
                    if (damMarkersList && sensorMarkerList) {
                        setCommonMarkers([...damMarkersList, ...sensorMarkerList])
                    }
                })
                .catch(err => {
                    // Do nothing
                })
            }
        }) 
        .catch(err => {
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
                        <CTableHeaderCell>Lịch đóng mở cống / đập</CTableHeaderCell>
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
                            <CTableDataCell>Chưa có</CTableDataCell>
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
                                            dam?.damSchedulesAtThisDate?.length === 0 ? "Chưa có" : ""
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
    const [error, setError] = useState(false);
    const [errorCode, setErrorCode] = useState();
    const [rynanStationList, setRynanStationList] = useState([]);
    useEffect(() => {
        //get Rynan station list 
        station.getStationListByRyan()
            .then((res) => {
                setRynanStationList([...res.data]);
                res.data.map((station) => {
                    var currentDate = new Date();
                    var dateStr = `${currentDate.getFullYear()}/${addZero(currentDate.getMonth()+1)}/${addZero(currentDate.getDate())}`;
                    observation.getDataStation(station?.so_serial, dateStr, dateStr, 1, 100000000)
                        .then((seperatedRes) => {
                            // filter how many sensor in station
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
                            var x = {sensor: []};
                            x.sensor = sensorList;
                            return x;
                        })
                        .then((sensor) => {
                            station.sensor = sensor;
                            return station;
                        })
                        .then((station) => {
                            setRynanStationList([...res.data]);
                        })
                        .catch((error) => {
                            setErrorCode(error?.response?.status);
                            setError(true);
                        })
                })
            })
            .catch((error) => {
                setErrorCode(error?.response?.status);
                setError(true);
            })
    }, [])

    const navigate = useNavigate()
    const handelDirectToDetail = (serialStation) => {
        navigate(`/station-list/station-detail/${serialStation}`);
    }

    const showSensorStationList = () => {
        return <>
            <CTable bordered align="middle" className="mb-0 border sensor-station-list" responsive>
                <CTableHead  className="text-nowrap">
                    <CTableRow>
                        <CTableHeaderCell className="bg-body-tertiary sensor-station-list__no" style={{'width' : '5%'}}>#</CTableHeaderCell>
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
                                        return <CTableRow key={station?.so_serial+sensorIndex}>
                                            <CTableDataCell className="sensor-station-list__no" style={{'width' : '5%'}} rowSpan={station?.sensor?.sensor?.length}>{ stationIndex+1 }</CTableDataCell>
                                            <CTableDataCell className="sensor-station-list__name" style={{'width' : '30%'}} rowSpan={station?.sensor?.sensor?.length}>
                                                <span 
                                                    style={{cursor: 'pointer'}}
                                                    onClick={() => handelDirectToDetail(station?.so_serial)}
                                                >
                                                    <span className="name">{ station.ten_thiet_bi }</span>
                                                </span> <br/>
                                                { station.khu_vuc_lap_dat }
                                            </CTableDataCell>
                                            <CTableDataCell style={{'width' : '25%'}}>{ generateSensorName(sensor.name) }</CTableDataCell>
                                            <CTableDataCell style={{'width' : '20%'}}>{ sensor.value }</CTableDataCell>
                                            <CTableDataCell style={{'width' : '25%'}} rowSpan={station?.sensor?.sensor?.length}>{ sensor.time }</CTableDataCell>
                                        </CTableRow>
                                    } else {
                                        return <CTableRow key={sensorIndex}>
                                            <CTableDataCell style={{'width' : '25%'}}>{ generateSensorName(sensor.name) }</CTableDataCell>
                                            <CTableDataCell style={{'width' : '20%'}}>{ sensor.value }</CTableDataCell>
                                        </CTableRow>
                                    }
                                })
                            })
                        }
                    </CTableBody>
            </CTable>
        </>
    }

    // NEWS
    // homepage interface after back from detailed news
    useEffect(() => {
        setTimeout(() => {
            var openedCode = sessionStorage.getItem("openedCode");
            if(openedCode) {
                const element = document.getElementById("news");
                element?.scrollIntoView({ behavior: 'smooth' });
                if(openedCode === '1') {
                    setVisibleAllNews(true);
                }
                sessionStorage.removeItem("openedCode");
            }
        }, 700)
    }, [])

    const [newsList, setNewsList] = useState([]);
    const [latestNews, setLatestNews] = useState([]);

    const [filterNewsList, setFilterNewsList] = useState([]);
    const [visibleAllNews, setVisibleAllNews] = useState(false);
    const [visibleInputSearch, setVisibleInputSearch] = useState(false);

    useEffect(() => {
        newsService.getAllNews()
            .then((res) => {
                setNewsList([...res]);
                setFilterNewsList([...res])
                setLatestNews([...res].splice(0, 4));                
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    const handleVisibleAllnews = () => {
        document.body.style.overflowY = "hidden"
        setVisibleAllNews(true);
    }

    const handleDirectNewsDetail = (newsId, openedCode) => { //openedCode: 0: open from show, 1 open from all-news
        navigate(`news/${newsId}`);
        sessionStorage.setItem('openedCode', openedCode);
    }

    const handleSearchNews = (e) => { //filter
        var filterList = newsList.filter((news) => {
            return news?.postTitle.includes(e.target.value);
        })
        setFilterNewsList(filterList);
    }

    const handleCloseSearchInput = () => {
        setVisibleInputSearch(false);
        setFilterNewsList([...newsList]);
    }

    const handleCloseAllNews = () => {
        setVisibleAllNews(false);
        setVisibleInputSearch(false);
        setFilterNewsList([...newsList]);
    }

    const renderNews = () => {
        return <>
            <CRow ref={myMenuRef4}>
                <CCol>
                    <CCard className="mb-4">
                        <CCardHeader className="news-header">
                            <div className="news-header__title">Tin tức mới nhất
                                <a className="ms-3" href="http://khuyennonghaugiang.com.vn/" target="__blank">
                                    Website Trung tâm khuyến nông tỉnh Hậu Giang
                                </a>
                            </div>
                            {
                                newsList.length > 4 && 
                                    <div className="news-header__view-more" 
                                        onClick={() => handleVisibleAllnews()}
                                    >
                                        Xem tất cả
                                    </div>
                            }
                        </CCardHeader>
                        <CCardBody>
                            <div className="news" id="news">
                                {
                                    latestNews.length !== 0 ? 
                                        <div className="news__image-list">
                                        {
                                            latestNews.map((news, index) => {
                                                return <>
                                                        <div key={index} className="news__image-list__item" onClick={() => {handleDirectNewsDetail(news?.postId, 0)}}>
                                                            <div className="news__image-list__item__image">
                                                                <img src={news.postAvatar} alt="Không tải được hình ảnh" />
                                                            </div>
                                                            <div className="news__image-list__item__title">
                                                                { news?.postTitle }
                                                            </div>
                                                            <div 
                                                                className="news__image-list__item__brief"
                                                                style={ news?.postTitle.length > 39 ? { WebkitLineClamp: 2 } : { WebkitLineClamp: 3 }}
                                                                dangerouslySetInnerHTML={{__html: news?.postContent}}
                                                            >
                                                            </div>
                                                        </div>
                                                </>
                                            })
                                        }
                                        </div>
                                    :
                                        <div style={{textAlign: 'center'}}>Chưa có bài viết được cập nhật</div>
                                }
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    }
    
    const myMenuRef1 = useRef(null)
    const myMenuRef2 = useRef(null)
    const myMenuRef3 = useRef(null)
    const myMenuRef4 = useRef(null)

    const scrollToMyView = (sRef) => {
        sRef?.current?.scrollIntoView()
    }

    const [activeSticky, setActiveSticky] = useState(false);

    const stickyMenu = () => {
        return <>
            <div className={clsx(styles.stickyMenu)}>
                <div className={clsx(styles.stickyButton)}>
                    <img 
                        onClick={() => setActiveSticky(!activeSticky)}
                        src={menu}
                    />
                </div>
                <div className={clsx({
                    [styles.stickyMenuList]: true,
                    [styles.stickyHide]: activeSticky
                })}>
                    <div onClick={() => scrollToMyView(myMenuRef1)} className={clsx(styles.stickyMenuItem)} >
                        <span className="text-primary">
                            Vị trí
                        </span>
                        <img src={mapItem} />
                    </div>
                    <div onClick={() => scrollToMyView(myMenuRef2)} className={clsx(styles.stickyMenuItem)} >
                        <span className="text-primary">
                            Lịch mở
                        </span>
                        <img src={scheduleItem} />
                    </div>
                    <div onClick={() => scrollToMyView(myMenuRef3)} className={clsx(styles.stickyMenuItem)} >
                        <span className="text-primary">
                            Thông tin trạm
                        </span>
                        <img src={sensorItem} />
                    </div>
                    <div onClick={() => scrollToMyView(myMenuRef4)} className={clsx(styles.stickyMenuItem)} >
                        <span className="text-primary">
                            Tin tức
                        </span>
                        <img src={newsItem} />
                    </div>
                </div>
            </div>
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
                            <div className={"all-news-modal__header__title__search-input " + (visibleInputSearch? 'all-news-modal__header__title__search-input--enabled' : '')}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => setVisibleInputSearch(true)} />
                                {
                                    visibleInputSearch && <input type="text"  autoFocus onChange={e => handleSearchNews(e)} />
                                }
                            </div>
                            {
                                visibleInputSearch && <div className="all-news-modal__header__title__close-search" onClick={() => handleCloseSearchInput()}>
                                    Hủy
                                </div>
                            }
                        </div>
                        <div className="all-news-modal__header__title__close" onClick={() => handleCloseAllNews()}>
                            <FontAwesomeIcon icon={faXmark}/>
                        </div>
                    </div>
                    <div className="all-news-modal__list">
                            {
                                filterNewsList.length !== 0 ? 
                                    filterNewsList.map((news, index) => {
                                        return <>
                                            <div key={index} className="all-news-modal__list__item" onClick={() => {handleDirectNewsDetail(news?.postId, 1)}}>
                                                <div className="all-news-modal__list__item__image">
                                                    <img src={news.postAvatar} alt="image error" />
                                                </div>
                                                <div className="all-news-modal__list__item__info">
                                                    <div className="all-news-modal__list__item__info__title">
                                                        { news?.postTitle }
                                                    </div>
                                                    <div 
                                                        className="all-news-modal__list__item__info__brief" 
                                                        dangerouslySetInnerHTML={{ __html: news?.postContent }}
                                                    >
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    })
                                : 
                                <div className="all-news-modal__list__empty-message">Không tìm thấy bài viết phù hợp</div>
                            }
                    </div>
                </div>
            </CModal>
        </>
    }
    
    return (
        <>
        <CustomIntroduction 
            pageCode={defaultPageCode}
            title="HỆ THỐNG GIÁM SÁT ĐỘ MẶN VÀ LỊCH ĐÓNG MỞ CỐNG / ĐẬP"
            content="Hệ thống hỗ trợ quản lý các thông tin về lịch đóng / mở của hệ thống cống / đập và cảm biến trên địa bàn tỉnh Hậu Giang"
        />
        {stickyMenu()}
        <CRow ref={myMenuRef1}>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        Vị trí tất cả cống / đập và trạm cảm biến
                    </CCardHeader>
                    <CCardBody>
                        <CRow className="mb-3">
                            <CCol xs={12} md={12} lg={12} style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                                <div style={{marginRight: '30px'}}><CFormCheck onChange={() => handleSetMapViewMode(1)} type="radio" name="mapViewCheck" id="mapViewCheck1" label="Tất cả" checked={mapViewMode === 1} /></div>
                                <div style={{marginRight: '30px'}}><CFormCheck onChange={() => handleSetMapViewMode(2)} type="radio" name="mapViewCheck" id="mapViewCheck2" label="Cống / Đập" checked={mapViewMode === 2}/></div>
                                <div style={{marginRight: '30px'}}><CFormCheck onChange={() => handleSetMapViewMode(3)} type="radio" name="mapViewCheck" id="mapViewCheck3" label="Trạm cảm biến" checked={mapViewMode === 3}/></div>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md={12} lg={12}>
                                {/* { 
                                    damMarkers && sensorMarkers ? mapViewMode === 1 ? <CustomAPIMap 
                                        markers={[...damMarkers, ...sensorMarkers]}
                                    /> : mapViewMode === 2 ? <CustomAPIMap markers={damMarkers} /> : <CustomAPIMap  markers={sensorMarkers}/> : null
                                } */}
                                {
                                    commonMarkers && <CustomAPIMap markers={commonMarkers} />
                                }
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>

        <CRow ref={myMenuRef2}>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        Lịch đóng mở cống / đập
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
        <CRow ref={myMenuRef3}>
            <CCol xs>
                <CCard className="mb-4">
                    <CCardHeader>
                        Thông tin trạm quan trắc
                    </CCardHeader>
                    <CCardBody>
                        { 
                            error ? 
                                <div className="error">
                                    {
                                    errorCode == 429 ? 
                                        <span>Server quá tải</span>
                                    :
                                        <span>Lỗi kết nối</span>
                                    }
                                    . Vui lòng thử lại sau.&nbsp;
                                    <span className="error__reload-btn" onClick={() => window.location.reload()}>Thử lại</span>
                                </div>
                            :
                                showSensorStationList()
                        }
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
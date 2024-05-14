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
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import './homepage.scss';

//service 
import station from "src/services/station"
import observation from "src/services/observation"
import newsService from "src/services/news-service"
import News from "./newspage/newspage"

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
                console.log("rynan station list: ", res);
                setRynanStationList([...res.data]);
                res.data.map((station) => {
                    console.log(station?.so_serial);
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
                            console.log("x: ", x);
                            return x;
                        })
                        .then((sensor) => {
                            station.sensor = sensor;
                            return station;
                        })
                        .then((station) => {
                            console.log("station then: ", station);
                            setRynanStationList([...res.data]);
                            // console.log("rynan station list: ", rynanStationList);
                        })
                })
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
                        <CTableHeaderCell className="bg-body-tertiary sensor-station-list__no" style={{'width' : '5%'}}>STT</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '30%'}}>Trạm</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '25%'}}>Cảm biến</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '20%'}}>Giá trị </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '25%'}}>Thời gian</CTableHeaderCell>
                        {
                            rynanStationList?.length > 3 && 
                            <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '15px'}}></CTableHeaderCell>
                        }
                    </CTableRow>
                </CTableHead>
            </CTable>
            <div className="sensor-station-list__table-content">
                <CTable bordered align="middle" className="mb-0 border sensor-station-list" responsive>
                    <CTableBody>
                        {
                            rynanStationList.map((station, stationIndex) => {
                                return station?.sensor?.sensor?.map((sensor, sensorIndex) => {
                                    if(sensorIndex==0) {
                                        return <CTableRow key={sensorIndex}>
                                            <CTableDataCell className="sensor-station-list__no" style={{'width' : '5%'}} rowSpan={station?.sensor?.sensor?.length}>{ stationIndex+1 }</CTableDataCell>
                                            <CTableDataCell style={{'width' : '30%'}} rowSpan={station?.sensor?.sensor?.length}>
                                                <span 
                                                    style={{cursor: 'pointer'}}
                                                    onClick={() => handelDirectToDetail(station?.so_serial)}
                                                >
                                                    <b>{ station.ten_thiet_bi }</b>
                                                </span> <br/>
                                                { station.khu_vuc_lap_dat }
                                            </CTableDataCell>
                                            <CTableDataCell style={{'width' : '25%'}}>{ sensor.name }</CTableDataCell>
                                            <CTableDataCell style={{'width' : '20%'}}>{ sensor.value }</CTableDataCell>
                                            <CTableDataCell style={{'width' : '25%'}} rowSpan={station?.sensor?.sensor?.length}>{ sensor.time }</CTableDataCell>
                                        </CTableRow>
                                    } else {
                                        return <CTableRow key={sensorIndex}>
                                            <CTableDataCell style={{'width' : '25%'}}>{ sensor.name }</CTableDataCell>
                                            <CTableDataCell style={{'width' : '20%'}}>{ sensor.value }</CTableDataCell>
                                            {/* <CTableDataCell>{ sensor.time }</CTableDataCell> */}
                                        </CTableRow>
                                    }
                                })
                            })
                        }
                    </CTableBody>
                </CTable>
            </div>
        </>
    }

    // NEWS
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
    const [postTitleSearch, setPostTitleSearch] = useState('')
    // const searchNewsComponent = () => {
    //     return (
    //         <CForm onSubmit={onFilterNews}>
    //             <CRow>
    //                 <CCol md={12} lg={6}>
    //                     <CFormInput
    //                         className="mb-2"
    //                         type="text"
    //                         placeholder="Tiêu đề bài viết"
    //                         onChange={(e) => setPostTitleSearch(e.target.value)}
    //                         aria-describedby="exampleFormControlInputHelpInline"
    //                         value={postTitleSearch}
    //                     />
    //                 </CCol>
    //                 <CCol md={12} lg={6}>
    //                     <CButton color="primary" className="me-2 " type="submit">
    //                         <CIcon icon={cilMagnifyingGlass} className="text-white"/>                             
    //                     </CButton>
    //                     <CButton color="success" onClick={onResetNews}>
    //                         <CIcon icon={cilReload} className="text-white"/>   
    //                     </CButton>
    //                 </CCol>
    //             </CRow>
    //         </CForm>
    //     )
    // }
    const [newsList, setNewsList] = useState([
        {
            postId: 1,
            postTitle: "Xâm nhập mặn tại đồng bằng sông Cửu Long duy trì mức cao",
            postContent: "Theo nhận định của Trung tâm Dự báo khí tượng thủy văn quốc gia, từ ngày 1-10/5, khu vực miền Tây Nam Bộ phổ biến ít mưa; ngày nắng nóng, có nơi nắng nóng gay gắt. Tuy mưa không nhiều nhưng cần chú ý có thể xuất hiện mưa dông nhiệt cục bộ vào chiều tối dễ kèm theo lốc, sét và gió giật mạnh nguy hiểm. Nhiệt độ cao nhất tại miền Tây Nam Bộ phổ biến từ 34-37 độ C, có nơi cao hơn. Mực nước trên sông Tiền và sông Hậu thời kỳ này biến đổi chậm theo triều. Mực nước cao nhất tuần tại Tân Châu là 1,10m, tại Châu Đốc 1,30m, ở mức tương đương và cao hơn trung bình nhiều năm cùng kỳ khoảng 0,05m.",
            postAvatar: "https://image.nhandan.vn/w800/Uploaded/2024/huounvj/2024_05_01/man-2264.jpg.webp",
            postCreatorName: "Nguyễn Văn A",
            postCreatedAt: "Thứ 5, 02/05/2024 9:32 (GMT+7)"
        },
        {
            postId: 2,
            postTitle: "Hồ Dầu Tiếng tiếp cứu nước ngọt cho Nam Bộ",
            postContent: "Những ngày này, hồ Dầu Tiếng, hồ thuỷ lợi lớn nhất Đông Nam Á với trữ lượng nước ngọt lên đến 1,5 tỷ mét khối vẫn ngày đêm “xuôi dòng” tiếp cứu nguồn nước ngọt cho các tỉnh miền nam, phục vụ tưới tiêu cho sản xuất nông nghiệp ở: Tây Ninh, Bình Dương, Thành phố Hồ Chí Minh và Long An. Hạn hán và xâm nhập mặn đang ở mức báo động. Các địa phương ở Nam Bộ như giải toả “cơn khát” khi tiếp cận nguồn nước từ thượng nguồn hồ Dầu Tiếng, qua đó giúp nhân dân ổn định hoạt động sản xuất nông nghiệp và sinh hoạt hằng ngày.",
            postAvatar: "https://image.nhandan.vn/w790/Uploaded/2024/wpgfbfjstpy/2024_04_26/anh-1-chon-532.jpg.webp",
            postCreatorName: "Nguyễn Hiền",
            postCreatedAt: "Thứ 4, 01/05/2024 8:05 (GMT+7)"
        },
        {
            postId: 3,
            postTitle: "Phòng chống hạn, mặn cho cây trồng",
            postContent: "Những tháng qua, nắng nóng kéo dài, hạn hán, thiếu nước, xâm nhập mặn xảy ra ở nhiều địa phương trên cả nước. Hàng trăm hồ chứa thủy lợi nhỏ cạn nước, hàng chục nghìn ha cây trồng bị ảnh hưởng, nhất là khu vực miền trung, Tây Nguyên và Đồng bằng sông Cửu Long. Cục Thủy lợi (Bộ Nông nghiệp và Phát triển nông thôn) cho biết, đến giữa tháng 4, các hồ chứa thủy lợi khu vực Bắc Bộ đạt 57% dung tích thiết kế, Bắc Trung Bộ đạt 59%, Nam Trung Bộ đạt 66%, Đông Nam Bộ đạt 56%, đặc biệt khu vực Tây Nguyên chỉ đạt 40% dung tích thiết kế, trong đó Kon Tum 43%, Gia Lai 37%, Đắk Lắk 38%, Đắk Nông 40%, Lâm Đồng 54%. Cũng qua thống kê, khoảng 182 hồ chứa nhỏ bị cạn nước ảnh hưởng đến phục vụ sản xuất nông nghiệp. Hạn hán, xâm nhập mặn, thiếu nước làm gần 10.300 ha cây trồng ở các địa phương: Bình Thuận, Bình Phước, Gia Lai, Kon Tum, Sóc Trăng bị ảnh hưởng. Khu vực Tây Nguyên là nơi có hàng triệu héc-ta cây công nghiệp như: Cà-phê, hồ tiêu, điều, mắc-ca…",
            postAvatar: "https://image.nhandan.vn/w800/Uploaded/2024/hutmhz/2024_04_23/han-man-6712.jpg.webp",
            postCreatorName: "Cao Văn",
            postCreatedAt: "Thứ 6, 26/04/2024 9:32 (GMT+7)"
        },
        {
            postId: 4,
            postTitle: "Cung cấp đủ nước sinh hoạt cho người dân vùng hạn, mặn",
            postContent: "Trung tâm dự báo Khí tượng-Thủy văn quốc gia nhận định, năm 2024, xâm nhập mặn tại các tỉnh Đồng bằng sông Cửu Long sẽ cao hơn, phức tạp hơn so với trung bình nhiều năm; mặn tiến sâu hơn bên trong các hệ thống sông. Để bảo đảm đời sống, sản xuất của người dân trong vùng hạn, mặn, thời gian qua, hàng loạt giải pháp đã được các địa phương triển khai như bảo vệ lúa an toàn, cấp nước sạch cho người dân, vận hành hệ thống cống linh hoạt ngăn mặn…Theo Đài Khí tượng-Thủy văn khu vực Nam Bộ, tại Đồng bằng sông Cửu Long, xâm nhập mặn mùa khô năm 2023-2024 ở mức sớm và sâu hơn trung bình nhiều năm, vào sâu hơn bên trong các hệ thống sông. Tính từ đầu mùa khô đến nay, đợt xâm nhập sâu nhất xuất hiện, với ranh mặn 4‰, tiến sâu vào đất liền 40-66 km, có nơi sâu hơn, ranh mặn 1‰ tại hai tỉnh Tiền Giang và Bến Tre vào sâu 70-76 km tùy theo sông. Đến thời điểm hiện tại, mức độ xâm nhập mặn các tỉnh Sóc Trăng, Long An, Trà Vinh, Tiền Giang... mặn phổ biến vẫn cao hơn so với trung bình nhiều năm, xấp xỉ so với năm 2016. Đáng chú ý, tại tỉnh Bến Tre, xâm nhập mặn ở mức xấp xỉ ranh mặn sâu nhất năm 2016, xâm nhập mặn trên sông Cổ Chiên đã sâu hơn ranh mặn sâu nhất năm 2016. Trong khi đó, dự báo tổng lượng mưa tháng 4 và 5 thấp hơn so với trung bình nhiều năm, nguồn nước từ sông Mê Công chảy về Đồng bằng sông Cửu Long vẫn thiếu hụt.",
            postAvatar: "https://image.nhandan.vn/w800/Uploaded/2024/buimsbvibuvwsi/2024_04_16/8-moi-2-8788.jpg.webp",
            postCreatorName: "Hoài Anh",
            postCreatedAt: "Thứ 6, 26/04/2024 9:32 (GMT+7)"
        },
        {
            postId: 5,
            postTitle: "Dự báo xâm nhập mặn khu vực Nam Bộ từ ngày 22-28/4",
            postContent: "Dự báo, từ ngày 11-20/4, xâm nhập mặn ở đồng bằng sông Cửu Long ở mức cao vào đầu tuần, sau đó giảm dần vào cuối tuần. Cảnh báo trong tháng 4, xâm nhập mặn tăng cao ở khu vực Nam Bộ khả năng tập trung từ ngày 22-28/4. Theo nhận định của Trung tâm Dự báo khí tượng thủy văn quốc gia, từ ngày 11-20/4, khu vực miền Tây Nam Bộ tiếp tục phổ biến ít mưa, ngày nắng nóng, có nơi nắng nóng gay gắt. Tuy mưa không nhiều nhưng người dân cần chú ý có thể xuất hiện mưa dông cục bộ vào chiều tối và khả năng kèm theo lốc, sét, gió giật mạnh nguy hiểm. Nhiệt độ cao nhất tại miền Tây Nam Bộ phổ biến từ 34-37 độ C, có nơi cao hơn. Trong thời kỳ này, mực nước trên sông Tiền và sông Hậu dao động theo triều với xu thế xuống dần vào cuối tuần. Mực nước cao nhất tuần tại Tân Châu là 1,40m, tại Châu Đốc 1,55m, ở mức cao hơn trung bình nhiều năm cùng kỳ từ 0,1-0,3m.",
            postAvatar: "https://image.nhandan.vn/w800/Uploaded/2024/huounvj/2024_04_10/6983jpg-2438.jpg.webp",
            postCreatorName: "Văn Hoàng",
            postCreatedAt: "Thứ 5, 25/04/2024 9:32 (GMT+7)"
        },
    ]);
    const [latestNews, setLatestNews] = useState([
        {
            postId: 1,
            postTitle: "Xâm nhập mặn tại đồng bằng sông Cửu Long duy trì mức cao",
            postContent: "Theo nhận định của Trung tâm Dự báo khí tượng thủy văn quốc gia, từ ngày 1-10/5, khu vực miền Tây Nam Bộ phổ biến ít mưa; ngày nắng nóng, có nơi nắng nóng gay gắt. Tuy mưa không nhiều nhưng cần chú ý có thể xuất hiện mưa dông nhiệt cục bộ vào chiều tối dễ kèm theo lốc, sét và gió giật mạnh nguy hiểm. Nhiệt độ cao nhất tại miền Tây Nam Bộ phổ biến từ 34-37 độ C, có nơi cao hơn. Mực nước trên sông Tiền và sông Hậu thời kỳ này biến đổi chậm theo triều. Mực nước cao nhất tuần tại Tân Châu là 1,10m, tại Châu Đốc 1,30m, ở mức tương đương và cao hơn trung bình nhiều năm cùng kỳ khoảng 0,05m.",
            postAvatar: "https://image.nhandan.vn/w800/Uploaded/2024/huounvj/2024_05_01/man-2264.jpg.webp",
            postCreatorName: "Nguyễn Văn A",
            postCreatedAt: "Thứ 5, 02/05/2024 9:32 (GMT+7)"
        },
        {
            postId: 2,
            postTitle: "Hồ Dầu Tiếng tiếp cứu nước ngọt cho Nam Bộ",
            postContent: "Những ngày này, hồ Dầu Tiếng, hồ thuỷ lợi lớn nhất Đông Nam Á với trữ lượng nước ngọt lên đến 1,5 tỷ mét khối vẫn ngày đêm “xuôi dòng” tiếp cứu nguồn nước ngọt cho các tỉnh miền nam, phục vụ tưới tiêu cho sản xuất nông nghiệp ở: Tây Ninh, Bình Dương, Thành phố Hồ Chí Minh và Long An. Hạn hán và xâm nhập mặn đang ở mức báo động. Các địa phương ở Nam Bộ như giải toả “cơn khát” khi tiếp cận nguồn nước từ thượng nguồn hồ Dầu Tiếng, qua đó giúp nhân dân ổn định hoạt động sản xuất nông nghiệp và sinh hoạt hằng ngày.",
            postAvatar: "https://opox.vn/storage/travel-blogs/must-thing-to-do/sapa-northern-vietnamjpg.jpg",
            postCreatorName: "Nguyễn Hiền",
            postCreatedAt: "Thứ 4, 01/05/2024 8:05 (GMT+7)"
        },
        // https://image.nhandan.vn/w790/Uploaded/2024/wpgfbfjstpy/2024_04_26/anh-1-chon-532.jpg.webp
        {
            postId: 3,
            postTitle: "Phòng chống hạn, mặn cho cây trồng",
            postContent: "Những tháng qua, nắng nóng kéo dài, hạn hán, thiếu nước, xâm nhập mặn xảy ra ở nhiều địa phương trên cả nước. Hàng trăm hồ chứa thủy lợi nhỏ cạn nước, hàng chục nghìn ha cây trồng bị ảnh hưởng, nhất là khu vực miền trung, Tây Nguyên và Đồng bằng sông Cửu Long. Cục Thủy lợi (Bộ Nông nghiệp và Phát triển nông thôn) cho biết, đến giữa tháng 4, các hồ chứa thủy lợi khu vực Bắc Bộ đạt 57% dung tích thiết kế, Bắc Trung Bộ đạt 59%, Nam Trung Bộ đạt 66%, Đông Nam Bộ đạt 56%, đặc biệt khu vực Tây Nguyên chỉ đạt 40% dung tích thiết kế, trong đó Kon Tum 43%, Gia Lai 37%, Đắk Lắk 38%, Đắk Nông 40%, Lâm Đồng 54%. Cũng qua thống kê, khoảng 182 hồ chứa nhỏ bị cạn nước ảnh hưởng đến phục vụ sản xuất nông nghiệp. Hạn hán, xâm nhập mặn, thiếu nước làm gần 10.300 ha cây trồng ở các địa phương: Bình Thuận, Bình Phước, Gia Lai, Kon Tum, Sóc Trăng bị ảnh hưởng. Khu vực Tây Nguyên là nơi có hàng triệu héc-ta cây công nghiệp như: Cà-phê, hồ tiêu, điều, mắc-ca…",
            postAvatar: "https://image.nhandan.vn/w800/Uploaded/2024/hutmhz/2024_04_23/han-man-6712.jpg.webp",
            postCreatorName: "Cao Văn",
            postCreatedAt: "Thứ 6, 26/04/2024 9:32 (GMT+7)"
        },
        {
            postId: 4,
            postTitle: "Cung cấp đủ nước sinh hoạt cho người dân vùng hạn, mặn",
            postContent: "Trung tâm dự báo Khí tượng-Thủy văn quốc gia nhận định, năm 2024, xâm nhập mặn tại các tỉnh Đồng bằng sông Cửu Long sẽ cao hơn, phức tạp hơn so với trung bình nhiều năm; mặn tiến sâu hơn bên trong các hệ thống sông. Để bảo đảm đời sống, sản xuất của người dân trong vùng hạn, mặn, thời gian qua, hàng loạt giải pháp đã được các địa phương triển khai như bảo vệ lúa an toàn, cấp nước sạch cho người dân, vận hành hệ thống cống linh hoạt ngăn mặn…Theo Đài Khí tượng-Thủy văn khu vực Nam Bộ, tại Đồng bằng sông Cửu Long, xâm nhập mặn mùa khô năm 2023-2024 ở mức sớm và sâu hơn trung bình nhiều năm, vào sâu hơn bên trong các hệ thống sông. Tính từ đầu mùa khô đến nay, đợt xâm nhập sâu nhất xuất hiện, với ranh mặn 4‰, tiến sâu vào đất liền 40-66 km, có nơi sâu hơn, ranh mặn 1‰ tại hai tỉnh Tiền Giang và Bến Tre vào sâu 70-76 km tùy theo sông. Đến thời điểm hiện tại, mức độ xâm nhập mặn các tỉnh Sóc Trăng, Long An, Trà Vinh, Tiền Giang... mặn phổ biến vẫn cao hơn so với trung bình nhiều năm, xấp xỉ so với năm 2016. Đáng chú ý, tại tỉnh Bến Tre, xâm nhập mặn ở mức xấp xỉ ranh mặn sâu nhất năm 2016, xâm nhập mặn trên sông Cổ Chiên đã sâu hơn ranh mặn sâu nhất năm 2016. Trong khi đó, dự báo tổng lượng mưa tháng 4 và 5 thấp hơn so với trung bình nhiều năm, nguồn nước từ sông Mê Công chảy về Đồng bằng sông Cửu Long vẫn thiếu hụt.",
            postAvatar: "https://image.nhandan.vn/w800/Uploaded/2024/buimsbvibuvwsi/2024_04_16/8-moi-2-8788.jpg.webp",
            postCreatorName: "Hoài Anh",
            postCreatedAt: "Thứ 6, 26/04/2024 9:32 (GMT+7)"
        },
    ]);
    const [filteredNewsList, setFilteredNewsList] = useState([]);
    const [visibleAllNews, setVisibleAllNews] = useState(false);
    const [visibleInputSearch, setVisibleInputSearch] = useState(false);
    const onResetNews = () => {
        setFilteredNewsList(newsList)
        if (newsList?.length > 4) {
            setLatestNews([...newsList].splice(0,4))
        }else {
            setLatestNews(newsList)
        }
    }
    // const onFilterNews = (e) => {
    //     e.preventDefault()
    //     if (postTitleSearch) {
    //         let filteredList = newsList.filter(news => {
    //             return searchRelatives(news?.postTitle, postTitleSearch)
    //         })
    //         if (filteredList) {
    //             setFilteredNewsList(filteredList)
    //             if (filteredList?.length > 4) {
    //                 setLatestNews([...filteredList].splice(0,4))
    //             }else {
    //                 setLatestNews(filteredList)
    //             }
    //         }
    //     }else {
    //         onResetNews()
    //     }
    // }

    useEffect(() => {
        newsService.getAllNews()
            .then((res) => {
                console.log("this is posts api", res);
                // setNewsList(res);
                // setFilteredNewsList(res)
                // setLatestNews([...res].splice(0, 4));
                
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
                                newsList.length > 4 && 
                                    <div className="news-header__view-more" 
                                        onClick={() => handleVisibleAllnews()}
                                    >
                                        Xem tất cả
                                    </div>
                            }
                        </CCardHeader>
                        <CCardBody>
                            <div>
                                {/* {searchNewsComponent()} */}
                            </div>
                            {/* { showNews() } */}
                            <div className="news" id="news">
                                {/* {
                                    filteredNewsList.length !== 0 ?  */}
                                        <div className="news__image-list">
                                        {
                                            latestNews.map((news) => {
                                                return <>
                                                        <div className="news__image-list__item" onClick={() => {handleDirectNewsDetail(news?.postId, 0)}}>
                                                            <div className="news__image-list__item__image">
                                                            {/* <div> */}
                                                                <img src={news.postAvatar} alt="image error" />
                                                            {/* </div> */}
                                                            </div>
                                                            <div className="news__image-list__item__title">
                                                                { news?.postTitle }
                                                            </div>
                                                            <div className="news__image-list__item__brief" dangerouslySetInnerHTML={{__html: news?.postContent.substring(0,100)}}>
                                                                {/* { news?.postContent.substring(0, 100) } */}
                                                            </div>
                                                        </div>
                                                </>
                                            })
                                        }
                                        </div>
                                    {/* :
                                        <div style={{textAlign: 'center'}}>Chưa có tin tức được cập nhật</div>
                                } */}
                                
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
                            <div className={"all-news-modal__header__title__search-input " + visibleInputSearch ? "all-news-modal__header__title__search-input--enabled" : ""}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                                <input type="text" />
                            </div>
                        </div>
                        <div className="all-news-modal__header__close" onClick={() => setVisibleAllNews(false)}>
                            <FontAwesomeIcon icon={faXmark}/>
                        </div>
                    </div>
                    <div className="all-news-modal__list">
                        <div className="virtual">
                            {
                                newsList.map((news) => {
                                    return <>
                                        <div className="all-news-modal__list__item" onClick={() => {handleDirectNewsDetail(news?.postId, 1)}}>
                                            <div className="all-news-modal__list__item__image">
                                                <img src={news.postAvatar} alt="image error" />
                                            </div>
                                            <div className="all-news-modal__list__item__info">
                                                <div className="all-news-modal__list__item__info__title">
                                                    { news?.postTitle }
                                                </div>
                                                <div className="all-news-modal__list__item__info__brief" dangerouslySetInnerHTML={{__html: news?.postContent.substring(0, 100)}}>
                                                    {/* { news?.postContent.substring(0, 100) } */}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                })
                            }
                        </div>
                    </div>
                </div>
            </CModal>
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

        {/* NEWS */}
        { renderNews() }

        {/* MORE NEWS */}
        { renderNewsListModal() }    

        </>
    )
}

export default HomePage
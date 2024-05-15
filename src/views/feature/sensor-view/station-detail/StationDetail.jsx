import { useEffect, useState } from "react"
import * as React from "react"
import './StationDetail.scss'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCircleDown, faTableCells, faChevronLeft, faSort, faRotateRight} from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";
import 'animate.css'

//modal 
import { CNav, CNavItem, CNavLink, CTabContent, CCard, CCardBody, CCol, CCardHeader, CRow, CTabPane, CListGroup } from '@coreui/react';
import Tooltip from '@mui/material/Tooltip';

//chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  // Tooltip,
  Legend,
} from 'chart.js';

//higth chart 
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'

//service
import observation from "src/services/observation";
import station from "src/services/station";

import { useParams } from "react-router-dom";
import CustomIntroduction from "src/views/customs/my-introduction";
import * as XLSX from "xlsx/xlsx.mjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  // Tooltip,
  Legend
);

// Load Highcharts modules
require("highcharts/modules/exporting")(Highcharts);

Highcharts?.setOptions({
  lang: {
    loading: 'Đang tải...',
    months: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    weekdays: ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    shortMonths: ['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10', 'T11', 'T12'],
    downloadJPEG: "Tải xuống hình ảnh JPEG",
    downloadPNG: "Tải xuống hình ảnh PNG",
    downloadPDF: "Tải xuống PDF",
    downloadSVG: "Tải xuống SVG",
    viewFullscreen: "Xem toàn màn hình",
    printChart: "In biểu đồ"
  },
  time: {
    useUTC: false
  },
  rangeSelector: {
    inputEnabled: true
  }
})

const StationDetail = () => {
    const { id } = useParams();
    const [error , setError] = useState(false);

    //tab
    const [activeKey, setActiveKey] = useState(0);

    //download card
    const [dateRange] = useState({startDate: '', endDate: ''});
    const [selectedDateRange, setSelectedDateRange] = useState({from: '', to: ''});
    const [visibleDownloadCard, setVisibleDownloadCard] = useState();

    //filter
    const [selectedDateRangeSort, setSelectedDateRangeSort] = useState({from: '', to: ''}); // value of data range input to show chart and table
    const [sensorListRynan, setSensorListRynan] = useState([]);
    const [selectingSensorRynan, setSelectingSensorRynan] = useState(""); //sensor name
    const [viewMode, setViewMode] = useState("chart"); //mode name: table, chart, etc
    const [latestSensorValue, setLatestSensorValue] = useState([]); //latest value of sensors array
    const [sensorValueListSort, setSensorValueListSort] = useState([]); //table in screen
    const [isLoadingSensorList, setIsLoadingSensorList] = useState(false);
    const [stationInfo, setStationInfo] = useState();
    const [dataStation, setDataStation] = useState({});

    const [periodFromStartDate, setPeriodFromStartDate] = useState(0); // du lieu hien thi trong bao nhieu ngay ke tu ngay bat dau (tuy chon), su dungj trong select option
    const [firstLoad, setFirstLoad] = useState(true);

    // auto reload 
    setInterval(() => {
      var date = new Date();
      if((date.getMinutes()/15 - Math.floor(date.getMinutes()/15) == 0)) {
        setReload(!reload);
      }
    }, 60*1000)

    //lay thong tin tram
    useEffect(() => {
      setIsLoadingSensorList(true);
      station.getStationListByRyan()
        .then((res) => {
          res.data.forEach((station) => {
            if(id===station.so_serial) {
              setStationInfo(station);
            }
          })
          setIsLoadingSensorList(false);
        })
        .catch((error) => {
          setError(true);
        })


      var currentDate = new Date();
      //min, max attribute for input
      dateRange.startDate = "2024-04-15";
      var currentDateStr = `${currentDate.getFullYear()}-${addZero(currentDate.getMonth()+1)}-${addZero(currentDate.getDate())}`;
      dateRange.endDate = currentDateStr;

      selectedDateRangeSort.from = currentDateStr;
      selectedDateRangeSort.to = currentDateStr;

    }, [])

    const [reload, setReload] = useState(false);

    const [responseDataStationRynan, setResponseDataStationRynan] = useState([]);

    useEffect(() => {
      setIsLoadingSensorList(true);
      
      var startDate, endDate;
      endDate = new Date();
      startDate = new Date(selectedDateRangeSort.from); // get startDate
      endDate.setTime(startDate.getTime() + (24*60*60*1000*Number(periodFromStartDate))); // calculate endDate

      // if endDate exceed current date, reset periodFromStartDate
      var exceedNow = (endDate.getTime() - new Date().getTime())/(24*60*60*1000);
      if(exceedNow > 0) {
        endDate = new Date();
        setPeriodFromStartDate(Math.floor(handleCaculateDatePeriod(startDate, endDate)));
      }

      // format startdate, endDate for calling api
      endDate = `${endDate.getFullYear()}/${addZero(endDate.getMonth()+1)}/${addZero(endDate.getDate())}`;
      selectedDateRangeSort.to = endDate;
      endDate = selectedDateRangeSort.to.replaceAll("-", "/");
      startDate = selectedDateRangeSort.from.replaceAll("-", "/");

      observation.getDataStation(id, startDate, endDate, 1, 10000)
        .then((res) => {
          console.log("res: ", res);
          setResponseDataStationRynan(res);

          //sort/reverse
          setSensorValueListSort([...res.data].reverse());

          // get sensor list
          var sensorList = [];
          var ltsValue = [];
          console.log("firstLoad: ", firstLoad);
          for(const sensor in res.data[0]) {
            if(sensor !== "trang_thai" && !isNaN(res.data[0][sensor]) && res.data[0][sensor] !== null) {
              sensorList.push(sensor);
              setSensorListRynan(sensorList);

              //get latest value for all sensor
              if(firstLoad) {
                let ltsValue1Sensor = {sensorName: '', sensorValue: 0, time: ''};
                ltsValue1Sensor.sensorName = sensor;
                ltsValue1Sensor.sensorValue = res.data[res.data.length-1][sensor];
                var ltsDate = new Date(res.data[res.data.length-1].ngay_gui);
                ltsValue1Sensor.time = addZero(ltsDate.getHours()) + ":" + addZero(ltsDate.getMinutes()) + ":" + addZero(ltsDate.getSeconds()) + ", " + addZero(ltsDate.getDate()) + '/' + addZero(ltsDate.getMonth()+1) + "/" + ltsDate.getFullYear();
                ltsValue.push(ltsValue1Sensor);
                setLatestSensorValue(ltsValue);
              }
            }
          }
          var pointArray = [];
          res?.data.forEach((multi) => {
            var point = {
              x: new Date(multi.ngay_gui).getTime(),
              y: Number(selectingSensorRynan === "" ? multi[sensorList[0]] : multi[selectingSensorRynan]),
              color: '#1a2848'
            }
            pointArray.push(point);
            if(selectingSensorRynan === "") {
              setSelectingSensorRynan(sensorList[0]);
            }
          })
          return pointArray;
        })
        .then((res) => {
          setDataStation(
            {
              chart: {
                type: 'line',
                height: 550, // Set the desired height here
              },
              plotOptions: {
                series: {
                    color: '#1a2848'
                }
              },
              tooltip: {
                formatter: function() {
                  var sendDTime = new Date(this.x);
                  var strTime= `${addZero(sendDTime.getHours())}:${addZero(sendDTime.getMinutes())}:${addZero(sendDTime.getSeconds())}, ${addZero(sendDTime.getDate())}/${addZero(sendDTime.getMonth()+1)}/${sendDTime.getFullYear()}`;
                  var strTimeShow = `Thời gian: <b> ${strTime} </b><br/>Giá trị: <b>${this.y}</b>` 
                  return strTimeShow; 
                }
              },
              series: [{
                data: res,
                zoneAxis: 'x',
                marker: {
                  symbol: "circle",
                  radius: 2,
                  enabled: true
                }
              }]
            }
          )
          setIsLoadingSensorList(false);
          setFirstLoad(false);
        })
        .catch((error) => {
          setError(true);
        })
    }, [reload, selectedDateRangeSort, periodFromStartDate]) //selectingSensorRynan,    

    const handleChangeSensorViewRynan = async (sensorName, index) => {
      setActiveKey(index);
      setSelectingSensorRynan(sensorName);
    }

    useEffect(() => {
      handleSetDataStaion();
    }, [selectingSensorRynan]);

    const handleSetDataStaion = () => { //loc va set options cho chart
      var pointArray = [];
      responseDataStationRynan.data?.forEach((multi, index) => {
        var point = {
          x: new Date(multi.ngay_gui).getTime(),
          y: Number(selectingSensorRynan === "" ? multi[sensorListRynan[0]] : multi[selectingSensorRynan]),
          color: '#1a2848'
        }
        pointArray.push(point);
        if(selectingSensorRynan === "") {
          setSelectingSensorRynan(sensorListRynan[0]);
        }

        //dateRage
        var dateTime, strDate;
        if(index===0 || index===responseDataStationRynan?.data.length-1) { // start point or end point
          dateTime = new Date(point.x);
          strDate = `${dateTime.getFullYear()}-${addZero(dateTime.getMonth()+1)}-${addZero(dateTime.getDate())}`;
        }
      })
      console.log("point array: ", pointArray);
      setDataStation(
        {
          chart: {
            type: 'line',
            height: 550, // Set the desired height here
          },
          plotOptions: {
            series: {
                color: '#1a2848'
            }
          },
          tooltip: {
            formatter: function() {
              var sendDTime = new Date(this.x);
              var strTime= `${addZero(sendDTime.getHours())}:${addZero(sendDTime.getMinutes())}:${addZero(sendDTime.getSeconds())}, ${addZero(sendDTime.getDate())}/${addZero(sendDTime.getMonth()+1)}/${sendDTime.getFullYear()}`;
              var strTimeShow = `Thời gian: <b> ${strTime} </b><br/>Giá trị: <b>${this.y}</b>` 
              return strTimeShow; 
            }
          },
          series: [{
            data: pointArray,
            zoneAxis: 'x',
            marker: {
              symbol: "circle",
              radius: 2,
              enabled: true
            }
          }]
        }
      )
    }

    const handleChangeViewModeRynan = (modeName) => {
      setViewMode(modeName);
      setVisibleDownloadCard(undefined);
    }
    //Rynan >>
    const navigate = useNavigate()
    const backToStationList = () => {
      navigate("/station-list"); 
    }

    const generateSensorName = (rawName) => {
      var generatedName = '';
      switch(rawName) {
        case 'do_pH':
          generatedName = "Độ pH";
          break;
        case 'muc_nuoc':
          generatedName = "Mực nước";
          break;
        case 'nhiet_do':
          generatedName = "Nhiệt độ";
          break;
        case 'do_man':
          generatedName = "Độ mặn";
          break;
        default:
          generatedName = rawName;
          break;    
      }
      return generatedName;
    }

    //export excel
    const [selectedSensorForDownloading, setSelectedSensorForDownloading] = useState([]);
    
    // choose sensor type for downloading
    const handleChangeSelectedSensorForDownloading = (e) => {
      if (e.target.checked) {
        setSelectedSensorForDownloading([...selectedSensorForDownloading, e.target.value]);
      } else {
        setSelectedSensorForDownloading(selectedSensorForDownloading.filter((item) => item !== e.target.value));
      }
      console.log("selected sensor list for download: ", selectedSensorForDownloading);
      console.log("dateRange: ", dateRange);
    }


    // select date range for downloading
    const handleSelectedDateRange = (e) => {
      if(e.target.name==="from") { //from thay doi
        if(new Date(e.target.value) <= new Date(selectedDateRange.to)) { //ok
          setSelectedDateRange({...selectedDateRange, from: e.target.value})
        }
      }
      else {
        if(new Date(e.target.value) >= new Date(selectedDateRange.from)) { //ok
          setSelectedDateRange({...selectedDateRange, to: e.target.value})
        }
      }
    }

    // select "date from" input to show value in chart, table
    const handleSelectedDateRangeSort = async (e) => {
      setSelectedDateRangeSort({ ...selectedDateRangeSort, from: e.target.value });
    }

    // calculate period between two dates
    const handleCaculateDatePeriod = (startDate, endDate) => {
      var period = (endDate.getTime() - startDate.getTime())/(24*60*60*1000);
      return period < 0 ? period*(-1) : period;
    }

    const handleShowDownloadingCard = () => {
      setVisibleDownloadCard(!visibleDownloadCard);
      var date = new Date();
      date = `${date.getFullYear()}-${addZero(date.getMonth()+1)}-${addZero(date.getDate())}`;
      setSelectedDateRange({from: date, to: date});
    }


    // download excel file
    const handleExportExcel = () => {
      var excelSheet = [];
      var colSheet = {}; // number of column in excel of number of sensor that are chosen
      colSheet.ngay_gui = ''; // ngay_gui column
      var startDate, endDate;
      // calculate date range for downloading
      startDate = selectedDateRange.from.replaceAll("-", "/");
      endDate = selectedDateRange.to.replaceAll("-", "/");
      observation.getDataStation(id, startDate, endDate, 1, 10000)
        .then((res) => {
          selectedSensorForDownloading.map((sensor) => {
            colSheet[sensor] = '';
          })
          var sendDate;
          res?.data?.forEach((item) => {
            //chuyen ngay trong csdl ve dang chuan utc
            sendDate = new Date(item.ngay_gui);
            item.ngay_gui = `${addZero(sendDate.getHours())}:${addZero(sendDate.getMinutes())}:${addZero(sendDate.getSeconds())}, ${addZero(sendDate.getDate())}/${addZero(sendDate.getMonth()+1)}/${sendDate.getFullYear()}`;
            for(const key in colSheet) {
              colSheet[key] = item[key];
            }
            excelSheet.push({...colSheet});
          })
          return excelSheet;
        })
        .then(() => {
          var wb = XLSX.utils.book_new();
          var ws = XLSX.utils.json_to_sheet(excelSheet);
          var currentDate = new Date();
          var dateStr = `${currentDate.getFullYear()}/${addZero(currentDate.getMonth()+1)}/${addZero(currentDate.getDate())}`;
          XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
          XLSX.writeFile(wb,  `${stationInfo.ten_thiet_bi}_${dateStr}.xlsx`);
    
          //unckeck ckeckbox
          let inputs = document.querySelectorAll('.ckeckbox-sensor-downloading');
          for (let i = 0; i < inputs.length; i++) {
              inputs[i].checked = false;
          }
          selectedDateRange.from = dateRange.startDate;
          selectedDateRange.to = dateRange.endDate;
          setVisibleDownloadCard(false);
        })
        .catch((error) => {
          throw error;
        })
    }

    const addZero = (no) => {
      return no < 10 ? '0' + no : no;
    }

    const handleSort = () => {
      setSensorValueListSort([...sensorValueListSort].reverse());
    }

    const generateHeader = () => {
      return <>
        <CCardHeader className="station-detail2__header">
          <div className="station-detail2__header__station-name">
            <span style={{marginRight: '10px', cursor: 'pointer'}} 
              onClick={() => {backToStationList()}}
            > 
              <FontAwesomeIcon icon={faChevronLeft}/>
            </span>
            { stationInfo?.ten_thiet_bi }
            {
              isLoadingSensorList &&
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            }
          </div>
          <Tooltip title="Cập nhật dữ liệu" placement="left" arrow>
            <div className="station-detail2__header__reload" onClick={() => {setReload(!reload)}}>
              <FontAwesomeIcon icon={faRotateRight}/>
            </div>
          </Tooltip>
        </CCardHeader>
      </>
    }

    const handleChangePeriodSelect = (e) => {
      setPeriodFromStartDate(e.target.value)
    }

    const generateToolBar = () => {
      return <>
        <CRow>
          <CCol xs={5}>
            {
              // viewMode === 'table' && 
              <div className="station-detail2__body__date-range-sort">
                <label htmlFor="">Từ</label>
                <input type="date" 
                  value={selectedDateRangeSort.from} 
                  min="2024-04-15"
                  // {dateRange.startDate}
                  max={dateRange.endDate}
                  name="from"
                  onChange={handleSelectedDateRangeSort}
                />
                <select name="" id="" value={periodFromStartDate} onChange={handleChangePeriodSelect}>
                  <option value="0">1 ngày</option>
                  <option value="1">2 ngày</option>
                  <option value="2">3 ngày</option>
                  <option value="3">4 ngày</option>
                  <option value="4">5 ngày</option>
                  <option value="5">6 ngày</option>
                  <option value="6">7 ngày</option>
                </select>
              </div>
            }
          </CCol>
          <CCol xs={7} className="station-detail2__body__formating">
            {
              viewMode === 'table' && 
              <button className="download-btn"
                onClick={() => handleShowDownloadingCard()}
              >
                <FontAwesomeIcon icon={faCircleDown}/>
                &nbsp;
                Tải xuống
              </button>
            }
            <Tooltip title="Bảng số liệu" arrow>
              <div 
                className={viewMode === 'table' ? "station-detail2__body__formating__item station-detail2__body__formating__item--active" : "station-detail2__body__formating__item"} 
                onClick={() => {handleChangeViewModeRynan('table')}}
              >
                <FontAwesomeIcon icon={faTableCells}/>
              </div>
            </Tooltip>
            <Tooltip title="Biểu đồ" arrow>
              <div 
                className={viewMode === 'chart'? "station-detail2__body__formating__item station-detail2__body__formating__item--active" : "station-detail2__body__formating__item"} 
                onClick={() => {handleChangeViewModeRynan('chart')}}
              >
                <FontAwesomeIcon icon={faChartLine}/>
              </div>
            </Tooltip>
          </CCol>
        </CRow>
        {
          visibleDownloadCard !== undefined && <>
            <div className={"download-card " + (visibleDownloadCard ? 'animate__animated animate__fadeInUp animate__faster' : 'animate__animated animate__fadeOutDown animate__faster')}>
              <div className="download-card__content">
                <div className="download-card__content__time">
                    <div className="download-card__content__time__heading">
                      Thời gian
                    </div>
                    <div className="download-card__content__time__input-group">
                      <label htmlFor="">Từ</label>
                      <input type="date" 
                        value={selectedDateRange.from} 
                        min={dateRange.startDate} 
                        max={dateRange.endDate} 
                        name="from"
                        onChange={handleSelectedDateRange}
                      />
                      <label htmlFor="">đến</label>
                      <input 
                        type="date" value={selectedDateRange.to} 
                        min={dateRange.startDate} 
                        max={dateRange.endDate} 
                        name="to"
                        onChange={handleSelectedDateRange}
                      />
                    </div>
                </div>
                <div className="download-card__content__sensor-option">
                  <div className="download-card__content__sensor-option__heading">
                    Cảm biến
                  </div>
                  <div className="download-card__content__sensor-option__sensor-list">
                    {
                      sensorListRynan.map((sensor, index) => {
                        return <span className="download-card__content__sensor-option__sensor-list__item" key={index}>
                          <input className="ckeckbox-sensor-downloading" type="checkbox" name="sensor" value={sensor} id="" onChange={handleChangeSelectedSensorForDownloading}/>
                          <label htmlFor="">{ generateSensorName(sensor) }</label>
                        </span>
                      })
                    }
                  </div>
                </div>
              </div>
              <div className="download-card__button">
                <div className="download-card__button__close" onClick={() => setVisibleDownloadCard(false)}>
                  Đóng
                </div>
                <button className="download-card__button__download"
                  disabled={selectedSensorForDownloading?.length===0}
                  onClick={() => handleExportExcel()}
                >
                  Tải xuống
                </button>
              </div>
            </div>
          </>
        }
      </>
    }

    const generateChart = () => {
      return <>
        {
          <div className="chart">
            <CRow>
              <CCol>
                <CNav variant="tabs" role="tablist">
                  {
                    sensorListRynan.map((sensor, index) => {
                      return <>
                        <CNavItem role="presentation" key={index} className="cnavitem">
                          <CNavLink
                            className="cnavlink"
                            active={activeKey === index}
                            component="button"
                            role="tab"
                            aria-controls="home-tab-pane"
                            aria-selected={activeKey === index}
                            onClick={() => {handleChangeSensorViewRynan(sensor, index)}}
                          >
                            { generateSensorName(sensor) }
                          </CNavLink>
                        </CNavItem>
                      </>
                    })
                  }
                </CNav>
                <CTabContent>
                  {
                    sensorListRynan.map((sensor, index) => {
                      return <>
                        <CTabPane role="tabpanel" aria-labelledby="profile-tab-pane" visible={activeKey === index}>
                          <HighchartsReact
                            highcharts={Highcharts}
                            constructorType={'stockChart'}
                            options={dataStation}
                          />
                        </CTabPane>
                      </>
                    })
                  }
                </CTabContent>
              </CCol>
            </CRow>
          </div>
        }
      </>
    }

    const generateTable = () => {
      return <>
          {
            <div>
              <CRow className="station-detail2__body__table" style={{position: 'relative'}}>
                {/* <CCol xs={2}></CCol> */}
                <CCol xs={8} style={{position: 'relative'}}>
                  <CNav variant="tabs" role="tablist" >
                    {
                      sensorListRynan.map((sensor, index) => {
                        return <>
                          <CNavItem role="presentation" key={index} className="cnavitem">
                            <CNavLink
                              className="cnavlink"
                              active={activeKey === index}
                              component="button"
                              role="tab"
                              aria-controls="home-tab-pane"
                              aria-selected={activeKey === index}
                              onClick={() => {handleChangeSensorViewRynan(sensor, index)}}
                            >
                              { generateSensorName(sensor) }
                            </CNavLink>
                          </CNavItem>
                        </>
                      })
                    }
                  </CNav>
                  <CTabContent>
                    {
                      sensorListRynan.map((sensor, index) => {
                        return <>
                          <CTabPane role="tabpanel" aria-labelledby="profile-tab-pane" visible={activeKey === index}>
                            <table className="sensor-value__specific-sensor">
                              <thead>
                                <tr>
                                    <th className="time">Thời gian
                                      <Tooltip title="Sắp xếp theo thứ tự thời gian" placement="right" arrow>
                                        <span className="sort-button"
                                          onClick={() => handleSort()}
                                        >
                                          <FontAwesomeIcon icon={faSort}/>
                                        </span>
                                      </Tooltip>
                                    </th>
                                    <th className="index">Giá trị</th>
                                    <th></th>
                                </tr>
                              </thead>
                            </table>
                            <div className="sensor-value-div">
                              <table className="sensor-value__specific-sensor">
                                <tbody>
                                  {
                                    sensorValueListSort.map((certainTime, index) => {
                                      var sendDate = new Date(certainTime.ngay_gui);
                                      var strDate = addZero(sendDate.getHours()) + ":" + addZero(sendDate.getMinutes()) + ":" + addZero(sendDate.getSeconds()) + ", " + addZero(sendDate.getDate()) + '/' + addZero(sendDate.getMonth()+1) + "/" + sendDate.getFullYear();
                                      return  <tr key={index}>
                                                <td className="time">{ strDate }</td>
                                                <td className="index">{ certainTime[selectingSensorRynan] }</td>
                                              </tr>
                                    })
                                  }
                                </tbody>
                              </table>
                            </div>
                          </CTabPane>
                        </>
                      })
                    }
                  </CTabContent>
                </CCol>
                <CCol xs={4}>
                  <div className="station-detail2__body__table__general-index">
                    <div className="station-detail2__body__table__general-index__header">
                      Chỉ số chung
                    </div>
                    <div className="station-detail2__body__table__general-index__content">
                      <div className="station-detail2__body__table__general-index__content__time-lts">
                        Thời gian cập nhật gần nhất:
                        <div className="value">
                          { latestSensorValue[0]?.time }
                        </div>
                      </div>
                      <div className="station-detail2__body__table__general-index__content__sensor-value">
                        <div className="station-detail2__body__table__general-index__content__sensor-value__header">
                          Giá trị cảm biến:
                        </div>
                        <div className="station-detail2__body__table__general-index__content__sensor-value__table">
                          <table>
                            {
                              latestSensorValue.map((sensor, index) => {
                                return <tr key={index}>
                                  <td className="key">{ sensor.sensorName }:</td>
                                  <td className="value">{ sensor.sensorValue }</td>
                                </tr>
                              })
                            }
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </CCol>
              </CRow>  
            </div>
          }
      </>
    }
    const defaultPageCode = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dms_page_sensor_detail";

    return (<>
      <CustomIntroduction 
        pageCode={defaultPageCode}
        title="THÔNG TIN CHI TIẾT TRẠM"
        content="Hỗ trợ xem chi tiết thông tin trạm và các chỉ số đo được theo thời gian thực"
      />
      {
        !error ?
        <CRow className="station-detail2">
          <CCol>
            <CCard className="mb-4">

              { generateHeader() }

              <CCardBody className="station-detail2__body">
                <CRow>
                  <CCol xs={12}>

                    { generateToolBar() }

                    {/* chart */}
                    { viewMode === 'chart' && generateChart() }

                    {/* table */}
                    { viewMode === 'table' && generateTable() }
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        :
        <div className="error">
          Lỗi kết nối. Vui lòng thử lại sau. &nbsp;
          <span onClick={() => window.location.reload()}>Thử lại</span>
        </div>
      }
    </>)
}

export default StationDetail;
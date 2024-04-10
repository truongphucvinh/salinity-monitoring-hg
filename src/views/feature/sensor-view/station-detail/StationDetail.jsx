import React, { useEffect, useState } from "react"
import './StationDetail.scss'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCircleDown, faTableCells, faChevronLeft, faSort} from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";
import 'animate.css'

//modal 
import { CNav, CNavItem, CNavLink, CTabContent, CCard, CCardBody, CCol, CCardHeader, CRow, CTabPane } from '@coreui/react';

//chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
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
  Tooltip,
  Legend
);

// function zones(colors) {
//   return [{
//     value: 1707294600000,
//     dashStyle: 'dot',
//     color: colors[0],
//     // fillColor: '#7cb5ec'
//   }, {
//     value: 1706776200000,
//     dashStyle: 'solid',
//     color: colors[1]
//   }]
// }

// const colors = [
//   ['#7cb5ec', '#FFA262', '#7cb5ec'],
//   ['#7cb5ec', '#8bbc21', '#7cb5ec']
// ]
  
// Load Highcharts modules
require("highcharts/modules/exporting")(Highcharts);

const StationDetail = () => {
    const { id } = useParams();

    //tab
    const [activeKey, setActiveKey] = useState(0);

    //download card
    const [dateRange] = useState({startDate: '', endDate: ''});
    const [selectedDateRange, setSelectedDateRange] = useState({from: '', to: ''});
    const [visibleDownloadCard, setVisibleDownloadCard] = useState();

    //filter
    const [selectedDateRangeSort, setSelectedDateRangeSort] = useState({from: '', to: ''});

    const [sensorListRynan, setSensorListRynan] = useState([]);
    const [selectingSensorRynan, setSelectingSensorRynan] = useState(""); //sensor name
    const [viewMode, setViewMode] = useState("chart"); //mode name: table, chart, etc
    const [latestSensorValue, setLatestSensorValue] = useState([]); //latest value of sensors array
    const [sensorValueList, setSensorValueList] = useState([]); //all value for all sensor, backup
    const [sensorValueListSort, setSensorValueListSort] = useState([]); //table in screen
    const [sensorValueListForDownloading, setSensorValueListForDownloading] = useState();
    const [isLoadingSensorList, setIsLoadingSensorList] = useState(false);
    const [stationInfo, setStationInfo] = useState();
    const [dataStation, setDataStation] = useState({})

    //test
    var testDate = new Date(2024, 12, 12, 14, 59, 58);
    console.log("testDate: ", testDate);

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
    }, [])

    useEffect(() => {
      setIsLoadingSensorList(true);
      var currentDate = new Date();
      var dateStr = `${currentDate.getFullYear()}/${addZero(currentDate.getMonth()+1)}/${addZero(currentDate.getDate())}`;
      observation.getDataStation(id, "2024/01/01", dateStr, 1, 100000000) //1000?
        .then((res) => {
          setSensorValueListForDownloading([...res.data]);
          var reverseSensorValueList = [...res.data];
          setSensorValueList(reverseSensorValueList.reverse());
          setSensorValueListSort([...sensorValueList]);
          //station list
          var sensorList = [];
          var ltsValue = [];
          for(const sensor in res.data[0]) {
            if(sensor !== "trang_thai" && !isNaN(res.data[0][sensor]) && res.data[0][sensor] !== null) {
              sensorList.push(sensor);
              setSensorListRynan(sensorList);

              //set latest value for all sensor
              let ltsValue1Sensor = {sensorName: '', sensorValue: 0, time: ''};
              ltsValue1Sensor.sensorName = sensor;
              ltsValue1Sensor.sensorValue = res.data[res.data.length-1][sensor];
              var ltsDate = new Date(res.data[res.data.length-1].ngay_gui);
              ltsValue1Sensor.time = addZero(ltsDate.getHours()) + ":" + addZero(ltsDate.getMinutes()) + ":" + addZero(ltsDate.getSeconds()) + ", " + addZero(ltsDate.getDate()) + '/' + addZero(ltsDate.getMonth()+1) + "/" + ltsDate.getFullYear();
              ltsValue.push(ltsValue1Sensor);
              setLatestSensorValue(ltsValue);
            }
          }
          //options array
          var pointArray = [];
          res?.data.forEach((multi, index) => {
            var point = {
              x: new Date(multi.ngay_gui).getTime(),
              y: Number(selectingSensorRynan === "" ? multi[sensorList[0]] : multi[selectingSensorRynan]),
              color: '#1a2848'
            }
            pointArray.push(point);
            if(selectingSensorRynan === "") {
              setSelectingSensorRynan(sensorList[0]);
            }

            //dateRage
            var dateTime, strDate;
            if(index===0 || index===res?.data.length-1) { // start point or end point
              dateTime = new Date(point.x);
              strDate = `${dateTime.getFullYear()}-${addZero(dateTime.getMonth()+1)}-${addZero(dateTime.getDate())}`;
              if(index === 0) {
                dateRange.startDate = strDate;
                selectedDateRange.from = dateRange.startDate;
                selectedDateRangeSort.from = dateRange.startDate;
              } else {
                dateRange.endDate = strDate;
                selectedDateRange.to = dateRange.endDate;
                selectedDateRangeSort.to = dateRange.endDate;
              }
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
                },
                // zones: [{value: 3}, {value: 5, color: 'red'}]
                // zones: zones(colors[0])
              }]
            }
          )
          setIsLoadingSensorList(false);
        })
    }, [selectingSensorRynan])

    const handleChangeSensorViewRynan = (sensorName, index) => {
      setActiveKey(index);
      setSelectingSensorRynan(sensorName);
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
    
    const handleChangeSelectedSensorForDownloading = (e) => {
      if (e.target.checked) {
        setSelectedSensorForDownloading([...selectedSensorForDownloading, e.target.value]);
      } else {
        setSelectedSensorForDownloading(selectedSensorForDownloading.filter((item) => item !== e.target.value));
      }
      console.log("selected sensor list for download: ", selectedSensorForDownloading);
      console.log("dateRange: ", dateRange);
    }

    const handleSelectedDateRange = (e) => {
      console.log("sensorValueListAfterFilter: ", sensorValueListAfterFilter);
      if(e.target.name==="from") { //from thay doi
        if(new Date(e.target.value) <= new Date(selectedDateRange.to)) { //ok
          setSelectedDateRange({...selectedDateRange, from: e.target.value})
          console.log("abc: ", selectedDateRange);
        }
      }
      else {
        if(new Date(e.target.value) >= new Date(selectedDateRange.from)) { //ok
          setSelectedDateRange({...selectedDateRange, to: e.target.value})
        }
      }
    }

    var sensorValueListAfterFilter;
    const handleSelectedDateRangeSort = async (e) => {
      var from, to;
      if(e.target.name==="from") { //from thay doi
        if(new Date(e.target.value) <= new Date(selectedDateRangeSort.to)) { //ok
          setSelectedDateRangeSort({ ...selectedDateRangeSort, from: e.target.value });
          from = e.target.value;
          to = selectedDateRangeSort.to;
          sensorValueListAfterFilter = sensorValueList.filter((item) => {
            return ((new Date(item.ngay_gui).getTime()) >= (new Date(from.substring(0, 4), Number(from.substring(5, 7))-1, from.substring(8, 10), 0, 0, 0, 0).getTime()) 
                && (new Date(item.ngay_gui).getTime()) <= (new Date(to.substring(0, 4), Number(to.substring(5, 7) - 1), to.substring(8, 10), 23, 59, 59, 59).getTime()))
          })
          setSensorValueListSort(sensorValueListAfterFilter);
          console.log("aaaa: ", sensorValueListAfterFilter);  
        }
      }
      else { //to thay doi
        if(new Date(e.target.value) >= new Date(selectedDateRangeSort.from)) { //ok
          setSelectedDateRangeSort({ ...selectedDateRangeSort, to: e.target.value });
          from =selectedDateRangeSort.from;
          to = e.target.value;
          sensorValueListAfterFilter = sensorValueList.filter((item) => {
            return ((new Date(item.ngay_gui).getTime()) >= (new Date(from.substring(0, 4), Number(from.substring(5, 7))-1, from.substring(8, 10), 0, 0, 0, 0).getTime()) 
                && (new Date(item.ngay_gui).getTime()) <= (new Date(to.substring(0, 4), Number(to.substring(5, 7) - 1), to.substring(8, 10), 23, 59, 59, 59).getTime()))
          })
          setSensorValueListSort(sensorValueListAfterFilter);
        }
      }
    }

    const handleExportExcel = () => {
      var excelSheet = [];
      var colSheet = {};
      colSheet.ngay_gui = '';
      selectedSensorForDownloading.map((sensor) => {
        colSheet[sensor] = '';
        return sensor;
      })
      sensorValueListForDownloading.map((item) => {
        //chuyen ngay trong csdl ve dang chuan utc
        var sendDate = new Date(item.ngay_gui);
        item.ngay_gui = `${addZero(sendDate.getHours())}:${addZero(sendDate.getMinutes())}:${addZero(sendDate.getSeconds())}, ${addZero(sendDate.getDate())}/${addZero(sendDate.getMonth()+1)}/${sendDate.getFullYear()}`;
        var from, to;
        from = selectedDateRange.from;
        to = selectedDateRange.to;
        if((new Date(sendDate).getTime()) >= (new Date(from.substring(0, 4), Number(from.substring(5, 7))-1, from.substring(8, 10), 0, 0, 0, 0).getTime()) 
          && (new Date(sendDate).getTime()) <= (new Date(to.substring(0, 4), Number(to.substring(5, 7) - 1), to.substring(8, 10), 23, 59, 59, 59).getTime()))  
        {
          for(const key in colSheet) {
            colSheet[key] = item[key];
          }
          excelSheet.push({...colSheet});
        }
        //tra lai dinh dang ban dau
        item.ngay_gui = sendDate;
        return item;
      })
      var wb = XLSX.utils.book_new();
      var ws = XLSX.utils.json_to_sheet(excelSheet);
      XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
      XLSX.writeFile(wb, "MyExcel.xlsx");

      //unckeck ckeckbox
      let inputs = document.querySelectorAll('.ckeckbox-sensor-downloading');
      for (let i = 0; i < inputs.length; i++) {
          inputs[i].checked = false;
      }
      selectedDateRange.from = dateRange.startDate;
      selectedDateRange.to = dateRange.endDate;
      setVisibleDownloadCard(false);
    }

    const addZero = (no) => {
      return no < 10 ? '0' + no : no;
    }

    const handleSort = () => {
      console.log("sensor list reverse: ", sensorValueListSort.reverse());
      var reverseList = [...sensorValueListSort];
      console.log("reverse: ", reverseList);
      setSensorValueListSort(reverseList);
    }

    const generateHeader = () => {
      return <>
        <CCardHeader className="station-detail2__header">
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
        </CCardHeader>
      </>
    }

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

    const generateToolBar = () => {
      return <>
        <CRow>
          <CCol xs={4}>
            {
              viewMode === 'table' && 
              <div className="station-detail2__body__date-range-sort">
                <label htmlFor="">Từ</label>
                <input type="date" 
                  value={selectedDateRangeSort.from} 
                  min={dateRange.startDate} 
                  max={dateRange.endDate} 
                  name="from"
                  onChange={handleSelectedDateRangeSort}
                  
                />
                <label htmlFor="">đến</label>
                <input 
                  type="date" value={selectedDateRangeSort.to} 
                  min={dateRange.startDate} 
                  max={dateRange.endDate} 
                  name="to"
                  onChange={handleSelectedDateRangeSort}
                />
              </div>
            }
          </CCol>
          <CCol xs={8} className="station-detail2__body__formating">
            {
              viewMode === 'table' && 
              <button className="download-btn"
                onClick={() => {setVisibleDownloadCard(!visibleDownloadCard)}}
              >
                <FontAwesomeIcon icon={faCircleDown}/>
                &nbsp;
                Tải xuống
              </button>
            }
            <div 
              className={viewMode === 'table' ? "station-detail2__body__formating__item station-detail2__body__formating__item--active" : "station-detail2__body__formating__item"} 
              onClick={() => {handleChangeViewModeRynan('table')}}
            >
              <FontAwesomeIcon icon={faTableCells}/>
            </div>
            <div 
              className={viewMode === 'chart'? "station-detail2__body__formating__item station-detail2__body__formating__item--active" : "station-detail2__body__formating__item"} 
              onClick={() => {handleChangeViewModeRynan('chart')}}
            >
              <FontAwesomeIcon icon={faChartLine}/>
            </div>
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
                          <label htmlFor="">{sensor}</label>
                        </span>
                      })
                    }
                  </div>
                </div>
              </div>
              <div className="download-card__button">
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
                            { sensor }
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
                              { sensor }
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
                                      <span className="sort-button"
                                        onClick={() => handleSort()}
                                      >
                                        <FontAwesomeIcon icon={faSort}/>
                                      </span>
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

    return (<>
      <CustomIntroduction 
        title={'THÔNG TIN TRẠM CHI TIẾT'}
        content={'Hỗ trợ theo dõi thông tin chi tiết của trạm cảm biến'}
      />
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
    </>)
}

export default StationDetail;
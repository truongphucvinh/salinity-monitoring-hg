import React, { useEffect } from "react"
import './StationDetail.scss'

import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { faTableCells } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faCircleDown } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";

//modal 
import { CNav, CNavItem, CNavLink, CTabContent } from '@coreui/react';

//chart
import { CCard, CCardBody, CCol, CCardHeader, CRow, CTabPane } from '@coreui/react'

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
import { useState } from 'react';

//higth chart 
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'

//service
import observation from "src/services/observation";
import station from "src/services/station";

import { useParams } from "react-router-dom";
import CustomIntroduction from "src/views/customs/my-introduction";

// import XLSX from "xlsx";
import { CSVLink } from "react-csv";
import * as XLSX from 'xlsx/xlsx.mjs';

function zones(colors) {
  return [{
    value: 1707294600000,
    dashStyle: 'dot',
    color: colors[0],
    // fillColor: '#7cb5ec'
  }, {
    value: 1706776200000,
    dashStyle: 'solid',
    color: colors[1]
  }]
}

const getTime = (date) => {
  return new Date(date).getTime();
}

const colors = [
  ['#7cb5ec', '#FFA262', '#7cb5ec'],
  ['#7cb5ec', '#8bbc21', '#7cb5ec']
]
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  

const StationDetail = () => {
    const { id } = useParams();
    //tab
    const [activeKey, setActiveKey] = useState(0);

    //download card
    const [dateRange, setDateRange] = useState({startDate: '', endDate: ''});
    const [selectedDateRange, setSelectedDateRange] = useState({from: '', to: ''});
    const [visibleDownloadCard, setVisibleDownloadCard] = useState(false);

    const [sensorListRynan, setSensorListRynan] = useState([]);
    const [selectingSensorRynan, setSelectingSensorRynan] = useState(""); //sensor name
    const [viewMode, setViewMode] = useState("table"); //mode name: table, chart, etc
    const [latestSensorValue, setLatestSensorValue] = useState([]); //latest value of sensors array
    const [sensorValueList, setSensorValueList] = useState([]); //all value for all sensor
    const [isLoadingSensorList, setIsLoadingSensorList] = useState(false);
    const [stationInfo, setStationInfo] = useState();
    const [dataStation, setDataStation] = useState(
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
              return 'Thời gian: <b>' + new Date(this.x).toLocaleString() + '</b>' + '<br/>Giá trị: <b>' +  this.y + '</b>';
          }
        },
      
        series: [{
          data: [],
          zoneAxis: 'x',
          marker: {
            symbol: "circle",
            radius: 3,
            enabled: true
          },
          // zones: [{value: 3}, {value: 5, color: 'red'}]
          // zones: zones(colors[0])
        }]
      }
    )

    //lay thong tin tram
    useEffect(() => {
      setIsLoadingSensorList(true);
      station.getStationListByRyan()
        .then((res) => {
          res.data.map((station) => {
            if(id==station.so_serial) {
              setStationInfo(station);
            }
          })
          setIsLoadingSensorList(false);
        })
    }, [])

    useEffect(() => {
      setIsLoadingSensorList(true);
      observation.getDataStation(id, "", "", 1, 1000) //1000?
        .then((res) => {
          setSensorValueList(res.data);
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
              ltsValue1Sensor.time = new Date(res.data[res.data.length-1].ngay_gui).toLocaleString();
              ltsValue.push(ltsValue1Sensor);
              setLatestSensorValue(ltsValue);
            }
          }
          //options array
          var pointArray = [];
          res?.data.map((multi, index) => {
            var point = {
              x: new Date(multi.ngay_gui.substring(0, multi.ngay_gui.length-5)).getTime(),
              y: Number(selectingSensorRynan == "" ? multi[sensorList[0]] : multi[selectingSensorRynan]),
              color: '#1a2848'
            }
            pointArray.push(point);
            if(selectingSensorRynan=="") {
              setSelectingSensorRynan(sensorList[0]);
            }

            //dateRage
            var dateTime = new Date(point.x);
            var date, month;
            date = dateTime.getDate() < 10 ? "0"+Number(dateTime.getDate()) : dateTime.getDate();
            month = dateTime.getMonth() < 9 ? "0"+Number(dateTime.getMonth()+1) : dateTime.getMonth()+1;
            var dateString = dateTime.getFullYear() + "-" + month + "-" + date;
            console.log("dateStr: ", dateString);
            if(index===0) {
              dateRange.startDate = dateString;
              selectedDateRange.from = dateRange.startDate;
            }
            if(index===res?.data.length-1) {
              dateRange.endDate = dateString;
              selectedDateRange.to = dateRange.endDate;
            }
          })
          // setSelectingMultiDTSValue(res);
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
                    return 'Thời gian: <b>' + new Date(this.x).toLocaleString() + '</b>' + '<br/>Giá trị: <b>' +  this.y + '</b>';
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
      console.log("date: ", e.target.name);
      var fromTo = {from: selectedDateRange.from, to: selectedDateRange.to};
      fromTo[e.target.name] = e.target.value;
      setSelectedDateRange(fromTo);
      console.log("selected date time: ", selectedDateRange);
    }

    const handleExportExcel = () => {
      var excelSheet = [];
      var colSheet = {};
      colSheet.ngay_gui = '';

      selectedSensorForDownloading.map((sensor) => {
        colSheet[sensor] = '';
      })

      sensorValueList.map((item) => {
        //chuyen ngay trong csdl ve dang chuan utc
        var sendDate = new Date(item.ngay_gui.substring(0, 4), Number(item.ngay_gui.substring(5, 7))-1, item.ngay_gui.substring(8, 10), item.ngay_gui.substring(11, 13), item.ngay_gui.substring(14, 16), item.ngay_gui.substring(17, 19));
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
      })
      console.log("colSheet: ", excelSheet);

      console.log("Sensor value list: ", excelSheet);
      var wb = XLSX.utils.book_new();
      var ws = XLSX.utils.json_to_sheet(excelSheet);
      XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
      XLSX.writeFile(wb, "MyExcel.xlsx");
    }

    return (<>
      <CustomIntroduction 
        title={'THÔNG TIN TRẠM CHI TIẾT'}
        content={'Hỗ trợ theo dõi thông tin chi tiết của trạm cảm biến'}
      />
      <CRow className="station-detail2">
        <CCol xs>
          <CCard className="mb-4">
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
            <CCardBody className="station-detail2__body">
              <CRow>
                <CCol xs={12}>
                  <CRow>
                    <CCol xs={12} className="station-detail2__body__formating">
                      <div 
                        className={viewMode=='table'? "station-detail2__body__formating__item station-detail2__body__formating__item--active" : "station-detail2__body__formating__item"} 
                        onClick={() => {handleChangeViewModeRynan('table')}}
                      >
                        <FontAwesomeIcon icon={faTableCells}/>
                      </div>
                      <div 
                        className={viewMode=='chart'? "station-detail2__body__formating__item station-detail2__body__formating__item--active" : "station-detail2__body__formating__item"} 
                        onClick={() => {handleChangeViewModeRynan('chart')}}
                      >
                        <FontAwesomeIcon icon={faChartLine}/>
                      </div>
                    </CCol>
                  </CRow>

                  {/* chart */}
                  {
                    viewMode=='chart' && <div>
                      <CRow>
                        <CCol>
                          <CNav variant="tabs" role="tablist">
                            {
                              sensorListRynan.map((sensor, index) => {
                                return <>
                                  <CNavItem role="presentation" key={index}>
                                    <CNavLink
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

                  {/* table */}
                  {
                    viewMode=='table' && <div>
                      <CRow className="station-detail2__body__table" style={{position: 'relative'}}>
                        <CCol xs={6} style={{position: 'relative'}}>
                          <CNav variant="tabs" role="tablist" >
                            {
                              sensorListRynan.map((sensor, index) => {
                                return <>
                                  <CNavItem role="presentation">
                                    <CNavLink
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
                            <div className="download-btn"
                              onClick={() => {setVisibleDownloadCard(!visibleDownloadCard)}}
                            >
                              <FontAwesomeIcon icon={faCircleDown}/>
                              &nbsp;
                              Tải xuống
                            </div>
                          </CNav>
                          {/* <div className="station-detail2__body__table__seperate-index__download-btn"
                              onClick={() => handleExportExcel()}
                            >
                              Tải xuống
                          </div> */}
                          {
                            visibleDownloadCard && <>
                              <div className="download-card">
                                {/* <div className="download-card__heading">
                                  Tải xuống
                                </div> */}
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
                                        <label htmlFor="">Đến</label>
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
                                            <input type="checkbox" name="sensor" value={sensor} id="" onChange={handleChangeSelectedSensorForDownloading}/>
                                            <label htmlFor="">{sensor}</label>
                                          </span>
                                        })
                                      }
                                    </div>
                                  </div>
                                </div>
                                <div className="download-card__button">
                                  <div className="download-card__button__download"
                                    onClick={() => handleExportExcel()}
                                  >
                                    Tải xuống
                                  </div>
                                </div>
                              </div>
                            </>
                          }
                          <CTabContent>
                            {
                              sensorListRynan.map((sensor, index) => {
                                return <>
                                  <CTabPane role="tabpanel" aria-labelledby="profile-tab-pane" visible={activeKey === index}>
                                    <table className="sensor-value__specific-sensor">
                                      <thead>
                                        <tr>
                                            <th className="time">Thời gian</th>
                                            <th className="index">Giá trị</th>
                                            <th></th>
                                        </tr>
                                      </thead>
                                    </table>
                                    <div className="sensor-value-div">
                                      <table className="sensor-value__specific-sensor">
                                        <tbody>
                                          {
                                            sensorValueList.map((certainTime, index) => {
                                              return  <tr key={index}>
                                                        <td className="time">{ new Date(certainTime.ngay_gui).toLocaleString() }</td>
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
                        <CCol xs={6} className="station-detail2__body__table__general-index">
                          <div className="station-detail2__body__table__general-index__header">
                            Chỉ số gần nhất
                          </div>
                          <div className="station-detail2__body__table__general-index__table">
                            <table className="station-value">
                                <thead>
                                  <tr>
                                      <th className="time">Thời gian</th>
                                      <th className="type">Cảm biến</th>
                                      <th className="index">Giá trị</th>
                                      {/* <th className="unit">Đơn vị</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                  {
                                    latestSensorValue.map((sensor, index) => {
                                      return <>
                                        <tr>
                                          <td className="time">{ sensor.time }</td>
                                          <td>{ sensor.sensorName }</td>
                                          <td className="index">{ sensor.sensorValue }</td>
                                          {/* <td className="unit">ppt</td> */}
                                        </tr>
                                      </>
                                    })
                                  }
                                </tbody>
                            </table>
                          </div>
                          
                        </CCol>
                      </CRow>  
                    </div>
                  }
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>)
}

export default StationDetail;
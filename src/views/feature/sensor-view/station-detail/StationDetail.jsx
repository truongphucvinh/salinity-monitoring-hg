import React, { useEffect, useRef } from "react"
import './StationDetail.scss'

import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { faTableCells } from "@fortawesome/free-solid-svg-icons";

//modal 
import { CModal, CNav, CNavItem, CNavLink, CTabContent } from '@coreui/react';

//chart
import { CCard, CCardBody, CCol, CCardHeader, CRow, CTabPane } from '@coreui/react'
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs'

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
  import { Line } from 'react-chartjs-2';
import { useState } from 'react';

//higth chart 
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import exportingModule from "highcharts/modules/exporting";

//select sensor list
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

//service
import thingService from 'src/services/thing';

//select
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useParams } from "react-router-dom";
const optionss = {
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
    data: [[1640269800000,176.28],[1640615400000,180.33],[1640701800000,179.29],[1640788200000,179.38],[1640874600000,178.2],[1640961000000,177.57],[1641220200000,182.01],[1641306600000,179.7],[1641393000000,174.92],[1641479400000,172],[1641565800000,172.17]]
  }]
}
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  export const options = {
    responsive: true,
    plugins: {
      legend: {
        // position: 'top' as const
      },
      title: {
        display: false,
        text: 'Chart.js Line Chart',
      },
    },
  };
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'January', 'February', 'March', 'April', 'May', 'June', 'July'];
  
  export const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => Math.round(Math.random() * 5)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: labels.map(() => Math.round(Math.random() * 5)),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

const StationDetail = () => {
    const { id } = useParams()
    const [value, setValue] = React.useState([
        dayjs('2022-04-17'),
        dayjs('2022-04-21'),
      ]);

    const random = () => Math.round(Math.random() * 100)

    //sensor list
    const [sensorList, setSensorList] = useState([])

    const [selectedSensorId, setSelectedSensorId] = useState(0); //id
    const [selectedSensor, setSelectedSensor] = useState();

    const [thing, setThing] = useState();

    const handleChangeSensor = (event) => {
      setSelectedSensor(handelChangSelectedSensor(event.target.value))
      setSelectedSensorId(event.target.value);
    } 

    //tab
    const [activeKey, setActiveKey] = useState(0);

    const [multiDTSStation, setMultiDTSStation] = useState();


    useEffect(() => {
      console.log("id thing: ", id);
      //get sensor list in specific thing/station
      var thingId = JSON.parse(localStorage.getItem('thingInfo'))?.id;
      thingService.getThingById(id)
        .then((res) => {
          setThing(res);
          console.log("thing info: ", res);
          setMultiDTSStation(res?.multiDataStreamDTOs);
          //loc danh sach station
          var sensorLists = []; 
          res?.multiDataStreamDTOs.map((multiDTS) => {
            sensorLists.push(multiDTS.sensor);
            setSensorList(sensorLists);
            console.log("sensor list: ", sensorLists);
          })
          console.log("res thing info: ", res);
          return sensorLists;
        })
        .then((res) => {
          setSelectedSensorId(res[0]?.sensorId);
          setSelectedSensor(handelChangSelectedSensor(res[0].Id))
        })
    }, [])

    const handelChangSelectedSensor = (sensorId) => {
      for(let i=0; sensorList.length-1; i++) {
        if(sensorId==sensorList[i]?.sensorId) {
          return sensorList[i];
        }
      }
    }

    return (<>
        <CRow className="station-detail2">
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader className="station-detail2__header">Danh sách trạm</CCardHeader>
            <CCardBody className="station-detail2__body">
              <CRow>
                <CCol xs={12}>
                  {/* <div className="station-detail">
                    <div className="station-detail__heading">
                        <div className="station-detail__heading__title">
                                { thing?.nameThing }
                        </div>
                    </div>
                    <div className="station-detail__sensor-list">
                      <FormControl sx={{ m: 0, minWidth: 480 }}>
                        <Select
                        sx={{
                          backgroundColor: "white",
                          color: "black",
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: '#00000050',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: "1px solid #00000050",
                            borderColor: '#00000050',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            // borderColor: 'black',
                            border: "1px solid #00000050",
                          },
                          '.MuiSvgIcon-root ': {
                            fill: "black !important",
                          }
                        }}
                          value={selectedSensorId}
                          onChange={handleChangeSensor}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          {
                            sensorList.map((sensor, index) => {
                              return <MenuItem value={sensor.sensorId} key={index}>{ sensor.sensorName }</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                    </div>
                    <div className="station-detail__content">
                        <div className="station-detail__content__table">
                          <CNav variant="tabs" role="tablist">
                            <CNavItem role="presentation">
                              <CNavLink
                                active={activeKey === 1}
                                component="button"
                                role="tab"
                                aria-controls="home-tab-pane"
                                aria-selected={activeKey === 1}
                                onClick={() => setActiveKey(1)}
                              >
                                Trạm
                              </CNavLink>
                            </CNavItem>
                            <CNavItem role="presentation">
                              <CNavLink
                                active={activeKey === 2}
                                component="button"
                                role="tab"
                                aria-controls="profile-tab-pane"
                                aria-selected={activeKey === 2}
                                onClick={() => setActiveKey(2)}
                              >
                                Cảm biến
                              </CNavLink>
                            </CNavItem>
                          </CNav>
                          <CTabContent>
                            <CTabPane role="tabpanel" aria-labelledby="home-tab-pane" visible={activeKey === 1}>
                              <table className="station-value">
                                <tr>
                                  <th className="type">Cảm biến</th>
                                  <th className="index">Giá trị</th>
                                  <th className="unit">Đơn vị</th>
                                  <th className="time">Thời gian</th>
                                </tr>
                                {
                                  sensorList.map((sensor, index) => {
                                    return <>
                                      <tr>
                                        <td>{ sensor.sensorName }</td>
                                        <td className="index">{ 9.6+index }</td>
                                        <td className="unit">ppt</td>
                                        <td className="time">08:00 27/12/2023</td>
                                      </tr>
                                    </>
                                  })
                                }
                              </table>
                            </CTabPane>
                            <CTabPane role="tabpanel" aria-labelledby="profile-tab-pane" visible={activeKey === 2}>
                              <table className="sensor-value">
                                <tr>
                                    <th className="time">Thời gian</th>
                                    <th className="index">Giá trị</th>
                                </tr>
                                <tr>
                                    <td>06:00 27/12/2023</td>
                                    <td className="index">25</td>
                                </tr>
                                <tr>
                                    <td>06:30 27/12/2023</td>
                                    <td className="index">25.5</td>
                                </tr>
                                <tr>
                                    <td>07:00 27/12/2023</td>
                                    <td className="index">26</td>
                                </tr>
                                <tr>
                                    <td>07:30 27/12/2023</td>
                                    <td className="index">26</td>
                                </tr>
                                <tr>
                                    <td>08:00 27/12/2023</td>
                                    <td className="index">28</td>
                                </tr>
                              </table>
                            </CTabPane>
                          </CTabContent>
                            
                        </div>
                        <div className="station-detail__content__chart">
                            <div className="station-detail__content__chart__heading">
                                <div className="station-detail__content__chart__heading__title">
                                    Biểu đồ
                                </div>
                                <div className="station-detail__content__chart__heading__download-btn">
                                </div>
                            </div>
                            <div className="station-detail__content__chart__chart">
                                <HighchartsReact
                                  highcharts={Highcharts}
                                  constructorType={'stockChart'}
                                  options={optionss}
                                />

                            </div>
                        </div>
                    </div>
                  </div> */}

                  <CRow>
                    <CCol xs={12} className="station-detail2__body__formating">
                      <div className="station-detail2__body__formating__item">
                        <FontAwesomeIcon icon={faTableCells}/>
                      </div>
                      <div className="station-detail2__body__formating__item station-detail2__body__formating__item--active">
                        <FontAwesomeIcon icon={faChartLine}/>
                      </div>
                    </CCol>
                  </CRow>
                  <CRow className="station-detail2__body__table">
                    <CCol xs={6} className="station-detail2__body__table__general-index">
                      <div className="station-detail2__body__table__general-index__header">
                        Chỉ số chung
                      </div>
                      <div className="station-detail2__body__table__general-index__table">
                        <table className="station-value">
                              <tr>
                                <th className="time">Thời gian</th>
                                <th className="type">Cảm biến</th>
                                <th className="index">Giá trị</th>
                                <th className="unit">Đơn vị</th>
                              </tr>
                              {
                                sensorList.map((sensor, index) => {
                                  return <>
                                    <tr>
                                      <td className="time">08:00 27/12/2023</td>
                                      <td>{ sensor.sensorName }</td>
                                      <td className="index">{ 9.6+index }</td>
                                      <td className="unit">ppt</td>
                                    </tr>
                                  </>
                                })
                              }
                        </table>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <CNav variant="tabs" role="tablist">
                        {
                          sensorList.map((sensor, index) => {
                            return <>
                              <CNavItem role="presentation">
                                <CNavLink
                                  active={activeKey === index}
                                  component="button"
                                  role="tab"
                                  aria-controls="home-tab-pane"
                                  aria-selected={activeKey === index}
                                  onClick={() => setActiveKey(index)}
                                >
                                  { sensor.sensorName }
                                </CNavLink>
                              </CNavItem>
                            </>
                          })
                        }
                      </CNav>
                      <CTabContent>
                        {
                          sensorList.map((sensor, index) => {
                            return <>
                              <CTabPane role="tabpanel" aria-labelledby="profile-tab-pane" visible={activeKey === index}>
                                <table className="sensor-value__specific-sensor">
                                  <tr>
                                      <th className="time">Thời gian</th>
                                      <th className="index">Giá trị</th>
                                      <th></th>
                                  </tr>
                                  <tr>
                                      <td>06:00 27/12/2023</td>
                                      <td className="index">25</td>
                                  </tr>
                                  <tr>
                                      <td>06:30 27/12/2023</td>
                                      <td className="index">25.5</td>
                                  </tr>
                                  <tr>
                                      <td>07:00 27/12/2023</td>
                                      <td className="index">26</td>
                                  </tr>
                                  <tr>
                                      <td>07:30 27/12/2023</td>
                                      <td className="index">26</td>
                                  </tr>
                                  <tr>
                                      <td>08:00 27/12/2023</td>
                                      <td className="index">28</td>
                                  </tr>
                                </table>
                              </CTabPane>
                            </>
                          })
                        }
                      </CTabContent>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CNav variant="tabs" role="tablist">
                        {
                          sensorList.map((sensor, index) => {
                            return <>
                              <CNavItem role="presentation">
                                <CNavLink
                                  active={activeKey === index}
                                  component="button"
                                  role="tab"
                                  aria-controls="home-tab-pane"
                                  aria-selected={activeKey === index}
                                  onClick={() => setActiveKey(index)}
                                >
                                  { sensor.sensorName }
                                </CNavLink>
                              </CNavItem>
                            </>
                          })
                        }
                      </CNav>
                      <CTabContent>
                        {
                          sensorList.map((sensor, index) => {
                            return <>
                              <CTabPane role="tabpanel" aria-labelledby="profile-tab-pane" visible={activeKey === index}>
                                <HighchartsReact
                                  highcharts={Highcharts}
                                  constructorType={'stockChart'}
                                  options={optionss}
                                />
                              </CTabPane>
                            </>
                          })
                        }
                      </CTabContent>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>)
}

export default StationDetail;
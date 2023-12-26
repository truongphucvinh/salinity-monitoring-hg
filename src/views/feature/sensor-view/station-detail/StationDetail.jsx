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
    const [value, setValue] = React.useState([
        dayjs('2022-04-17'),
        dayjs('2022-04-21'),
      ]);

      const random = () => Math.round(Math.random() * 100)

    const [dateRange, setDateRange] = useState([null, null]);

    //sensor list
    const [displaySensorList, setDisplaySensorList] = useState(false);
    const [sensorList, setSensorList] = useState([])

    const [selectedSensorId, setSelectedSensorId] = useState(0); //id

    const [thing, setThing] = useState();

    const handleChangeSensor = (event) => {
      setSelectedSensorId(event.target.value);
    } 

    //tab
    const [activeKey, setActiveKey] = useState(2);


    useEffect(() => {
      //get sensor list in specific thing/station
      var thingId = JSON.parse(localStorage.getItem('thingInfo'))?.id;
      thingService.getThingById(thingId)
        .then((res) => {
          setThing(res);
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
        })
    }, [])

    return (<>
        <div className="station-detail">
            <div className="station-detail__heading">
                <div className="station-detail__heading__title">
                        Trạm đo mặn số 1
                </div>
            </div>
               {/*<div className="station-detail__date-selection">
                  <div className="station-detail__date-selection__left">
                   <div className="station-detail__date-selection__sensor-option" onClick={() => setDisplaySensorList(true)}>
                      <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.46447 15.5355C6.51185 13.5829 6.51185 10.4171 8.46447 8.46447M5.63592 18.364C2.1212 14.8493 2.1212 9.15077 5.63592 5.63605M15.5355 15.5355C17.4881 13.5829 17.4881 10.4171 15.5355 8.46447M18.364 18.364C21.8788 14.8493 21.8788 9.15077 18.364 5.63605M13 12.0001C13 12.5523 12.5523 13.0001 12 13.0001C11.4477 13.0001 11 12.5523 11 12.0001C11 11.4478 11.4477 11.0001 12 11.0001C12.5523 11.0001 13 11.4478 13 12.0001Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="sensor-name">Cảm biến độ mặn</span>
                    </div>
                    <div className="division"></div>
                    <div className="station-detail__date-selection__show-by">
                        Hiển thị theo 
                        <select name="" id="">
                            <option value="">giờ</option>
                            <option value="">ngày</option>
                            <option value="">tuần</option>
                        </select>
                    </div>
                    <div className="station-detail__date-selection__period">
                        <FontAwesomeIcon icon={faCalendar} style={{height: '20px', width: '20px'}}/>
                        <DatePicker
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => {
                                setDateRange(update);
                            }}
                            isClearable={false}
                        />
                    </div>
                    <div className="station-detail__date-selection__filter-btn">
                        Lọc
                    </div>

                    </div> 
                    <div className="station-detail__date-selection__download-btn">
                        <FontAwesomeIcon icon={faDownload}/>        
                        <span>Tải xuống excel</span>
                    </div>
                </div>*/}

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
                        Cảm biến độ mặn
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
                        <tr>
                          <td>Độ mặn</td>
                          <td className="index">9.6</td>
                          <td className="unit">ppt</td>
                          <td className="time">12:00 15/12/2023</td>
                        </tr>
                        <tr>
                          <td>Độ mặn</td>
                          <td className="index">9.6</td>
                          <td className="unit">ppt</td>
                          <td className="time">12:00 15/12/2023</td>
                        </tr>
                        <tr>
                          <td>Độ mặn</td>
                          <td className="index">9.6</td>
                          <td className="unit">ppt</td>
                          <td className="time">12:00 15/12/2023</td>
                        </tr>
                        <tr>
                          <td>Độ mặn</td>
                          <td className="index">9.6</td>
                          <td className="unit">ppt</td>
                          <td className="time">12:00 15/12/2023</td>
                        </tr>
                        <tr>
                          <td>Độ mặn</td>
                          <td className="index">9.6</td>
                          <td className="unit">ppt</td>
                          <td className="time">12:00 15/12/2023</td>
                        </tr>
                      </table>
                    </CTabPane>
                    <CTabPane role="tabpanel" aria-labelledby="profile-tab-pane" visible={activeKey === 2}>
                      <table className="sensor-value">
                        <tr>
                            <th className="time">Thời gian</th>
                            <th className="index">Giá trị</th>
                        </tr>
                        <tr>
                            <td>12:00 15/12/2023</td>
                            <td className="index">9.6</td>
                        </tr>
                        <tr>
                            <td>12:00 15/12/2023</td>
                            <td className="index">9.6</td>
                        </tr>
                        <tr>
                            <td>12:00 15/12/2023</td>
                            <td className="index">9.6</td>
                        </tr>
                        <tr>
                            <td>12:00 15/12/2023</td>
                            <td className="index">9.6</td>
                        </tr>
                        <tr>
                            <td>12:00 15/12/2023</td>
                            <td className="index">9.6</td>
                        </tr>
                      </table>
                    </CTabPane>
                  </CTabContent>
                    
                </div>
                <div className="station-detail__content__chart">
                    <div className="station-detail__content__chart__heading">
                        <div className="station-detail__content__chart__heading__title">
                            Biểu đồ độ mặn
                        </div>
                        <div className="station-detail__content__chart__heading__download-btn">
                            {/* <FontAwesomeIcon icon={faDownload}/>         */}
                            {/* <span>Tải xuống</span> */}
                        </div>
                    </div>
                    <div className="station-detail__content__chart__chart">
                        {/* <Line options={options} data={data}/> */}
                        {/* <div id="container"></div> */
                        <HighchartsReact
                          highcharts={Highcharts}
                          constructorType={'stockChart'}
                          options={optionss}
                        />}

                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default StationDetail;
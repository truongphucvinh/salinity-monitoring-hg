import React, { useEffect } from "react"
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

//select
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
  
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
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  
  export const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => Math.round(Math.random() * 100)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: labels.map(() => Math.round(Math.random() * 100)),
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
    const [startDate, endDate] = dateRange;

    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
      setAge(event.target.value);
    };

    //sensor list
    const [displaySensorList, setDisplaySensorList] = useState(false);
    const [sensorList, setSensorList] = useState([
      {
        id: 1,
        name: "sensor 1",
        description: "sensor 1 description"
      },
      {
        id: 2,
        name: "sensor 2",
        description: "sensor 2 description"
      },
      {
        id: 3,
        name: "sensor 3",
        description: "sensor 2 description"
      },
      {
        id: 4,
        name: "sensor 4",
        description: "sensor 2 description"
      },
      {
        id: 5,
        name: "sensor 5",
        description: "sensor 2 description"
      }
    ])

    const [selectedSensor, setSelectedSensor] = useState(
      {
        id: 2,
        name: "sensor 2",
        description: "sensor 2 description"
      }
    );

    const handleChangeSensor = (sensorId) => {
      if(sensorId!=selectedSensor.id) {
        //goi api lay gia tri cua sensorId
        setDisplaySensorList(false);
      }
    } 

    //tab
    const [activeKey, setActiveKey] = useState(1)


    useEffect(() => {
        console.log("abc");
      }, [dateRange])

    return (<>
        <div className="station-detail">
            <div className="station-detail__heading">
                <div className="station-detail__heading__title">
                        Trạm đo mặn số 1
                </div>
            </div>
            <div className="station-detail__date-selection">
                <div className="station-detail__date-selection__left">
                    <div className="station-detail__date-selection__sensor-option" onClick={() => setDisplaySensorList(true)}>
                      <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.46447 15.5355C6.51185 13.5829 6.51185 10.4171 8.46447 8.46447M5.63592 18.364C2.1212 14.8493 2.1212 9.15077 5.63592 5.63605M15.5355 15.5355C17.4881 13.5829 17.4881 10.4171 15.5355 8.46447M18.364 18.364C21.8788 14.8493 21.8788 9.15077 18.364 5.63605M13 12.0001C13 12.5523 12.5523 13.0001 12 13.0001C11.4477 13.0001 11 12.5523 11 12.0001C11 11.4478 11.4477 11.0001 12 11.0001C12.5523 11.0001 13 11.4478 13 12.0001Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="sensor-name">Sensor 1</span>
                      {/* <span className="change-btn">Xem khác</span> */}
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
                        Dữ liệu trạm
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
                        Dữ liệu cảm biến độ mặn
                      </CNavLink>
                    </CNavItem>
                  </CNav>
                  <CTabContent>
                    <CTabPane role="tabpanel" aria-labelledby="home-tab-pane" visible={activeKey === 1}>
                      <table>
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
                    <CTabPane role="tabpanel" aria-labelledby="profile-tab-pane" visible={activeKey === 2}>
                      <table>
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
                            <FontAwesomeIcon icon={faDownload}/>        
                            {/* <span>Tải xuống</span> */}
                        </div>
                    </div>
                    <div className="station-detail__content__chart__chart">
                        <Line options={options} data={data}/>
                    </div>
                </div>
            </div>
        </div>

        {/* sensor list modal */}
        <CModal
            backdrop="static"
            alignment="center"
            visible={displaySensorList}
            onClose={() => setDisplaySensorList(false)}
            aria-labelledby="StaticBackdropExampleLabel"
            className='sensor-list'
        >
          <div className="sensor-list">
            <div className="sensor-list__title">
                Danh sách cảm biến Trạm 1
            </div>
            <div className="sensor-list__list">
              {
                sensorList.map((sensor) => {
                  return <>
                    <div 
                      className={"sensor-list__list__item " + (sensor.id == selectedSensor.id ? 'sensor-list__list__item--is-selected' : '')}
                      onClick={() => handleChangeSensor(sensor.id)}
                    >
                      <div className="sensor-list__list__item__name">
                        { sensor.name }
                      </div>
                      <div className="sensor-list__list__item__description">
                        { sensor.description }
                      </div>
                    </div>
                  </>
                })
              }
            </div>
            <div className="sensor-list__action">
              <div className="sensor-list__action__cancel-btn"
                onClick={() => setDisplaySensorList(false)}
              >
                Đóng
              </div>
            </div>
          </div>
        </CModal>
    </>)
}

export default StationDetail;
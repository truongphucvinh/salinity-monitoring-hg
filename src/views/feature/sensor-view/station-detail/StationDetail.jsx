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

//chart
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
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
    </>)
}

export default StationDetail;
import { useState, useEffect } from 'react'
import * as React from 'react';
import './StationList.scss'
import { CButton, CForm, CFormInput, CFormSelect, CTableDataCell } from '@coreui/react';
//service
import stationService from 'src/services/station';
import observation from "src/services/observation";
import { generateSensorName } from 'src/tools';
//bootstrap
import { CRow, CCol, CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CModal } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilTouchApp, cilTrash } from '@coreui/icons'
//modal
import { useNavigate } from 'react-router-dom';
import CustomIntroduction from 'src/views/customs/my-introduction';
import CustomModal from 'src/views/customs/my-modal';
import useCamera from 'src/hooks/useCamera';
import { deleteCameraApi } from 'src/services/camera-services';

const StationList = () => {
  const { addCamera, deleteCamera, camera } = useCamera()
  const [stationIsSelected, setStationIsSelected] = useState();

  //available station
  const [rynanStationList, setRynanStationList] = useState([]); //including stations are gotten by Ryan api
  const [visibleRynanStationDetail, setVisibleRynanStationDetail] = useState(false);
  const [error, setError] = useState(false);
  const [stationListLoading, setStationListLoading] = useState();
  const [isAddCamera, setIsAddCamera] = useState(false);

  //useEffect
  useEffect(() => {
    setStationListLoading(true);
    //Rynan station list
    stationService.getStationListByRyan()
      .then((res) => {
        setRynanStationList(res.data);
      })
      .catch((error) => {
        setError(true)
      })
  }, [camera])

  const addZero = (no) => {
    return no < 10 ? '0' + no : no;
  }

  const [rynanStationIsSeeing, setRynanStationIsSeeing] = useState();
  const handelViewRynanStation = (serialNo) => {
    rynanStationList.forEach((station) => {
      if (station.so_serial === serialNo) {
        var currentDate = new Date();
        var dateStr = `${currentDate.getFullYear()}/${addZero(currentDate.getMonth() + 1)}/${addZero(currentDate.getDate())}`;
        observation.getDataStation(serialNo, dateStr, dateStr, 1, 100000000)
          .then((res) => {
            var sensorList = [];
            for (const sensor in res.data[0]) {
              if (sensor !== "trang_thai" && !isNaN(res.data[0][sensor]) && res.data[0][sensor] !== null) {
                sensorList.push(sensor);
                station.sensor_list = sensorList;
              }
            }
          })
          .then(() => {
            setRynanStationIsSeeing(station);
            setVisibleRynanStationDetail(true);
          })
          .catch((error) => { })
      }
    })
  }

  const navigate = useNavigate()
  const handelDirectToDetail = (thingId, status) => {
    if (status !== 0) {
      navigate(`station-detail/${thingId}`);
    }
  }

  const defaultPageCode = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dms_page_station_management"
  const openAddModal = () => {
    setIsAddCamera(true)
  }
  console.log("addTest", isAddCamera);
  const cameraDevice = {
    link: "",
    deviceId: ""
  }
  const [addLink, setAddLink] = useState(cameraDevice)
  const handleSetLink = (value) => {
    setAddLink((prev) => {
      return { ...prev, link: value }
    })
  }
  const handleSetAddDeviceId = (value) => {
    setAddLink(prev => {
      return { ...prev, deviceId: value }
    })
  }

  const createCamera = (e) => {
    // validation
    const form = e.currentTarget
    e.preventDefault()
    if (form.checkValidity() === false) {
      e.stopPropagation()
    } else {
      addCamera({
        deviceId: addLink?.deviceId,
        type: "CAMERA",
        url: addLink?.link,
        username: "admin",
        password: "c123456789c"
      })
      setIsAddCamera(false)
    }
  }
  console.log("rynanStationList", rynanStationList);
  const [matchStationWithCamera, setMatchStationWithCamera] = useState([])
  useEffect(() => {
    const combinedArray = [];

    rynanStationList?.forEach(station => {
      camera?.forEach(cam => {
        // if (station?.ma_thiet_bi === cam?.deviceId) {
        const combinedObject = {
          ...station,
          url: station?.ma_thiet_bi === cam?.deviceId ? cam?.url : ""
        };
        if (station?.ma_thiet_bi === cam?.deviceId) combinedArray.push(combinedObject);
        // }
      });
    });

    setMatchStationWithCamera(combinedArray);
  }, [rynanStationList, camera]);
  console.log("matchStationWithCamera", matchStationWithCamera);
  const handleDeleteCamera = (cameraId) => {
    deleteCamera(cameraId)
    // setRynanStationList(camera)
    // console.log("cameraId",cameraId);

  }

  return (
    <>
      <CustomIntroduction
        pageCode={defaultPageCode}
        title='QUẢN LÝ TRẠM CẢM BIẾN'
        content='Hỗ trợ quản lý thông tin các trạm cảm biến tại các vị trí trực thuộc tỉnh Hậu Giang'
      />
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Danh sách trạm quan trắc</CCardHeader>
            <CCardBody>

              {/* station list in available << */}
              {/* <h6>Trạm sẵn có</h6> */}
              <CTable bordered align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary" style={{ 'width': '5%' }}>#</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{ 'width': '25%' }}>Tên trạm</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{ 'width': '35%' }}>Địa chỉ</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{ 'width': '20%' }}>Trạng thái</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{ 'width': '20%' }}>Thao tác</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {
                    rynanStationList?.length !== 0 ? rynanStationList?.map((station, index) => {
                      return <>
                        <CTableRow onClick={() => setStationIsSelected(station)} key={index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell style={{ 'cursor': 'pointer', 'color': '#5856dd', 'textDecoration': 'underline' }} onClick={() => handelDirectToDetail(station?.so_serial, station?.trang_thai)}>
                            {station.ten_thiet_bi}
                          </CTableDataCell>
                          <CTableDataCell>{station.khu_vuc_lap_dat}</CTableDataCell>
                          <CTableDataCell style={{ display: "flex", alignItem: 'center' }}>
                            <div className={station.trang_thai === 1 ? "station-status station-status--active" : "station-status station-status--inactive"}></div>
                            {
                              station.trang_thai === 1 ? <span>Đang hoạt động</span> : <span>Trạm đang khóa</span>
                            }
                          </CTableDataCell>
                          <CTableDataCell>
                            <CIcon icon={cilTouchApp} onClick={() => { handelViewRynanStation(station.so_serial) }} className="text-primary mx-1" role="button" />
                          </CTableDataCell>
                        </CTableRow>
                      </>
                    })
                      :
                      <CTableRow>
                        <CTableDataCell colSpan={6}><p className="text-center">{'Không có dữ liệu'}</p></CTableDataCell>
                      </CTableRow>
                  }
                </CTableBody>
              </CTable>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol sx={12}>
          <div className="d-flex justify-content-center my-4">
            <CButton className="btn btn-primary" onClick={openAddModal} >
              <CIcon icon={cilPlus} className="me-2" />
              Thêm camera
            </CButton>
          </div>
        </CCol>
      </CRow>
      <CRow >
        <CCol>
          <CCard>
            <CCardHeader>Danh sách camera của trạm quan trắc</CCardHeader>
            <CCardBody>

              {/* station list in available << */}
              {/* <h6>Trạm sẵn có</h6> */}
              <CTable bordered align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary" style={{ 'width': '5%' }}>#</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{ 'width': '25%' }}>Tên trạm</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{ 'width': '55%' }}>Link camera</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{ 'width': '25%' }}>Thao tác</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {
                    matchStationWithCamera?.length !== 0 ? matchStationWithCamera?.map((station, index) => {
                      return <>
                        <CTableRow onClick={() => setStationIsSelected(station)} key={index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell style={{ 'cursor': 'pointer', 'color': '#5856dd', 'textDecoration': 'underline' }} onClick={() => handelDirectToDetail(station?.so_serial, station?.trang_thai)}>
                            {station.ten_thiet_bi}
                          </CTableDataCell>
                          <CTableDataCell>
                            <a href={`http://${station?.url}`} target="_blank" rel="noopener noreferrer">{station?.url}</a>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton type="button" color="secondary" onClick={() => handleDeleteCamera(station?.ma_thiet_bi)}><CIcon icon={cilTrash} /></CButton>
                          </CTableDataCell>
                        </CTableRow>
                      </>
                    })
                      :
                      <CTableRow>
                        <CTableDataCell colSpan={6}><p className="text-center">{'Không có dữ liệu'}</p></CTableDataCell>
                      </CTableRow>
                  }
                </CTableBody>
              </CTable>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal
        alignment="center"
        visible={isAddCamera}
        onClose={() => setIsAddCamera(false)}
        aria-labelledby="VerticallyCenteredExample"
      >
        <div className="view-station-detail">
          <div className="view-station-detail__header">
            Thêm camera
          </div>
          <CForm
            onSubmit={e => createCamera(e)}
            noValidate
          // validated={updateFormValidate}
          >
            <CRow>
              <CCol lg={12}>
                <CFormSelect
                  aria-label="Default select example"
                  className="mt-4"
                  onChange={(e) => handleSetAddDeviceId(e.target.value)}
                  value={addLink.deviceId}
                  feedbackInvalid="Chưa chọn!"
                >
                  <option selected="" value="" >Chọn thiết bị</option>
                  {
                    rynanStationList && Array.isArray(rynanStationList) && rynanStationList.map((station) => {
                      return <option key={station?.ma_thiet_bi} value={station?.ma_thiet_bi}>{station?.ten_thiet_bi}</option>
                    })
                  }
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow>
              <CCol lg={12}>
                <CFormInput
                  className="mt-4"
                  type="text"
                  required
                  placeholder="Link camera"
                  feedbackInvalid="Chưa nhập!"
                  onChange={(e) => handleSetLink(e.target.value)}
                  value={addLink?.link}
                  aria-describedby="exampleFormControlInputHelpInline"
                />
              </CCol>
            </CRow>

            <CRow>
              <CCol lg={12} className="d-flex justify-content-end">
                <CButton type="submit" className="mt-4" color="primary">Thêm</CButton>
              </CCol>
            </CRow>
          </CForm>
        </div>
      </CModal>
      <CModal
        alignment="center"
        visible={visibleRynanStationDetail}
        onClose={() => setVisibleRynanStationDetail(false)}
        aria-labelledby="VerticallyCenteredExample"
      >
        <div className="view-station-detail">
          <div className="view-station-detail__header">
            Thông tin trạm
          </div>
          <div className="view-station-detail__body">
            <table>
              <tr>
                <td className='key'>Tên trạm</td>
                <td className='value'>{rynanStationIsSeeing?.ghi_chu}</td>
              </tr>
              <tr>
                <td className='key'>Trạng thái</td>
                <td className='value' style={{ display: "flex", alignItem: 'center' }}>
                  <div style={{ marginLeft: 0 }}
                    className={rynanStationIsSeeing?.trang_thai ? "station-status station-status--active" : "station-status station-status--inactive"}></div>
                  {
                    rynanStationIsSeeing?.trang_thai ? <span>Đang hoạt động</span> : <span>Trạm đang khóa</span>
                  }
                </td>
              </tr>
              <tr>
                <td className='key'>Mô tả</td>
                <td className='value'>{rynanStationIsSeeing?.ghi_chu}</td>
              </tr>
              <tr>
                <td className='key'>Địa chỉ</td>
                <td className='value'>{rynanStationIsSeeing?.khu_vuc_lap_dat}</td>
              </tr>
              <tr>
                <td className='key'>Tọa độ</td>
                <td className='value' >
                  <span>Kinh độ: {rynanStationIsSeeing?.kinh_do}</span><br />
                  <span>Vĩ độ: {rynanStationIsSeeing?.vi_do}</span>
                </td>
              </tr>
              <tr>
                <td className='key'>Cảm biến</td>
                <td className='value'>
                  {
                    rynanStationIsSeeing?.sensor_list?.map((sensor, index) => {
                      return <>
                        <span >{generateSensorName(sensor)}</span>
                        {
                          rynanStationIsSeeing?.sensor_list?.length - 1 !== index ?
                            <span>, </span>
                            :
                            <span></span>
                        }
                      </>
                    })
                  }
                </td>
              </tr>
            </table>
          </div>
          <div className="view-station-detail__footer">
            <div className="view-station-detail__footer__close-btn" onClick={() => setVisibleRynanStationDetail(false)}>
              Đóng
            </div>
          </div>
        </div>
      </CModal>
    </>
  )
}

export default StationList
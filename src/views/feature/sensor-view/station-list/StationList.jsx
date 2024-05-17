import { useState, useEffect} from 'react'
import * as React from 'react';
import './StationList.scss'

import Box from '@mui/material/Box';

import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

//form
import { CForm, CFormInput, CTableDataCell } from '@coreui/react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

//service
import multiDataStreamSerivce from 'src/services/multi-data-stream';
import stationService from 'src/services/station';
import thingService from 'src/services/thing';
import sensorService from 'src/services/sensor'
import observation from "src/services/observation";

import { generateSensorName } from 'src/tools';

//bootstrap
import { Spinner } from 'react-bootstrap';

import { CRow, CCol, CCard, CCardHeader, CCardBody, CButton } from '@coreui/react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilPencil,
  cilTrash,
  cilTouchApp
} from '@coreui/icons'

//modal
import { CModal} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import CustomIntroduction from 'src/views/customs/my-introduction';
const label = { inputProps: { 'aria-label': 'Switch demo' } };

const animatedComponents = makeAnimated();

const StationList = () => {
    
  //menu
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [stationIsSelected, setStationIsSelected] = useState();

  //modal 
  const [openCreateStationModal, setOpenCreateStationModal] = React.useState(false);
  const handleOpenCreateStationModal = () => {
    setOpenCreateStationModal(true);
    setIsModification(false);
  };
  const handleCloseCreateStationModal = () => {
    setOpenCreateStationModal(false);
    setNewStation({name: '', description: ''});
    setSelectedSensorList([]);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    p: 0,
    select: {
      '.MuiOutlinedInput-notchedOutline': {
        border: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, 0.5)',
        borderRadius: '0px',
        borderColor: 'rgba(0, 0, 0, 0.5)'
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        border: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, 0.5)',
        borderColor: 'rgba(0, 0, 0, 0.5)'
        
      },
      '&:focus .MuiOutlinedInput-notchedOutline': {
        outline: 'none',
        borderColor: 'rgba(0, 0, 0, 0.5)'
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
  };

  const [stationList, setStationList] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState([]);
  const [selectedSensorBackup, setSelectedSensorBackup] = useState([]);
  const [damList, setDamList] = useState([]);
  const [selectedDam, setSelectedDam] = useState({});

  //select chip sensor list
  const [sensorList, setSensorList] = useState([])
  const [selectedSensorList, setSelectedSensorList] = useState([]);

  //available station
  const [rynanStationList, setRynanStationList] = useState([]); //including stations are gotten by Ryan api
  const [visibleRynanStationDetail, setVisibleRynanStationDetail] = useState(false)

  const [error, setError] = useState(false);

  const handleChangeSensorsSelection = (event) => {
    setSelectedSensor(event);
    setNewStation(prev => ({
      ...prev,
      sensors: event
    }))
  };

  const handleChangeDamSelection = (event) => {
    setSelectedDam(event);
    setNewStation(prev => ({
      ...prev,
      dam: event.value
    }))
  }

  const [newStation, setNewStation] = useState({
    name: '',
    description: '',
    node: 'test node',
    coordination: {
      longtitude: '',
      latitude: ''
    },
    dam: '',
    status: 'Active'
  })
  const [newThing, setNewThing] = useState({
    name: '',
    description: '',
    locationId: 0
  })
  const [stationCreationLoading, setStationCreationLoading] = useState(false);
  const [stationListLoading, setStationListLoading] = useState(true);
  const [stationListChange, setStationListChange] = useState(false);

  //delete station
  const [deletionConfirm, setDeletionConfirm] = useState(false)
  const handelVisibleDeletionConfirm = () => {
    setDeletionConfirm(true);
    setAnchorEl(null);
  }
  const handleDeleteStation = (station) => {
    stationService.deleteStation(station?.station?.id)
      .then((res) => {
        thingService.deleteThing(station?.thingId)
        .then(() => {
          setDeletionConfirm(false);
          setStationListChange(!stationListChange);
        })
      })
      .catch((error) => {
        setError(true)
      })
  }
  const [multiDTSOfStation, setMultiDTSOfStation] = useState([]); 

  const [isModification, setIsModification] = useState(false); //true: modify, false: create

  //useEffect
  useEffect(() => {
    setStationListLoading (true);
    //Rynan station list
    stationService.getStationListByRyan()
      .then((res) => {
        setRynanStationList(res.data);
      })
      .catch((error) => {
        setError(true)
      })

    stationService.getStationList()
      .then((res) => {
        setStationList(res);
      })
      .then(() => {
        setStationListLoading(false);
      })
      .catch((error) => {
        setError(true)
      })
  }, [stationListChange])

  useEffect(() => {
    //get sensor list
    sensorService.getSensorList()
      .then((res) => {
        let sensorListVL = [];
        res.map((sensor) => {
          let sensorVL = {
            value: sensor.id,
            label: sensor.name
          }
          sensorListVL.push(sensorVL);
          setSensorList(sensorListVL);
        })
      })
      .catch((error) => {
        setError(true)
      })
    //get dam list
    setDamList([
      {value: '1', label: "Đập 1"},
      {value: '2', label: "Đập 2"},
      {value: '3', label: "Đập 3"},
      {value: '4', label: "Đập 4"},
      {value: '5', label: "Đập 5"},
    ])
  }, [])

  const handleChangeStationCreationForm = (e) => {
    setNewStation(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handelSubmitStationForm = (e) => { //for creation and modification
    e.preventDefault();
    if(isModification) {
      handelModifyStation();
    } else {
      handelCreateStation();
    }
  }

  const handelCreateStation = () => {
    setStationCreationLoading(true);
    //create thing
    newThing.name = newStation.name;
    newThing.description = newStation.description;

    var newStationFormating = {
      name: newStation.name,
      description: newStation.description,
      node: "Test node",
      status: true
    }

    thingService.createThing(newThing)
      .then((res) => {
        //create station
        stationService.createStation(res.data.id, newStationFormating)
          .then((resStation) => {
          //link sensor here
            var dataStreamInfo = {
              name: newStation.name,
              description: newStation.description
            }
            selectedSensor.map((sensor) => {
              multiDataStreamSerivce.createDataStream(res.data.id, sensor.value, dataStreamInfo)
                .then((resMultiDTS) => {
                })
            })
        })
        .then(() => {
          setStationCreationLoading(false);
          handleCloseCreateStationModal();
          setStationListChange(!stationListChange);
        })
        .catch((error) => {
          console.log(error);
        })
      })
      .catch((error) => {
        setError(true)
      })
  }

  const handleDisplayModifyStation = (stationInfo) => {
    setIsModification(true);
    setMultiDTSOfStation([]);
    setNewStation({
      name: stationInfo?.station.name, 
      description: stationInfo?.station.description
    });
    setSelectedDam({value: 1, label: "Đập 1"});
    setSelectedSensor([{value: 1, label: 'Cảm biến mực nước'}, {value: 2, label: 'Cảm biến nhiệt độ'}]);

    var sensorIdList = [];
    var sensorIdListByMDTs = []; 
    var multiDTSLIst = [];
    stationInfo?.multiDataStreamDTOs.map((multiDTS) => {
      var sensorMDTId = {
        value: multiDTS?.sensor.sensorId,
        label: multiDTS?.sensor.sensorName
      }
      sensorIdListByMDTs.push(sensorMDTId);
      multiDTSLIst.push(multiDTS);
      setMultiDTSOfStation(multiDTSLIst);
      sensorIdList.push(multiDTS?.sensor.sensorId);
    })
    setSelectedSensor(sensorIdListByMDTs);
    setSelectedSensorBackup([...sensorIdList]);
    setOpenCreateStationModal(true);
    setIsModification(true);
    setAnchorEl(null);  
  }

  const handelModifyStation = async () => {
    var selectedSensorId = await Promise.all(selectedSensor.map((sensor) => {
      return sensor.value;
    }))
    //cap nhap lien ket sensor
    //neu khong co trong backup => them
    var thingId = stationIsSelected.thingId;
    const x = await Promise.all(selectedSensorId.map(async(sensorId) => {
      if (selectedSensorBackup.includes(sensorId) == 0) {
        var multiDTSInfo = {
          name: `sensorId ${sensorId}, thingId ${thingId}`,
          description: 'Multi data stream description'
        };
        await multiDataStreamSerivce.createDataStream(thingId, sensorId, multiDTSInfo)
          .then((res) => {});
      }
    })) 

    //neu co trong backup nhung khong co trong mang hien tai => xoa
    const y = await Promise.all(selectedSensorBackup.map(async(sensorId) => {
      if(selectedSensorId.includes(sensorId)==0) {
        var multiDataStreamId = handelFindMDTIdBySensorId(sensorId);
        await multiDataStreamSerivce.deleteMultiDataStream(multiDataStreamId)
          .then((res) => {})
      }
    })) 

    setStationCreationLoading(false);
    handleCloseCreateStationModal();
    setStationListChange(!stationListChange);
  }

  const handelFindMDTIdBySensorId = (sensorId) => {
    for(let i=0; i<multiDTSOfStation.length; i++) {
      if(sensorId==multiDTSOfStation[i]?.sensor?.sensorId) {
        return multiDTSOfStation[i].multiDataStreamId;
      }
    }
  }

  const addZero = (no) => {
    return no < 10 ? '0' + no : no;
  }

  const [rynanStationIsSeeing, setRynanStationIsSeeing] = useState();
  const handelViewRynanStation = (serialNo) => {
    rynanStationList.map((station) => {
      if(station.so_serial == serialNo) {
        var currentDate = new Date();
        var dateStr = `${currentDate.getFullYear()}/${addZero(currentDate.getMonth()+1)}/${addZero(currentDate.getDate())}`;
        observation.getDataStation(serialNo, dateStr, dateStr, 1, 100000000) 
          .then((res) => {
            var sensorList = [];
            for(const sensor in res.data[0]) {
              if(sensor !== "trang_thai" && !isNaN(res.data[0][sensor]) && res.data[0][sensor] !== null) {
                sensorList.push(sensor);
                station.sensor_list = sensorList;
              }
            }
          })
          .then(() => {
            setRynanStationIsSeeing(station);
            setVisibleRynanStationDetail(true);
          })
          .catch((error) => {})
      }
    })
  }

  const navigate = useNavigate()
  const handelDirectToDetail = (thingId) => {
    navigate(`station-detail/${thingId}`);
  }

    const defaultPageCode = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dms_page_station_management"
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
                          <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '5%'}}>STT</CTableHeaderCell>
                          <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '25%'}}>Tên trạm</CTableHeaderCell>
                          <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '35%'}}>Địa chỉ</CTableHeaderCell>
                          <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '20%'}}>Trạng thái</CTableHeaderCell>
                          <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '20%'}}>Thao tác</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {
                          rynanStationList?.length !== 0 ? rynanStationList?.map((station, index) => {
                            return <>
                              <CTableRow onClick={() => setStationIsSelected(station)} key={index}>
                                <CTableDataCell>{ index+1 }</CTableDataCell>
                                <CTableDataCell style={{'cursor': 'pointer'}} onClick={() => handelDirectToDetail(station?.so_serial)}>
                                  { station.ten_thiet_bi }
                                </CTableDataCell>
                                <CTableDataCell>{ station.khu_vuc_lap_dat }</CTableDataCell>
                                <CTableDataCell style={{display: "flex", alignItem: 'center'}}>
                                  <div className={station.trang_thai ? "station-status station-status--active" : "station-status station-status--inactive"}></div>
                                  {
                                    station.trang_thai ? <span>Đang hoạt động</span> : <span>Trạm đang khóa</span>
                                  }
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CIcon icon={cilTouchApp} onClick={() => {handelViewRynanStation(station.so_serial)}} className="text-primary mx-1" role="button"/>
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
    
        {/* create station modal */}
        <Modal
          disableAutoFocus={true}
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openCreateStationModal}
          onClose={handleCloseCreateStationModal}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={openCreateStationModal}>
            <Box sx={style}>
              <form className="station-creation" onSubmit={handelSubmitStationForm}>
                <div className="station-creation__title">
                  {
                    isModification ? 
                      <span>Chỉnh sửa trạm</span>
                    :
                      <span>Thêm trạm</span>
                  }
                </div>
                <div className="station-creation__form">
                  <div className="station-creation__form__name">
                    <CForm>
                      <CFormInput
                        value={newStation.name} 
                        name="name"
                        onChange={handleChangeStationCreationForm}
                        type="text"
                        id="exampleFormControlInput1"
                        label="Tên"
                        aria-describedby="exampleFormControlInputHelpInline"
                      />
                    </CForm>
                  </div>
                  <div className="station-creation__form__description">
                    <CForm>
                      <CFormInput
                        value={newStation.description} 
                        name="description"
                        onChange={handleChangeStationCreationForm}
                        type="text"
                        id="exampleFormControlInput1"
                        label="Mô tả"
                        aria-describedby="exampleFormControlInputHelpInline"
                      />
                    </CForm>
                  </div>
                  <div className="station-creation__form__coordination">
                    <label>Tọa độ</label>
                    <div className="station-creation__form__coordination__input">
                      <div className="station-creation__form__coordination__input__longitude">
                        <CForm>
                          <CFormInput
                            value={newStation.longtitude} 
                            name="longtitude"
                            onChange={handleChangeStationCreationForm}
                            type="text"
                            placeholder='Kinh độ'
                            id="exampleFormControlInput1"
                            aria-describedby="exampleFormControlInputHelpInline"
                          />
                        </CForm>
                      </div>
                      <div className="station-creation__form__coordination__input__latitude">
                        <CForm>
                          <CFormInput
                            value={newStation.latitude} 
                            name="latitude"
                            onChange={handleChangeStationCreationForm}
                            type="text"
                            placeholder='Vĩ độ'
                            id="exampleFormControlInput1"
                            aria-describedby="exampleFormControlInputHelpInline"
                          />
                        </CForm>
                      </div>
                    </div>
                  </div>
                  <div className="station-creation__form__sensor-selection">
                    <label htmlFor="sensor">Cảm biến</label>
                    <Select
                      onChange={handleChangeSensorsSelection}
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      placeholder=''
                      isMulti
                      options={sensorList}
                      value={selectedSensor}
                    />
                  </div>
                  <div className="station-creation__form__dam-selection">
                    <label htmlFor="">Liên kết trạm</label>
                    <Select
                      onChange={handleChangeDamSelection}
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      options={damList}
                      placeholder=''
                      value={selectedDam}
                    />
                  </div>
                </div>
                <div className="station-creation__action">
                  <div className="station-creation__action__cancel-btn" onClick={handleCloseCreateStationModal}>
                    Hủy
                  </div>
                  <button className="station-creation__action__creation-btn">
                    {
                      stationCreationLoading ? 
                      <Spinner animation="border" role="status" style={{height: '15px', width: '15px', color: 'white'}}>
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                      :
                      isModification ? 
                        <span>Câp nhật</span>
                      :
                        <span>Thêm trạm</span>
                    }
                  </button>
                </div>
              </form>
            </Box>
          </Fade>
        </Modal>

        {/* view station detail */}
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
                  <td className='value'>{ rynanStationIsSeeing?.ghi_chu }</td>
                </tr>
                <tr>
                  <td className='key'>Trạng thái</td>
                  <td className='value' style={{display: "flex", alignItem: 'center'}}>
                      <div style={{marginLeft: 0}}
                        className={rynanStationIsSeeing?.trang_thai ? "station-status station-status--active" : "station-status station-status--inactive"}></div>
                      {
                        rynanStationIsSeeing?.trang_thai ? <span>Đang hoạt động</span> : <span>Trạm đang khóa</span>
                      }
                  </td>
                </tr>
                <tr>
                  <td className='key'>Mô tả</td>
                  <td className='value'>{ rynanStationIsSeeing?.ghi_chu }</td>
                </tr>
                <tr>
                  <td className='key'>Địa chỉ</td>
                  <td className='value'>{ rynanStationIsSeeing?.khu_vuc_lap_dat }</td>
                </tr>
                <tr>
                  <td className='key'>Tọa độ</td>
                  <td className='value' >
                    <span>Kinh độ: { rynanStationIsSeeing?.kinh_do }</span><br/>
                    <span>Vĩ độ: { rynanStationIsSeeing?.vi_do }</span>
                  </td>
                </tr>
                <tr>
                  <td className='key'>Cảm biến</td>
                  <td className='value'>
                    {
                      rynanStationIsSeeing?.sensor_list?.map((sensor, index) => {
                        return <>
                          <span >{ sensor }</span>
                          {
                            rynanStationIsSeeing?.sensor_list?.length-1 !== index ? 
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
              <div className="view-station-detail__footer__close-btn" onClick={() =>  setVisibleRynanStationDetail(false)}>
                Đóng
              </div>
            </div>
          </div>
        </CModal>

        {/* confirm delete station */}
        <CModal
          backdrop="static"
          visible={deletionConfirm}
          onClose={() => setDeletionConfirm(false)}
          aria-labelledby="StaticBackdropExampleLabel"
        >
          <div className="deletion-station-confirm">
            <div className="deletion-station-confirm__body">
                Xóa trạm <b>{ stationIsSelected?.station?.name }</b>?
            </div>
            <div className="deletion-station-confirm__action">
              <div className="deletion-station-confirm__action__cancel-btn" onClick={() => setDeletionConfirm(false)}>
                Hủy
              </div>
              <div className="deletion-station-confirm__action__accept-btn" onClick={() => handleDeleteStation(stationIsSelected)}>
                Xóa trạm
              </div>
            </div>
          </div>
        </CModal>
      </>
  )   
}

export default StationList
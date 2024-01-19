import { useState, useEffect, useLayoutEffect } from 'react'
import * as React from 'react';
import './StationList.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

import Switch from '@mui/material/Switch';

import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

//select chip
// import Select from '@mui/material/Select';

//form
import { CForm, CFormInput, CTableDataCell } from '@coreui/react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
// import { colourOptions } from './doc/data';

//service
import multiDataStreamSerivce from 'src/services/multi-data-stream';
import stationService from 'src/services/station';
import thingService from 'src/services/thing';
import sensorService from 'src/services/sensor'

//bootstrap
import { Spinner } from 'react-bootstrap';

import { CRow, CCol, CCard, CCardHeader, CCardBody, CButton } from '@coreui/react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilPencil,
  cilTrash,
  cilMagnifyingGlass,
  cilReload,
  cilPlus,
  cilTouchApp
} from '@coreui/icons'

//modal
import { CModal} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
const label = { inputProps: { 'aria-label': 'Switch demo' } };

const animatedComponents = makeAnimated();

const StationList = () => {
    
  //menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [stationIsSelected, setStationIsSelected] = useState();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
  const [selectedSensorListBackup, setSelectedSensorListBackup] = useState([]);

  const handleChangeSensorsSelection = (event) => {
    setSelectedSensor(event);
    setNewStation(prev => ({
      ...prev,
      sensors: event
    }))
    console.log("selected sensor: ", newStation);
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
  const [stationDeletionLoading, setStationDeletionLoading] = useState(false);
  const handleDeleteStation = (station) => {
    stationService.deleteStation(station?.station?.id)
      .then((res) => {
        thingService.deleteThing(station?.thingId)
        .then((resThing) => {
          console.log("resthing: ", resThing);
        })
        .then(() => {
          setDeletionConfirm(false);
          setStationListChange(!stationListChange);
        })
      })
  }
  const [sensorIdListByMDT, setSensorIdListByMDT] = useState([]); //{sensorId, multiDTSId}, sensorId va multiDTSId tuong ung => xoa link sensor trong khi modify

  const [isModification, setIsModification] = useState(false); //true: modify, false: create

  useLayoutEffect(() => {

  })

  //useEffect
  useEffect(() => {
    setStationListLoading (true);
    stationService.getStationList()
      .then((res) => {
        setStationList(res);
        console.log("station list: ", res)
      })
      .then(() => {
        setStationListLoading(false);
      })
      .catch((error) => {
        console.log("error: ", error);
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
          console.log("sensorListVL: ", sensorListVL);
          setSensorList(sensorListVL);
        })
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
    console.log(newStation);
  }

  const handelSubmitStationForm = (e) => { //for creation and modification
    e.preventDefault();
    // if(isModification) {
    //   console.log("modify");
    //   handelModifyStation();
    // } else {
      console.log("create");
      // handelCreateStation();
    // }
    console.log("new station: ", newStation);

    console.log("selected sensor listss: ", selectedSensor, selectedSensorBackup);
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

    console.log("new station formating", newStationFormating);

    thingService.createThing(newThing)
      .then((res) => {
        console.log("done");
        //create station
        stationService.createStation(res.data.id, newStationFormating)
          .then((resStation) => {
            console.log("station res: ", resStation);
          
          //link sensor here
            var dataStreamInfo = {
              name: newStation.name,
              description: newStation.description
            }
            console.log("selected sensor list in: ", selectedSensorList);
            selectedSensorList.map((sensor) => {
              console.log("create multi data stream, selected sensor list: ", sensor);
              multiDataStreamSerivce.createDataStream(res.data.id, sensor.value, dataStreamInfo)
                .then((resMultiDTS) => {
                  console.log("resMultiDTS: ", resMultiDTS);
                })
            })
        })
        .then(() => {
          setStationCreationLoading(false);
          handleCloseCreateStationModal();
          setStationListChange(!stationListChange);
        })
        .catch((error) => {
          console.log("station error: ", error);
        })
      })
      .catch((error) => {
        console.log("thing error: ", error);
      })
  }

  const handleDisplayModifyStation = (stationInfo) => {
    console.log("station infooo: ", stationInfo);
    setSensorIdListByMDT([]);
    setNewStation({
      name: stationInfo?.station.name, 
      description: stationInfo?.station.description
    });
    setSelectedDam({value: 1, label: "Đập 1"});
    setSelectedSensor([{value: 1, label: 'Cảm biến mực nước'}, {value: 2, label: 'Cảm biến nhiệt độ'}]);

    var sensorIdList = [];
    var sensorIdListByMDTs = []; 
    stationInfo?.multiDataStreamDTOs.map((multiDTS) => {
      console.log("sensorr: ", multiDTS.sensor);
      var sensorMDTId = {
        value: multiDTS?.sensor.sensorId,
        label: multiDTS?.sensor.sensorName
      }
      sensorIdListByMDTs.push(sensorMDTId);
      console.log("list by MDTs: ", sensorIdListByMDTs);
      setSensorIdListByMDT(sensorIdListByMDTs);
      sensorIdList.push(multiDTS?.sensor.sensorId);
    })

    setSelectedSensor(sensorIdListByMDTs);
    setSelectedSensorBackup([...sensorIdList]);
    setOpenCreateStationModal(true);
    setIsModification(true);
    setAnchorEl(null);
  }

  const handelModifyStation = async () => {
    //cap nhap lien ket sensor
    //neu khong co trong backup => them
    var thingId = stationIsSelected.thingId;
    const x = await Promise.all(selectedSensor.map(async(sensor, index) => {
      if (selectedSensorBackup.includes(sensor.value) == 0) {
        var multiDTSInfo = {
          name: `sensorId ${sensor.value}, thingId ${thingId}`,
          description: 'Multi data stream description'
        };
        await multiDataStreamSerivce.createDataStream(thingId, sensor.value, multiDTSInfo)
          .then((res) => {});
      }
    })) 

    //neu co trong backup nhung khong co trong mang hien tai => xoa
    const xyz = await Promise.all(selectedSensorListBackup.map(async (sensorId, index) => {
      if(selectedSensorList.includes(sensorId)==0) {
        var multiDataStreamId = handelFindMDTIdBySensorId(sensorId);
        await multiDataStreamSerivce.deleteMultiDataStream(multiDataStreamId)
          .then((res) => {})
      }
    })) 
    setStationListChange(!stationListChange);
  }

  const handelFindMDTIdBySensorId = (sensorId) => {
    for(let i=0; i<sensorIdListByMDT.length; i++) {
      if(sensorId==sensorIdListByMDT[i].sensorId) {
        return sensorIdListByMDT[i].multiDTSId;
      }
    }
  }

  const navigate = useNavigate()
  const handelDirectToDetail = (thingId) => {
    console.log("thingId: ", thingId);
    localStorage.setItem("thingInfo", JSON.stringify({id: thingId}));
    navigate(`station-detail/${thingId}`);
  }

    return (
        <>
          <CRow>
            <CCol>
              <CCard>
                <CCardHeader>Danh sách trạm cảm biến</CCardHeader>
                <CCardBody>
                  <CButton 
                    type="button" 
                    color="primary"
                    onClick={handleOpenCreateStationModal}
                  >Thêm</CButton>
                  <CTable bordered align="middle" className="mb-0 border" hover responsive style={{'margin-top' : "20px"}}>
                    <CTableHead className="text-nowrap">
                      <CTableRow>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '5%'}}>#</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '25%'}}>Tên trạm</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '20%'}}>Mô tả</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '20%'}}>Liên kết đập</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '15%'}}>Trạng thái</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '15%'}}>Thao tác</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {
                        stationList?.length !== 0 ? stationList.map((station, index) => {
                          return <>
                            <CTableRow onClick={() => setStationIsSelected(station)}>
                              <CTableDataCell>{ index+1 }</CTableDataCell>
                              <CTableDataCell style={{'cursor': 'pointer'}} onClick={() => handelDirectToDetail(station?.thingId)}>{ station.station.name }</CTableDataCell>
                              <CTableDataCell>{ station.station.name }</CTableDataCell>
                              <CTableDataCell>{ station.station.name }</CTableDataCell>
                              <CTableDataCell style={{display: "flex", alignItem: 'center'}}>
                                <div className={station.station.status ? "station-status station-status--active" : "station-status station-status--inactive"}></div>
                                {
                                  station.station.status ? <span>Đang hoạt động</span> : <span>Trạm đang khóa</span>
                                }
                              </CTableDataCell>
                              <CTableDataCell>
                                <CIcon icon={cilTouchApp} onClick={() => {}} className="text-primary mx-1" role="button"/>
                                <CIcon icon={cilPencil} onClick={() => handleDisplayModifyStation(station)} className="text-success mx-1" role="button"/>
                                <CIcon icon={cilTrash} onClick={() => handelVisibleDeletionConfirm()}  className="text-danger" role="button"/>
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
          <div className="station">
              <div className="station__heading">
                  <div className="station__heading__title">
                      Danh sách trạm 
                      {
                        stationListLoading && 
                        <Spinner animation="border" role="status" style={{height: '15px', width: '15px', color: 'black', marginLeft: '10px'}}>
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      }
                  </div>
                  <div className="station__heading__add-new-station-btn" onClick={handleOpenCreateStationModal}>
                      Thêm trạm mới
                  </div>
              </div>
              <div className="station__list">
                  {
                    !stationListLoading && stationList.map((station, index) => {
                      return <div key={index} className="station__list__item">
                      <div className="station__list__item__name">
                          { station.station.name}
                      </div>
                      <div className="station__list__item__status">
                          <span>Trang thai: </span>
                          <div></div>
                          {
                            station.station.status ? <span>Đang hoạt động</span> : <span>Trạm đang khóa</span>
                          }
                      </div>
                      <div className="station__list__item__action">
                          <div className="station__list__item__action__more-btn" onClick={() => setStationIsSelected(station)}>
                              
                                {/* menu */}
                                <Tooltip title="">
                                  <IconButton
                                      onClick={handleClick}
                                      size="small"
                                      sx={{ ml: 2 }}
                                      aria-controls={open ? 'account-menu' : undefined}
                                      aria-haspopup="true"
                                      aria-expanded={open ? 'true' : undefined}
                                  >
                                      {/* <Avatar sx={{ width: 32, height: 32 }}>M</Avatar> */}
                                      <FontAwesomeIcon icon={faEllipsis}/>
                                  </IconButton>
                              </Tooltip>
                          </div>
                          <div className="station__list__item__action__detail-btn" onClick={() => {handelDirectToDetail(station?.thingId)}}>
                              Chi tiết
                          </div>
                      </div>
                  </div>
                    })
                  }
              </div>
          </div>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem>
              <div className="update-station-status">
                <div>Khóa trạm</div>
                <div><Switch {...label} defaultChecked /></div>
              </div>
              
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleDisplayModifyStation(stationIsSelected)}>
              Chỉnh sửa
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handelVisibleDeletionConfirm()}>
              Xóa trạm
            </MenuItem>
            <Divider />
          </Menu>

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
                      {/* <label htmlFor="name">Tên</label> */}
                      {/* <input id='name' name="name" type="text" value={newStation.name} onChange={handleChangeStationCreationForm} /> */}
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
                      {/* <label htmlFor="description">Mô tả</label> */}
                      {/* <input id='description' name="description" type="text" value={newStation.description} onChange={handleChangeStationCreationForm} /> */}
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
                      {/* <FormControl sx={{ m: 1, width: 410 }}>
                        <Select
                          labelId="demo-multiple-name-label"
                          id="demo-multiple-name"
                          multiple
                          value={selectedSensorList}
                          onChange={handleChange}
                          sx={style.select}
                          input={<OutlinedInput label="Name" />}
                          MenuProps={MenuProps}
                        >
                          {sensorList.map((sensor) => (
                            <MenuItem
                              key={sensor.name}
                              value={sensor.id}
                              // style={getStyles(name, personName, theme)}
                            >
                              {sensor.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl> */}
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
                        // <span>Tạo trạm</span>
                      }
                    </button>
                  </div>
                </form>
              </Box>
            </Fade>
          </Modal>

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
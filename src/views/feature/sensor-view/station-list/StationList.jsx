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
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Checkbox } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

//service
import multiDataStreamSerivce from 'src/services/multi-data-stream';
import stationService from 'src/services/station';
import thingService from 'src/services/thing';
import sensorService from 'src/services/sensor'

//bootstrap
import { Spinner } from 'react-bootstrap';

//modal
import { CModal} from '@coreui/react';
const label = { inputProps: { 'aria-label': 'Switch demo' } };

//select chip
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },}

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
    width: 450,
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

  //select chip sensor list
  const [sensorList, setSensorList] = useState([])
  const [selectedSensorList, setSelectedSensorList] = useState([]);
  const [selectedSensorListBackup, setSelectedSensorListBackup] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedSensorList(
      typeof value === 'string' ? value.split(',') : value,
    );
    console.log("selected sensor: ", selectedSensorList);
  };

  const [newStation, setNewStation] = useState({
    name: '',
    description: '',
    node: 'test node',
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
    sensorService.getSensorList()
      .then((res) => {
        setSensorList(res);
      })
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
    if(isModification) {
      console.log("modify");
      handelModifyStation();
    } else {
      console.log("create");
      handelCreateStation();
    }
  }

  const handelCreateStation = () => {
    setStationCreationLoading(true);
    //create thing
    newThing.name = newStation.name;
    newThing.description = newStation.description;

    thingService.createThing(newThing)
      .then((res) => {
        //create station
        stationService.createStation(res.data.id, newStation)
        .then((resStation) => {
          console.log("station res: ", resStation);
          
          //link sensor here
          var dataStreamInfo = {
            name: newStation.name,
            description: newStation.description
          }
          selectedSensorList.map((sensorId) => {
            multiDataStreamSerivce.createDataStream(res.data.id, sensorId, dataStreamInfo)
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
    setSensorIdListByMDT([]);
    setNewStation({
      name: stationInfo?.station.name, 
      description: stationInfo?.station.description
    });
    var sensorIdList = [];
    var sensorIdListByMDTs = []; 
    stationInfo?.multiDataStreamDTOs.map((multiDTS) => {
      var sensorMDTId = {
        sensorId: multiDTS?.sensor.sensorId,
        multiDTSId: multiDTS?.multiDataStreamId
      }
      sensorIdListByMDTs.push(sensorMDTId);
      setSensorIdListByMDT(sensorIdListByMDTs);
      sensorIdList.push(multiDTS?.sensor.sensorId);
    })
    setSelectedSensorList(sensorIdList);
    setSelectedSensorListBackup([...sensorIdList]);
    setOpenCreateStationModal(true);
    setIsModification(true);
    setAnchorEl(null);
  }

  const handelModifyStation = async () => {
    //cap nhap lien ket sensor
    //neu khong co trong backup => them
    var thingId = stationIsSelected.thingId;
    const x = await Promise.all(selectedSensorList.map(async (sensorId, index) => {
      if (selectedSensorListBackup.includes(sensorId) == 0) {
        var multiDTSInfo = {
          name: `sensorId ${sensorId}, thingId ${thingId}`,
          description: 'Multi data stream description'
        };
        await multiDataStreamSerivce.createDataStream(thingId, sensorId, multiDTSInfo)
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

  const handelDirectToDetail = (thingId) => {
    console.log("thingId: ", thingId);
    localStorage.setItem("thingInfo", JSON.stringify({id: thingId}))
  }

    return (
        <>
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
                    Thêm trạm
                  </div>
                  <div className="station-creation__form">
                    <div className="station-creation__form__name">
                      <label htmlFor="name">Tên</label>
                      <input id='name' name="name" type="text" value={newStation.name} onChange={handleChangeStationCreationForm} />
                    </div>
                    <div className="station-creation__form__description">
                      <label htmlFor="description">Mô tả</label>
                      <input id='description' name="description" type="text" value={newStation.description} onChange={handleChangeStationCreationForm} />
                    </div>
                    <div className="station-creation__form__sensor-selection">
                      <label htmlFor="sensor">Cảm biến</label>
                      <FormControl sx={{ m: 1, width: 410 }}>
                        {/* <InputLabel id="demo-multiple-name-label">Name</InputLabel> */}
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
                              {/* <Checkbox checked={selectedSensorList.indexOf(sensor.name) > -1} />
                              <ListItemText primary={sensor.name} /> */}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
                        <span>Tạo trạm</span>
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
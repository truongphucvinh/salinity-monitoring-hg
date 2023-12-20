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

//service
import multiDataStream from 'src/services/multi-data-stream';
import stationService from 'src/services/station';
import thingService from 'src/services/thing'
import { Accordion } from '@mui/material';

//bootstrap
import { Spinner } from 'react-bootstrap';

//delete station
import { CModal, CButton, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

//select chip
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

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
  const handleOpenCreateStationModal = () => setOpenCreateStationModal(true);
  const handleCloseCreateStationModal = () => setOpenCreateStationModal(false);

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

  //select chip
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
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

  const handelVisibleDeletionConfirm = (stationInfo) => {
    setDeletionConfirm(!deletionConfirm);
    setAnchorEl(null);
  }

  //xoa station
  const [stationDeletionLoading, setStationDeletionLoading] = useState(false);
  const handleDeleteStation = (stationId) => {
    console.log("stationid: ", stationId);
  }

  useLayoutEffect(() => {

  })

  //truyen du lieu giua 2 sibling, use context; singleton 
  //useRef, useMemo, react memo, useCallback

  useEffect(() => {
    setStationListLoading (true);
    stationService.getStationList()
      .then((res) => {
        setStationList(res);
      })
      .then(() => {
        setStationListLoading(false);
      })
      .catch((error) => {
        console.log("error: ", error);
      })
  }, [stationListChange])

  const handleChangeStationCreationForm = (e) => {
    setNewStation(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handelCreateStation = (e) => {
    e.preventDefault();
    setStationCreationLoading(true);
    //create thing
    newThing.name = newStation.name;
    newThing.description = newStation.description;

    console.log("new thing: ", newThing);

    thingService.createThing(newThing)
      .then((res) => {
        //create station
        stationService.createStation(res.data.id, newStation)
        .then((resStation) => {
          console.log("station res: ", resStation);
          
          //link sensor here
          //...
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

    return (
        <>
            <div className="station">
                <div className="station__heading">
                    <div className="station__heading__title">
                        Danh sách trạm đo mặn  
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
                            <div className="station__list__item__action__detail-btn">
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
              <MenuItem onClick={handleClose}>
                Chỉnh sửa
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handelVisibleDeletionConfirm("abc")}>
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
                  <form className="station-creation" onSubmit={handelCreateStation}>
                    <div className="station-creation__title">
                      Thêm trạm đo mặn
                    </div>
                    <div className="station-creation__form">
                      <div className="station-creation__form__name">
                        <label htmlFor="name">Tên</label>
                        <input id='name' name="name" type="text" onChange={handleChangeStationCreationForm} />
                      </div>
                      <div className="station-creation__form__description">
                        <label htmlFor="description">Mô tả</label>
                        <input id='description' name="description" type="text" onChange={handleChangeStationCreationForm} />
                      </div>
                      <div className="station-creation__form__sensor-selection">
                        <label htmlFor="sensor">Cảm biến</label>
                        <FormControl sx={{ m: 1, width: 410 }}>
                          {/* <InputLabel id="demo-multiple-name-label">Name</InputLabel> */}
                          <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            multiple
                            value={personName}
                            onChange={handleChange}
                            sx={style.select}
                            input={<OutlinedInput label="Name" />}
                            // MenuProps={MenuProps}
                          >
                            {names.map((name) => (
                              <MenuItem
                                key={name}
                                value={name}
                                // style={getStyles(name, personName, theme)}
                              >
                                {name}
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

            {/* sensor list modal */}


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
          <div className="deletion-station-confirm__action__accept-btn" onClick={() => handleDeleteStation(stationIsSelected?.station?.id)}>
            Xóa trạm
          </div>
        </div>
      </div>
    </CModal>
        </>
    )
       
}

export default StationList
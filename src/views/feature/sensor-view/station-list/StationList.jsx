import { useState, useEffect } from 'react'
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

const label = { inputProps: { 'aria-label': 'Switch demo' } };


const StationList = () => {
    
  //menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
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
  };

  const [stationList, setStationList] = useState([
    {
      name: 'Tram so 1',
      status: true
    },
    {
      name: 'Tram so 2',
      status: true
    },
    {
      name: 'Tram so 3',
      status: true
    },
    {
      name: 'Tram so 4',
      status: true
    },
    {
      name: 'Tram so 5',
      status: true
    },
    {
      name: 'Tram so 6',
      status: true
    },
    {
      name: 'Tram so 7',
      status: true
    },
  ]);

  const handelSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log("form: ", Object.fromEntries(data.entries()));
  }

    return (
        <>
            <div className="station">
                <div className="station__heading">
                    <div className="station__heading__title">
                        Danh sách trạm đo mặn
                    </div>
                    <div className="station__heading__add-new-station-btn" onClick={handleOpenCreateStationModal}>
                        Thêm trạm mới
                    </div>
                </div>
                <div className="station__list">
                    {
                      stationList.map((station, index) => {
                        return <div key={index} className="station__list__item">
                        <div className="station__list__item__name">
                            { station.name}
                        </div>
                        <div className="station__list__item__status">
                            <span>Trang thai: </span>
                            <div></div>
                            <span>Dang hoat dong</span>
                        </div>
                        <div className="station__list__item__action">
                            <div className="station__list__item__action__more-btn">
                                
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
              // onClick={handleClose}
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
              <MenuItem>
                Chỉnh sửa
              </MenuItem>
              <Divider />
              <MenuItem>
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
                  <form className="station-creation" onSubmit={handelSubmit}>
                    <div className="station-creation__title">
                      Thêm trạm đo mặn
                    </div>
                    <div className="station-creation__form">
                      <div className="station-creation__form__name">
                        <label htmlFor="name">Tên</label>
                        <input id='name' name="name" type="text" />
                      </div>
                      <div className="station-creation__form__description">
                        <label htmlFor="description">Mô tả</label>
                        <input id='description' name="description" type="text" />
                      </div>
                      <div className="station-creation__form__sensor-selection">
                        <label htmlFor="sensor">Cảm biến</label>
                        <select name="" id="">
                          <option value="">123abc</option>
                          <option value="">123abc</option>
                          <option value="">123abc</option>
                        </select>
                      </div>
                    </div>
                    <div className="station-creation__action">
                      <div className="station-creation__action__cancel-btn" onClick={handleCloseCreateStationModal}>
                        Hủy
                      </div>
                      <button className="station-creation__action__creation-btn">
                        Tạo trạm
                      </button>
                    </div>
                  </form>
                </Box>
              </Fade>
            </Modal>

        </>
    )
       
}

export default StationList
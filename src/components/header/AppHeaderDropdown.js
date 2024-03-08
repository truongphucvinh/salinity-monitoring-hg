import React, { useEffect, useState } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/user.jpg'
import { useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const [isAuthenticated, setIsAuthencticated] = useState(false)
  const navigate = useNavigate()
  const onUpdateAuthStatus = () => {
    if (localStorage.getItem('_isAuthenticated')) {
      setIsAuthencticated(true)
    }else {
      setIsAuthencticated(false)
    }
  }
  const handleLogout = () => {
    if (isAuthenticated) {
      localStorage.removeItem('_isAuthenticated')
      localStorage.removeItem('_authenticatedUser')
      onUpdateAuthStatus()
      navigate("/login")
    }
  }
  useEffect(() => {
    onUpdateAuthStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {
        isAuthenticated ? <CDropdown variant="nav-item">
          <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
            <CAvatar src={avatar8} size="md" />
          </CDropdownToggle>
          <CDropdownMenu className="pt-0" placement="bottom-end">
            {/* <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
            <CDropdownItem href="#">
              <CIcon icon={cilBell} className="me-2" />
              Updates
              <CBadge color="info" className="ms-2">
                42
              </CBadge>
            </CDropdownItem>
            <CDropdownItem href="#">
              <CIcon icon={cilEnvelopeOpen} className="me-2" />
              Messages
              <CBadge color="success" className="ms-2">
                42
              </CBadge>
            </CDropdownItem>
            <CDropdownItem href="#">
              <CIcon icon={cilTask} className="me-2" />
              Tasks
              <CBadge color="danger" className="ms-2">
                42
              </CBadge>
            </CDropdownItem>
            <CDropdownItem href="#">
              <CIcon icon={cilCommentSquare} className="me-2" />
              Comments
              <CBadge color="warning" className="ms-2">
                42
              </CBadge>
            </CDropdownItem> */}
            {/* <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader> */}
            {/* <CDropdownItem href="#">
              <CIcon icon={cilUser} className="me-2" />
              Profile
            </CDropdownItem>
            <CDropdownItem href="#">
              <CIcon icon={cilSettings} className="me-2" />
              Settings
            </CDropdownItem>
            <CDropdownItem href="#">
              <CIcon icon={cilCreditCard} className="me-2" />
              Payments
              <CBadge color="secondary" className="ms-2">
                42
              </CBadge>
            </CDropdownItem>
            <CDropdownItem href="#">
              <CIcon icon={cilFile} className="me-2" />
              Projects
              <CBadge color="primary" className="ms-2">
                42
              </CBadge>
            </CDropdownItem> */}
            <CDropdownDivider />
            <CDropdownItem role='button' onClick={() => handleLogout()}>
              <CIcon icon={cilLockLocked}  className="me-2" role='button' />
              Đăng xuất
            </CDropdownItem>
          </CDropdownMenu>
          </CDropdown> : ''
      }
    </>

  )
}

export default AppHeaderDropdown

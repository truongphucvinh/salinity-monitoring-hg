import React, { useEffect, useRef, useState } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,CCol, CFormInput, CButton, CSpinner, CForm, CToaster
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
  cilLoopCircular,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import * as CryptoJS from 'crypto-js'

import avatar8 from './../../assets/images/avatars/user.jpg'
import { useNavigate } from 'react-router-dom'
import { getLoggedUserInformation } from 'src/tools'
import CustomModal from 'src/views/customs/my-modal'
import { loginAuth, updateUser } from 'src/services/authentication-services'
import createToast from 'src/views/customs/my-toast'
import { createFailIcon, createSuccessIcon } from 'src/views/customs/my-icon'

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
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const [changePasswordVisible, setChangePasswordVisible] = useState(false)
  const [user, setUser] = useState()
  const passwordData = {
    updateCurrentPassword: '',
    udpateNewPassword: '',
    updateConfirmPassword: ''
  }
  const [passwordState, setPasswordState] = useState(passwordData)
  const updateValidatedData = {
    updateValidated1: false,
    updateValidated2: false
  }
  const [updateValidatedState, setUpdateValidatedState] = useState(updateValidatedData)
  const {updateValidated1, updateValidated2} = updateValidatedState
  const [newPasswordVisible, setNewPasswordVisible] = useState(false)
  const {updateNewPassword, updateConfirmPassword, updateCurrentPassword} = passwordState
  const handleUpdateValidatedState = (flag, value) => {
    if (flag) {
      setUpdateValidatedState(prev => {
        return {...prev, updateValidated1: value}
      })
    }else {
      setUpdateValidatedState(prev => {
        return {...prev, updateValidated2: value}
      })
    }
  }
  const handleSetNewPassword = (value) => {
    setPasswordState(prev => {
      return {...prev, updateNewPassword: value}
    })
  }
  const handleSetCurrentPassword = (value) => {
    setPasswordState(prev => {
      return {...prev, updateCurrentPassword: value}
    })
  }
  const handleSetConfirmPassword = (value) => {
    setPasswordState(prev => {
      return {...prev, updateConfirmPassword: value}
    })
  }
  const openChangePasswordModal = () => {
    setChangePasswordVisible(true)
  }
  const confirmPassword = (e) => {
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
    }else {
      const loggedData = {
        username: user?.username,
        password: CryptoJS.AES.encrypt(updateCurrentPassword || '', secretKey).toString()
      }
      // Mở xác nhận
      loginAuth(loggedData)
      .then(res => {
        // login operation here --> Calling API 
        setNewPasswordVisible(true)
        addToast(createToast({
          title: 'Xác nhận mật khẩu',
          content: 'Xác nhận mật khẩu thành công ! Mời bạn nhập mật khẩu mới',
          icon: createSuccessIcon()
        }))
        setPasswordState(passwordData)
        handleUpdateValidatedState(true, false)
        setNewPasswordVisible(true)
      })
      .catch(err => {
        // non-login operation here --> Show the toast
        addToast(createToast({
          title: 'Cập nhật mật khẩu',
          content: "Xác nhận mật khẩu không thành công! Mật khẩu hiện tại không đúng",
          icon: createFailIcon()
        }))
      })
    }
    handleUpdateValidatedState(true, true)
  }
  const secretKey = process.env.AUTH_TOKEN || 'oda_dev'
  const updatePassword = (e) => {
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
    } else {
      if (updateConfirmPassword !== updateNewPassword) {
        addToast(createToast({
          title: 'Cập nhật mật khẩu',
          content: 'Cập nhật mật khẩu không thành công ! Mật khẩu xác nhận lại không đúng',
          icon: createFailIcon()
        }))
      } else {
        const changePasswordData = {
          password: CryptoJS.AES.encrypt(updateNewPassword || '', secretKey).toString()
        }
        updateUser(changePasswordData, user?._id)
          .then(res => {
              if (res?.data?.success)  {
                  setChangePasswordVisible(false)
                  addToast(createToast({
                      title: 'Cập nhật mật khẩu',
                      content: 'Cập nhật mật khẩu thành công',
                      icon: createSuccessIcon()
                  }))
                  handleUpdateValidatedState(false, false)
                  setPasswordState(passwordData)
                  setNewPasswordVisible(false)
              }else {
                  addToast(createToast({
                      title: 'Cập nhật mật khẩu',
                      content: res?.data?.message,
                      icon: createFailIcon()
                  }))
              }

          })
          .catch(err => {
              addToast(createToast({
                  title: 'Cập nhật mật khẩu',
                  content: "Cập nhật mật khẩu không thành công",
                  icon: createFailIcon()
              }))
          })  
      }
    }
    handleUpdateValidatedState(false, true)
  }
  const changePasswordForm = (isLoaded) => { 
    return (
        <>
            {  isLoaded ? <>
              <CForm 
                    onSubmit={e => confirmPassword(e)} 
                    noValidate
                    validated={updateValidated1}
                >
                    <CRow>
                        <CCol lg={12}>
                            <CFormInput
                                className="mt-4"
                                type="password"
                                disabled={newPasswordVisible}
                                required
                                placeholder="Mật khẩu hiện tại"
                                feedbackInvalid="Chưa nhập mật khẩu hiện tại!"
                                onChange={(e) => handleSetCurrentPassword(e.target.value)}
                                value={updateCurrentPassword}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12} className="d-flex justify-content-end">
                            <CButton type="submit" className="mt-4" color="primary"
                              disabled={newPasswordVisible}
                            >Xác nhận mật khẩu</CButton>
                        </CCol>
                    </CRow>
                </CForm>
              <CForm 
                    onSubmit={e => updatePassword(e)} 
                    noValidate
                    validated={updateValidated2}
                >
                    <CRow>
                        <CCol lg={12}>
                            <CFormInput
                                className="mt-4"
                                type="password"
                                disabled={!newPasswordVisible}
                                required
                                placeholder="Mật khẩu mới"
                                feedbackInvalid="Chưa nhập mật khẩu mới!"
                                onChange={(e) => handleSetNewPassword(e.target.value)}
                                value={updateNewPassword}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12}>
                            <CFormInput
                                className="mt-4"
                                type="password"
                                disabled={!newPasswordVisible}
                                required
                                placeholder="Xác nhận lại mật khẩu"
                                feedbackInvalid="Chưa nhập mật khẩu xác nhận!"
                                onChange={(e) => handleSetConfirmPassword(e.target.value)}
                                value={updateConfirmPassword}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12} className="d-flex justify-content-end">
                            <CButton type="submit" className="mt-4" color="primary"
                              disabled={!newPasswordVisible}
                            >Đổi mật khẩu</CButton>
                        </CCol>
                    </CRow>
                </CForm>
            </>
            : <CSpinner />
            }
        </>
    )
}

  useEffect(() => {
    onUpdateAuthStatus()
    const user = getLoggedUserInformation()
    setUser(user)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {
        isAuthenticated ? <CDropdown variant="nav-item">
          <CustomModal visible={changePasswordVisible} title={'Đổi mật khẩu'} body={changePasswordForm(user)} setVisible={(value) => setChangePasswordVisible(value)}/>
          <CToaster ref={toaster} push={toast} placement="top-end" />
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
            <CDropdownItem role='button' className='text-primary' onClick={() => openChangePasswordModal()}>
              <CIcon icon={cilLoopCircular}  className="me-2" role='button' />
              Đổi mật khẩu
            </CDropdownItem>
            <CDropdownItem role='button' className='text-danger' onClick={() => handleLogout()}>
              <CIcon icon={cilLockLocked}  className="me-2" role='button' />
              Đăng xuất
            </CDropdownItem>
          </CDropdownMenu>
          </CDropdown> : <CButton>
            <a className='' href='#/login'>Đăng nhập</a>
          </CButton>
      }
    </>

  )
}

export default AppHeaderDropdown

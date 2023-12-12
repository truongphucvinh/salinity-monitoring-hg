import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToastHeader,
  CToastBody,
  CToast,
  CToaster
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { loginAuth } from 'src/services/authentication-services'
import * as CryptoJS from 'crypto-js'
import {INVALID_CREDDENTIAL} from "../../../errors/LoginErrors"
const Login = () => {
  // Login data
  const loginData = {
    username: '',
    password: ''
  }
  const [login, setLogin] = useState(loginData)
  const {username, password} = login

  const handleSetUsername = (value) => {
    setLogin(prev => {
      return {...prev, username: value}
    })
  }
  const handleSetPassword = (value) => {
    setLogin(prev => {
      return {...prev, password: value}
    })
  }
  // Login Redirect
  let navigate = useNavigate() 
  // Login logic
  const secretKey = process.env.AUTH_TOKEN || 'oda_dev'
  const onFinish = () => {
    const loginRequest = {
      username: username,
      password: CryptoJS.AES.encrypt(password || '', secretKey).toString()
    }
    loginAuth(loginRequest)
    .then(res => {
      localStorage.setItem("_authenticatedUser", JSON.stringify(res?.data?.data))
      navigate('/dashboard')
    }).catch(err => {
      addToast(exampleToast)
    })
  }
  // Login Toast
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const exampleToast = (
    <CToast>
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#007aff"></rect>
        </svg>
        <div className="fw-bold me-auto">Xác thực</div>
        <small>0 phút trước</small>
      </CToastHeader>
      <CToastBody>{INVALID_CREDDENTIAL}</CToastBody>
    </CToast>
  )
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
          <CToaster ref={toaster} push={toast} placement="top-end" />
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={onFinish}>
                    <h1>Đăng nhập</h1>
                    <p className="text-body-secondary">Xác thực tài khoản của bạn</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Tên đăng nhập" autoComplete="username"
                        value={username}
                        onChange={(e) => handleSetUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Mật khẩu"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => handleSetPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary"  className="px-4" type='submit'>
                          Đăng nhập
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Quên mật khẩu?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Đăng ký</h2>
                    <p>
                      Hãy tạo một hồ sơ mới để sử dụng các dịch vụ của chúng tôi.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Đăng ký tại đây!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login

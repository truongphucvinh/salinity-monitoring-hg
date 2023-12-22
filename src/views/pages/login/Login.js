import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import * as icon from '@coreui/icons'
import CIcon from '@coreui/icons-react'
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
import { cilLockLocked, cilUser } from '@coreui/icons'
import { loginAuth } from 'src/services/authentication-services'
import * as CryptoJS from 'crypto-js'
import {INVALID_CREDENTIAL} from "../../../errors/LoginErrors"
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
  // Login Validation - Fix here tomorrow
  const [validated, setValidated] = useState(false)
  // Login Redirect
  let navigate = useNavigate() 
  // Login logic
  const secretKey = process.env.AUTH_TOKEN || 'oda_dev'
  const onFinish = (e) => {
    const form = e.currentTarget
    if (form.checkValidity() === true) {
      const loginRequest = {
        username: username,
        password: CryptoJS.AES.encrypt(password || '', secretKey).toString()
      }
      loginAuth(loginRequest)
      .then(res => {
        localStorage.setItem("_authenticatedUser", JSON.stringify(res?.data?.data))
        localStorage.setItem("_isAuthenticated", JSON.stringify(true))
        navigate('/dashboard')
      }).catch(err => {
        addToast(exampleToast)
      })
    }else {
      e.preventDefault()
      e.stopPropagation()
      setValidated(true)
    }
  }
  // Login Toast
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const exampleToast = (
    <CToast>
      <CToastHeader closeButton>
      <CIcon icon={icon.cilXCircle} style={{'--ci-primary-color': 'red'}} />
        <div className="fw-bold me-auto px-2">Xác thực</div>
      </CToastHeader>
      <CToastBody>{INVALID_CREDENTIAL}</CToastBody>
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
                  <CForm noValidate validated={validated} onSubmit={(e) => onFinish(e)}>
                    <h1>Đăng nhập</h1>
                    <p className="text-body-secondary">Xác thực tài khoản của bạn</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Tên đăng nhập" autoComplete="username"
                        feedbackInvalid="Vui lòng điền tên đăng nhập"
                        required
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
                        required
                        feedbackInvalid="Vui lòng điền mật khẩu"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => handleSetPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs>
                        <CButton color="primary"  className="px-4" type='submit'>
                          Đăng nhập
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
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

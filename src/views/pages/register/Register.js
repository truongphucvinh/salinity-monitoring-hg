import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Register = () => {
  // Register data
  const registerData = {
    username: '',
    password: '',
    confirm: '',
    email: ''
  }
  const [registerState, setRegisterState] = useState(registerData)
  const {username, password, confirm, email} = registerState
  const handleSetUsername = (value) => {
    setRegisterState((prev) => {
      return {...prev, username: value}
    })
  }
  const handleSetPassword = (value) => {
    setRegisterState((prev) => {
      return {...prev, password: value}
    })
  }
  const handleSetConfirm = (value) => {
    setRegisterState((prev) => {
      return {...prev, confirm: value}
    })
  }
  const handleSetEmail = (value) => {
    setRegisterState((prev) => {
      return {...prev, email: value}
    })
  }
  // Register Logic
  

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Đăng ký</h1>
                  <p className="text-body-secondary">Tạo tài khoản mới</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput placeholder="Tên đăng nhập" autoComplete="username" 
                      onChange={e => handleSetUsername(e.target.value)}
                      value={username}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput placeholder="Email" autoComplete="email" 
                      onChange={e => handleSetEmail(e.target.value)}
                      value={email}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Mật khẩu"
                      autoComplete="new-password"
                      onChange={e => handleSetPassword(e.target.value)}
                      value={password}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      autoComplete="new-password"
                      onChange={e => handleSetConfirm(e.target.value)}
                      value={confirm}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" type='submit'>Tạo tài khoản</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register

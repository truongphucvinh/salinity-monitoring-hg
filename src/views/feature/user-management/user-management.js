import React, { useEffect, useState } from "react"
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CTableDataCell,
    CButton,
    CFormInput,
    CForm
  } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilPencil,
    cilTrash,
    cilMagnifyingGlass,
    cilReload
  } from '@coreui/icons'
import { getAllUsers } from "src/services/authentication-services"
import { setAuthApiHeader } from "src/services/global-axios"


const UserManagement = () => {

    // User Management Data
    const [listUsers, setListUsers] = useState([])
    // Call inital APIs
    useEffect(() => {
        if (JSON.parse(localStorage.getItem("_isAuthenticated"))) {
            setAuthApiHeader()
            getAllUsers()
            .then(res => {
                // Install filter users here
                const users = res?.data?.data?.result
                setListUsers(users)
                setFilteredUsers(users)
            })
            .catch(err => {
                // Do nothing
            })
        }
    },[])
    // Searching data
    const [filteredUsers, setFilteredUsers] = useState([])
    const initSearch = {
        username: '',
        email: '',
        fullName: ''
    }
    const [searchState, setSearchState] = useState(initSearch)
    const {username, email, fullName} = searchState
    const handleSetUsername = (value) => {
        setSearchState(prev => {
            return {...prev, username: value}
        })
    }
    const handleSetEmail = (value) => {
        setSearchState(prev => {
            return {...prev, email: value}
        })
    }
    const handleSetFullName = (value) => {
        setSearchState(prev => {
            return {...prev, fullName: value}
        })
    }
    const onFilter = () => {
        if (username) {
            setFilteredUsers(prev => {
                return prev.filter(user => user?.username === username.trim())
            })
        }
        if (email) {
            setFilteredUsers(prev => {
                return prev.filter(user => user?.email === email.trim())
            })
        }
        if (fullName) {
            setFilteredUsers(prev => {
                return prev.filter(user => user?.fullName === fullName.trim())
            })
        }
    }
    const onReset = () => {
        setFilteredUsers(listUsers)
    }

    return (
        <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Danh sách người dùng</CCardHeader>
            <CCardBody>
                <CForm onSubmit={onFilter}>
                    <CRow>
                        <CCol xs={3}>
                            <CFormInput
                                type="text"
                                placeholder="Tên tài khoản"
                                onChange={(e) => handleSetUsername(e.target.value)}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                        <CCol xs={3}>
                            <CFormInput
                                type="email"
                                placeholder="Email"
                                onChange={(e) => handleSetEmail(e.target.value)}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                        <CCol xs={3}>
                            <CFormInput
                                type="text"
                                placeholder="Họ và tên"
                                onChange={(e) => handleSetFullName(e.target.value)}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                        <CCol xs={3}>
                            <CButton color="primary" type="submit">
                                <CIcon icon={cilMagnifyingGlass} className="text-white"/>                             
                            </CButton>
                            <CButton color="success" className="mx-2" onClick={onReset}>
                                <CIcon icon={cilReload} className="text-white"/>   
                            </CButton>
                        </CCol>
                    </CRow>
              </CForm>
              <br />
              <CTable bordered align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">STT</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Tên tài khoản</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Email</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Họ và tên</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Thao tác</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        filteredUsers.map((user, index) => {
                            return (
                                <CTableRow key={user._id}>
                                    <CTableDataCell>{index + 1}</CTableDataCell>
                                    <CTableDataCell>{user?.username}</CTableDataCell>
                                    <CTableDataCell>{user?.email}</CTableDataCell>
                                    <CTableDataCell>{user?.fullName}</CTableDataCell>
                                    <CTableDataCell>
                                        <CIcon icon={cilPencil} className="text-success mx-1" role="button"/>
                                        <CIcon icon={cilTrash} className="text-danger" role="button"/>
                                    </CTableDataCell>
                                </CTableRow>    
                            )
                        })
                    }
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
}

export default UserManagement
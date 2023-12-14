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
    CForm,
    CPagination,
    CPaginationItem,
    CFormSelect
  } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilPencil,
    cilTrash,
    cilMagnifyingGlass,
    cilReload,
    cilPlus
  } from '@coreui/icons'
import { getAllDomains, getAllRoles, getAllUsers } from "src/services/authentication-services"
import { setAuthApiHeader } from "src/services/global-axios"
import CustomPagination, {currentPageData} from "src/views/customs/my-pagination"
import CustomModal from "src/views/customs/my-modal"

const UserManagement = () => {

    // User Management Data
    const [listUsers, setListUsers] = useState([])
    const [listDomains, setListDomains] = useState([])
    const [listRoles, setListRoles] = useState([])
    
    // Call inital APIs
    useEffect(() => {
        if (JSON.parse(localStorage.getItem("_isAuthenticated"))) {
            // Setting up access token
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
            
            getAllDomains()
            .then(res => {
                const domains = res?.data?.data?.result
                setListDomains(domains)
            })
            .catch(err => {
                // Do nothing
            })

            getAllRoles()
            .then((res) => {
                const roles = res?.data?.data?.result
                setListRoles(roles)
            })
            .catch((err) => {
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
        if (username || email || fullName) {
            setFilteredUsers(listUsers)
            if (username) {
                setFilteredUsers(prev => {
                    return prev.filter(user => user?.username?.includes(username.trim()))
                })
            }
            if (email) {
                setFilteredUsers(prev => {
                    return prev.filter(user => user?.email?.includes(email.trim()))
                })
            }
            if (fullName) {
                console.log();
                setFilteredUsers(prev => {
                    return prev.filter(user => user?.fullName?.includes(fullName.trim()))
                })
            }
        }else {
            onReset()
        }
    }
    const onReset = () => {
        setFilteredUsers(listUsers)
    }
    // Pagination + Filtering
    const showFilteredTable = (filteredUsers, duration) => {
        return (
            <CTable bordered align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '5%'}}>#</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '30%'}}>Tên tài khoản</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '30%'}}>Email</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '20%'}}>Họ và tên</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '15%'}}>Thao tác</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        filteredUsers.map((user, index) => {
                            return (
                                <CTableRow key={user._id}>
                                    <CTableDataCell>{index + 1 + duration}</CTableDataCell>
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
        )
    }
    // Adding Modal
    const [addVisible, setAddVisible] = useState(false)
    const addForm = (
            <CForm>
                <CRow>
                    <CCol lg={12}>
                        <CFormInput
                            className="mb-4"
                            type="text"
                            placeholder="Tên tài khoản"
                            onChange={(e) => handleSetUsername(e.target.value)}
                            aria-describedby="exampleFormControlInputHelpInline"
                        />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol lg={12}>
                        <CFormInput
                            className="mb-4"
                            type="password"
                            placeholder="Mật khẩu"
                            onChange={(e) => handleSetUsername(e.target.value)}
                            aria-describedby="exampleFormControlInputHelpInline"
                        />
                    </CCol>
                </CRow>
                
                <CRow>
                    <CCol lg={12}>
                        <CFormInput
                            className="mb-4"
                            type="text"
                            placeholder="Họ và tên"
                            onChange={(e) => handleSetUsername(e.target.value)}
                            aria-describedby="exampleFormControlInputHelpInline"
                        />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol lg={12}>
                        <CFormInput
                            className="mb-4"
                            type="email"
                            placeholder="Email"
                            onChange={(e) => handleSetUsername(e.target.value)}
                            aria-describedby="exampleFormControlInputHelpInline"
                        />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol lg={12}>
                        <CFormSelect aria-label="Default select example" className="mb-4" required>
                            <option defaultChecked>Tổ chức</option>
                            {
                                listDomains.map((domain) => {
                                    return  <option key={domain?._id} value={domain?._id}>{domain?.name}</option>
                                })
                            }
                        </CFormSelect>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol lg={12}>
                        <CFormSelect aria-label="Default select example" className="mb-4" required>
                            <option defaultChecked>Vai trò</option>
                            {
                                listRoles.map((role) => {
                                    return  <option key={role?._id} value={role?._id}>{role?.name}</option>
                                })
                            }
                        </CFormSelect>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol lg={12} className="d-flex justify-content-end"><CButton type="submit" color="primary">Hoàn tất</CButton></CCol>
                </CRow>
            </CForm>)

    return (
        <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Danh sách người dùng</CCardHeader>
            <CCardBody>
                <CustomModal visible={addVisible} title={'Thêm người dùng'} body={addForm} setVisible={(value) => setAddVisible(value)}/>
                <CForm onSubmit={onFilter}>
                    <CRow>
                        <CCol md={12} lg={3}>
                            <CFormInput
                                className="mb-2"
                                type="text"
                                placeholder="Tên tài khoản"
                                onChange={(e) => handleSetUsername(e.target.value)}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                        <CCol md={12} lg={3}>
                            <CFormInput
                                className="mb-2"
                                type="text"
                                placeholder="Email"
                                onChange={(e) => handleSetEmail(e.target.value)}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                        <CCol md={12} lg={3}>
                            <CFormInput
                                className="mb-2"
                                type="text"
                                placeholder="Họ và tên"
                                onChange={(e) => handleSetFullName(e.target.value)}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                        <CCol md={12} lg={3}>
                            <CButton color="primary" className="me-2 " type="submit">
                                <CIcon icon={cilMagnifyingGlass} className="text-white"/>                             
                            </CButton>
                            <CButton color="success" onClick={onReset}>
                                <CIcon icon={cilReload} className="text-white"/>   
                            </CButton>
                        </CCol>
                    </CRow>
              </CForm>
              <br />
              <CRow>
                <CCol xs={12}>
                    <CButton type="button" color="primary" onClick={() => setAddVisible(true)}>Thêm <CIcon icon={cilPlus}/></CButton>
                </CCol>
              </CRow>
              <br />
              <CustomPagination listItems={filteredUsers} showData={showFilteredTable} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
}

export default UserManagement
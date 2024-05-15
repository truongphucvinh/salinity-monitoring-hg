import React, { useEffect, useState, useRef } from "react"
import * as CryptoJS from 'crypto-js'
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
    CToaster,
    CFormSelect,
    CSpinner
  } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilPencil,
    cilTrash,
    cilMagnifyingGlass,
    cilReload,
    cilPlus,
    cilLoopCircular
  } from '@coreui/icons'
import { createUser, deleteUser, getAllUsers, getPermissionsOfDomain, getUserById, updateUser } from "src/services/authentication-services"
import { setAuthApiHeader } from "src/services/global-axios"
import CustomPagination from "src/views/customs/my-pagination"
import CustomModal from "src/views/customs/my-modal"
import createToast from "src/views/customs/my-toast"
import { createFailIcon, createSuccessIcon } from "src/views/customs/my-icon"
import CustomAuthorizationChecker from "src/views/customs/my-authorizationchecker"
import CustomAuthorizationCheckerChildren from "src/views/customs/my-authorizationchecker-children"
import { checkCurrentUser, checkUserCanNotChange, searchRelatives } from "src/tools"
import CustomAuthChecker from "src/views/customs/my-authchecker"
import CustomIntroduction from "src/views/customs/my-introduction"

const UserManagement = () => {

    const defaultPageCode="U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dms_page_user_management"
    const defaultRoleAdminId="65b74ca2526ef32c8be0ca07"||process.env.HG_ROLE_ID_ADMIN_DEFAULT
    // User Management Data
    const [listUsers, setListUsers] = useState([])
    // const [listDomains, setListDomains] = useState([])
    const [listRoles, setListRoles] = useState([])
    const secretKey = process.env.REACT_APP_AUTH_TOKEN
    const defaultDomainId = process.env.HG_DOMAIN_ID || '65b0cbba526ef32c8be05f1d'
    const defaultAuthorizationCode = process.env.REACT_APP_HG_MODULE_USER_MANAGEMENT || "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_user_management"
    // Checking feature's module
    const defaultModuleAddFeature = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_user_management_add_user"
    const defaultModuleUpdateFeature = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_user_management_update_user"
    const defaultModuleDeleteFeature = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_user_management_delete_user"
    const [haveAdding, setHaveAdding] = useState(false)
    const [haveUpdating, setHaveUpdating] = useState(false)
    const [haveDeleting, setHaveDeleting] = useState(false)
    // Call inital APIs
    // Filtering all users of our project
    const onFilterUsers = (listUsers, domainId) => {
        return listUsers.filter(user => {
            return user?.permission?.domain === domainId
        })
    }
    const convertResultToRoleList = (results) => {
        return results?.length !== 0 && results?.map(item => {
            return item?.role
        })
    }
    const rebaseAllData = () => {
        if (JSON.parse(localStorage.getItem("_isAuthenticated"))) {
            // Setting up access token
            setAuthApiHeader()
            getAllUsers()
            .then(res => {
                // Install filter users here
                const users = res?.data?.data?.result
                const filteredUsers = onFilterUsers(users, defaultDomainId)
                setListUsers(filteredUsers)
                setFilteredUsers(filteredUsers)
            })
            .catch(err => {
                // Do nothing
            })

            getPermissionsOfDomain(defaultDomainId)
            .then(res => {
                const permissions = res?.data?.data?.result
                const roles = convertResultToRoleList(permissions)
                setListRoles(roles)
            })
            .catch(err => {
                // Do nothing
            })
        }
    }
    useEffect(() => {
       rebaseAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    return prev.filter(user => user?.username && searchRelatives(user?.username, username))
                })
            }
            if (email) {
                setFilteredUsers(prev => {
                    return prev.filter(user => user?.email && searchRelatives(user?.email, email))
                })
            }
            if (fullName) {
                setFilteredUsers(prev => {
                    return prev.filter(user => user?.fullName && searchRelatives(user?.fullName, fullName))
                })
            }
        }else {
            onReset()
        }
    }
    const onReset = () => {
        setFilteredUsers(listUsers)
    }
    // Toast
    const [toast, addToast] = useState(0)
    const toaster = useRef()


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
                        filteredUsers?.length !== 0 ? filteredUsers.map((user, index) => {
                            return (
                                <CTableRow key={user?._id}>
                                    <CTableDataCell>{index + 1 + duration}</CTableDataCell>
                                    <CTableDataCell>{user?.username}</CTableDataCell>
                                    <CTableDataCell>{user?.email}</CTableDataCell>
                                    <CTableDataCell>{user?.fullName}</CTableDataCell>
                                    {
                                        !checkUserCanNotChange(user?._id)?.status ? <CTableDataCell>
                                            {
                                                checkUserCanNotChange(user?._id)?.canEdit ? <>
                                                    {haveUpdating && <CIcon icon={cilPencil} onClick={() => openUpdateModal(user?._id)} className="text-success mx-1" role="button"/>}                                            
                                                </> : <>{`${checkUserCanNotChange(user?._id)?.msg}`}</>
                                            }
                                        </CTableDataCell> : <CTableDataCell>
                                            {haveUpdating && <CIcon icon={cilPencil} onClick={() => openUpdateModal(user?._id)} className="text-success mx-1" role="button"/>}
                                            {haveDeleting && <CIcon icon={cilTrash} onClick={() => openDeleteModal(user?._id)}  className="text-danger" role="button"/>}
                                        </CTableDataCell>
                                    }

                                </CTableRow>    
                            )
                        }) : <CTableRow>
                            <CTableDataCell colSpan={5}><p className="text-center">{'Không có dữ liệu'}</p></CTableDataCell>
                        </CTableRow>
                    }
                </CTableBody>
              </CTable>
        )
    }
    // Adding Modal
    const addData = {
        addUsername: '',
        addPassword: '',
        addFullname: '',
        addEmail: '',
        // addDomainId: '',
        addRoleId: '',
        addLoaded: true
    }
    const [addState, setAddState] = useState(addData)
    const { addLoaded, addUsername, addPassword, addFullname, addEmail, /*addDomainId*/ addRoleId } = addState
    const [addValidated, setAddValidated] = useState(false)
    const handleSetAddLoaded = (value) => {
        setAddState(prev => {
            return { ...prev, addLoaded: value }
        })
    }
    const handleSetAddUsername = (value) => {
        setAddState(prev => {
            return { ...prev, addUsername: value }
        })
    }
    const handleSetAddPassword = (value) => {
        setAddState(prev => {
            return { ...prev, addPassword: value }
        })
    }
    const handleSetAddFullname = (value) => {
        setAddState(prev => {
            return { ...prev, addFullname: value }
        })
    }
    const handleSetAddEmail = (value) => {
        setAddState(prev => {
            return { ...prev, addEmail: value }
        })
    }
    // const handleSetAddDomainId = (value) => {
    //     setAddState(prev => {
    //         return { ...prev, addDomainId: value }
    //     })
    // }
    const handleSetAddRoleId = (value) => {
        setAddState(prev => {
            return { ...prev, addRoleId: value }
        })
    }
    const createNewUser = (e) => {
        // validation
        const form = e.currentTarget
        e.preventDefault()
        if (form.checkValidity() === false) {
            e.stopPropagation()
        } else {
            // This is backup for general domain and role selection also
            // const user = {
            //     username: addUsername,
            //     fullName: addFullname,
            //     password: CryptoJS.AES.encrypt(addPassword || '', secretKey).toString(),
            //     email: addEmail,
            //     domain: addDomainId,
            //     role: addRoleId
            // }
            const user = {
                username: addUsername,
                fullName: addFullname,
                password: CryptoJS.AES.encrypt(addPassword || '', secretKey).toString(),
                email: addEmail,
                domain: defaultDomainId,
                role: addRoleId
            }
            createUser(user)
            .then(res => {
                if (res?.data?.success)  {
                    setAddVisible(false)
                    rebaseAllData()
                    addToast(createToast({
                        title: 'Thêm người dùng',
                        content: 'Thêm người dùng thành công',
                        icon: createSuccessIcon()
                    }))
                    handleSetAddLoaded(false)
                    setAddValidated(false)
                }else {
                    addToast(createToast({
                        title: 'Thêm người dùng',
                        content: res?.data?.message,
                        icon: createFailIcon()
                    }))
                }
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Thêm người dùng',
                    content: "Thêm người dùng không thành công",
                    icon: createFailIcon()
                }))
            })  
        }
        setAddValidated(true)
    }

    const [addVisible, setAddVisible] = useState(false)
    const addForm = (isLoaded) => {
        return <>
        {
            !isLoaded ? <CSpinner /> : <CForm 
            onSubmit={e => createNewUser(e)} 
            noValidate
            validated={addValidated}
        >
            <CRow>
                <CCol lg={12}>
                    <CFormInput
                        className="mt-4"
                        type="text"
                        placeholder="Tên tài khoản"
                        feedbackInvalid="Chưa nhập tên tài khoản!"
                        onChange={(e) => handleSetAddUsername(e.target.value)}
                        value={addUsername}
                        aria-describedby="exampleFormControlInputHelpInline"
                        required
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol lg={12}>
                    <CFormInput
                        className="mt-4"
                        type="password"
                        placeholder="Mật khẩu"
                        feedbackInvalid="Chưa nhập mật khẩu!"
                        onChange={(e) => handleSetAddPassword(e.target.value)}
                        value={addPassword}
                        aria-describedby="exampleFormControlInputHelpInline"
                        required
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol lg={12}>
                    <CFormInput
                        className="mt-4"
                        type="text"
                        placeholder="Họ và tên"
                        feedbackInvalid="Chưa nhập họ và tên!"
                        onChange={(e) => handleSetAddFullname(e.target.value)}
                        value={addFullname}
                        aria-describedby="exampleFormControlInputHelpInline"
                        required
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol lg={12}>
                    <CFormInput
                        className="mt-4"
                        type="email"
                        placeholder="Email"
                        feedbackInvalid="Chưa nhập Email!"
                        onChange={(e) => handleSetAddEmail(e.target.value)}
                        value={addEmail}
                        aria-describedby="exampleFormControlInputHelpInline"
                        required
                    />
                </CCol>
            </CRow>
            {/* This is backup for vary of domain selection */}
            {/* <CRow> 
                <CCol lg={12}>
                    <CFormSelect
                        aria-label="Default select example" 
                        className="mt-4" 
                        onChange={(e) => handleSetAddDomainId(e.target.value)} 
                        required
                        value={addDomainId}
                        feedbackInvalid="Chưa chọn tổ chức!"
                    >
                        <option selected="" value="">Tổ chức</option>
                        {
                            listDomains.map((domain) => {
                                return  <option key={domain?._id} value={domain?._id}>{domain?.name}</option>
                            })
                        }
                    </CFormSelect>
                </CCol>
            </CRow> */}
            <CRow>
                <CCol lg={12}>
                    <CFormSelect 
                        aria-label="Default select example" 
                        className="mt-4"
                        onChange={(e) => handleSetAddRoleId(e.target.value)}
                        value={addRoleId}
                        required
                        feedbackInvalid="Chưa chọn vai trò!"
                    >
                        <option selected="" value="" >Vai trò</option>
                        {
                            listRoles && Array.isArray(listRoles) && listRoles.filter((role) => {
                                return role?._id !== defaultRoleAdminId
                            }).map((role) => {
                                return  <option key={role?._id} value={role?._id}>{role?.name}</option>
                            })
                        }
                    </CFormSelect>
                </CCol>
            </CRow>
            <CRow>
                <CCol lg={12} className="d-flex justify-content-end">
                    <CButton type="submit" className="mt-4" color="primary">Hoàn tất</CButton>
                </CCol>
            </CRow>
        </CForm>          
        }
    </>
    } 
 
    // Updating Model
    const updateData = {
        updateId: '',
        updateUsername: '',
        updatePassword: '',
        updateFullname: '',
        updateEmail: '',
        // updateDomainId: '',
        updateRoleId: '' 
    }
    const [updateState, setUpdateState] = useState(updateData)
    const { updateId, updateUsername, updatePassword, updateFullname, updateEmail, /*updateDomainId*/ updateRoleId } = updateState
    const [updateValidated, setUpdateValidated] = useState(false)
    const getUserDataById = (userId) => {
        if (userId) {
            getUserById(userId)
            .then(res => {
                if (res?.data.success) {
                    const user = res?.data?.data
                    setUpdateState(prev => {
                        return {
                            ...prev, 
                            updateId: user?._id,
                            updateUsername: user.username,
                            updateFullname: user.fullName,
                            updateEmail: user.email,
                            updateDomainId: user?.permission?.domain,
                            updateRoleId: user?.permission?.role
                        }
                    })
                }else {
                    addToast(createToast({
                        title: 'Cập nhật người dùng',
                        content: res?.data.message,
                        icon: createFailIcon()
                    }))
                }
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Cập nhật người dùng',
                    content: "Thông tin người dùng không đúng",
                    icon: createFailIcon()
                }))
            })
        }
    }
    // const handleSetUpdateId = (value) => {
    //     setUpdateState(prev => {
    //         return { ...prev, updateId: value }
    //     })
    // }
    const openUpdateModal = (userId) => {
        getUserDataById(userId)
        setUpdateVisible(true)
    }
    const openUpdatePasswordModal = (userId) => {
        getUserById(userId)
        setUpdateVisible(true)
    }
    const handleSetUpdateUsername = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateUsername: value }
        })
    }
    const handleSetUpdatePassword = (value) => {
        setUpdateState(prev => {
            return { ...prev, updatePassword: value }
        })
    }
    const handleSetUpdateFullname = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateFullname: value }
        })
    }
    const handleSetUpdateEmail = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateEmail: value }
        })
    }
    // const handleSetUpdateDomainId = (value) => {
    //     setUpdateState(prev => {
    //         return { ...prev, updateDomainId: value }
    //     })
    // }
    const handleSetUpdateRoleId = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateRoleId: value }
        })
    }
    const updateAUser = (e) => {
        // validation
        const form = e.currentTarget
        e.preventDefault()
        if (form.checkValidity() === false) {
            e.stopPropagation()
        } else {
            // This is backup for update user with the general domain selections
            // const user = {
            //     username: updateUsername,
            //     fullName: updateFullname,
            //     password: CryptoJS.AES.encrypt(updatePassword || '', secretKey).toString(),
            //     email: updateEmail,
            //     domain: updateDomainId,
            //     role: updateRoleId
            // }
            let user = {}
            // if we have already complete the password field.
            if (updatePassword){
                user = {
                    username: updateUsername,
                    fullName: updateFullname,
                    password: CryptoJS.AES.encrypt(updatePassword || '', secretKey).toString(),
                    email: updateEmail,
                    domain: defaultDomainId,
                    role: updateRoleId
                }
            }else {
                user = {
                    username: updateUsername,
                    fullName: updateFullname,
                    email: updateEmail,
                    domain: defaultDomainId,
                    role: updateRoleId
                }
            }
            updateUser(user, updateId)
            .then(res => {
                if (res?.data?.success)  {
                    setUpdateVisible(false)
                    rebaseAllData()
                    addToast(createToast({
                        title: 'Cập nhật người dùng',
                        content: 'Cập nhật người dùng thành công',
                        icon: createSuccessIcon()
                    }))
                    setUpdateValidated(false)
                }else {
                    addToast(createToast({
                        title: 'Cập nhật người dùng',
                        content: res?.data?.message,
                        icon: createFailIcon()
                    }))
                }

            })
            .catch(err => {
                addToast(createToast({
                    title: 'Cập nhật người dùng',
                    content: "Cập nhật người dùng không thành công",
                    icon: createFailIcon()
                }))
            })  
        }
        setUpdateValidated(true)
    }
    const [updateVisible, setUpdateVisible] = useState(false)
    const updateForm = (isLoaded) => { 
        return (
            <>
                {  isLoaded ? 
                    <CForm 
                        onSubmit={e => updateAUser(e)} 
                        noValidate
                        validated={updateValidated}
                    >
                        <CRow>
                            <CCol lg={12}>
                                <CFormInput
                                    className="mt-4"
                                    type="text"
                                    placeholder="Tên tài khoản"
                                    feedbackInvalid="Chưa nhập tên tài khoản!"
                                    onChange={(e) => handleSetUpdateUsername(e.target.value)}
                                    value={updateUsername}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol lg={12}>
                                <CFormInput
                                    className="mt-4"
                                    type="password"
                                    placeholder="Mật khẩu"
                                    feedbackInvalid="Chưa nhập mật khẩu!"
                                    onChange={(e) => handleSetUpdatePassword(e.target.value)}
                                    value={updatePassword}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol lg={12}>
                                <CFormInput
                                    className="mt-4"
                                    type="text"
                                    placeholder="Họ và tên"
                                    feedbackInvalid="Chưa nhập họ và tên!"
                                    onChange={(e) => handleSetUpdateFullname(e.target.value)}
                                    value={updateFullname}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol lg={12}>
                                <CFormInput
                                    className="mt-4"
                                    type="email"
                                    placeholder="Email"
                                    feedbackInvalid="Chưa nhập email hoặc chưa đúng định dạng @..."
                                    onChange={(e) => handleSetUpdateEmail(e.target.value)}
                                    value={updateEmail}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                />
                            </CCol>
                        </CRow>
                        {/* This is backup to update user with the general domain selections */}
                        {/* <CRow>
                            <CCol lg={12}>
                                <CFormSelect
                                    aria-label="Default select example" 
                                    className="mt-4" 
                                    onChange={(e) => handleSetUpdateDomainId(e.target.value)} 
                                    value={updateDomainId}
                                    feedbackInvalid="Chưa chọn tổ chức!"
                                >
                                    <option selected="" value="">Tổ chức</option>
                                    {
                                        listDomains.map((domain) => {
                                            return  <option key={domain?._id} value={domain?._id}>{domain?.name}</option>
                                        })
                                    }
                                </CFormSelect>
                            </CCol>
                        </CRow> */}
                        {
                            checkUserCanNotChange(updateId)?.status && <CRow>
                                <CCol lg={12}>
                                    <CFormSelect 
                                        aria-label="Default select example" 
                                        className="mt-4"
                                        onChange={(e) => handleSetUpdateRoleId(e.target.value)} 
                                        value={updateRoleId}
                                        feedbackInvalid="Chưa chọn vai trò!"
                                    >
                                        <option selected="" value="" >Vai trò</option>
                                        {
                                            listRoles && Array.isArray(listRoles) && listRoles.filter((role) => {
                                                return role?._id !== defaultRoleAdminId
                                            }).map((role) => {
                                                return  <option key={role?._id} value={role?._id}>{role?.name}</option>
                                            })
                                        }
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                        }
                        <CRow>
                            <CCol lg={12} className="d-flex justify-content-end">
                                <CButton type="submit" className="mt-4" color="primary">Hoàn tất</CButton>
                            </CCol>
                        </CRow>
                    </CForm> : <CSpinner />
                }
            </>
        )
    }

    // Delete
    const deleteAUser = (userId) => {
        if (userId) {
            deleteUser(userId)
            .then(res => {
                if (res?.data?.success)  {
                    setDeleteVisible(false)
                    rebaseAllData()
                    addToast(createToast({
                        title: 'Xóa người dùng',
                        content: 'Xóa người dùng thành công',
                        icon: createSuccessIcon()
                    }))
                    setUpdateValidated(false)
                }else {
                    addToast(createToast({
                        title: 'Xóa người dùng',
                        content: res?.data?.message,
                        icon: createFailIcon()
                    }))
                }
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Xóa người dùng',
                    content: "Xóa người dùng không thành công",
                    icon: createFailIcon()
                }))
            })
        }
    }
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [deleteId, setDeleteId] = useState(0)
    const deleteForm = (userId) => {
        return (
            <>
                {   
                    userId ? 
                    <CForm onSubmit={(e) => {
                        e.preventDefault()
                        deleteAUser(userId)
                    }}>
                        <CRow>
                            <CCol md={12}>
                                <p>Bạn có chắc muốn xóa người dùng này ?</p>
                            </CCol>
                            <CCol md={12} className="d-flex justify-content-end">
                                <CButton color="primary" type="submit">Xác nhận</CButton>
                                <CButton color="danger" onClick={() => setDeleteVisible(false)} className="text-white ms-3">Hủy</CButton>
                            </CCol>
                        </CRow>
                    </CForm> : <CSpinner />
                }
            </>
        )
    }
    const openDeleteModal = (userId) => {
        setDeleteId(userId)
        setDeleteVisible(true)
    }

    useEffect(() => {
        // To reset all add state
        setAddState(addData)
        setUpdateState(updateData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[addVisible, updateVisible])

    return (
        <>
        <CustomIntroduction 
            pageCode={defaultPageCode}
            title="QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG"
            content="Hỗ trợ quản lý thông tin tài khoản người dùng, cung cấp tài khoản"
        />
        <CRow>
            <CustomAuthChecker />
        <CCol xs>
        <CustomAuthorizationChecker isRedirect={true} code={defaultAuthorizationCode} />
        <CustomAuthorizationCheckerChildren parentCode={defaultAuthorizationCode} checkingCode={defaultModuleAddFeature} setExternalState={setHaveAdding}/>
        <CustomAuthorizationCheckerChildren parentCode={defaultAuthorizationCode} checkingCode={defaultModuleUpdateFeature} setExternalState={setHaveUpdating}/>
        <CustomAuthorizationCheckerChildren parentCode={defaultAuthorizationCode} checkingCode={defaultModuleDeleteFeature} setExternalState={setHaveDeleting}/>
          <CCard className="mb-4">
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CCardHeader>Danh sách người dùng</CCardHeader>
            <CCardBody>
                <CustomModal visible={addVisible} title={'Thêm người dùng'} body={addForm(addLoaded)} setVisible={(value) => setAddVisible(value)}/>
                <CustomModal visible={updateVisible} title={'Cập nhật người dùng'} body={updateForm(updateId)} setVisible={(value) => setUpdateVisible(value)}/>
                <CustomModal visible={deleteVisible} title={'Xóa người dùng'} body={deleteForm(deleteId)} setVisible={(value) => setDeleteVisible(value)}/>
                <CForm onSubmit={(e) => {
                    e.preventDefault()
                    onFilter()
                }}>
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
                    {haveAdding && <CButton type="button" color="primary" onClick={() => setAddVisible(true)}>Thêm <CIcon icon={cilPlus}/></CButton>}
                </CCol>
              </CRow>
              <br />
              <CustomPagination listItems={filteredUsers} showData={showFilteredTable} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      </>
    )
}

export default UserManagement
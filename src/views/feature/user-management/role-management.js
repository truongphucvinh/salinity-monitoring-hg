import React, { useEffect, useState, useRef } from "react"
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
    CSpinner,
    CFormTextarea,
    CFormLabel,
    CAccordion,
    CAccordionItem,
    CAccordionHeader,
    CAccordionBody,
    CFormCheck
  } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilPencil,
    cilMagnifyingGlass,
    cilReload,
    cilPlus
  } from '@coreui/icons'
import { setAuthApiHeader } from "src/services/global-axios"
import CustomPagination from "src/views/customs/my-pagination"
import CustomModal from "src/views/customs/my-modal"
import createToast from "src/views/customs/my-toast"
import { createFailIcon, createSuccessIcon } from "src/views/customs/my-icon"
import CustomSpinner from "src/views/customs/my-spinner"
import { createPermission, createRole, getAllModules, getAllModulesOfPermission, getAllPermissions, getPermissionById, updatePermission, updateRole } from "src/services/authentication-services"

const RoleManagement = () => {

    // Role Management
    const defaultDomainId = '65b0cbba526ef32c8be05f1d' || process.env.HG_DOMAIN_ID
    const [listRole, setListRoles] = useState([])
    const [isLoadedRoles, setIsLoadedRoles] = useState(false)
    const [listModules, setListModules] = useState([])
    // It is used for the update also - think about changing its name
    const [addModules, setAddModules] = useState([])
    const handleSetIsLoadedRoles = (value) => {
        setIsLoadedRoles(prev => {
            return { ...prev, isLoadedRoles: value }
        })
    }

    

    useEffect(() => {
        handleSetIsLoadedRoles(true)
    }, [listRole])

    const rebaseAddModules = (modules) => {
        if (modules?.length !== 0) {
            setAddModules(modules.map(module => {
                return {
                    parent: module?._id,
                    children: []
                }
            }))
        }
    }

    useEffect(() => {
        rebaseAddModules(listModules)
    }, [listModules])
    
    // Call inital APIs
    const domainFilter = (permissions) => {
        const domainId = defaultDomainId
        const filteredPermissions = permissions.filter(permission => permission?.domain?._id === domainId)
        return filteredPermissions.map(permission => {
            return {
                _id: permission?.role?._id,
                name: permission?.role?.name,
                description: permission?.role?.description,
                permission_id: permission?._id
            }
        })
    }
    const moduleFilter = (modules) => {
        const moduleCode = 'U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ' || process.env.HG_MODULE_CODE
        return modules.filter(module => module?.URL.includes(moduleCode))
    }
    const rebaseAllData = () => {
        if (JSON.parse(localStorage.getItem("_isAuthenticated"))) {
            // Setting up access token
            setAuthApiHeader()
            getAllPermissions()
            .then(res => {
                const permissions = res?.data?.data?.result
                const filteredRoles = domainFilter(permissions)
                setListRoles(filteredRoles)
                setFilteredRoles(filteredRoles)
            })
            .catch(err => {
                // Do nothing
            })

            getAllModules()
            .then(res => {
                const modules = res?.data?.data?.result
                const filteredModules = moduleFilter(modules)
                setListModules(filteredModules)
            })
            .catch(err => {
                // Do nothing
            })
        }
    }
    useEffect(() => {
       rebaseAllData()
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    // Searching data
    const [filteredRoles, setFilteredRoles] = useState([])
    const initSearch = {
        roleName: "",
        roleDescription: ""
    }
    const [searchState, setSearchState] = useState(initSearch)
    const {roleName, roleDescription} = searchState
    const handleSetRoleName = (value) => {
        setSearchState(prev => {
            return {...prev, roleName: value}
        })
    }
    const handleSetRoleDescription = (value) => {
        setSearchState(prev => {
            return {...prev, roleDescription: value}
        })
    }
    const onFilter = () => {
        if (roleName || roleDescription) {
            setFilteredRoles(listRole)
            if (roleName) {
                setFilteredRoles(prev => {
                    return prev.filter(role => role?.name?.includes(roleName.trim()))
                })
            }
            if (roleDescription) {
                setFilteredRoles(prev => {
                    return prev.filter(role => role?.description?.includes(roleDescription.trim()))
                })
            }
        }else {
            onReset()
        }
    }
    const onReset = () => {
        setFilteredRoles(listRole)
    }
    // Toast
    const [toast, addToast] = useState(0)
    const toaster = useRef()


    // Pagination + Filtering
    const showFilteredTable = (filteredRoles, duration, isLoaded) => {
        return (
            <>
                {
                    !isLoaded ? <CustomSpinner /> :
                    <CTable bordered align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '5%'}}>#</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '30%'}}>Tên vai trò</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '50%'}}>Mô tả</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '15%'}}>Thao tác</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        filteredRoles?.length !== 0 ? filteredRoles.map((role, index) => {
                            return (
                                
                                <CTableRow key={role?._id}>
                                    <CTableDataCell>{index + 1 + duration}</CTableDataCell>
                                    <CTableDataCell>{role?.name}</CTableDataCell>
                                    <CTableDataCell>{role?.description}</CTableDataCell>
                                    <CTableDataCell>
                                        <CIcon icon={cilPencil} onClick={() => openUpdateModal(role?._id, role?.permission_id)} className="text-success mx-1" role="button"/>
                                        {/* <CIcon icon={cilTrash} onClick={() => openDeleteModal(role?._id)}  className="text-danger" role="button"/> */}
                                    </CTableDataCell>
                                </CTableRow>    
                            )
                        }) : <CTableRow>
                            <CTableDataCell colSpan={4}><p className="text-center">{'Không có dữ liệu'}</p></CTableDataCell>
                        </CTableRow>
                    }
                </CTableBody>
              </CTable>
                }
            </>
            
        )
    }
    // Adding Modal
    const addData = {
        addRoleName: "",
        addRoleDescription: ""
    }
    const [addState, setAddState] = useState(addData)
    const { addRoleName, addRoleDescription } = addState
    const [addValidated, setAddValidated] = useState(false)
    const addModuleItem = (parentModuleId, childModuleId) => {
        let flagIndex = -1
        for (let i = 0; i<=addModules?.length; i++) {
            if (addModules[i]?.parent === parentModuleId) {
                flagIndex = i
                break
            }
        }
        if (flagIndex !== -1 ) { // The parent id is existed !
            if (!addModules[flagIndex]?.children.includes(childModuleId)) {
                // The child element is not existed !
                addModules[flagIndex]?.children.push(childModuleId)
            }else {
                // The child element is existed ! --> We just remove is out of the children list
                const removeIndex = addModules[flagIndex]?.children?.indexOf(childModuleId)
                if (removeIndex !== -1) {
                    addModules[flagIndex]?.children.splice(removeIndex, 1)
                }
            }
        }
    }

    const handleSetAddRoleName = (value) => {
        setAddState(prev => {
            return { ...prev, addRoleName: value }
        })
    }
    const handleSetAddRoleDescription = (value) => {
        setAddState(prev => {
            return { ...prev, addRoleDescription: value }
        })
    }

    const createNewRole = (e) => {
        // validation
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
        } else {
            const role = {
                name: addRoleName.trim(),
                description: addRoleDescription.trim()
            }
            createRole(role)
            .then(res => {
                const newRole = res?.data?.data
                const permission = {
                    role: newRole?._id,
                    domain: defaultDomainId
                }
                createPermission(permission)
                .then(res1 => {
                    const newPermission = res1?.data?.data
                    const permissionModules = {
                        // To filter all parent without children modules
                        modules: addModules.filter(module => Array.isArray(module?.children) && module?.children?.length !== 0)
                    }
                    console.log(permissionModules)
                    updatePermission(permissionModules, newPermission?._id)
                    .then(res2 => {
                        console.log(res2)
                        setAddVisible(false)
                        rebaseAllData()
                        addToast(createToast({
                            title: 'Thêm vai trò',
                            content: 'Thêm vai trò thành công',
                            icon: createSuccessIcon()
                        }))
                        setAddValidated(false)
                    })
                    .catch(err2 => {
                        addToast(createToast({
                            title: 'Thêm vai trò',
                            content: "Thêm vai trò không thành công",
                            icon: createFailIcon()
                        }))
                    })
                })
                .catch(err1 => {
                    addToast(createToast({
                        title: 'Thêm vai trò',
                        content: "Thêm vai trò không thành công",
                        icon: createFailIcon()
                    }))
                })
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Thêm vai trò',
                    content: "Thêm vai trò không thành công",
                    icon: createFailIcon()
                }))
            })
        }
        setAddValidated(true)
    }

    const [addVisible, setAddVisible] = useState(false)

    // Reset the addModules --> Just save each element when the popup is showing
    useEffect(() => {
        if (!addVisible) {
            rebaseAddModules(listModules)
        }
    }, [addVisible]) // eslint-disable-line react-hooks/exhaustive-deps



    const addForm = () => {
        return <>
                <CForm 
                    onSubmit={e => createNewRole(e)} 
                    noValidate
                    validated={addValidated}
                >
                    <CRow>
                        <CCol lg={12}>
                            <CFormInput
                                className="mt-4"
                                type="text"
                                placeholder="Tên vai trò"
                                maxLength={50}
                                feedbackInvalid="Không bỏ trống và phải ít hơn 50 ký tự"
                                onChange={(e) => handleSetAddRoleName(e.target.value)}
                                value={addRoleName}
                                aria-describedby="exampleFormControlInputHelpInline"
                                required
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12}>
                            <CFormTextarea
                                className="mt-4"
                                type="text"
                                placeholder="Mô tả vai trò"
                                maxLength={250}
                                feedbackInvalid="Không bỏ trống và ít hơn 250 ký tự"
                                onChange={(e) => handleSetAddRoleDescription(e.target.value)}
                                value={addRoleDescription}
                                rows={3}
                                aria-describedby="exampleFormControlInputHelpInline"
                            ></CFormTextarea>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12}>
                            <CFormLabel></CFormLabel>
                            {
                                listModules?.length !== 0 ? <CAccordion>
                                    {
                                        listModules.map((module, index) => {
                                            return <CAccordionItem itemID={module?._id} key={index}>
                                                <CAccordionHeader>
                                                    {module?.name}
                                                </CAccordionHeader>
                                                <CAccordionBody>
                                                    {
                                                        module?.children?.length !== 0 ? <>
                                                            {
                                                                module?.children.map((childModule, index) => {
                                                                    return <CFormCheck id="flexCheckDefault" onClick={() => addModuleItem(module?._id, childModule?._id)} label={childModule?.name} key={index} value={childModule?._id}/>
                                                                })
                                                            }
                                                        </> : "Không có dữ liệu"
                                                    }
                                                </CAccordionBody>
                                            </CAccordionItem> 
                                        })
                                    }
                                </CAccordion> : <CSpinner />
                            }
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12} className="d-flex justify-content-end">
                            <CButton type="submit" className="mt-4" color="primary">Hoàn tất</CButton>
                        </CCol>
                    </CRow>
                </CForm> 
        </>

    }
 
    // Updating Model
    const updateData = {
        updateRoleId: '',
        updateRoleDescription: '',
        updateRoleName: ''
    }
    const [updateState, setUpdateState] = useState(updateData)
    const { updateRoleId, updateRoleDescription, updateRoleName } = updateState
    const [updateValidated, setUpdateValidated] = useState(false)
    const matchingAddModulesForUpdate = (modules) => {
        let customModules = addModules
        if (modules && Array.isArray(modules) && modules?.length !== 0) {
            for (let i = 0; i < modules?.length; i++) {
                for (let j = 0; j < customModules?.length; j++) {
                    if (customModules[j]?.parent === modules[i]?._id) {
                        if (Array.isArray(customModules[j]?.children) && Array.isArray(modules[i]?.children)) {
                            customModules[j].children = [... new Set([...customModules[j]?.children, ...modules[i]?.children])]
                        }
                    }
                }
            }
        }
        return customModules
    } 
    const getRoleDataById = (roleId, permissionId) => {
        if (roleId && permissionId) {
            getPermissionById(permissionId)
            .then(res => {
                console.log(res)
                const foundPermission = res?.data?.data
                const roleOfPermission = foundPermission?.role
                const updateRoleFetchedData = {
                    updateRoleId: roleOfPermission?._id,
                    updateRoleName: roleOfPermission?.name,
                    updateRoleDescription: roleOfPermission?.description
                }
                setUpdateState(updateRoleFetchedData)
                getAllModulesOfPermission(permissionId)
                .then(res1 => {
                    const modules = res1?.data?.data?.result
                    console.log(res1);
                    const customModules = matchingAddModulesForUpdate(modules)
                    console.log(customModules)
                })
                .catch(err1 => {
                    addToast(createToast({
                        title: 'Cập nhật vai trò',
                        content: "Thông tin vai trò không đúng",
                        icon: createFailIcon()
                    }))
                })
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Cập nhật vai trò',
                    content: "Thông tin vai trò không đúng",
                    icon: createFailIcon()
                }))
            })
        }
    }
    const handleSetUpdateRoleId = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateRoleId: value }
        })
    }
    const openUpdateModal = (roleId, permissionId) => {
        handleSetUpdateRoleId(roleId)
        getRoleDataById(roleId, permissionId)
        setUpdateVisible(true)
    }
    const handleSetUpdateRoleName = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateRoleName: value }
        })
    }
    const handleSetUpdateRoleDescription = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateRoleDescription: value }
        })
    }
    const updateADamType = (e) => {
        // validation
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
        } else {
            const role = {
                name: updateRoleName,
                description: updateRoleDescription
            }
            updateRole(role, updateRoleId)
            .then(res => {
                setUpdateVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Cập nhật vai trò',
                    content: 'Cập nhật vai trò thành công',
                    icon: createSuccessIcon()
                }))
                setUpdateValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Cập nhật vai trò',
                    content: "Cập nhật vai trò không thành công",
                    icon: createFailIcon()
                }))
            })  
        }
        setUpdateValidated(true)
    }
    const [updateVisible, setUpdateVisible] = useState(false)
    useEffect(() => {
        if (!updateVisible) {
            rebaseAddModules(listModules)
        }
    }, [updateVisible]) // eslint-disable-line react-hooks/exhaustive-deps
    const updateForm = (isLoaded) => { 
        return (
            <>
                {  isLoaded ? 
                    <CForm 
                        onSubmit={e => updateADamType(e)} 
                        noValidate
                        validated={updateValidated}
                    >
                        <CRow>
                            <CCol lg={12}>
                                <CFormInput
                                    className="mt-4"
                                    type="text"
                                    placeholder="Tên vai trò"
                                    maxLength={50}
                                    feedbackInvalid="Ít hơn 50 ký tự"
                                    onChange={(e) => handleSetUpdateRoleName(e.target.value)}
                                    value={updateRoleName}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol lg={12}>
                                <CFormTextarea
                                    className="mt-4"
                                    type="text"
                                    placeholder="Mô tả vai trò"
                                    onChange={(e) => handleSetUpdateRoleDescription(e.target.value)}
                                    value={updateRoleDescription}
                                    rows={3}
                                    maxLength={250}
                                    feedbackInvalid="Ít hơn 250 ký tự"
                                    aria-describedby="exampleFormControlInputHelpInline"
                                ></CFormTextarea>
                            </CCol>
                        </CRow>
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
    

    // Delete will be fixed later !
    /*
    const deleteARole = (roleId) => {
        if (roleId) {
            delete(roleId)
            .then(res => {
                setDeleteVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Xóa vai trò',
                    content: 'Xóa vai trò thành công',
                    icon: createSuccessIcon()
                }))
                setUpdateValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Xóa vai trò',
                    content: "Xóa vai trò không thành công",
                    icon: createFailIcon()
                }))
            })
        }
    }
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [deleteIdDamTypeId, setDeleteDamTypeId] = useState(0)
    const deleteForm = (damTypeId) => {
        return (
            <>
                {   
                    damTypeId ? 
                    <CForm onSubmit={() => deleteARole(damTypeId)}>
                        <CRow>
                            <CCol md={12}>
                                <p>Bạn có chắc muốn xóa vai trò này ?</p>
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
    const openDeleteModal = (damTypeId) => {
        setDeleteDamTypeId(damTypeId)
        setDeleteVisible(true)
    }
    */
    useEffect(() => {
        // To reset all add state
        setAddState(addData)
        setUpdateState(updateData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addVisible, updateVisible])

    return (
        <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CCardHeader>Danh sách vai trò</CCardHeader>
            <CCardBody>
                <CustomModal visible={addVisible} title={'Thêm vai trò'} body={addForm()} setVisible={(value) => setAddVisible(value)}/>
                <CustomModal visible={updateVisible} title={'Cập nhật vai trò'} body={updateForm(updateRoleId)} setVisible={(value) => setUpdateVisible(value)}/>
                {/* <CustomModal visible={deleteVisible} title={'Xóa người vai trò'} body={deleteForm(deleteIdDamTypeId)} setVisible={(value) => setDeleteVisible(value)}/> */}
                <CForm onSubmit={onFilter}>
                    <CRow>
                        <CCol md={12} lg={3}>
                            <CFormInput
                                className="mb-2"
                                type="text"
                                placeholder="Tên vai trò"
                                onChange={(e) => handleSetRoleName(e.target.value)}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                        <CCol md={12} lg={3}>
                            <CFormInput
                                className="mb-2"
                                type="text"
                                placeholder="Mô tả vai trò"
                                onChange={(e) => handleSetRoleDescription(e.target.value)}
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
              <CustomPagination listItems={filteredRoles} showData={showFilteredTable} isLoaded={isLoadedRoles} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
}

export default RoleManagement
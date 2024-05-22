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
    CImage
  } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilPencil,
    cilTrash,
    cilMagnifyingGlass,
    cilReload,
    cilPlus
  } from '@coreui/icons'
import "./post-management.css"
import CustomPagination from "src/views/customs/my-pagination"
import CustomModal from "src/views/customs/my-modal"
import createToast from "src/views/customs/my-toast"
import { createFailIcon, createSuccessIcon } from "src/views/customs/my-icon"
import { createDamType, deleteDamType, getAllDamTypes, getDamTypeById, updateDamType } from "src/services/dam-services"
import CustomSpinner from "src/views/customs/my-spinner"
import CustomAuthorizationChecker from "src/views/customs/my-authorizationchecker"
import CustomAuthorizationCheckerChildren from "src/views/customs/my-authorizationchecker-children"
import { checkInitElement, formatDate, formatDateToDay, getPostCreatedAt, searchRelatives } from "src/tools"
import CustomAuthChecker from "src/views/customs/my-authchecker"
import CustomIntroduction from "src/views/customs/my-introduction"
import { createPost, deletePost, getAllPosts, getPostById, updatePost } from "src/services/post-services"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import CustomEditor from "src/views/customs/my-editor"

const PostManagement = () => {

    const defaultAuthorizationCode = process.env.REACT_APP_HG_MODULE_POST_MANAGEMENT || "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_post_management"
    // Checking feature's module
    const defaultModuleAddFeature = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_post_management_add_post"
    const defaultModuleUpdateFeature = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_post_management_update_post"
    const defaultModuleDeleteFeature = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_post_management_delete_post"
    const [haveAdding, setHaveAdding] = useState(false)
    const [haveUpdating, setHaveUpdating] = useState(false)
    const [haveDeleting, setHaveDeleting] = useState(false)
    const [listPosts, setListPosts] = useState([])
    const [isLoadedPosts, setIsLoadedPosts] = useState(false)
    const handleSetIsLoadedPosts = (value) => {
        setIsLoadedPosts(prev => {
            return { ...prev, isLoadedPosts: value }
        })
    }
    useEffect(() => {
        handleSetIsLoadedPosts(true)
    }, [listPosts])
    
    // Call inital APIs
    const rebaseAllData = () => {
        getAllPosts()
        .then(res => {
            // Install filter users here
            const posts = res?.data
            setListPosts(posts)
            setFilteredPosts(posts)
        })
        .catch(err => {
            // Do nothing
        })
    }
    useEffect(() => {
       rebaseAllData()
    },[])

    // Searching data
    const [filteredPosts, setFilteredPosts] = useState([])
    const initSearch = {
        postTitle: "",
        postCreatorName: "",
        postCreatedAt: ""
    }
    const [searchState, setSearchState] = useState(initSearch)
    const {postTitle, postCreatorName, postCreatedAt} = searchState
    const handleSetPostTitle = (value) => {
        setSearchState(prev => {
            return {...prev, postTitle: value}
        })
    }
    const handleSetPostCreatorName = (value) => {
        setSearchState(prev => {
            return {...prev, postCreatorName: value}
        })
    }
    const handleSetPostCreatedAt = (value) => {
        setSearchState(prev => {
            return {...prev, postCreatedAt: value}
        })
    }
    const onFilter = () => {
        if (postTitle || postCreatorName) {
            setFilteredPosts(listPosts)
            if (postTitle) {
                setFilteredPosts(prev => {
                    return prev.filter(post => post?.postTitle && searchRelatives(post?.postTitle, postTitle))
                })
            }
            if (postCreatorName) {
                setFilteredPosts(prev => {
                    return prev.filter(post => post?.postCreatorName && searchRelatives(post?.postCreatorName, postCreatorName))
                })
            }
        }else {
            onReset()
        }
    }
    const onReset = () => {
        setFilteredPosts(listPosts)
    }
    // Toast
    const [toast, addToast] = useState(0)
    const toaster = useRef()


    // Pagination + Filtering
    const showFilteredTable = (filteredPosts, duration, isLoaded) => {
        return (
            <>
                {
                    !isLoaded ? <CustomSpinner /> :
                    <CTable bordered align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '5%'}}>#</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '30%'}}>Tiêu đề</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '25%'}}>Tác giả</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '25%'}}>Ngày tạo</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '15%'}}>Thao tác</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        filteredPosts?.length !== 0 ? filteredPosts.map((post, index) => {
                            return (
                                <CTableRow key={post?.postId}>
                                    <CTableDataCell>{index + 1 + duration}</CTableDataCell>
                                    <CTableDataCell>{post?.postTitle}</CTableDataCell>
                                    <CTableDataCell>{post?.postCreatorName}</CTableDataCell>
                                    <CTableDataCell>{getPostCreatedAt(post)}</CTableDataCell>
                                    <CTableDataCell>
                                        {haveUpdating && <CIcon icon={cilPencil} onClick={() => openUpdateModal(post?.postId)} className="text-success mx-1" role="button"/>}
                                        {haveDeleting && <CIcon icon={cilTrash} onClick={() => openDeleteModal(post?.postId)}  className="text-danger" role="button"/>}
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
        addPostTitle: "",
        addPostContent: "",
        addPostCreatorName: "",
        addPostAvatar: "",
        addPostTagIds: []
    }
    const [addState, setAddState] = useState(addData)
    const { addPostTitle, addPostContent, addPostCreatorName, addPostAvatar, addPostTagIds } = addState
    const [addValidated, setAddValidated] = useState(false)
    const handleSetAddPostAvatar = (value) => {
        setAddState(prev => {
            return {...prev, addPostAvatar: value}
        })
    }
    const handleSetAddPostAvatarImage = (event) => {
        const file = event?.target?.files[0]
        const reader = new FileReader()
        reader.onloadend = function() {
            handleSetAddPostAvatar(reader.result)
        }
        reader.readAsDataURL(file);
    }
    const handleSetAddPostTitle = (value) => {
        setAddState(prev => {
            return { ...prev, addPostTitle: value }
        })
    }
    const handleSetAddPostContent = (value) => {
        setAddState(prev => {
            return { ...prev, addPostContent: value }
        })
    }
    const handleSetAddPostCreatorName = (value) => {
        setAddState(prev => {
            return {...prev, addPostCreatorName: value}
        })
    }
    const handleSetAddPostTagIds = (value) => {
        setAddState(prev => {
            return {...prev, addPostTagIds: value}
        })
    }

    const createNewPost = (e) => {
        // validation
        const form = e.currentTarget
        e.preventDefault()
        if (form.checkValidity() === false) {
            e.stopPropagation()
        } else {
            const post = {
                postTitle: addPostTitle.trim(),
                postContent: addPostContent.trim(),
                postCreatorName: addPostCreatorName.trim(),
                postCreatedAt: formatDateToDay(),
                postAvatar: addPostAvatar,
                postTagIds: []
                // fix here
            }
            createPost(post)
            .then(res => {
                setAddVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Thêm bài viết',
                    content: 'Thêm bài viết thành công',
                    icon: createSuccessIcon()
                }))
                setAddValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Thêm bài viết',
                    content: "Thêm bài viết không thành công",
                    icon: createFailIcon()
                }))
            })
        }
        setAddValidated(true)
    }

    const [addVisible, setAddVisible] = useState(false)
    const addForm = () => {
        return <>
                <CForm 
                    onSubmit={e => createNewPost(e)} 
                    noValidate
                    validated={addValidated}
                >
                    <CRow>
                        <CCol lg={12}>
                            {
                                addPostAvatar && <>
                                    <p>Hình ảnh tiêu đề</p>
                                    <CImage 
                                        src={addPostAvatar}
                                        width={"200px"}
                                        height={"200px"}
                                    />
                                </>
                            }

                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12}>
                            <CFormInput
                                className="mt-4"
                                type="text"
                                placeholder="Tên bài viết"
                                maxLength={50}
                                feedbackInvalid="Không bỏ trống và phải ít hơn 50 ký tự"
                                onChange={(e) => handleSetAddPostTitle(e.target.value)}
                                value={addPostTitle}
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
                                placeholder="Tên người viết bài"
                                maxLength={50}
                                feedbackInvalid="Không bỏ trống và phải ít hơn 50 ký tự"
                                onChange={(e) => handleSetAddPostCreatorName(e.target.value)}
                                value={addPostCreatorName}
                                aria-describedby="exampleFormControlInputHelpInline"
                                required
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12}>
                            <CFormInput
                                className="mt-4"
                                type="file"
                                placeholder="Hình đại diện bài viết"
                                maxLength={50}
                                feedbackInvalid="Không bỏ trống"
                                onChange={handleSetAddPostAvatarImage}
                                aria-describedby="exampleFormControlInputHelpInline"
                                required
                            />
                        </CCol>
                    </CRow>
                    {/* Fix here later */}
                    <CRow>
                        <CCol lg={12} className="mt-4">
                            <CustomEditor 
                                content={addPostContent}
                                setContent={handleSetAddPostContent}
                            />
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
        updatePostId: '',
        updatePostTitle: '',
        updatePostContent: '',
        updatePostCreatorName: '',
        updatePostAvatar: "",
        updatePostTagIds: []
    }
    const [updateState, setUpdateState] = useState(updateData)
    const { updatePostId, updatePostTitle, updatePostContent, updatePostTagIds, updatePostCreatorName, updatePostAvatar } = updateState
    const [updateValidated, setUpdateValidated] = useState(false)
    const getAPostById = (postId) => {
        if (postId) {
            getPostById(postId)
            .then(res => {
                const post = res?.data
                if (post) {
                    const updatePostFetchData = {
                        updatePostId: post?.postId,
                        updatePostTitle: post?.postTitle,
                        updatePostContent: post?.postContent,
                        updatePostCreatorName: post?.postCreatorName,
                        updatePostAvatar: post?.postAvatar,
                        updatePostTagIds: []
                        // fix here
                    }
                    setUpdateState(updatePostFetchData)
                }else {
                    addToast(createToast({
                        title: 'Cập nhật bài viết',
                        content: "Thông tin bài viết không đúng",
                        icon: createFailIcon()
                    }))
                }
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Cập nhật bài viết',
                    content: "Thông tin bài viết không đúng",
                    icon: createFailIcon()
                }))
            })
        }
    }
    const handleSetUpdatePostAvatar = (value) => {
        setUpdateState(prev => {
            return {...prev, updatePostAvatar: value}
        })
    }
    const handleSetUpdatePostAvatarImage = (event) => {
        const file = event?.target?.files[0]
        const reader = new FileReader()
        reader.onloadend = function() {
            handleSetUpdatePostAvatar(reader.result)
        }
        reader.readAsDataURL(file);
    }
    const handleSetUpdatePostId = (value) => {
        setUpdateState(prev => {
            return { ...prev, updatePostId: value }
        })
    }
    const openUpdateModal = (postId) => {
        handleSetUpdatePostId(postId)
        getAPostById(postId)
        setUpdateVisible(true)
    }
    const handleSetUpdatePostTitle = (value) => {
        setUpdateState(prev => {
            return { ...prev, updatePostTitle: value }
        })
    }
    const handleSetUpdatePostContent = (value) => {
        setUpdateState(prev => {
            return { ...prev, updatePostContent: value }
        })
    }
    const handleSetUpdatePostCreatorName = (value) => {
        setUpdateState(prev => {
            return { ...prev, updatePostCreatorName: value }
        })
    }
    const handleSetUpdatePostTagIds = (value) => {
        setUpdateState(prev => {
            return {...prev, updatePostTagIds: value}
        })
    }
    const updateAPost = (e) => {
        // validation
        const form = e.currentTarget
        e.preventDefault()
        if (form.checkValidity() === false) {
            e.stopPropagation()
        } else {
            const post = {
                postId: updatePostId,
                postTitle: updatePostTitle,
                postContent: updatePostContent,
                postCreatorName: updatePostCreatorName,
                postAvatar: updatePostAvatar,
                postTagIds: []
                // fix here
            }
            updatePost(post)
            .then(res => {
                setUpdateVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Cập nhật bài viết',
                    content: 'Cập nhật bài viết thành công',
                    icon: createSuccessIcon()
                }))
                setUpdateValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Cập nhật bài viết',
                    content: "Cập nhật bài viết không thành công",
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
                        onSubmit={e => updateAPost(e)} 
                        noValidate
                        validated={updateValidated}
                    >
                        <CRow>
                            <CCol lg={12}>
                                {
                                    updatePostAvatar && <>
                                        <p>Hình ảnh tiêu đề</p>
                                        <CImage 
                                            src={updatePostAvatar}
                                            width={"200px"}
                                            height={"200px"}
                                        />
                                    </>
                                }

                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol lg={12}>
                                <CFormInput
                                    className="mt-4"
                                    type="text"
                                    placeholder="Tên bài viết"
                                    required
                                    maxLength={500}
                                    feedbackInvalid="Ít hơn 50 ký tự"
                                    onChange={(e) => handleSetUpdatePostTitle(e.target.value)}
                                    value={updatePostTitle}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol lg={12}>
                                <CFormInput
                                    className="mt-4"
                                    type="text"
                                    placeholder="Tên tác giả bài viết"
                                    required
                                    maxLength={50}
                                    feedbackInvalid="Ít hơn 50 ký tự"
                                    onChange={(e) => handleSetUpdatePostCreatorName(e.target.value)}
                                    value={updatePostCreatorName}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol lg={12}>
                                <CFormInput
                                    className="mt-4"
                                    type="file"
                                    placeholder="Hình đại diện bài viết"
                                    maxLength={50}
                                    feedbackInvalid="Không bỏ trống"
                                    onChange={handleSetUpdatePostAvatarImage}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                        <CCol lg={12} className="mt-4">
                            <CustomEditor 
                                content={updatePostContent}
                                setContent={handleSetUpdatePostContent}
                            />
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

    // Delete
    const deleteAPost = (postId) => {
        if (postId) {
            deletePost(postId)
            .then(res => {
                setDeleteVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Xóa bài viết',
                    content: 'Xóa bài viết thành công',
                    icon: createSuccessIcon()
                }))
                setUpdateValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Xóa bài viết',
                    content: "Xóa bài viết không thành công",
                    icon: createFailIcon()
                }))
            })
        }
    }
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [deletePostId, setDeletePostId] = useState(0)
    const deleteForm = (postId) => {
        return (
            <>
                {   
                    postId ? 
                    <CForm onSubmit={(e) => {
                        e.preventDefault()
                        deleteAPost(postId)
                    }}>
                        <CRow>
                            <CCol md={12}>
                                <p>Bạn có chắc muốn xóa bài viết này ?</p>
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
    const openDeleteModal = (postId) => {
        setDeletePostId(postId)
        setDeleteVisible(true)
    }

    useEffect(() => {
        // To reset all add state
        setAddState(addData)
        setUpdateState(updateData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addVisible, updateVisible])
    const defaultPageCode = 'U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dms_page_post_management'
    return (
        <>
        <CustomIntroduction 
            pageCode={defaultPageCode}
            title="QUẢN LÝ BÀI VIẾT"
            content="Hỗ trợ người dùng đăng tải và thao tác với các tin tức mới"
        />
        <CRow>
        <CustomAuthChecker />
        <CustomAuthorizationChecker isRedirect={true} code={defaultAuthorizationCode}/>
        <CustomAuthorizationCheckerChildren parentCode={defaultAuthorizationCode} checkingCode={defaultModuleAddFeature} setExternalState={setHaveAdding}/>
        <CustomAuthorizationCheckerChildren parentCode={defaultAuthorizationCode} checkingCode={defaultModuleUpdateFeature} setExternalState={setHaveUpdating}/>
        <CustomAuthorizationCheckerChildren parentCode={defaultAuthorizationCode} checkingCode={defaultModuleDeleteFeature} setExternalState={setHaveDeleting}/>
        <CCol xs>
          <CCard className="mb-4">
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <CCardHeader>Danh sách bài viết</CCardHeader>
            <CCardBody>
                <CustomModal isLarge={true} visible={addVisible} title={'Thêm bài viết'} body={addForm()} setVisible={(value) => setAddVisible(value)}/>
                <CustomModal isLarge={true} visible={updateVisible} title={'Cập nhật bài viết'} body={updateForm(updatePostId)} setVisible={(value) => setUpdateVisible(value)}/>
                <CustomModal visible={deleteVisible} title={'Xóa bài viết'} body={deleteForm(deletePostId)} setVisible={(value) => setDeleteVisible(value)}/>
                <CForm onSubmit={(e)=>{
                    e.preventDefault()
                    onFilter()
                }}>
                    <CRow>
                        <CCol md={12} lg={3}>
                            <CFormInput
                                className="mb-2"
                                type="text"
                                placeholder="Tên bài viết"
                                onChange={(e) => handleSetPostTitle(e.target.value)}
                                aria-describedby="exampleFormControlInputHelpInline"
                            />
                        </CCol>
                        <CCol md={12} lg={3}>
                            <CFormInput
                                className="mb-2"
                                type="text"
                                placeholder="Tên tác giả"
                                onChange={(e) => handleSetPostCreatorName(e.target.value)}
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
              <CustomPagination listItems={filteredPosts} showData={showFilteredTable} isLoaded={isLoadedPosts} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      </>
    )
}

export default PostManagement
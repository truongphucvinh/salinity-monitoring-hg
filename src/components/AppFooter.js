import React, { useEffect, useState } from 'react'
import { CButton, CCol, CFooter, CForm, CFormInput, CRow, CSpinner } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import CustomAuthorizationCheckerChildren from 'src/views/customs/my-authorizationchecker-children'
import { getAllProjects, updateProjectById } from 'src/services/general-services'
import CustomModal from 'src/views/customs/my-modal'

const AppFooter = () => {
  const defaultAuthorizationCode = process.env.HG_MODULE_GENERAL_INFORMATION_MANAGEMENT || "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_general_information_management"
  // Checking feature's module
  const defaultModuleUpdateFooter = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_general_information_management_update_footer_information"
  const [havingUpdateFooter, setHavingUpdateFooter] = useState(false)
  const defaultProjectCode = process.env.HG_GENERAL_PROJECT || "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dms_project"
  const [projectState, setProjectState] = useState(null)
  const [updateFooter, setUpdateFooter] = useState(null)
  const [updateFooterVisible, setUpdateFooterVisible] = useState(false)
  const [updateFormValidate, setUpdateFormValidate] = useState(false)
  const openUpdateFooterModal = () => {
    setUpdateFormValidate(false)
    setUpdateFooterVisible(true)
    setUpdateFooter(projectState)
  }
  const updateFooterPage = (e) => {
    const form = e.currentTarget
    e.preventDefault()
    if (form.checkValidity() === false) {
        e.stopPropagation()
    }else {
      if (updateFooter) {
        let updateData = {
          projectId: updateFooter?.projectId
        }
        if (updateFooter?.projectFooterLeft) {
          updateData["projectFooterLeft"] = updateFooter?.projectFooterLeft?.trim()
        }
        if (updateFooter?.projectFooterLeftLink) {
          updateData["projectFooterLeftLink"] = updateFooter?.projectFooterLeftLink?.trim()
        }
        if (updateFooter?.projectFooterRight) {
          updateData["projectFooterRight"] = updateFooter?.projectFooterRight?.trim()
        }
        if (updateFooter?.projectFooterRight) {
          updateData["projectFooterRight"] = updateFooter?.projectFooterRight?.trim()
        }
        updateProjectById(updateData)
        .then(res => {
          setUpdateFooterVisible(false)
          getProjectInformation()
        })
        .catch(err => {
          // Do nothing
        })
      }
    }
    setUpdateFormValidate(true)
  } 
  const updateFooterForm = (isLoaded) => {
    return (<>
      {
        isLoaded ? <CForm 
              onSubmit={e => updateFooterPage(e)} 
              noValidate
              validated={updateFormValidate}
          >
              <CRow>
                  <CCol lg={12}>
                      <CFormInput
                          className="mt-4"
                          type="text"
                          required
                          placeholder="Thông tin lề trái"
                          feedbackInvalid="Chưa nhập thông tin!"
                          onChange={(e) => setUpdateFooter((prev) => {
                            return {...prev, projectFooterLeft: e.target.value}
                          })}
                          value={updateFooter?.projectFooterLeft}
                          aria-describedby="exampleFormControlInputHelpInline"
                      />
                  </CCol>
              </CRow>
              <CRow>
                  <CCol lg={12}>
                      <CFormInput
                          className="mt-4"
                          type="text"
                          required
                          placeholder="Đường dẫn lề trái"
                          feedbackInvalid="Chưa nhập đường dẫn!"
                          onChange={(e) => setUpdateFooter((prev) => {
                            return {...prev, projectFooterLeftLink: e.target.value}
                          })}
                          value={updateFooter?.projectFooterLeftLink}
                          aria-describedby="exampleFormControlInputHelpInline"
                      />
                  </CCol>
              </CRow>
              <CRow>
                  <CCol lg={12}>
                      <CFormInput
                          className="mt-4"
                          type="text"
                          required
                          placeholder="Thông tin lề phải"
                          feedbackInvalid="Chưa nhập thông tin!"
                          onChange={(e) => setUpdateFooter((prev) => {
                            return {...prev, projectFooterRight: e.target.value}
                          })}
                          value={updateFooter?.projectFooterRight}
                          aria-describedby="exampleFormControlInputHelpInline"
                      />
                  </CCol>
              </CRow>
              <CRow>
                  <CCol lg={12}>
                      <CFormInput
                          className="mt-4"
                          type="text"
                          required
                          placeholder="Đường dẫn lề phải"
                          feedbackInvalid="Chưa nhập đường dẫn!"
                          onChange={(e) => setUpdateFooter((prev) => {
                            return {...prev, projectFooterRightLink: e.target.value}
                          })}
                          value={updateFooter?.projectFooterRightLink}
                          aria-describedby="exampleFormControlInputHelpInline"
                      />
                  </CCol>
              </CRow>
              <CRow>
                  <CCol lg={12} className="d-flex justify-content-end">
                      <CButton type="submit" className="mt-4" color="primary">Xác nhận</CButton>
                  </CCol>
              </CRow>
          </CForm> : <CSpinner />
      }
    </>)
  }
  const getProjectInformation = () => {
    getAllProjects()
    .then(res => {
      let projects = res?.data
      if (projects) {
        let filteredProject = projects?.filter(project => {
          return project?.projectCode === defaultProjectCode
        })[0]
        if (filteredProject) {
          setProjectState(filteredProject)
        }
      }
    })
    .catch(err => {
      // Do nothing
    })
  }
  useEffect(() => {
    getProjectInformation()
  }, [])
  return (
    <CFooter className="px-4">
      <CustomAuthorizationCheckerChildren parentCode={defaultAuthorizationCode} checkingCode={defaultModuleUpdateFooter} setExternalState={setHavingUpdateFooter}/>
      <CustomModal visible={updateFooterVisible} title={'Cập nhật chân trang'} body={updateFooterForm(projectState)} setVisible={(value) => setUpdateFooterVisible(value)}/>
      <div>
        {
          projectState?.projectFooterLeftLink ? <>
            <a href={`https://${projectState?.projectFooterLeftLink}`} target="_blank" rel="noopener noreferrer">
              {projectState?.projectFooterLeft}
            </a>
          </> : <>
            <span className="ms-1">{projectState?.projectFooterLeft}</span>  
          </>
        }
      </div>
      <div className="ms-auto">
        {
          projectState?.projectFooterRightLink ? <>
            <a href={`https://${projectState?.projectFooterRightLink}`} target="_blank" rel="noopener noreferrer">
              {projectState?.projectFooterRight}
            </a>
          </> : <>
            <span>{projectState?.projectFooterRight}</span>
          </>
        }

      </div>
        {
          havingUpdateFooter && <div className='ms-3'>
          <CButton className='btn btn-primary' onClick={openUpdateFooterModal}>
            <CIcon icon={cilPencil} className='me-2'/>
            Cập nhật
          </CButton>
        </div>
        }
    </CFooter>
  )
}

export default React.memo(AppFooter)

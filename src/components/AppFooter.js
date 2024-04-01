import React, { useState } from 'react'
import { CButton, CFooter } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import CustomAuthorizationCheckerChildren from 'src/views/customs/my-authorizationchecker-children'

const AppFooter = () => {
  const defaultAuthorizationCode = process.env.HG_MODULE_GENERAL_INFORMATION_MANAGEMENT || "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_general_information_management"
  // Checking feature's module
  const defaultModuleUpdateFooter = "U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_general_information_management_update_footer_information"
  const [havingUpdateFooter, setHavingUpdateFooter] = useState(false)
  return (
    <CFooter className="px-4">
      <CustomAuthorizationCheckerChildren parentCode={defaultAuthorizationCode} checkingCode={defaultModuleUpdateFooter} setExternalState={setHavingUpdateFooter}/>
      <div>
        {/* <a href="http://se.cit.ctu.edu.vn/" target="_blank" rel="noopener noreferrer">
          SE, CIT
        </a> */}
        <span className="ms-1">Phát hành năm 2024.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Được phát triển bởi</span>
        <a href="http://se.cit.ctu.edu.vn/" target="_blank" rel="noopener noreferrer">
          Khoa Kỹ thuật Phần mềm (SE), Trường CNTT&TT (CIT), Trường Đại học Cần Thơ (CTU)
        </a>
      </div>
        {
          havingUpdateFooter && <div className='ms-3'>
          <CButton className='btn btn-primary'>
            <CIcon icon={cilPencil} className='me-2'/>
            Cập nhật
          </CButton>
        </div>
        }
    </CFooter>
  )
}

export default React.memo(AppFooter)

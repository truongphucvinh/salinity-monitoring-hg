import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        {/* <a href="http://se.cit.ctu.edu.vn/" target="_blank" rel="noopener noreferrer">
          SE, CIT
        </a> */}
        <span className="ms-1">Phát hành năm 2024.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Được hỗ trợ bởi</span>
        <a href="http://se.cit.ctu.edu.vn/" target="_blank" rel="noopener noreferrer">
          Khoa Kỹ thuật Phần mềm, Trường Đại học Cần Thơ (CIT, CTU)
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarNav,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'
import { cilAudio } from '@coreui/icons'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const styles = {
    ctuLogo: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }
  }

  return (
    <CSidebar
      // className="border-end"
      style={{borderRight: "1px solid red"}}
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom" style={styles.ctuLogo}>
        <CSidebarBrand to="/" >
          {/* <span className='d-flex align-items-center'><CIcon customClassName="sidebar-brand-full me-2" icon={cilAudio} height={32} />Giám sát độ mặn</span> */}
          {/* <CIcon customClassName="sidebar-brand-full me-2" icon={cilAudio} height={32} /> */}
          {/* <CIcon customClassName="sidebar-brand-narrow" icon={cilAudio} height={32} /> */}
          <img src={require('../assets/images/SHG.png')} height="80px" width="80px"/>
          <img src={require('../assets/images/CTU.png')} height="60px" width="60px" style={{marginLeft: "20px"}}/>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarFooter className="d-none d-lg-flex" style={{borderBottom: "1px solid rgba(128, 128, 128, 0.3)"}}>
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

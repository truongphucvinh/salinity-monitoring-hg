import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilGroup,
  cilLineWeight,
  cilNotes,
  cilOptions,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilStream,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Trang chủ',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Người dùng',
  },
  {
    component: CNavItem,
    name: 'Quản lý tài khoản',
    to: '/user-management',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Cơ sở hạ tầng',
  },
  {
    component: CNavItem,
    name: 'Quản lý đập',
    to: '/dam-management',
    icon: <CIcon icon={cilLineWeight} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Quản lý loại đập',
    to: '/dam-type-management',
    icon: <CIcon icon={cilOptions} customClassName="nav-icon" />,
  },
  {
    component:  CNavItem,
    name: 'Trạm',
    to: '/station-list',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />
  },
  {
    component:  CNavItem,
    name: 'StationDetail',
    to: '/station-detail',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: 'Quản lý sông, kênh, rạch',
    to: '/river-management',
    icon: <CIcon icon={cilStream} customClassName="nav-icon" />,
  }
]

export default _nav

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
  cilTask,
  cilEqualizer
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Trang chủ',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: 'Quản lý tài khoản',
    to: '/user-management',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    code: 'U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_user_management'
  },
  {
    component: CNavItem,
    name: 'Quản lý vai trò',
    to: '/role-management',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
    code: 'U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_role_management'
  },
  {
    component: CNavItem,
    name: 'Quản lý đập',
    to: '/dam-management',
    icon: <CIcon icon={cilLineWeight} customClassName="nav-icon" />,
    code: 'U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dam_management'
  },
  {
    component: CNavItem,
    name: 'Quản lý loại đập',
    to: '/dam-type-management',
    icon: <CIcon icon={cilOptions} customClassName="nav-icon" />,
    code: 'U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_dam_type_management'
  },
  {
    component: CNavItem,
    name: 'Quản lý sông, kênh, rạch',
    to: '/river-management',
    icon: <CIcon icon={cilStream} customClassName="nav-icon" />,
    code: 'U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_river_management'
  },
  {
    component:  CNavItem,
    name: 'Quản lý trạm',
    to: '/station-list',
    icon: <CIcon icon={cilEqualizer} customClassName="nav-icon" />,
    code: 'U2FsdGVkX1/CWjVqRRnlyitZ9vISoCgx/rEeZbKMiLQ=_sensor_station_management'
  }
]

export default _nav

import React, { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import { CBadge } from '@coreui/react'
import { setAuthApiHeader } from 'src/services/global-axios'
import { useState } from 'react'
import { checkItemCode, getLoggedUserInformation } from 'src/tools'
import { getAllModulesOfPermission } from 'src/services/authentication-services'

export const AppSidebarNav = ({ items }) => {
  const location = useLocation()
  const navLink = (name, icon, badge, indent = false) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component
        {...(rest.to &&
          !rest.items && {
            component: NavLink,
          })}
        key={index}
        {...rest}
      >
        {navLink(name, icon, badge, indent)}
      </Component>
    )
  }
  const navGroup = (item, index) => {
    const { component, name, icon, items, to, ...rest } = item
    const Component = component
    return (
      <Component
        compact
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon)}
        visible={location.pathname.startsWith(to)}
        {...rest}
      >
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index, true),
        )}
      </Component>
    )
  }
  const [listModules, setListModules] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const filterNavItems = (modules, items) => {
    return items && items?.filter(item => checkItemCode(item?.code, modules))
  }
  const rebaseAllData = () => {
    const user = getLoggedUserInformation()
    if (user) {
      const permissionId = user?.permission?._id
      setAuthApiHeader()
      getAllModulesOfPermission(permissionId)
      .then(res => {
        const allModules = res?.data?.data?.result
        setFilteredItems(filterNavItems(allModules, items))
        setListModules(allModules)
      })
      .catch(err => {
        // Do nothing
      })
    }
  }
  
  useEffect(() => {
    if (Array.isArray(listModules) && listModules?.length === 0) {
      // Just call api for the first time
      rebaseAllData()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <React.Fragment>
      {
        items && navItem(items[1], 1) // Home page
      }
      {
        items && navItem(items[0], 0) // About Us
      }
      {filteredItems &&
        filteredItems.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </React.Fragment>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}

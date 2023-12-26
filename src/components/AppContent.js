import React, { Suspense, useState, useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'
import CustomAuthChecker from 'src/views/customs/my-authchecker'

const AppContent = () => {

  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <CustomAuthChecker />
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)

import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableRow,
    CTableDataCell
  } from '@coreui/react'
import { getDamById } from "src/services/dam-services"
import CustomSpinner from "src/views/customs/my-spinner"

const DamDetail = () => {
    const { id } = useParams()
    // const id = 'ff676fa5-4cdf-46c8-96d9-406090f61418'
    const damData = {
        dam: '',
        isLoaded: false
    }
    const [damState, setDamState] = useState(damData)
    const {dam, isLoaded} = damState
    const handleSetDamState = (value) => {
        setDamState(prev => {
            return {...prev, dam: value, isLoaded: true}
        })
    }
    const rebaseAllData = () => {
        if (id) {
            getDamById(id)
            .then(res => {
                if (res?.data) {
                    handleSetDamState(res?.data)
                }
            })
            .catch(err => {
                // Do nothing
            })
        }
    }
    useEffect(() => {
        rebaseAllData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Thông tin chi tiết</CCardHeader>
            <CCardBody>
                <CRow>
                    <CCol lg={12}>
                        {   
                            isLoaded ?
                            <CTable bordered align="middle" className="mb-0 border" hover responsive>
                                <CTableBody>
                                    <CTableRow>
                                        <CTableDataCell className="bg-body-tertiary fw-bold" style={{'width' : '20%'}}>Tên đập</CTableDataCell>
                                        <CTableDataCell>{dam?.damName}</CTableDataCell>
                                    </CTableRow>  
                                    <CTableRow>
                                        <CTableDataCell className="bg-body-tertiary fw-bold" style={{'width' : '20%'}}>Ngày xây dựng</CTableDataCell>
                                        <CTableDataCell>{`${dam?.damConstructedAt[0]}-${dam?.damConstructedAt[1]}-${dam?.damConstructedAt[2]}`}</CTableDataCell>
                                    </CTableRow>     
                                    <CTableRow>
                                        <CTableDataCell className="bg-body-tertiary fw-bold" style={{'width' : '20%'}}>Kích thước</CTableDataCell>
                                        <CTableDataCell>{`${dam?.damCapacity} x ${dam?.damHeight} (mét)`}</CTableDataCell>
                                    </CTableRow>      
                                    <CTableRow>
                                        <CTableDataCell className="bg-body-tertiary fw-bold" style={{'width' : '20%'}}>Loại đập</CTableDataCell>
                                        <CTableDataCell>{dam?.damType?.damTypeName}</CTableDataCell>
                                    </CTableRow>   
                                    <CTableRow>
                                        <CTableDataCell className="bg-body-tertiary fw-bold" style={{'width' : '20%'}}>Sông, kênh, rạch</CTableDataCell>
                                        <CTableDataCell>{dam?.damRiver?.riverName}</CTableDataCell>
                                    </CTableRow>   
                                </CTableBody>
                            </CTable> : <CustomSpinner />
                        }

                    </CCol>
                </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
}

export default DamDetail
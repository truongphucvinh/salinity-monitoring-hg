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
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,

  } from '@coreui/react'
import { getAllDamSchedules, getDamById } from "src/services/dam-services"
import CustomSpinner from "src/views/customs/my-spinner"
import CustomMap from "src/views/customs/my-map"
import CIcon from "@coreui/icons-react"
import { cilPencil, cilTrash, cilTouchApp } from "@coreui/icons"
import DamScheduleManagement from "./dam-schedule-management"
import { damStatusConverter } from "src/tools"

const DamDetail = () => {
    // Got the id of URL
    const { id } = useParams()
    // Initial data of dam and dam schedule
    const damData = {
        dam: '',
        isLoaded: false
    }
    const [damState, setDamState] = useState(damData)
    const {dam, isLoaded} = damState
    const damScheduleData = {
        damSchedules: '',
        isLoadedDamSchedules: false
    }
    const [damScheduleState, setDamScheduleState] = useState(damScheduleData)
    const {damSchedules, isLoadedDamSchedules} = damScheduleState
    // Handle changing state data
    const handleSetDamState = (value) => {
        setDamState(prev => {
            return {...prev, dam: value, isLoaded: true}
        })
    }
    const handleSetDamScheduleState = (value) => {
        setDamScheduleState(prev => {
            return {...prev, damSchedules: value, isLoadedDamSchedules: true}
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

            getAllDamSchedules(id)
            .then(res => {
                if (res?.data) {
                    handleSetDamScheduleState(res?.data)
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
        <>
            {
                isLoaded && isLoadedDamSchedules ?
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
                                                <CTableRow>
                                                    <CTableDataCell className="bg-body-tertiary fw-bold" style={{'width' : '20%'}}>Mô tả</CTableDataCell>
                                                    <CTableDataCell>{dam?.damDescription ? dam?.damDescription : 'Không có dữ liệu'}</CTableDataCell>
                                                </CTableRow> 
                                                <CTableRow>
                                                    <CTableDataCell className="bg-body-tertiary fw-bold" style={{'width' : '20%'}}>Trạng thái</CTableDataCell>
                                                    <CTableDataCell><CIcon icon={damStatusConverter(dam)?.icon} className="me-2"/>{damStatusConverter(dam)?.status}</CTableDataCell>
                                                </CTableRow> 
                                            </CTableBody>
                                        </CTable> : <CustomSpinner />
                                    }

                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol lg={12}>
                                    <h4 className="text-center my-4 fw-bold" style={{'color': 'black'}}>Vị trí trên bản đồ</h4>
                                    <CustomMap 
                                        longtitude={dam?.damLongtitude} 
                                        latitude={dam?.damLatitude} 
                                        zoom={15}    
                                    />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol lg={12}>
                                    <h4 className="text-center my-4 fw-bold" style={{'color': 'black'}}>Lịch mở đập</h4>
                                    <DamScheduleManagement damInstance={dam} rebaseDetailPage={rebaseAllData}/>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                    </CCol>
                </CRow> : <CustomSpinner />
            }
        </>
        
    )
}

export default DamDetail
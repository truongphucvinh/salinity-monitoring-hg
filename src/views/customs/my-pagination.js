import React, { useEffect, useState } from "react"
import {
    CPagination,
    CPaginationItem
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilChevronLeft, cilChevronRight } from "@coreui/icons"

const CustomPagination = ({ listItems, showData }) => {

    // initial data
    const paginationData = {
        itemsPerPage: process.env.PAGINATION_NUMBER || 5,
        active: 1,
        totalPages: 0,
        items: []
    }
    const [paginationState, setPaginationState] = useState(paginationData)
    const { itemsPerPage, active, totalPages, items } = paginationState
    useEffect(() => {
        let tempItems = []
        let noPages = listItems?.length % itemsPerPage > 0 ? Math.floor(listItems.length / itemsPerPage) + 1 : Math.floor(listItems.length / itemsPerPage)
        for (let i = 1; i <= noPages; i++) {
            tempItems.push(
                <CPaginationItem role="button" key={i} active={i === active} onClick={() => setPaginationState(prev => {return {...prev, active: i}})}>
                    {i}
                </CPaginationItem>
            )
        }
        setPaginationState(prev => {return {...prev, totalPages: noPages}})
        setPaginationState(prev => {return {...prev, items: tempItems}})
    }, [listItems, active])
    return (
        <>
            { showData(listItems.slice((active - 1) * itemsPerPage, active * itemsPerPage), (active - 1) * itemsPerPage) }
            <br />
            {
                listItems?.length > itemsPerPage ? <CPagination aria-label="Page navigation example">
                        <CPaginationItem role="button" onClick={() => setPaginationState(prev => {return {...prev, active: active === 1 ? active : active - 1}})}>
                            <CIcon icon={cilChevronLeft} />
                        </CPaginationItem>
                        { items.length > 0 ? items : '' }
                        <CPaginationItem role="button" onClick={() => setPaginationState(prev => {return {...prev, active: active === totalPages ? active : active + 1}})}>
                            <CIcon icon={cilChevronRight} />
                        </CPaginationItem>
                </CPagination> : ''
            }
        </>

    )

}

export default CustomPagination
import React, { useEffect, useState } from "react"
import {
    CPagination,
    CPaginationItem
} from "@coreui/react"

const CustomPagination = ({ listItems }) => {

    // initial data
    const paginationData = {
        itemsPerPage: process.env.PAGINATION_NUMBER || 10,
        active: 1,
        totalPages: 0,
        items: []
    }
    const [paginationState, setPaginationState] = useState(paginationData)
    const { itemsPerPage, active, totalPages, items } = paginationState
    useEffect(() => {
        let tempItems = []
        let noPages = listItems.length / itemsPerPage > 0 ? Math.floor(listItems.length / itemsPerPage) + 1 : Math.floor(listItems.length / itemsPerPage)
        for (let i = 1; i <= noPages; i++) {
            tempItems.push(
                <CPaginationItem key={i} active={i === active} onClick={() => setPaginationState(prev => {return {...prev, active: i}})}>
                    {i}
                </CPaginationItem>
            )
        }
        setPaginationState(prev => {return {...prev, totalPages: noPages}})
        setPaginationState(prev => {return {...prev, items: tempItems}})
    }, [listItems])

    return (
        <CPagination aria-label="Page navigation example">
            <CPaginationItem>Previous</CPaginationItem>
                { items.length > 0 ? items : '' }
            <CPaginationItem>Next</CPaginationItem>
        </CPagination>
    )

}

export default CustomPagination
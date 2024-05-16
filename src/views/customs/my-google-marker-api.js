import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from "@vis.gl/react-google-maps"
import React, { useState } from "react"
import damMarker from "../../icons/dam.png"
import stationMarker from "../../icons/station.png"
import styles from "./custom-css/my-google-css.module.css"
import clsx from "clsx"

const CustomMarker = ({position, content, customMarker = null}) => {

    const [markerRef, marker] = useAdvancedMarkerRef()
    const [isShowInfo, setIsShowInfo] = useState(false)
    return <>
            <AdvancedMarker
                position={position}
                ref={markerRef}
                onClick={() => setIsShowInfo(!isShowInfo)}
            >
                    {customMarker === "dam" ? <img className={clsx(styles.markerImage)} src={damMarker}/> : <img className={clsx(styles.markerImage)} src={stationMarker}/>}
            </AdvancedMarker>
            {
                isShowInfo && <InfoWindow 
                    anchor={marker}
                    onClose={() => setIsShowInfo(false)}
                >
                    <div>
                        {content}
                    </div>
                </InfoWindow>
            }
    </>
}

export default CustomMarker
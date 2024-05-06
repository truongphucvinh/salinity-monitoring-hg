import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from "@vis.gl/react-google-maps"
import React, { useRef, useState } from "react"

const CustomMarker = ({position, content}) => {

    const [markerRef, marker] = useAdvancedMarkerRef()
    const [isShowInfo, setIsShowInfo] = useState(false)

    return <>
        <AdvancedMarker
            position={position}
            ref={markerRef}
            onClick={() => setIsShowInfo(!isShowInfo)}
        />
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
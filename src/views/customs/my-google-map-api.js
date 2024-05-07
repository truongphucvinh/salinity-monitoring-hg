import { APIProvider, Map } from "@vis.gl/react-google-maps"
import React, { useEffect, useState } from "react"
import CustomMarker from "./my-google-marker-api";

const CustomAPIMap = ({markers}) => {
    const initConfigMap = {
        bounds: '',
        zoom: 10,
        mapId: 'DMS_MAP_ID'
    } 
    const [mapConfigurations, setMapConfigurations] = useState(initConfigMap)
    const {bounds, zoom, mapId} = mapConfigurations
    const handleSetBounds = (value) => {
        setMapConfigurations((prev) => {
            return {...prev, bounds: value}
        })
    }
    const handleSetZoom = (value) => {
        setMapConfigurations((prev) => {
            return {...prev, zoom: value}
        })
    }
    const setUpBounds = async() => {
        let minLat = Math.min(...markers.map(({position}) => position.lat));
        let maxLat = Math.max(...markers.map(({position}) => position.lat));
        let minLng = Math.min(...markers.map(({position}) => position.lng));
        let maxLng = Math.max(...markers.map(({position}) => position.lng));
        let bounds = {
            east: maxLng,
            west: minLng,
            north: maxLat,
            south: minLat
        }
        handleSetBounds(bounds)
    }
    useEffect(() => {
        if (markers) {
            setUpBounds()
        }
    }, markers)
    return <>
        <APIProvider 
            apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
        >
            <Map 
                style={{width: '100%', minHeight: '80vh'}}
                defaultBounds={bounds}
                zoom={zoom}
                mapId={mapId}
                onZoomChanged={(e) => handleSetZoom(e?.target?.value)}
            >
                
                {markers?.map(({id, name, position, customMarker}) => {
                    return  <CustomMarker 
                        key={id}
                        position={position}
                        content={name}
                        customMarker={customMarker}
                    />
                })}
            </Map>
        </APIProvider>
    </>
}

export default CustomAPIMap
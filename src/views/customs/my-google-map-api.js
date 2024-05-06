import { APIProvider, Map } from "@vis.gl/react-google-maps"
import React, { useEffect, useState } from "react"
import CustomMarker from "./my-google-marker-api";

const CustomAPIMap = () => {

    const markers = [
        {
        id: 1,
        name: "Chicago, Illinois",
        position: { lat: 41.881832, lng: -87.623177 }
        },
        {
        id: 2,
        name: "Denver, Colorado",
        position: { lat: 39.739235, lng: -104.99025 }
        },
        {
        id: 3,
        name: "Los Angeles, California",
        position: { lat: 34.052235, lng: -118.243683 }
        },
        {
        id: 4,
        name: "New York, New York",
        position: { lat: 40.712776, lng: -74.005974 }
        }
    ];
    const initConfigMap = {
        bounds: '',
        zoom: 5,
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
        setUpBounds()
    }, [])

    return <>
        <APIProvider 
            apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
        >
            <Map 
                style={{width: '100wh', height: '100vh'}}
                defaultBounds={bounds}
                zoom={zoom}
                mapId={mapId}
                onZoomChanged={(e) => handleSetZoom(e?.target?.value)}
            >
                {markers.map(({id, name, position}) => {
                    return  <CustomMarker 
                        key={id}
                        position={position}
                        content={name}
                    />
                })}
            </Map>
        </APIProvider>
    </>
}

export default CustomAPIMap
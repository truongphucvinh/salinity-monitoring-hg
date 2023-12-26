import React from "react"
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';


const CustomMap = ({longtitude, latitude, zoom}) => {
    const apiKey = process.env.GOOGLE_MAP_API_KEY || 'AIzaSyAXRPZdbclbQ3V9D5KJaN7kMjRy9bhbA78'
    const position = {lat: latitude, lng: longtitude}

    return (<>
        <div style={{'height': '500px'}}>
            <APIProvider apiKey={apiKey}>
                <Map center={position} zoom={zoom}>
                    <Marker position={position} />
                </Map>
            </APIProvider>
        </div>
    </>)
}

export default CustomMap
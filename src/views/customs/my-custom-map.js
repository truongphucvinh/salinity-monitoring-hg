import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api"
import React, { useMemo, useState } from "react"


const PlacesAutoComplete = ({selected}) => {
    // const {

    // } = 
}

const Map = () => {
    const center = useMemo({ lat: 43.45, lng: -80.49 }, [])
    const [selected, setSelected] = useState(null)

    return <>
        <div className="places-container">
            
        </div>
        <GoogleMap
            zoom={10}
            center={center}
        >
            {selected && <Marker position={selected}/>}
        </GoogleMap>
    </>
}

const CustomPlace = () => {
    const {isLoaded} = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY || 'AIzaSyAXRPZdbclbQ3V9D5KJaN7kMjRy9bhbA78'
    })
    return <>
        {isLoaded ? <Map /> : <div>Loading Map ...</div>}
    </>
}

export default CustomPlace
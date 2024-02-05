import { GoogleMap, LoadScript, Marker, Polygon } from "@react-google-maps/api"
import React, { useState } from "react"

const CustomGoogleMap = ({
    longtitude, latitude, zoom
}) => {
    const apiKey = process.env.GOOGLE_MAP_API_KEY || 'AIzaSyAXRPZdbclbQ3V9D5KJaN7kMjRy9bhbA78'
    const mapStyles = {
        height: "500px",
        width: "100%"
    }
    const defaultCenter = {
        // lat: latitude,
        // lng: longtitude
        lat: 41.3851, lng: 2.1734
    }
    const polygonCoords = [
        { lat: 41.3851, lng: 2.1734 },
        { lat: 41.3951, lng: 2.1834 },
        { lat: 41.3751, lng: 2.1634 }
    ]
    const [coords, setCoords] = useState([])
    const showLngLat = (e) => {
        setCoords((prev) => {
            return [...prev, { id: 0, lat: e.latLng.lat(), lng: e.latLng.lng() }]
        })
    }
    const destroyMarker = (id) => {
        const newCoords = coords.filter(coord => coord?.id !== id)
        console.log();
        setCoords(newCoords)
    }

    return <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
            mapContainerStyle={mapStyles}
            center={defaultCenter}
            zoom={13}
            onClick={(e) => showLngLat(e)}
        >
            {
                coords && coords.map((coord, index) => {
                    coord.id = index
                    return <Marker onClick={() => destroyMarker(index)} key={index} position={{
                            lat: coord?.lat,
                            lng: coord?.lng
                        }} />
                })
                    
            }
            {/* <Polygon 
                    paths={coords}
                    options={{ fillColor: "#red", fillOpacity: 0, strokeColor: "yellow", strokeOpacity: 3, strokeWeight: 3 }}
                /> */}
        </GoogleMap>
    </LoadScript>

}

export default CustomGoogleMap
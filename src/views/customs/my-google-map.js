import { GoogleMap, LoadScript, Marker, Polygon } from "@react-google-maps/api"
import React from "react"

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

    return <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
            mapContainerStyle={mapStyles}
            center={defaultCenter}
            zoom={13}
        >
            <Polygon 
                paths={polygonCoords}
                options={{ fillColor: "#red", fillOpacity: 1, strokeColor: "#000", strokeOpacity: 3, strokeWeight: 3 }}
            />
        </GoogleMap>
    </LoadScript>

}

export default CustomGoogleMap
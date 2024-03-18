import React from "react"

const CustomEmbeddedMap = ({isLoaded, lat, lng, width, height}) => {
    const apiKey = process.env.GOOGLE_MAP_API_KEY || 'AIzaSyDCj8v-jhX3yiCQlvCHpaMmogiV4PyhBp8'
    const mapMode = "place"
    const getParams = (lat, lng) => {
        return `q=${lat},${lng}`
    }

    return <>
        {
            isLoaded ? <iframe
                height={500}
                frameBorder={0}
                style={{ border: 0, width: '100%' }}
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/${mapMode}?key=${apiKey}&${getParams(lat,lng)}`}
                allowFullScreen=""
          ></iframe> : <div className="text-center">Đang tải...</div>
        }

    </>
}

export default CustomEmbeddedMap
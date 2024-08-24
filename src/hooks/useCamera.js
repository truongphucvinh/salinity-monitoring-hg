import { useEffect, useState } from "react";
import { createCamera, getAllCamera } from "src/services/camera-services";

function useCamera() {
    const [camera, setCamera] = useState(null);

    useEffect(() => {
        const fetchDataCamera = async () => {
            try {
                const response = await getAllCamera("CAMERA",0,6);

                // Log the data to the console
                console.log("camera", response.data);

                setCamera(response.data)

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchDataCamera();
    }, []);
    const fetchDataCamera = async () => {
        try {
            const response = await getAllCamera();

            // Log the data to the console
            console.log("camera", response.data);

            setCamera(response.data)

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const addCamera = async (camera) => {
        try {
             // Log the data to the console
             console.log("addCamera-1", camera);
            const response = await createCamera(camera);

            // Log the data to the console
            console.log("addCamera-2", response);

            // setCamera(response)
            fetchDataCamera()

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    return {
        camera,
        addCamera
    }
}

export default useCamera;
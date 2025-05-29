// components/TreeRegistrationCamera.jsx
import { useCamera } from 'react-camera-hook';
import { GeolocatedProps, geolocated } from 'react-geolocated';

const TreeRegistrationCamera = ({ coords, onCapture }) => {
  const { cameraRef, capture } = useCamera();
  
  const handleCapture = async () => {
    const photo = await capture();
    
    // Adiciona metadados de geolocalização à foto
    const photoWithMetadata = {
      ...photo,
      metadata: {
        gps: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy
        },
        timestamp: new Date().toISOString()
      }
    };
    
    onCapture(photoWithMetadata);
  };

  return (
    <div className="camera-container">
      <div className="camera-overlay">
        <div className="gps-marker">
          <span>📍</span>
          <p>Localização capturada!</p>
        </div>
      </div>
      
      <video ref={cameraRef} autoPlay playsInline />
      
      <button onClick={handleCapture} className="capture-btn">
        <CameraIcon />
        Registrar Árvore
      </button>
    </div>
  );
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
  },
  userDecisionTimeout: 5000,
})(TreeRegistrationCamera);
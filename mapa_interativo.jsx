// components/ActivityMap.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Ícones personalizados
const treeIcon = new L.Icon({
  iconUrl: '/icons/tree-marker.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const seedIcon = new L.Icon({
  iconUrl: '/icons/seed-marker.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35]
});

const ActivityMap = ({ activities, currentLocation }) => {
  return (
    <MapContainer 
      center={currentLocation} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      {activities.map(activity => (
        <Marker
          key={activity.activity_id}
          position={[activity.location.lat, activity.location.lng]}
          icon={activity.type === 'tree_registration' ? treeIcon : seedIcon}
        >
          <Popup>
            <div className="activity-popup">
              <h3>{activity.type === 'tree_registration' ? 'Árvore Registrada' : 'Coleta de Sementes'}</h3>
              <p>{new Date(activity.timestamp).toLocaleDateString()}</p>
              
              {activity.photos.slice(0, 1).map(photo => (
                <img 
                  key={photo} 
                  src={photo} 
                  alt="Registro" 
                  className="popup-photo"
                />
              ))}
              
              <button 
                className="details-btn"
                onClick={() => navigate(`/activity/${activity.activity_id}`)}
              >
                Ver Detalhes
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* Marcador da posição atual */}
      <Marker position={currentPosition} icon={currentLocationIcon}>
        <Popup>Sua posição atual</Popup>
      </Marker>
    </MapContainer>
  );
};
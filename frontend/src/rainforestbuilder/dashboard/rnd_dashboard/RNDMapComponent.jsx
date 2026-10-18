import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const { BaseLayer } = LayersControl;

// Fix Leaflet icon issue
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const RNDMapComponent = () => {
    const [geojsonData, setGeojsonData] = useState(null);
    const [selectedCompartment, setSelectedCompartment] = useState(null);
    const mapRef = useRef(null);
    const labelsLayerRef = useRef(null);
    const geojsonLayerRef = useRef(null);

    return (
        <div className="w-full h-full relative">
          <h1 className='text-[blue]'>Seed Harvest Locations</h1>
            <MapContainer
                center={[6.134511889744518, -2.187651559183602]}
                zoom={17}
                scrollWheelZoom={true}
                style={{ 
                    height: '100%', 
                    width: '100%',
                    position: 'relative',
                    zIndex: 1
                }}
                className="leaflet-container"
                ref={mapRef}
                whenCreated={(mapInstance) => {
                    // Prevent map events from bubbling up
                    mapInstance.getContainer().addEventListener('wheel', (e) => {
                        e.stopPropagation();
                    });
                    mapInstance.getContainer().addEventListener('mousedown', (e) => {
                        e.stopPropagation();
                    });
                }}
            >
                <LayersControl position="topright">
                  <BaseLayer  name="Google Satellite">
                      <TileLayer
                        url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
                        attribution='© <a href="https://www.google.cn/copyright">Google Satellite</a> contributors'
                      />
                    </BaseLayer>
                    <BaseLayer name="OpenStreetMap">
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                    </BaseLayer>
                    <BaseLayer name="Google Satellite Hybrid" >
                      <TileLayer
                        url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                        attribution='© <a href="https://www.google.com/copyright">Google Satellite Hybrid</a> contributors'
                      />
                    </BaseLayer>
                    <BaseLayer checked name="May Drone Capture">
                        <TileLayer
                            url={`http://192.168.1.200:8000/tileserver/tiles/{z}/{x}/{y}.png`}
                            tms={true}
                            minZoom={3}
                            maxZoom={20}
                        />
                    </BaseLayer>
                </LayersControl>
            </MapContainer>
        </div>
    );
};

export default RNDMapComponent;
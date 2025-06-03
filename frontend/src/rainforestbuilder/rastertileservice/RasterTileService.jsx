// import React from "react";
import { MapContainer, TileLayer, LayersControl, ScaleControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const { BaseLayer } = LayersControl;

const DroneMapViewer = () => {

  // Default map settings
  const mapCenter =[6.134511889744518, -2.187651559183602]; // Default location, replace with your area's coordinates
  const defaultZoom = 17;

  const data = async()=>{
  const response = await fetch("http://192.168.1.200:8000/raster-tile-server/tiles/13/4046/4235.png")
    if (response.ok){
      console.log(response)
    }
  }
data()
  

  return (
    <div className="map-container" style={{ height: "600px", width: "100%" }}>
      {/* <h1 className="text-blue">helo</h1> */}
      <MapContainer
        center={mapCenter}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100vw" }}
      >
        <ScaleControl position="bottomleft" />
        
        <LayersControl position="topright">
        
          <BaseLayer name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          
        
         
            <BaseLayer checked name="May Drone Capture">
              <TileLayer
              
                url={`http://192.168.1.200:8000/tileserver/tiles/{z}/{x}/{y}.png`}
                tms='1'
          
                minZoom='3'
                maxZoom='19'
              />
            </BaseLayer>
         
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default DroneMapViewer;

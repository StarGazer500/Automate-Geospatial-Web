// MapComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, LayersControl, } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
const { BaseLayer } = LayersControl;
// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapComponent = (startDate,endDate) => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [qcGeojsonData, setQcGeojsonData] = useState(null);
  const [selectedCompartment, setSelectedCompartment] = useState(null);
  const mapRef = useRef(null);
  const labelsLayerRef = useRef(null);
  const geojsonLayerRef = useRef(null);
  const qcGeojsonLayerRef = useRef(null);

useEffect(()=>{

},[startDate,endDate])

  useEffect(() => {
    const fetchCompartments = async () => {
      try {
        const response = await fetch('http://192.168.1.200:8000/dashboard/retrieve-all-compt/', {
          method: 'GET',
          headers: { "Content-Type": "application/json" },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched data:", data);
        
        // Check for nested features structure and fix if needed
        if (data.features && typeof data.features === 'object' && data.features.features) {
          console.log("Detected double-nested features structure");
          setGeojsonData({
            type: 'FeatureCollection',
            features: data.features.features
          });
        } else {
          setGeojsonData(data);
        }
      } catch (error) {
        console.error('Error fetching GeoJSON:', error);
      }
    };
    
    fetchCompartments();
  }, []);

  // Add permanent labels for compartment names
  const addCompartmentLabels = () => {
    if (!geojsonData || !mapRef.current) return;
    
    // Clear any existing labels
    if (labelsLayerRef.current) {
      mapRef.current.removeLayer(labelsLayerRef.current);
    }
    
    // Create a new feature group for labels
    labelsLayerRef.current = L.featureGroup().addTo(mapRef.current);
    
    // Create a GeoJSON layer so we can iterate through features
    const geojsonLayer = L.geoJSON(geojsonData);
    
    // Add a label for each feature
    geojsonLayer.eachLayer(layer => {
      if (layer.feature && layer.feature.properties && layer.feature.properties.comptname) {
        // Get the center of the polygon/multipolygon
        const center = layer.getBounds().getCenter();
        
        // Create a label
        const label = L.marker(center, {
          icon: L.divIcon({
            className: 'compartment-label',
            html: `<div>${layer.feature.properties.comptname}</div>`,
            iconSize: [80, 30],     // Reduced size
            iconAnchor: [40, 15]    // Adjusted anchor
          }),
          interactive: false // Prevents the label from being clickable
        });
        
        // Add the label to the feature group
        labelsLayerRef.current.addLayer(label);
      }
    });
  };

  // Send compartment data to the backend
  const sendCompartmentToBackend = async (compartment) => {
    try {
      console.log("Sending compartment to backend:", compartment);
      
      // Example API call to send the compartment data
      const response = await fetch('http://192.168.1.200:8000/dashboard/rerieve-qcpnts-in-comptment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(compartment)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Backend response:", result);
      setQcGeojsonData(result.points_within)
      
      // You can handle the response here, e.g., display points within the compartment
      return result;
    } catch (error) {
      console.error("Error sending compartment data:", error);
      return null;
    }
  };





  useEffect(() => {
    console.log("qcpoints",qcGeojsonData)
    if (qcGeojsonData && mapRef.current) {
      try {
        // Create and store GeoJSON layer reference
        if (qcGeojsonLayerRef.current) {
          mapRef.current.removeLayer(qcGeojsonLayerRef.current);
        }
        
        qcGeojsonLayerRef.current = L.geoJSON(qcGeojsonData, {
          // style:qcgeoJsonStyle,
          // onEachFeature: onEachFeature
        }).addTo(mapRef.current);
        
        mapRef.current.fitBounds(qcGeojsonLayerRef.current.getBounds());
        
        // Add labels
        // addCompartmentLabels();
      } catch (error) {
        console.error('Error setting bounds or adding labels:', error);
      }
    }
  }, [qcGeojsonData]);


  // Fit map to bounds and add labels when data changes
  useEffect(() => {
    if (geojsonData && mapRef.current) {
      try {
        // Create and store GeoJSON layer reference
        if (geojsonLayerRef.current) {
          mapRef.current.removeLayer(geojsonLayerRef.current);
        }
        
        geojsonLayerRef.current = L.geoJSON(geojsonData, {
          style: geoJsonStyle,
          onEachFeature: onEachFeature
        }).addTo(mapRef.current);
        
        mapRef.current.fitBounds(geojsonLayerRef.current.getBounds());
        
        // Add labels
        addCompartmentLabels();
      } catch (error) {
        console.error('Error setting bounds or adding labels:', error);
      }
    }
  }, [geojsonData]);

  // Effect to handle selected compartment changes
  useEffect(() => {
    if (selectedCompartment) {
      // You can do something when a compartment is selected
      console.log("Selected compartment:", selectedCompartment);
      
      // Example: Send the selected compartment to the backend
      sendCompartmentToBackend(selectedCompartment);
    } 2312
  }, [selectedCompartment]);

  const geoJsonStyle = (feature) => {
    // You can customize style based on feature properties
    return {
      color: '#3388ff',
      weight: 2,
      fillOpacity: 0.2,
      fillColor: feature.properties.status === 'Unprepared' ? '#ff9933' : '#33cc33'
    };
  };

  // Function to highlight the selected compartment
  const highlightFeature = (e) => {
    const layer = e.target;
    
    layer.setStyle({
      weight: 4,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.5
    });
    
    layer.bringToFront();
  };

  // Reset highlight
  const resetHighlight = (e) => {
    geojsonLayerRef.current.resetStyle(e.target);
  };

  // Handler for clicking on a compartment
  const onCompartmentClick = (e) => {
    const layer = e.target;
    const feature = layer.feature;
    
    // Set the selected compartment
    setSelectedCompartment({
      id: feature.id,
      properties: feature.properties,
      geometry: feature.geometry,
      comptname: feature.properties.comptname,
      // Extract bounding box coordinates
      bounds: layer.getBounds(),
      // Extract center point
      center: layer.getBounds().getCenter()
    });
    
    // Highlight the selected compartment
    highlightFeature(e);
  };

  // Bind properties to popup and set up event handlers
  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      // Get compartment name
      // const comptName = feature.properties.comptname || 'N/A';
      
      // Create popup content with compartment name highlighted at the top
      // let popupContent = `<h3 style="margin: 0; padding: 8px 0; color: #2c3e50; border-bottom: 1px solid #ddd;">${comptName}</h3>`;
      
      // // Add other properties
      // popupContent += Object.entries(feature.properties)
      //   .filter(([key]) => key !== 'comptname') // Skip comptname as we've already added it
      //   .map(([key, value]) => {
      //     // Format key for display
      //     const formattedKey = key
      //       .replace(/_/g, ' ')
      //       .replace(/\b\w/g, (c) => c.toUpperCase());
      //     return `<strong>${formattedKey}:</strong> ${value !== null ? value : 'N/A'}`;
      //   })
      //   .join('<br/>');
        
      // Add button to send compartment data
      // popupContent += `
      //   <div style="margin-top: 10px; text-align: center;">
      //     <button 
      //       id="select-compartment-${feature.id}" 
      //       style="padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;"
      //     >
      //       Select This Compartment
      //     </button>
      //   </div>
      // `;
      
      // Bind popup to the layer
      // layer.bindPopup(popupContent);
      
      // Add event listener for the button after popup is opened
      // layer.on('popupopen', function() {
      //   setTimeout(() => {
      //     const button = document.getElementById(`select-compartment-${feature.id}`);
      //     if (button) {
      //       button.addEventListener('click', function() {
      //         onCompartmentClick({ target: layer });
      //         layer.closePopup();
      //       });
      //     }
      //   }, 100);
      // });
      
      // Set up event handlers for hover effects
      layer.on({
        // mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: onCompartmentClick
      });
    }
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <style>
        {`
          .compartment-label {
            background-color: transparent;
            border: none;
            color: #333;
            font-weight: bold;
            text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
            font-size: 10px;     // Reduced font size
            text-align: center;
            white-space: nowrap;
            z-index: 1000;
          }
        `}
      </style>
      <MapContainer
        center={[6.32, -2.18]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <LayersControl position="topright">
          <BaseLayer checked name="Google Satellite">
            <TileLayer
              url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
              attribution='&copy; <a href="https://www.google.cn/copyright">Google Satellite</a> contributors'
            />
          </BaseLayer>
          <BaseLayer name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </BaseLayer>
          <BaseLayer name="Google Satellite Hybrid" checked>
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
              attribution='&copy; <a href="https://www.google.com/copyright">Google Satellite Hybrid</a> contributors'
            />
          </BaseLayer>
        </LayersControl>
      </MapContainer>
      
      {/* Display selected compartment information */}
      {selectedCompartment && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
          maxWidth: '300px',
          zIndex: 1000
        }}>
          {/* <h4 style={{ margin: '0 0 5px 0' }}>Selected: {selectedCompartment.comptname}</h4>
          <p style={{ margin: '0 0 5px 0' }}>ID: {selectedCompartment.id}</p> */}
          {/* <p style={{ margin: '0' }}>
            Center: [{selectedCompartment.center.lat.toFixed(6)}, {selectedCompartment.center.lng.toFixed(6)}]
          </p> */}
          {/* <button 
            onClick={() => setSelectedCompartment(null)}
            style={{ 
              marginTop: '10px', 
              padding: '3px 8px', 
              backgroundColor: '#f44336', 
              color: 'white', 
              border: 'none', 
              borderRadius: '3px', 
              cursor: 'pointer' 
            }}
          >
            Clear Selection
          </button> */}
        </div>
      )}
    </div>
  );
};

export default MapComponent;
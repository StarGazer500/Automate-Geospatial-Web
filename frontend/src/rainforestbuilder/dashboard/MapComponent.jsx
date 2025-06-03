// MapComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, LayersControl, } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
const { BaseLayer } = LayersControl;
// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapComponent = ({startDate,endDate,setChartData}) => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [qcGeojsonData, setQcGeojsonData] = useState(null);
  const [selectedCompartment, setSelectedCompartment] = useState(null);
  const mapRef = useRef(null);
  const labelsLayerRef = useRef(null);
  const qcLabelsLayerRef = useRef(null);
  const geojsonLayerRef = useRef(null);
  const qcGeojsonLayerRef = useRef(null);
  const markerClusterGroupRef = useRef(null);

  // useEffect(()=>{
    
  // },[startDate,endDate])

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
            iconSize: [80, 30],
            iconAnchor: [40, 15]
          }),
          interactive: false
        });
        
        // Add the label to the feature group
        labelsLayerRef.current.addLayer(label);
      }
    });
  };

  // Add permanent labels for QC points (activity)
  const addQCLabels = () => {
    if (!qcGeojsonData || !mapRef.current) return;
    
    // Clear any existing labels
    if (qcLabelsLayerRef.current) {
      mapRef.current.removeLayer(qcLabelsLayerRef.current);
    }
    
    // Create a new feature group for labels
    qcLabelsLayerRef.current = L.featureGroup().addTo(mapRef.current);
    
    // Create a GeoJSON layer so we can iterate through features
    const qcGeojsonLayer = L.geoJSON(qcGeojsonData);
    
    // Add a label for each feature
    qcGeojsonLayer.eachLayer(layer => {
      if (layer.feature && layer.feature.properties && layer.feature.properties.activity) {
        // Get the coordinates of the point (since QC points are likely Point geometries)
        const coords = layer.getLatLng();
        
        // Create a label
        const label = L.marker(coords, {
          icon: L.divIcon({
            className: 'activity-label',
            html: `<div>${layer.feature.properties.activity}</div>`,
            iconSize: [80, 30],
            iconAnchor: [40, 15]
          }),
          interactive: false
        });
        
        // Add the label to the feature group
        qcLabelsLayerRef.current.addLayer(label);
      }
    });
  };

  // Send compartment data to the backend
  const sendCompartmentToBackend = async (compartment) => {
    try {
      console.log("Sending compartment to backend:", compartment);
      
      const response = await fetch('http://192.168.1.200:8000/dashboard/rerieve-qcpnts-in-comptment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({compartment,startDate,endDate})
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Backend response:", result);
      setQcGeojsonData(result.points_within)
      setChartData(result)
      
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
        // Clear existing layers
        if (qcGeojsonLayerRef.current) {
          mapRef.current.removeLayer(qcGeojsonLayerRef.current);
        }
        
        if (markerClusterGroupRef.current) {
          mapRef.current.removeLayer(markerClusterGroupRef.current);
        }
        
        // Create marker cluster group
        markerClusterGroupRef.current = L.markerClusterGroup({
          showCoverageOnHover: false,
          maxClusterRadius: 35,
          zIndexOffset: 1000,
          iconCreateFunction: function(cluster) {
            return L.divIcon({
              html: `<div class="cluster-marker">${cluster.getChildCount()}</div>`,
              className: 'marker-cluster-custom',
              iconSize: L.point(40, 40)
            });
          }
        });
        
        // Create GeoJSON layer and add it to the cluster group
        qcGeojsonLayerRef.current = L.geoJSON(qcGeojsonData, {
          pointToLayer: function(feature, latlng) {
            const marker = L.marker(latlng);
            
            // Add popup if needed
            if (feature.properties) {
              let popupContent = '<div>';
              for (const property in feature.properties) {
                popupContent += `<strong>${property}:</strong> ${feature.properties[property]}<br>`;
              }
              popupContent += '</div>';
              marker.bindPopup(popupContent, {
                closeButton: true,
                autoClose: false,
                closeOnClick: false
              });
            }
            
            return marker;
          }
        });
        
        // Add all the markers to the cluster group
        markerClusterGroupRef.current.addLayer(qcGeojsonLayerRef.current);
        
        // Add the cluster group to the map
        mapRef.current.addLayer(markerClusterGroupRef.current);
        
        // Fit bounds to see all points
        mapRef.current.fitBounds(qcGeojsonLayerRef.current.getBounds());
        
        // Add labels (if needed, consider if you still want individual labels with clustering)
        addQCLabels();
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
      console.log("Selected compartment:", selectedCompartment);
      
      sendCompartmentToBackend(selectedCompartment);
    }
  }, [selectedCompartment]);

  const geoJsonStyle = (feature) => {
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
      bounds: layer.getBounds(),
      center: layer.getBounds().getCenter()
    });
    
    // Highlight the selected compartment
    highlightFeature(e);
  };

  // Bind properties to popup and set up event handlers
  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      layer.on({
        mouseover: highlightFeature,
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
            font-size: 10px;
            text-align: center;
            white-space: nowrap;
            z-index: 1000;
          }
          .activity-label {
            background-color: transparent;
            border: none;
            color: #333;
            font-weight: bold;
            text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
            font-size: 10px;
            text-align: center;
            white-space: nowrap;
            z-index: 1000;
          }
          .marker-cluster-custom {
            background: rgba(255, 204, 0, 0.6);
            border: 3px solid rgba(255, 204, 0, 0.4);
            border-radius: 50%;
            color: black;
            text-align: center;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .cluster-marker {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
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
              attribution='© <a href="https://www.google.cn/copyright">Google Satellite</a> contributors'
            />
          </BaseLayer>
          <BaseLayer name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </BaseLayer>
          <BaseLayer name="Google Satellite Hybrid" checked>
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
              attribution='© <a href="https://www.google.com/copyright">Google Satellite Hybrid</a> contributors'
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
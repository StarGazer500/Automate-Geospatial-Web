import React, { useEffect } from 'react';
import L from 'leaflet';
import { createTileLayerComponent, updateGridLayer } from '@react-leaflet/core';
import 'leaflet.vectorgrid';

const createVectorTileLayer = (props, context) => {
  const { url, ...options } = props;
  try {
    const instance = L.vectorGrid.protobuf(url, {
      vectorTileLayerStyles: {
        // 'tmp4957sosh': { // Match layer name from MBTiles
        //   weight: 1,
        //   color: '#3388ff',
        //   fillColor: '#3388ff',
        //   fillOpacity: 0.2,
        //   fill: true
        // }
      },
      // minZoom: props.minZoom || 6,
      // maxZoom: props.maxZoom || 18,
      ...options,
    })
      .on('tileload', (e) => {
        console.log('Tile loaded:', e.coords);
      })
      .on('tileerror', (e) => {
        console.log('Tile error:', e.coords);
      })
      .on('error', (e) => {
        console.error('VectorGrid error:', e);
      });

    return { instance, context };
  } catch (err) {
    console.error('Error creating VectorTileLayer:', err);
    throw err; // Propagate error for debugging
  }
};

const updateVectorTileLayer = (instance, props, prevProps) => {
  updateGridLayer(instance, props, prevProps);
};

const VectorTileLayer = createTileLayerComponent(
  createVectorTileLayer,
  updateVectorTileLayer
);

export default VectorTileLayer;
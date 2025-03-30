import React, { useState } from 'react';
import {InputGeospatatialContext,OutputGeospatatialContext,DocumentContext,MapContext,AnalysisAssetContext} from './context';

export const InputGeospatialProvider = ({ children }) => {
  const [sharedValue, setSharedValue] = useState({
    files: [],
    dataType: 'vector',
    typeOfData: 'Field data',
    description: '',
    dateCaptured: ''
  });
  return (
    <InputGeospatatialContext.Provider value={{ sharedValue, setSharedValue }}>
      {children}
    </InputGeospatatialContext.Provider>
  );
};

export const OutputGeospatialProvider = ({ children }) => {
  const [sharedValue, setSharedValue] = useState({
    files: [],
    dataType: 'vector',
    typeOfData: 'Processed Data',
    description: '',
    dateCaptured: ''
  });
  return (
    <OutputGeospatatialContext.Provider value={{ sharedValue, setSharedValue }}>
      {children}
    </OutputGeospatatialContext.Provider>
  );
};



export const DocumentProvider = ({ children }) => {
  const [sharedValue, setSharedValue] = useState({
      file: null,
      description: '',
      dateCaptured: ''
    });

  return (
    <DocumentContext.Provider value={{ sharedValue, setSharedValue }}>
      {children}
    </DocumentContext.Provider>
  );
};


export const MapProvider = ({ children }) => {
  const [sharedValue, setSharedValue] = useState({
      file: null,
      description: '',
      dateCaptured: ''
    });
  return (
    <MapContext.Provider value={{ sharedValue, setSharedValue }}>
      {children}
    </MapContext.Provider>
  );
};


export const AnalysisAssetProvider = ({ children }) => {
  const [sharedValue, setSharedValue] = useState({
      file: null,
      description: '',
      dateCaptured: ''
    });
    
  return (
    <AnalysisAssetContext.Provider value={{ sharedValue, setSharedValue }}>
      {children}
    </AnalysisAssetContext.Provider>
  );
};
;

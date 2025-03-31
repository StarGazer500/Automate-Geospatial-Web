import React, { useState } from 'react';
import {InputGeospatatialContext,OutputGeospatatialContext,DocumentContext,MapContext,AnalysisAssetContext, CategoryOfDataClickedContext,IsComponentUsedInFormSliderClickedContext} from './context';

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



export const CategoryOfDataClickedProvider = ({ children }) => {
  const [sharedValue, setSharedValue] = useState("All");
    
  return (
    <CategoryOfDataClickedContext.Provider value={{ sharedValue, setSharedValue }}>
      {children}
    </CategoryOfDataClickedContext.Provider>
  );
};

export const IsComponentUsedInFormSliderClickedProvider = ({ children }) => {
  const [sharedValue, setSharedValue] = useState(false);
    
  return (
    <IsComponentUsedInFormSliderClickedContext.Provider value={{ sharedValue, setSharedValue }}>
      {children}
    </IsComponentUsedInFormSliderClickedContext.Provider>
  );
};

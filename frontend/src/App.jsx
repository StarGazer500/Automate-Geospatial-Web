import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Homepage from './rainforestbuilder/homepage/Homepage'
import  DatasetView from './rainforestbuilder/dataset/Dataset'
import {MapDetailView,DocumentDetailView,AnalysisDetailView,GeospatialDetailView} from './rainforestbuilder/dataset/DetailView'

import FormSlider from './rainforestbuilder/dataset/FormSlider'
// import DocumentDataUpload from './rainforestbuilder/dataset/Uploads'
import { Route, Routes } from "react-router-dom";



function App() {


  return (
    <>
  

      
    <Routes >
             <Route path="/" element={<Homepage />} />
            <Route path="/data-view" element={<DatasetView/>} />
            <Route path="/homepage" element={<Homepage/>} />
            <Route path="/map-detail-view" element={<MapDetailView/>} />
            <Route path="/doc-detail-view" element={<DocumentDetailView/>} />
            <Route path="/analysis-detail-view" element={<AnalysisDetailView/>} />
            <Route path="/geo-detail-view" element={<GeospatialDetailView/>} />
            
           
        </Routes>
    
      
    </>
  )
}

export default App

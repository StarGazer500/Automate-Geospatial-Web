import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Homepage from './rainforestbuilder/homepage/Homepage'
import  DatasetView from './rainforestbuilder/dataset/Dataset'
import {MapDetailView,DocumentDetailView,AnalysisDetailView,GeospatialDetailView} from './rainforestbuilder/dataset/DetailView'
import DroneMapViewer from './rainforestbuilder/rastertileservice/RasterTileService'

import {LoginForm} from './rainforestbuilder/auth/LoginView'


import FormSlider from './rainforestbuilder/dataset/FormSlider'
import {DocumentDataUpload} from './rainforestbuilder/dataset/Uploads'
import { Route, Routes } from "react-router-dom";
import {Dashboard} from './rainforestbuilder/dashboard/Dashboard'



function App() {


  return (
    <>
  

      
    <Routes >
            <Route path="/dashboard" element={<Dashboard/>} />
             <Route path="/" element={<Homepage />} />
            <Route path="/data-view" element={<DatasetView/>} />
            <Route path="/doc-upload" element={<DocumentDataUpload/>} />
            <Route path="/homepage" element={<Homepage/>} />
            <Route path="/map-detail-view" element={<MapDetailView/>} />
            <Route path="/doc-detail-view" element={<DocumentDetailView/>} />
            <Route path="/analysis-detail-view" element={<AnalysisDetailView/>} />
            <Route path="/geo-detail-view" element={<GeospatialDetailView/>} />
            <Route path="/login-user" element={<LoginForm/>} />
            <Route path="/basemap-tms" element={<DroneMapViewer/>} />
            

            

           
        </Routes>
    
      
    </>
  )
}

export default App

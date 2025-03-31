import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Homepage from './rainforestbuilder/homepage/Homepage'
import  DatasetView from './rainforestbuilder/dataset/Dataset'

import FormSlider from './rainforestbuilder/dataset/FormSlider'
// import DocumentDataUpload from './rainforestbuilder/dataset/Uploads'
import { Route, Routes } from "react-router-dom";



function App() {


  return (
    <>
    {/* <Homepage/> */}
    {/* < DatasetView/> */}
    {/* <GeospatialDataUpload/> */}
    {/* <DocumentDataUpload/> */}
    {/* <MapDataUpload/>    */}
    {/* <FormSlider /> */}

      
    <Routes >
             <Route path="/" element={<Homepage />} />
            <Route path="/data-view" element={<DatasetView/>} />
            <Route path="/homepage" element={<Homepage/>} />
            
           
        </Routes>
    
      
    </>
  )
}

export default App

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Homepage from './rainforestbuilder/homepage/Homepage'
import  DatasetView from './rainforestbuilder/dataset/Dataset'
import {GeospatialDataUpload, DocumentDataUpload,MapDataUpload} from './rainforestbuilder/dataset/Uploads'
import FormSlider from './rainforestbuilder/dataset/FormSlider'
// import DocumentDataUpload from './rainforestbuilder/dataset/Uploads'



function App() {


  return (
    <>
    {/* <Homepage/> */}
    {/* < DatasetView/> */}
    {/* <GeospatialDataUpload/> */}
    {/* <DocumentDataUpload/> */}
    {/* <MapDataUpload/>    */}
    <FormSlider />
    
      
    </>
  )
}

export default App

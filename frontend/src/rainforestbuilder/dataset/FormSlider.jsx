// DocumentDataSlide.jsx
import React, { useState,useRef,useContext, useEffect } from 'react';
import { DocumentDataUpload, GeospatialInputDataUpload, GeospatialOutputDataUpload, MapDataUpload, AnalysisAssetsUpload } from './Uploads';
import {IsComponentUsedInFormSliderClickedContext} from '../../utils/context';
import { useNavigate} from 'react-router-dom';


const DocumentDataSlide = ({ nextSlide }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <DocumentDataUpload />
      <button
        onClick={() => nextSlide(1)}
        className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        Next
      </button>
    </div>
  );
};

const MapDataSlide = ({ prevSlide, nextSlide }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <MapDataUpload />
      <div className="flex justify-between mt-4">
        <button
          onClick={() => prevSlide(0)}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={() => nextSlide(2)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const InputGeospatialDataSlide = ({ prevSlide, nextSlide }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <GeospatialInputDataUpload />
      <div className="flex justify-between mt-4">
        <button
          onClick={() => prevSlide(1)}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={() => nextSlide(3)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const OutputGeospatialDataSlide = ({ prevSlide, nextSlide }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <GeospatialOutputDataUpload />
      <div className="flex justify-between mt-4">
        <button
          onClick={() => prevSlide(2)}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={() => nextSlide(4)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const AnalysisAssetDataSlide = ({ prevSlide,analysisAssetsUploadRef }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <AnalysisAssetsUpload ref={analysisAssetsUploadRef} />
      <div className="flex justify-between mt-4">
        <button
          onClick={() => prevSlide(3)}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={() => {
            // Trigger handleSubmit in AnalysisAssetsUpload component using ref
            analysisAssetsUploadRef.current.handleSubmit(); // Call handleSubmit directly using ref
          }}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
        >
          Finish
        </button>
      </div>
    </div>
  );
};

// FormSlider.jsx
const FormSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const analysisAssetsUploadRef = useRef();

  const navigate = useNavigate()
  useEffect(() => {
    // This will set the CSRF cookie
    async function fetchisAuthData(){
    const response=await fetch('http://127.0.0.1:8000/manage-data/is_user_authenticated/',  {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      alert("User is Logged out, Redirecting to login");
      navigate('/login-user', { state: { from: window.location.pathname } });
      // return null;
    }
    // const data = await response.json();
    console.log("User is Logged In")
  }

  fetchisAuthData()
  
  }, []);

  const { sharedValue, setSharedValue } = useContext(IsComponentUsedInFormSliderClickedContext);
  useEffect(()=>{
    setSharedValue(true)

  },[])

  const slides = [
    <DocumentDataSlide nextSlide={setCurrentSlide} />,
    <MapDataSlide prevSlide={setCurrentSlide} nextSlide={setCurrentSlide} />,
    <InputGeospatialDataSlide prevSlide={setCurrentSlide} nextSlide={setCurrentSlide} />,
    <OutputGeospatialDataSlide prevSlide={setCurrentSlide} nextSlide={setCurrentSlide} />,
    <AnalysisAssetDataSlide
      prevSlide={setCurrentSlide}
      analysisAssetsUploadRef={analysisAssetsUploadRef} // Pass the ref to the slide
    />
  ];

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative overflow-hidden">
          <div
            className="transition-transform duration-300 ease-in-out flex"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full flex justify-center"
              >
                <div className="w-full max-w-3xl p-4">
                  {slide}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSlider;
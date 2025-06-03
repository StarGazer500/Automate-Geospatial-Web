import React, { useState,useEffect,useContext,forwardRef, useImperativeHandle } from 'react';
import {InputGeospatatialContext,OutputGeospatatialContext,DocumentContext,MapContext,IsComponentUsedInFormSliderClickedContext,AnalysisAssetContext} from '../../utils/context';
import './Uploads.css';
import { DocumentUploadRequest, DocumentMetaData, DocumentUploadResponse } from "./grpc_setup/generated/file_upload1_pb.esm";
import { MapUploadRequest, MapMetaData, MapUploadResponse } from "./grpc_setup/generated/file_upload3_pb.esm";
import { FileUploadRequest, FileMetaData, FileUploadResponse } from "./grpc_setup/generated/file_upload2_pb.esm";
import { AnalysisFileUploadRequest, AnalysisInputFileMetaData,AnalysisOutputFileMetaData,AnalysisAnalysisAssetMetaData,AnalysisDocumentMetaData,AnalysisMapMetaData, AnalysisFileUploadResponse } from './grpc_setup/generated/file_upload4_pb.esm'
import { useNavigate} from 'react-router-dom';


const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB limit

export const DocumentDataUpload = () => {
  const [formData, setFormData] = useState({
    file: null,
    description: '',
    dateCaptured: ''
  });
  const [filePath, setFilePath] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [progress, setProgress] = useState(0); // Progress as a percentage

  const { sharedValue, setSharedValue } = useContext(DocumentContext);
  const { sharedValue: isOpenInFormSlider } = useContext(IsComponentUsedInFormSliderClickedContext);

  const navigate = useNavigate()
  useEffect(() => {
    // This will set the CSRF cookie
    async function fetchisAuthData(){
    const response=await fetch('http://192.168.1.200:8000/manage-data/is_user_authenticated/',  {
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
  

  const handleFileChange = (e) => {
   
    if (e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > MAX_FILE_SIZE) {
        setUploadStatus(`File too large: ${Math.round(selectedFile.size / (1024 * 1024))}MB exceeds 2GB limit`);
        setFilePath('');
        setFormData({ ...formData, file: null });
        setSharedValue({ ...sharedValue, file: null});
      } else {
        setFormData({ ...formData, file: selectedFile });
        setSharedValue({ ...sharedValue, file: selectedFile });
        setFilePath(selectedFile.name);
        setUploadStatus('');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setSharedValue({ ...sharedValue, [name]: value });
    // setSharedValue{}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file || !formData.description || !formData.dateCaptured) {
      setUploadStatus('Please All Entries must be filled');
      return;
    }

    setUploadStatus('Uploading...');
    setProgress(0); // Reset progress
    const ws = new WebSocket('ws://192.168.1.200:8000/ws/documentupload/');

    ws.onopen = () => {
      // Send metadata
      const metaRequest = new  DocumentUploadRequest();
      const metadata = new DocumentMetaData();
      metadata.setFileName(formData.file.name);
      metadata.setDescription(formData.description);
      metadata.setDateCaptured(formData.dateCaptured);
      metaRequest.setMetaData(metadata);
      ws.send(metaRequest.serializeBinary());

      // Calculate total chunks for progress
      const totalChunks = Math.ceil(formData.file.size / CHUNK_SIZE);
      let chunksSent = 0;

      const reader = formData.file.stream().getReader();
      const sendChunks = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            const endRequest = new DocumentUploadRequest();
            endRequest.setEndSignal(true);
            ws.send(endRequest.serializeBinary());
            break;
          }
          const chunkRequest = new DocumentUploadRequest();
          chunkRequest.setChunkData(value);
          ws.send(chunkRequest.serializeBinary());
          chunksSent += 1;
          setProgress(Math.round((chunksSent / totalChunks) * 100)); // Update progress as percentage
        }
      };
      sendChunks();
    };

    ws.onmessage = (event) => {
      const response = DocumentUploadResponse.deserializeBinary(new Uint8Array(event.data));
      setUploadStatus(response.getMessage());
      if (response.getSuccess() && response.getMessage().includes('Upload completed')) {
        setProgress(100); // Ensure 100% on completion
        ws.close();
      } else if (!response.getSuccess()) {
        setProgress(0); // Reset progress on failure
      }
    };

    ws.onerror = (err) => {
      setUploadStatus('Upload failed: WebSocket error');
      setProgress(0);
      console.error('WebSocket error:', err);
    };
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="data-form">
        <h2>Documnent Data Upload Form</h2>

        <div className="form-group">
          <label htmlFor="fileUpload">Data Upload (Max 2GB)</label>
          <div className='file-input-row'>
            <input
              style={{ border: '1px solid #ddd', borderRadius: '4px', height: '37px' }}
              className='file-path-input'
              placeholder='Enter File Path'
              value={filePath}
              readOnly
            />
            <label style={{ color: 'white', textAlign: 'center' }} className="file-button">
              Open
              <input
                type="file"
                id="fileUpload"
                onChange={handleFileChange}
                required
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        

       
        <div className="form-group">
          <label htmlFor="dateCaptured">Date Created</label>
          <input
            type='date'
            id="dateCaptured"
            name="dateCaptured"
            className='date-captured'
            value={formData.dateCaptured}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Data Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Enter data description..."
            required
          />
        </div>

        {isOpenInFormSlider?null:<button type="submit" disabled={uploadStatus === 'Uploading...'}>Submit</button>}

        {/* Progress and Status Display */}
        {uploadStatus && (
          <div className="upload-feedback">
            <p>{uploadStatus}</p>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p>{progress}% ({Math.round((formData.file?.size || 0) * (progress / 100) / (1024 * 1024))}MB / {Math.round((formData.file?.size || 0) / (1024 * 1024))}MB)</p>
          </div>
        )}
      </form>
    </div>
  );
};



export const MapDataUpload = () => {
  const [formData, setFormData] = useState({
    file: null,
    description: '',
    dateCaptured: ''
  });
  const [filePath, setFilePath] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [progress, setProgress] = useState(0); // Progress as a percentage

  const { sharedValue, setSharedValue } = useContext(MapContext);
  const { sharedValue: isOpenInFormSlider } = useContext(IsComponentUsedInFormSliderClickedContext);

  const navigate = useNavigate()
  useEffect(() => {
    // This will set the CSRF cookie
    async function fetchisAuthData(){
    const response=await fetch('http://192.168.1.200:8000/manage-data/is_user_authenticated/',  {
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

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > MAX_FILE_SIZE) {
        setUploadStatus(`File too large: ${Math.round(selectedFile.size / (1024 * 1024))}MB exceeds 2GB limit`);
        setFilePath('');
        setFormData({ ...formData, file: null });
        setSharedValue({ ...sharedValue , file: null });
      } else {
        setFormData({ ...formData, file: selectedFile });
        setSharedValue({ ...sharedValue , file: selectedFile });
        setFilePath(selectedFile.name);
        setUploadStatus('');
      }
    }
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setSharedValue({ ...sharedValue , [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file || !formData.description || !formData.dateCaptured) {
      setUploadStatus('Please All Entries must be filled');
      return;
    }

    setUploadStatus('Uploading...');
    setProgress(0); // Reset progress
    const ws = new WebSocket('ws://192.168.1.200:8000/ws/mapupload/');

    ws.onopen = () => {
      // Send metadata
      const metaRequest = new  MapUploadRequest();
      const metadata = new MapMetaData();
      metadata.setFileName(formData.file.name);
      metadata.setDescription(formData.description);
      metadata.setDateCaptured(formData.dateCaptured);
      metaRequest.setMetaData(metadata);
      ws.send(metaRequest.serializeBinary());

      // Calculate total chunks for progress
      const totalChunks = Math.ceil(formData.file.size / CHUNK_SIZE);
      let chunksSent = 0;

      const reader = formData.file.stream().getReader();
      const sendChunks = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            const endRequest = new MapUploadRequest();
            endRequest.setEndSignal(true);
            ws.send(endRequest.serializeBinary());
            break;
          }
          const chunkRequest = new MapUploadRequest();
          chunkRequest.setChunkData(value);
          ws.send(chunkRequest.serializeBinary());
          chunksSent += 1;
          setProgress(Math.round((chunksSent / totalChunks) * 100)); // Update progress as percentage
        }
      };
      sendChunks();
    };

    ws.onmessage = (event) => {
      const response = MapUploadResponse.deserializeBinary(new Uint8Array(event.data));
      setUploadStatus(response.getMessage());
      if (response.getSuccess() && response.getMessage().includes('Upload completed')) {
        setProgress(100); // Ensure 100% on completion
        ws.close();
      } else if (!response.getSuccess()) {
        setProgress(0); // Reset progress on failure
      }
    };

    ws.onerror = (err) => {
      setUploadStatus('Upload failed: WebSocket error');
      setProgress(0);
      console.error('WebSocket error:', err);
    };
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="data-form">
        <h2>Map Data Upload Form</h2>

        <div className="form-group">
          <label htmlFor="fileUpload">Data Upload (Max 2GB)</label>
          <div className='file-input-row'>
            <input
              style={{ border: '1px solid #ddd', borderRadius: '4px', height: '37px' }}
              className='file-path-input'
              placeholder='Enter File Path'
              value={filePath}
              readOnly
            />
            <label style={{ color: 'white', textAlign: 'center' }} className="file-button">
              Open
              <input
                type="file"
                id="fileUpload"
                onChange={handleFileChange}
                required
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        

       
        <div className="form-group">
          <label htmlFor="dateCaptured">Date Created</label>
          <input
            type='date'
            id="dateCaptured"
            name="dateCaptured"
            className='date-captured'
            value={formData.dateCaptured}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Data Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Enter data description..."
            required
          />
        </div>

        {isOpenInFormSlider?null:<button type="submit" disabled={uploadStatus === 'Uploading...'}>Submit</button>}

        {/* Progress and Status Display */}
        {uploadStatus && (
          <div className="upload-feedback">
            <p>{uploadStatus}</p>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p>{progress}% ({Math.round((formData.file?.size || 0) * (progress / 100) / (1024 * 1024))}MB / {Math.round((formData.file?.size || 0) / (1024 * 1024))}MB)</p>
          </div>
        )}
      </form>
    </div>
  );
};

;








// import React, { useState } from 'react';
// import './Uploads.css';
// import { FileUploadRequest, FileMetaData, FileUploadResponse } from "./grpc_setup/generated/file_upload2_pb.esm";

// const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
// const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB limit

export const GeospatialDataUpload = () => {
  const [formData, setFormData] = useState({
    files: [],
    dataType: 'vector',
    typeOfData: 'Field data',
    description: '',
    dateCaptured: ''
  });
  const [filePaths, setFilePaths] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate()
  useEffect(() => {
    // This will set the CSRF cookie
    async function fetchisAuthData(){
    const response=await fetch('http://192.168.1.200:8000/manage-data/is_user_authenticated/',  {
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

  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_FILE_SIZE) {
      setUploadStatus(`Total size too large: ${Math.round(totalSize / (1024 * 1024))}MB exceeds 2GB limit`);
      setFilePaths([]);
      setFormData({ ...formData, files: [] });
     
    } else {
      setFormData({ ...formData, files: selectedFiles });

      setFilePaths(selectedFiles.map(file => file.name));
      setUploadStatus('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
   
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.files.length === 0 || !formData.description || !formData.dateCaptured) {
      setUploadStatus('Please Make sure entries are filled');
      return;
    }

    if (formData.files.find(f => f.name.toLowerCase().endsWith('.shp'))){
      if(!formData.files.find(f => f.name.toLowerCase().endsWith('.shx')) || 
        !formData.files.find(f => f.name.toLowerCase().endsWith('.shx'))||
        !formData.files.find(f => f.name.toLowerCase().endsWith('.prj'))||
        !formData.files.find(f => f.name.toLowerCase().endsWith('.dbf'))
      ){
      setUploadStatus('shapefiles must include .shp, .shx,.dbf');
      return;

      }
      
    }

    setUploadStatus('Uploading...');
    setProgress(0);
    const ws = new WebSocket('ws://192.168.1.200:8000/ws/upload/');

    ws.onopen = async () => {
      console.log('WebSocket opened');
      const primaryFile = formData.files.find(f => f.name.toLowerCase().endsWith('.shp')) || formData.files[0];
      const metaRequest = new FileUploadRequest();
      const metadata = new FileMetaData();
      metadata.setFileName(primaryFile.name);
      metadata.setDataType(formData.dataType);
      metadata.setTypeOfData(formData.typeOfData);
      metadata.setDescription(formData.description);
      metadata.setDateCaptured(formData.dateCaptured);
      metaRequest.setMetaData(metadata);
      metaRequest.setFileName(primaryFile.name); // Set top-level file_name
      ws.send(metaRequest.serializeBinary());
      console.log('Metadata sent:', primaryFile.name);

      let totalBytes = formData.files.reduce((sum, file) => sum + file.size, 0);
      let bytesSent = 0;

      for (const file of formData.files) {
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        let chunksSent = 0;
        const reader = file.stream().getReader();
        console.log(`Uploading ${file.name}, size: ${file.size} bytes`);

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log(`Finished ${file.name}: ${chunksSent} chunks`);
            break;
          }
          const chunkRequest = new FileUploadRequest();
          chunkRequest.setChunkData(value);
          chunkRequest.setFileName(file.name); // Set for each chunk
          ws.send(chunkRequest.serializeBinary());
          chunksSent += 1;
          bytesSent += value.length;
          console.log(`Sent chunk ${chunksSent}/${totalChunks} for ${file.name}`);
          setProgress(Math.round((bytesSent / totalBytes) * 100));
        }
      }

      const endRequest = new FileUploadRequest();
      endRequest.setEndSignal(true);
      endRequest.setFileName(primaryFile.name); // Optional, for consistency
      ws.send(endRequest.serializeBinary());
      console.log('End signal sent');
    };

    ws.onmessage = (event) => {
      const response = FileUploadResponse.deserializeBinary(new Uint8Array(event.data));
      console.log('Response:', response.getMessage());
      setUploadStatus(response.getMessage());
      if (response.getSuccess() && response.getMessage().includes('Upload completed')) {
        setProgress(100);
        ws.close();
      } else if (!response.getSuccess()) {
        setProgress(0);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setUploadStatus('Upload failed: WebSocket error');
      setProgress(0);
    };

    ws.onclose = () => console.log('WebSocket closed');
  };

  // Rest of the component (form UI) remains unchanged
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="data-form">
        <h2>Geospatial Data Upload Form</h2>
        <div className="form-group">
          <label htmlFor="fileUpload">Data Upload (Max 2GB Total)</label>
          <div className='file-input-row'>
            <input
              style={{ border: '1px solid #ddd', borderRadius: '4px', height: '37px' }}
              className='file-path-input'
              placeholder='Select files...'
              value={filePaths.join(', ')}
              readOnly
            />
            <label style={{ color: 'white', textAlign: 'center' }} className="file-button">
              Open
              <input
                type="file"
                id="fileUpload"
                onChange={handleFileChange}
                multiple
                required
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <small>Select all Shapefile components (.shp, .shx, .dbf, etc.) if uploading vector data</small>
        </div>
        <div className="form-group">
          <label htmlFor="dataType">Geospatial Type</label>
          <select id="dataType" name="dataType" value={formData.dataType} onChange={handleInputChange}>
            <option value="vector">Vector</option>
            <option value="raster">Raster</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="typeOfData">State of Data</label>
          <select id="typeOfData" name="typeOfData" value={formData.typeOfData} onChange={handleInputChange}>
            <option value="Field data">Field Data</option>
            <option value="Processed Data">Processed Data</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dateCaptured">Date Created</label>
          <input
            type='date'
            id="dateCaptured"
            name="dateCaptured"
            className='date-captured'
            value={formData.dateCaptured}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Data Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Enter data description..."
            required
          />
        </div>
        <button type="submit" disabled={uploadStatus === 'Uploading...'}>Submit</button>
        {uploadStatus && (
          <div className="upload-feedback">
            <p>{uploadStatus}</p>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <p>{progress}% ({Math.round((formData.files.reduce((sum, f) => sum + (f?.size || 0), 0) * (progress / 100)) / (1024 * 1024))}MB / {Math.round(formData.files.reduce((sum, f) => sum + (f?.size || 0), 0) / (1024 * 1024))}MB)</p>
          </div>
        )}
      </form>
    </div>
  );
};


export const GeospatialInputDataUpload = () => {
  const [formData, setFormData] = useState({
    files: [],
    dataType: 'vector',
    typeOfData: 'Field data',
    description: '',
    dateCaptured: ''
  });
  const [filePaths, setFilePaths] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [progress, setProgress] = useState(0);

  const { sharedValue, setSharedValue } = useContext(InputGeospatatialContext);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_FILE_SIZE) {
      setUploadStatus(`Total size too large: ${Math.round(totalSize / (1024 * 1024))}MB exceeds 2GB limit`);
      setFilePaths([]);
      setFormData({ ...formData, files: [] });
      setSharedValue({ ...sharedValue , files: [] });
    } else {
      setFormData({ ...formData, files: selectedFiles });
      setSharedValue({ ...sharedValue , files: selectedFiles });
      setFilePaths(selectedFiles.map(file => file.name));
      setUploadStatus('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setSharedValue({ ...sharedValue , [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.files.length === 0 || !formData.description || !formData.dateCaptured) {
      setUploadStatus('Please Make sure entries are filled');
      return;
    }

    if (formData.files.find(f => f.name.toLowerCase().endsWith('.shp'))){
      if(!formData.files.find(f => f.name.toLowerCase().endsWith('.shx')) || 
        !formData.files.find(f => f.name.toLowerCase().endsWith('.shx'))||
        !formData.files.find(f => f.name.toLowerCase().endsWith('.prj'))||
        !formData.files.find(f => f.name.toLowerCase().endsWith('.dbf'))
      ){
      setUploadStatus('shapefiles must include .shp, .shx,.dbf');
      return;

      }
      
    }

    setUploadStatus('Uploading...');
    setProgress(0);
    const ws = new WebSocket('ws://192.168.1.200:8000/ws/upload/');

    ws.onopen = async () => {
      console.log('WebSocket opened');
      const primaryFile = formData.files.find(f => f.name.toLowerCase().endsWith('.shp')) || formData.files[0];
      const metaRequest = new FileUploadRequest();
      const metadata = new FileMetaData();
      metadata.setFileName(primaryFile.name);
      metadata.setDataType(formData.dataType);
      metadata.setTypeOfData(formData.typeOfData);
      metadata.setDescription(formData.description);
      metadata.setDateCaptured(formData.dateCaptured);
      metaRequest.setMetaData(metadata);
      metaRequest.setFileName(primaryFile.name); // Set top-level file_name
      ws.send(metaRequest.serializeBinary());
      console.log('Metadata sent:', primaryFile.name);

      let totalBytes = formData.files.reduce((sum, file) => sum + file.size, 0);
      let bytesSent = 0;

      for (const file of formData.files) {
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        let chunksSent = 0;
        const reader = file.stream().getReader();
        console.log(`Uploading ${file.name}, size: ${file.size} bytes`);

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log(`Finished ${file.name}: ${chunksSent} chunks`);
            break;
          }
          const chunkRequest = new FileUploadRequest();
          chunkRequest.setChunkData(value);
          chunkRequest.setFileName(file.name); // Set for each chunk
          ws.send(chunkRequest.serializeBinary());
          chunksSent += 1;
          bytesSent += value.length;
          console.log(`Sent chunk ${chunksSent}/${totalChunks} for ${file.name}`);
          setProgress(Math.round((bytesSent / totalBytes) * 100));
        }
      }

      const endRequest = new FileUploadRequest();
      endRequest.setEndSignal(true);
      endRequest.setFileName(primaryFile.name); // Optional, for consistency
      ws.send(endRequest.serializeBinary());
      console.log('End signal sent');
    };

    ws.onmessage = (event) => {
      const response = FileUploadResponse.deserializeBinary(new Uint8Array(event.data));
      console.log('Response:', response.getMessage());
      setUploadStatus(response.getMessage());
      if (response.getSuccess() && response.getMessage().includes('Upload completed')) {
        setProgress(100);
        ws.close();
      } else if (!response.getSuccess()) {
        setProgress(0);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setUploadStatus('Upload failed: WebSocket error');
      setProgress(0);
    };

    ws.onclose = () => console.log('WebSocket closed');
  };

  // Rest of the component (form UI) remains unchanged
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="data-form">
        <h2>Geospatial Input Data Upload Form</h2>
        <div className="form-group">
          <label htmlFor="fileUpload">Data Upload (Max 2GB Total)</label>
          <div className='file-input-row'>
            <input
              style={{ border: '1px solid #ddd', borderRadius: '4px', height: '37px' }}
              className='file-path-input'
              placeholder='Select files...'
              value={filePaths.join(', ')}
              readOnly
            />
            <label style={{ color: 'white', textAlign: 'center' }} className="file-button">
              Open
              <input
                type="file"
                id="fileUpload"
                onChange={handleFileChange}
                multiple
                required
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <small>Select all Shapefile components (.shp, .shx, .dbf, etc.) if uploading vector data</small>
        </div>
        <div className="form-group">
          <label htmlFor="dataType">Geospatial Type</label>
          <select id="dataType" name="dataType" value={formData.dataType} onChange={handleInputChange}>
            <option value="vector">Vector</option>
            <option value="raster">Raster</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="typeOfData">State of Data</label>
          <select id="typeOfData" name="typeOfData" value={formData.typeOfData} onChange={handleInputChange}>
            <option value="Field data">Field Data</option>
            <option value="Processed Data">Processed Data</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dateCaptured">Date Created</label>
          <input
            type='date'
            id="dateCaptured"
            name="dateCaptured"
            className='date-captured'
            value={formData.dateCaptured}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Data Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Enter data description..."
            required
          />
        </div>
        
        {uploadStatus && (
          <div className="upload-feedback">
            <p>{uploadStatus}</p>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <p>{progress}% ({Math.round((formData.files.reduce((sum, f) => sum + (f?.size || 0), 0) * (progress / 100)) / (1024 * 1024))}MB / {Math.round(formData.files.reduce((sum, f) => sum + (f?.size || 0), 0) / (1024 * 1024))}MB)</p>
          </div>
        )}
      </form>
    </div>
  );
};



export const GeospatialOutputDataUpload = () => {
  const [formData, setFormData] = useState({
    files: [],
    dataType: 'vector',
    typeOfData: 'Processed Data',
    description: '',
    dateCaptured: ''
  });
  const [filePaths, setFilePaths] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [progress, setProgress] = useState(0);

  const { sharedValue, setSharedValue } = useContext(OutputGeospatatialContext);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_FILE_SIZE) {
      setUploadStatus(`Total size too large: ${Math.round(totalSize / (1024 * 1024))}MB exceeds 2GB limit`);
      setFilePaths([]);
      setFormData({ ...formData, files: [] });
      setSharedValue({ ...sharedValue , files: [] });
    } else {
      setFormData({ ...formData, files: selectedFiles });
      setSharedValue({ ...sharedValue , files: selectedFiles });
      setFilePaths(selectedFiles.map(file => file.name));
      setUploadStatus('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setSharedValue({ ...sharedValue , [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.files.length === 0 || !formData.description || !formData.dateCaptured) {
      setUploadStatus('Please Make sure entries are filled');
      return;
    }

    if (formData.files.find(f => f.name.toLowerCase().endsWith('.shp'))){
      if(!formData.files.find(f => f.name.toLowerCase().endsWith('.shx')) || 
        !formData.files.find(f => f.name.toLowerCase().endsWith('.shx'))||
        !formData.files.find(f => f.name.toLowerCase().endsWith('.prj'))||
        !formData.files.find(f => f.name.toLowerCase().endsWith('.dbf'))
      ){
      setUploadStatus('shapefiles must include .shp, .shx,.dbf');
      return;

      }
      
    }

    setUploadStatus('Uploading...');
    setProgress(0);
    const ws = new WebSocket('ws://192.168.1.200:8000/ws/upload/');

    ws.onopen = async () => {
      console.log('WebSocket opened');
      const primaryFile = formData.files.find(f => f.name.toLowerCase().endsWith('.shp')) || formData.files[0];
      const metaRequest = new FileUploadRequest();
      const metadata = new FileMetaData();
      metadata.setFileName(primaryFile.name);
      metadata.setDataType(formData.dataType);
      metadata.setTypeOfData(formData.typeOfData);
      metadata.setDescription(formData.description);
      metadata.setDateCaptured(formData.dateCaptured);
      metaRequest.setMetaData(metadata);
      metaRequest.setFileName(primaryFile.name); // Set top-level file_name
      ws.send(metaRequest.serializeBinary());
      console.log('Metadata sent:', primaryFile.name);

      let totalBytes = formData.files.reduce((sum, file) => sum + file.size, 0);
      let bytesSent = 0;

      for (const file of formData.files) {
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        let chunksSent = 0;
        const reader = file.stream().getReader();
        console.log(`Uploading ${file.name}, size: ${file.size} bytes`);

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log(`Finished ${file.name}: ${chunksSent} chunks`);
            break;
          }
          const chunkRequest = new FileUploadRequest();
          chunkRequest.setChunkData(value);
          chunkRequest.setFileName(file.name); // Set for each chunk
          ws.send(chunkRequest.serializeBinary());
          chunksSent += 1;
          bytesSent += value.length;
          console.log(`Sent chunk ${chunksSent}/${totalChunks} for ${file.name}`);
          setProgress(Math.round((bytesSent / totalBytes) * 100));
        }
      }

      const endRequest = new FileUploadRequest();
      endRequest.setEndSignal(true);
      endRequest.setFileName(primaryFile.name); // Optional, for consistency
      ws.send(endRequest.serializeBinary());
      console.log('End signal sent');
    };

    ws.onmessage = (event) => {
      const response = FileUploadResponse.deserializeBinary(new Uint8Array(event.data));
      console.log('Response:', response.getMessage());
      setUploadStatus(response.getMessage());
      if (response.getSuccess() && response.getMessage().includes('Upload completed')) {
        setProgress(100);
        ws.close();
      } else if (!response.getSuccess()) {
        setProgress(0);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setUploadStatus('Upload failed: WebSocket error');
      setProgress(0);
    };

    ws.onclose = () => console.log('WebSocket closed');
  };

  // Rest of the component (form UI) remains unchanged
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="data-form">
        <h2>Geospatial Ouptut Data Upload Form</h2>
        <div className="form-group">
          <label htmlFor="fileUpload">Data Upload (Max 2GB Total)</label>
          <div className='file-input-row'>
            <input
              style={{ border: '1px solid #ddd', borderRadius: '4px', height: '37px' }}
              className='file-path-input'
              placeholder='Select files...'
              value={filePaths.join(', ')}
              readOnly
            />
            <label style={{ color: 'white', textAlign: 'center' }} className="file-button">
              Open
              <input
                type="file"
                id="fileUpload"
                onChange={handleFileChange}
                multiple
                required
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <small>Select all Shapefile components (.shp, .shx, .dbf, etc.) if uploading vector data</small>
        </div>
        <div className="form-group">
          <label htmlFor="dataType">Geospatial Type</label>
          <select id="dataType" name="dataType" value={formData.dataType} onChange={handleInputChange}>
            <option value="vector">Vector</option>
            <option value="raster">Raster</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="typeOfData">State of Data</label>
          <select id="typeOfData" name="typeOfData" value={formData.typeOfData} onChange={handleInputChange}>
            <option value="Field data">Field Data</option>
            <option value="Processed Data">Processed Data</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dateCaptured">Date Created</label>
          <input
            type='date'
            id="dateCaptured"
            name="dateCaptured"
            className='date-captured'
            value={formData.dateCaptured}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Data Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Enter data description..."
            required
          />
        </div>
       
        {uploadStatus && (
          <div className="upload-feedback">
            <p>{uploadStatus}</p>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <p>{progress}% ({Math.round((formData.files.reduce((sum, f) => sum + (f?.size || 0), 0) * (progress / 100)) / (1024 * 1024))}MB / {Math.round(formData.files.reduce((sum, f) => sum + (f?.size || 0), 0) / (1024 * 1024))}MB)</p>
          </div>
        )}
      </form>
    </div>
  );
};






// const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
// const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB limit

// export const AnalysisAssetsUpload = forwardRef((props, ref) => {
//   const [formData, setFormData] = useState({
//     file: null,
//     description: '',
//     dateCaptured: ''
//   });
//   const [filePath, setFilePath] = useState('')
//   const [uploadStatus, setUploadStatus] = useState('');
//   const [progress, setProgress] = useState(0);

//   const { sharedValue: inputgeospatialValue } = useContext(InputGeospatatialContext);
//   const { sharedValue: outputgeospatialValue } = useContext(OutputGeospatatialContext);
//   const { sharedValue: documentValue } = useContext(DocumentContext);
//   const { sharedValue: mapValue } = useContext(MapContext);

//   const handleFileChange = (e) => {
//     if (e.target.files[0]) {
//       const selectedFile = e.target.files[0];
//       if (selectedFile.size > MAX_FILE_SIZE) {
//         setUploadStatus(`File too large: ${Math.round(selectedFile.size / (1024 * 1024))}MB exceeds 2GB limit`);
//         setFilePath('');
//         setFormData({ ...formData, file: null });
        
//       } else {
//         setFormData({ ...formData, file: selectedFile });
        
//         setFilePath(selectedFile.name);
//         setUploadStatus('');
//       }
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
   
//   };

//   const handleSubmit = async (e) => {
//     // If called from a form submission, prevent default behavior
//     if (e && typeof e.preventDefault === 'function') {
//       e.preventDefault();
//     }

//     if (!formData.file) {
//       setUploadStatus('Please select at least one file');
//       return;
//     }

//     // setUploadStatus('Uploading...');
//     // setProgress(0);
//     const ws = new WebSocket('ws://192.168.1.200:8000/ws/analysisupload/');
//     console.log(inputgeospatialValue)

//     ws.onopen = async () => {
//       console.log('WebSocket opened');
//       // inputgeospatial
//       const inputprimaryFile = inputgeospatialValue.files;
//       const metaRequest = new AnalysisFileUploadRequest();
//       const inputgeometadata = new AnalysisInputFileMetaData();
//       inputgeometadata.setFileName(inputprimaryFile .name);
//       inputgeometadata.setDataType(inputgeospatialValue.dataType);
//       inputgeometadata.setTypeOfData(inputgeospatialValue.typeOfData);
//       inputgeometadata.setDescription(inputgeospatialValue.description);
//       inputgeometadata.setDateCaptured(inputgeospatialValue.dateCaptured);
//       metaRequest.setInputMetaData(inputgeometadata);
//       metaRequest.setInputGeoFileName(inputprimaryFile.name); // Set top-level file_name

//       // inputgeospatial
//       const outputprimaryFile = outputgeospatialValue.files;
     
//       const outputgeometadata = new AnalysisOutputFileMetaData();
//       outputgeometadata.setFileName(outputprimaryFile.name);
//       outputgeometadata.setDataType(outputgeospatialValue.dataType);
//       outputgeometadata.setTypeOfData(outputgeospatialValue.typeOfData);
//       outputgeometadata.setDescription(outputgeospatialValue.description);
//       outputgeometadata.setDateCaptured(outputgeospatialValue.dateCaptured);
//       metaRequest.setOutputMetaData(outputgeometadata);
//       metaRequest.setOutputGeoFileName(outputprimaryFile.name); // Set top-level file_name
//  //

//       // document
//       const docmetadata = new AnalysisDocumentMetaData();
//       docmetadata.setFileName(documentValue.file.name);
//       docmetadata.setDescription(documentValue.description);
//       docmetadata.setDateCaptured(documentValue.dateCaptured);
//       metaRequest.setDocumentMetaData(docmetadata);

//       // map
//       const mapmetadata = new AnalysisMapMetaData();
//       mapmetadata.setFileName(mapValue.file.name);
//       mapmetadata.setDescription(mapValue.description);
//       mapmetadata.setDateCaptured(mapValue.dateCaptured);
//       metaRequest.setMapMetaData(mapmetadata);

//       // Analysis Assets 
//       const analysismetadata = new AnalysisAnalysisAssetMetaData();
//       analysismetadata.setFileName(formData.file.name);
//       analysismetadata.setDescription(formData.description);
//       analysismetadata.setDateCaptured(formData.dateCaptured);
//       metaRequest.setAnalysisMetaData(analysismetadata);


//       ws.send(metaRequest.serializeBinary());
//       // console.log('Metadata sent:', primaryFile.name);

//       // let noOfFIleSent=0

//       // sending inputgeospatial chunk
      
//       async function sendInputGeospatialChunk(){
//         try{
//         let totalBytes = inputgeospatialValue.files.reduce((sum, file) => sum + file.size, 0);
//         let bytesSent = 0;
  
//         for (const file of inputgeospatialValue.files) {
//           const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
//           let chunksSent = 0;
//           const reader = file.stream().getReader();
//           console.log(`Uploading ${file.name}, size: ${file.size} bytes`);
  
//           while (true) {
//             const { done, value } = await reader.read();
//             if (done) {
//               console.log(`Finished ${file.name}: ${chunksSent} chunks`);
//               // noOfFIleSent+=1
  
//               break;
//             }
//             const chunkRequest = new AnalysisFileUploadRequest();
//             chunkRequest.setInputGeoChunkData(value);
//             chunkRequest.setInputGeoFileName(file.name); // Set for each chunk
//             ws.send(chunkRequest.serializeBinary());
//             chunksSent += 1;
//             bytesSent += value.length;
//             console.log(`Sent chunk ${chunksSent}/${totalChunks} for ${file.name}`);
//             // setProgress(Math.round((bytesSent / totalBytes) * 100));
//           }
//         }
//         return true

//       }catch (error) {
//         console.error('Error sending geospatial chunks:', error);
//         // setUploadStatus(`Upload failed: ${error.message}`);
//         ws.close(1011, `Error during upload: ${error.message}`);
//        return false;
//       }
//       }


//       async function sendOutputGeospatialChunk(){
//         try{
//         let totalBytes = outputgeospatialValue.files.reduce((sum, file) => sum + file.size, 0);
//         let bytesSent = 0;
  
//         for (const file of outputgeospatialValue.files) {
//           const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
//           let chunksSent = 0;
//           const reader = file.stream().getReader();
//           console.log(`Uploading ${file.name}, size: ${file.size} bytes`);
  
//           while (true) {
//             const { done, value } = await reader.read();
//             if (done) {
//               console.log(`Finished ${file.name}: ${chunksSent} chunks`);
//               // noOfFIleSent+=1
  
//               break;
//             }
//             const chunkRequest = new AnalysisFileUploadRequest();
//             chunkRequest.setOutputGeoChunkData(value);
//             chunkRequest.setOutputGeoFileName(file.name); // Set for each chunk
//             ws.send(chunkRequest.serializeBinary());
//             chunksSent += 1;
//             bytesSent += value.length;
//             console.log(`Sent chunk ${chunksSent}/${totalChunks} for ${file.name}`);
//             // setProgress(Math.round((bytesSent / totalBytes) * 100));
//           }
//         }
//         return true

//       }catch (error) {
//         console.error('Error sending geospatial chunks:', error);
//         // setUploadStatus(`Upload failed: ${error.message}`);
//         ws.close(1011, `Error during upload: ${error.message}`);
//        return false;
//       }
//       }

//       // await sendGeospatialChunk()
     

//     //  sending  document chunks
//       const doctotalChunks = Math.ceil(documentValue.file.size / CHUNK_SIZE);
//       let docchunksSent = 0;

//       const docreader = documentValue.file.stream().getReader();
//       const docsendocChunks = async () => {
//         try{
//         while (true) {
//           const { done, value } = await docreader.read();
//           if (done) {
//             // noOfFIleSent+=1
//             // const endRequest = new AnalysisFileUploadRequest();
//             // endRequest.setEndSignal(true);
//             // ws.send(endRequest.serializeBinary());
//             break;
//           }
//           const chunkRequest = new AnalysisFileUploadRequest();
//           chunkRequest.setDocChunkData(value);
//           ws.send(chunkRequest.serializeBinary());
//           docchunksSent += 1;
//           // setProgress(Math.round((docchunksSent / doctotalChunks) * 100)); // Update progress as percentage
//         }
//         return true
//       }catch (error) {
//         console.error('Error sending Document chunks:', error);
//         // setUploadStatus(`Upload failed: ${error.message}`);
//         ws.close(1011, `Error during upload: ${error.message}`);
//         return false;
//       }
//     };
//       // await docsendocChunks();

//       // sending map chunks


//       const maptotalChunks = Math.ceil(mapValue.file.size / CHUNK_SIZE);
//       let mapchunksSent = 0;

//       const mapreader = mapValue.file.stream().getReader();
//       const mapsendChunks = async () => {
//         try{
//         while (true) {
//           const { done, value } = await mapreader.read();
//           if (done) {
//             // noOfFIleSent+=1
//             // const endRequest = new AnalysisFileUploadRequest();
//             // endRequest.setEndSignal(true);
//             // ws.send(endRequest.serializeBinary());
//             break;
//           }
//           const chunkRequest = new AnalysisFileUploadRequest();
//           chunkRequest.setMapChunkData(value);
//           ws.send(chunkRequest.serializeBinary());
//           mapchunksSent += 1;
//           // setProgress(Math.round((mapchunksSent / maptotalChunks) * 100)); // Update progress as percentage
//         }
//         return true

//       }catch (error) {
//         console.error('Error sending Map chunks:', error);
//         // setUploadStatus(`Upload failed: ${error.message}`);
//         ws.close(1011, `Error during upload: ${error.message}`);
//         return false;
//       }
//     };
//       // await mapsendChunks();

//       // sending analysis script chunks
//       const analysistotalChunks = Math.ceil(formData.file.size / CHUNK_SIZE);
//       let analysischunksSent = 0;

//       const analysisreader = formData.file.stream().getReader();
//       const analysissendChunks = async () => {
//         try{
//         while (true) {
//           const { done, value } = await analysisreader.read();
//           if (done) {
//             // noOfFIleSent+=1
//             // const endRequest = new AnalysisFileUploadRequest();
//             // endRequest.setEndSignal(true);
//             // ws.send(endRequest.serializeBinary());
//             break;
//           }
//           const chunkRequest = new AnalysisFileUploadRequest();
//           chunkRequest.setAnalysisChunkData(value);
//           ws.send(chunkRequest.serializeBinary());
//           analysischunksSent += 1;
//           // setProgress(Math.round((analysischunksSent / analysistotalChunks) * 100)); // Update progress as percentage
//         }
//         return true
//       }catch (error) {
//         console.error('Error sending Analysis chunks:', error);
//         // setUploadStatus(`Upload failed: ${error.message}`);
//         ws.close(1011, `Error during upload: ${error.message}`);
//         return false;
//       }
//     };
//       // await analysissendChunks();




      

//       // sending end signial
//       const [inputgeoResult,outputgeoResult, docResult, mapResult, analysisResult] = await Promise.all([
//         sendInputGeospatialChunk(),
//         sendOutputGeospatialChunk(),
//         docsendocChunks(),
//         mapsendChunks(),
//         analysissendChunks()
//       ]);
      
//       // Check results after all promises are resolved
//       if (inputgeoResult && outputgeoResult && docResult && mapResult && analysisResult) {
//         const endRequest = new AnalysisFileUploadRequest();
//         endRequest.setEndSignal(true);
//         // endRequest.setFileName(primaryFile.name);
//         ws.send(endRequest.serializeBinary());
//         console.log('End signal sent - all chunks complete');
//       } else {
//         console.error('Not all chunks were successfully sent');
//         // Handle the error
//       }

      
//     };

//     ws.onmessage = (event) => {
//       const response = AnalysisFileUploadResponse.deserializeBinary(new Uint8Array(event.data));
//       console.log('Response:', response.getMessage());
//       setUploadStatus(response.getMessage());
//       if (response.getSuccess() && response.getMessage().includes('Upload completed')) {
//         setProgress(100);
//         ws.close();
//       } else if (!response.getSuccess()) {
//         setProgress(0);
//       }
//     };

//     ws.onerror = (err) => {
//       console.error('WebSocket error:', err);
//       setUploadStatus('Upload failed: WebSocket error');
//       setProgress(0);
//     };

//     ws.onclose = () => console.log('WebSocket closed');
//   };

//    // Expose the handleSubmit function through ref
//    useImperativeHandle(ref, () => ({
//     handleSubmit: () => handleSubmit(null), // Call handleSubmit without an event
//   }));

//   // Rest of the component (form UI) remains unchanged
//   return (
//     <div className="form-container">
//       <form onSubmit={handleSubmit} className="data-form">
//         <h2>Analysis Data Upload Form</h2>
//         <div className="form-group">
//           <label htmlFor="fileUpload">Data Upload (Max 2GB Total)</label>
//           <div className='file-input-row'>
//             <input
//               style={{ border: '1px solid #ddd', borderRadius: '4px', height: '37px' }}
//               className='file-path-input'
//               placeholder='Select files...'
//               value={filePath}
//               readOnly
//             />
//             <label style={{ color: 'white', textAlign: 'center' }} className="file-button">
//               Open
//               <input
//                 type="file"
//                 id="fileUpload"
//                 onChange={handleFileChange}
//                 multiple
//                 required
//                 style={{ display: 'none' }}
//               />
//             </label>
//           </div>
//           <small>Select all Shapefile components (.shp, .shx, .dbf, etc.) if uploading vector data</small>
//         </div>

        
        
//         <div className="form-group">
//           <label htmlFor="dateCaptured">Date Created</label>
//           <input
//             type='date'
//             id="dateCaptured"
//             name="dateCaptured"
//             className='date-captured'
//             value={formData.dateCaptured}
//             onChange={handleInputChange}
//           />
//         </div>

        


//         <div className="form-group">
//           <label htmlFor="description">Data Description</label>
//           <textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             rows="4"
//             placeholder="Enter data description..."
//             required
//           />
//         </div>
//         <button type="submit" disabled={uploadStatus === 'Uploading...'}>Submit</button>
//         {uploadStatus && (
//           <div className="upload-feedback">
//             <p>{uploadStatus}</p>
//             <div className="progress-bar-container">
//               <div className="progress-bar" style={{ width: `${progress}%` }}></div>
//             </div>
//             <p>{progress}% ({Math.round((formData.files.reduce((sum, f) => sum + (f?.size || 0), 0) * (progress / 100)) / (1024 * 1024))}MB / {Math.round(formData.files.reduce((sum, f) => sum + (f?.size || 0), 0) / (1024 * 1024))}MB)</p>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// });

// // export default GeospatialDataUpload;




export const AnalysisAssetsUpload = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    file: null,
    description: '',
    dateCaptured: ''
  });
  const [filePath, setFilePath] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [progress, setProgress] = useState(0);

  const { sharedValue: inputgeospatialValue } = useContext(InputGeospatatialContext);
  const { sharedValue: outputgeospatialValue } = useContext(OutputGeospatatialContext);
  const { sharedValue: documentValue } = useContext(DocumentContext);
  const { sharedValue: mapValue } = useContext(MapContext);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > MAX_FILE_SIZE) {
        setUploadStatus(`File too large: ${Math.round(selectedFile.size / (1024 * 1024))}MB exceeds 2GB limit`);
        setFilePath('');
        setFormData({ ...formData, file: null });
      } else {
        setFormData({ ...formData, file: selectedFile });
        setFilePath(selectedFile.name);
        setUploadStatus('');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (!formData.file || !formData.description || !formData.dateCaptured) {
      setUploadStatus('Please All Entries must be filled');
      return;
    }

    if (!inputgeospatialValue?.files?.length || !outputgeospatialValue?.files?.length || 
        !documentValue?.file || !mapValue?.file) {
      setUploadStatus('Please complete all previous steps before submitting');
      return;
    }

    setUploadStatus('Uploading...');
    setProgress(0);
    const ws = new WebSocket('ws://192.168.1.200:8000/ws/analysisupload/');

    ws.onopen = async () => {
      console.log('WebSocket opened');

      // Send all metadata first
      const sendMetadata = async () => {
        const metaRequest = new AnalysisFileUploadRequest();

        const inputGeoMetadata = new AnalysisInputFileMetaData();
        inputGeoMetadata.setFileName(inputgeospatialValue.files[0].name);
        inputGeoMetadata.setDataType(inputgeospatialValue.dataType);
        inputGeoMetadata.setTypeOfData(inputgeospatialValue.typeOfData);
        inputGeoMetadata.setDescription(inputgeospatialValue.description);
        inputGeoMetadata.setDateCaptured(inputgeospatialValue.dateCaptured);
        metaRequest.setInputMetaData(inputGeoMetadata);
        ws.send(metaRequest.serializeBinary());

        const outputGeoMetadata = new AnalysisOutputFileMetaData();
        outputGeoMetadata.setFileName(outputgeospatialValue.files[0].name);
        outputGeoMetadata.setDataType(outputgeospatialValue.dataType);
        outputGeoMetadata.setTypeOfData(outputgeospatialValue.typeOfData);
        outputGeoMetadata.setDescription(outputgeospatialValue.description);
        outputGeoMetadata.setDateCaptured(outputgeospatialValue.dateCaptured);
        metaRequest.setOutputMetaData(outputGeoMetadata);
        ws.send(metaRequest.serializeBinary());

        const docMetadata = new AnalysisDocumentMetaData();
        docMetadata.setFileName(documentValue.file.name);
        docMetadata.setDescription(documentValue.description);
        docMetadata.setDateCaptured(documentValue.dateCaptured);
        metaRequest.setDocumentMetaData(docMetadata);
        ws.send(metaRequest.serializeBinary());

        const mapMetadata = new AnalysisMapMetaData();
        mapMetadata.setFileName(mapValue.file.name);
        mapMetadata.setDescription(mapValue.description);
        mapMetadata.setDateCaptured(mapValue.dateCaptured);
        metaRequest.setMapMetaData(mapMetadata);
        ws.send(metaRequest.serializeBinary());

        const analysisMetadata = new AnalysisAnalysisAssetMetaData();
        analysisMetadata.setFileName(formData.file.name);
        analysisMetadata.setDescription(formData.description);
        analysisMetadata.setDateCaptured(formData.dateCaptured);
        metaRequest.setAnalysisMetaData(analysisMetadata);
        ws.send(metaRequest.serializeBinary());
      };

      await sendMetadata();
      console.log('All metadata sent');

      const totalSize =
        inputgeospatialValue.files.reduce((sum, file) => sum + file.size, 0) +
        outputgeospatialValue.files.reduce((sum, file) => sum + file.size, 0) +
        documentValue.file.size +
        mapValue.file.size +
        formData.file.size;
      let bytesSent = 0;

      async function sendChunks(files, chunkSetter, fileNameSetter) {
        try {
          for (const file of Array.isArray(files) ? files : [files]) {
            const reader = file.stream().getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunkRequest = new AnalysisFileUploadRequest();
              chunkSetter(chunkRequest, value);
              if (fileNameSetter) chunkRequest[fileNameSetter](file.name);
              ws.send(chunkRequest.serializeBinary());
              bytesSent += value.length;
              setProgress(Math.min(99, Math.round((bytesSent / totalSize) * 100)));
            }
          }
          return true;
        } catch (error) {
          console.error('Error sending chunks:', error);
          setUploadStatus(`Upload failed: ${error.message}`);
          return false;
        }
      }

      const allChunksSent = await Promise.all([
        sendChunks(inputgeospatialValue.files, (req, val) => req.setInputGeoChunkData(val), 
                  'setInputGeoFileName'),
        sendChunks(outputgeospatialValue.files, (req, val) => req.setOutputGeoChunkData(val), 
                  'setOutputGeoFileName'),
        sendChunks(documentValue.file, (req, val) => req.setDocChunkData(val)),
        sendChunks(mapValue.file, (req, val) => req.setMapChunkData(val)),
        sendChunks(formData.file, (req, val) => req.setAnalysisChunkData(val))
      ]);

      if (allChunksSent.every(result => result)) {
        const endRequest = new AnalysisFileUploadRequest();
        endRequest.setEndSignal(true);
        ws.send(endRequest.serializeBinary());
        console.log('End signal sent - all chunks complete');
      } else {
        setUploadStatus('Upload failed: Incomplete file upload');
        ws.close(1011, 'Incomplete upload');
      }
    };

    ws.onmessage = (event) => {
      console.log('Raw WebSocket message type:', typeof event.data, event.data);
      
      const processResponse = async (data) => {
        let arrayBuffer;
        if (data instanceof ArrayBuffer) {
          arrayBuffer = data;
        } else if (data instanceof Blob) {
          arrayBuffer = await data.arrayBuffer(); // Convert Blob to ArrayBuffer
        } else {
          console.error('Unexpected data type:', typeof data);
          setUploadStatus('Upload failed: Server sent invalid data type');
          setProgress(0);
          ws.close(1011, 'Invalid data type');
          return;
        }
        
        try {
          const response = AnalysisFileUploadResponse.deserializeBinary(new Uint8Array(arrayBuffer));
          const message = response.getMessage() || 'No message received';
          console.log('Parsed Response:', message);
          setUploadStatus(message);
          if (response.getSuccess() && message.includes('Upload completed')) {
            setProgress(100);
            ws.close();
          } else if (!response.getSuccess()) {
            setUploadStatus(`Upload failed: ${message}`);
            setProgress(0);
            ws.close(1011, message);
          } else {
            setProgress(Math.min(99, progress + 1));
          }
        } catch (error) {
          console.error('Failed to deserialize response:', error);
          setUploadStatus(`Upload failed: Invalid response from server (${error.message})`);
          setProgress(0);
          ws.close(1011, 'Invalid response');
        }
      };
    
      processResponse(event.data);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setUploadStatus('Upload failed: WebSocket error');
      setProgress(0);
      ws.close(1011, 'WebSocket error');
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      if (event.code !== 1000) {
        setUploadStatus(`Upload failed: Connection closed unexpectedly (${event.reason})`);
      }
    };
  };

  useImperativeHandle(ref, () => ({
    handleSubmit: () => handleSubmit(null),
  }));

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="data-form">
        <h2>Analysis Data Upload Form</h2>
        <div className="form-group">
          <label htmlFor="fileUpload">Data Upload (Max 2GB Total)</label>
          <div className="file-input-row">
            <input
              style={{ border: '1px solid #ddd', borderRadius: '4px', height: '37px' }}
              className="file-path-input"
              placeholder="Select file..."
              value={filePath}
              readOnly
            />
            <label style={{ color: 'white', textAlign: 'center' }} className="file-button">
              Open
              <input
                type="file"
                id="fileUpload"
                onChange={handleFileChange}
                required
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <small>Select analysis script or related file</small>
        </div>
        <div className="form-group">
          <label htmlFor="dateCaptured">Date Created</label>
          <input
            type="date"
            id="dateCaptured"
            name="dateCaptured"
            className="date-captured"
            value={formData.dateCaptured}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Data Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Enter data description..."
            required
          />
        </div>
        
        {uploadStatus && (
          <div className="upload-feedback">
            <p>{uploadStatus}</p>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
});
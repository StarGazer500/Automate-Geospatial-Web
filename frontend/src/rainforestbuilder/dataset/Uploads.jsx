import React, { useState } from 'react';
import './Uploads.css';
import { DocumentUploadRequest, DocumentMetaData, DocumentUploadResponse } from "./grpc_setup/generated/file_upload1_pb.esm";

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
    e.preventDefault();
    if (!formData.file) {
      setUploadStatus('Please select a file');
      return;
    }

    setUploadStatus('Uploading...');
    setProgress(0); // Reset progress
    const ws = new WebSocket('ws://localhost:8000/ws/documentupload/');

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
        <h2>Data Upload Form</h2>

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

        <button type="submit" disabled={uploadStatus === 'Uploading...'}>Submit</button>

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


import { MapUploadRequest, MapMetaData, MapUploadResponse } from "./grpc_setup/generated/file_upload3_pb.esm";
export const MapDataUpload = () => {
  const [formData, setFormData] = useState({
    file: null,
    description: '',
    dateCaptured: ''
  });
  const [filePath, setFilePath] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [progress, setProgress] = useState(0); // Progress as a percentage

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
    e.preventDefault();
    if (!formData.file) {
      setUploadStatus('Please select a file');
      return;
    }

    setUploadStatus('Uploading...');
    setProgress(0); // Reset progress
    const ws = new WebSocket('ws://localhost:8000/ws/mapupload/');

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
        <h2>Data Upload Form</h2>

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

        <button type="submit" disabled={uploadStatus === 'Uploading...'}>Submit</button>

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
import { FileUploadRequest, FileMetaData, FileUploadResponse } from "./grpc_setup/generated/file_upload2_pb.esm";

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
    if (formData.files.length === 0) {
      setUploadStatus('Please select at least one file');
      return;
    }

    setUploadStatus('Uploading...');
    setProgress(0);
    const ws = new WebSocket('ws://localhost:8000/ws/upload/');

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
        <h2>Data Upload Form</h2>
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

// export default GeospatialDataUpload;
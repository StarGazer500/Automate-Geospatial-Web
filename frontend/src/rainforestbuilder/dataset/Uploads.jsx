import React, { useState } from 'react';
import './Uploads.css';
import { FileUploadRequest, FileMetaData, FileUploadResponse } from "./grpc_setup/generated/file_upload1_pb.esm";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB limit

const GeospatialDataUpload = () => {
  const [formData, setFormData] = useState({
    file: null,
    dataType: 'vector',
    typeOfData: 'Field data',
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
    const ws = new WebSocket('ws://localhost:8000/ws/upload/');

    ws.onopen = () => {
      // Send metadata
      const metaRequest = new FileUploadRequest();
      const metadata = new FileMetaData();
      metadata.setFileName(formData.file.name);
      metadata.setDataType(formData.dataType);
      metadata.setTypeOfData(formData.typeOfData);
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
            const endRequest = new FileUploadRequest();
            endRequest.setEndSignal(true);
            ws.send(endRequest.serializeBinary());
            break;
          }
          const chunkRequest = new FileUploadRequest();
          chunkRequest.setChunkData(value);
          ws.send(chunkRequest.serializeBinary());
          chunksSent += 1;
          setProgress(Math.round((chunksSent / totalChunks) * 100)); // Update progress as percentage
        }
      };
      sendChunks();
    };

    ws.onmessage = (event) => {
      const response = FileUploadResponse.deserializeBinary(new Uint8Array(event.data));
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
          <label htmlFor="dataType">Geospatial Type</label>
          <select
            id="dataType"
            name="dataType"
            value={formData.dataType}
            onChange={handleInputChange}
          >
            <option value="vector">Vector</option>
            <option value="raster">Raster</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="typeOfData">State of Data</label>
          <select
            id="typeOfData"
            name="typeOfData"
            value={formData.typeOfData}
            onChange={handleInputChange}
          >
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

export default GeospatialDataUpload;
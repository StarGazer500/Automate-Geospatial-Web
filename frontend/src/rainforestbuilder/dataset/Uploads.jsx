import React, { useState } from 'react';
import './Uploads.css'; // We'll create this CSS file next

const GeospatialDataUpload = () => {
  const [formData, setFormData] = useState({
    file: null,
    dataType: 'vector',
    typeOfData: 'Field data',
    description: '',
    dateCaptured: ''

  });
  
  const [filePath, setFilePath] = useState('');
  
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
      setFilePath(e.target.files[0].name);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };
  
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="data-form">
        <h2>Data Upload Form</h2>
        
        <div className="form-group">
          <label htmlFor="fileUpload">Data Upload</label>
          <div className='file-input-row'>
            <input 
             style={{border:'1px solid  #ddd',borderRadius: '4px',height:'37px'}}
              className='file-path-input' 
              placeholder='Enter File Path' 
              value={filePath}
              readOnly
            />
            <label style={{color:'white',textAlign:'center'}} className="file-button">
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
        
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default GeospatialDataUpload;
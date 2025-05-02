import { useState,useContext,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Uploads.css';
import {DetailViewIdContext } from '../../utils/context';
import { FileUploadRequest1, FileMetaData1, FileUploadResponse1 } from "./grpc_setup/generated/file_upload5_pb.esm";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB limit

export const EditData = ({inputType,dataCategory,dataToEdit,dataKey}) => {
 const [data, setData] = useState(null);
//   const [inputType, setInputType] = useState('text');
  const [error, setError] = useState(null);
  const [filePaths, setFilePaths] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [progress, setProgress] = useState(0); // Progress as a percentage

  const { sharedValue:ItemId} = useContext(DetailViewIdContext)

  


  const handleChange = (e) => {
    if (inputType === 'text') {
      
      setData(e.target.value )

    }
     else if (inputType === 'file') {
        
        let files = Array.from(e.target.files)
        if (files.length === 0) return;
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        if (totalSize > MAX_FILE_SIZE) {
          setUploadStatus(`Total size too large: ${Math.round(totalSize / (1024 * 1024))}MB exceeds 2GB limit`);
          setFilePaths([]);
          setData(null);
          return
         
        } else {
           
            
          setData(files)
          setFilePaths(files.map(file => file.name));
          setUploadStatus('');
        }

    }
  };

  function isCompleteShapefileSet(data, nameWithoutExt) {
    const requiredExtensions = ['.shp', '.shx', '.prj', '.dbf'];
    const expectedFileNames = requiredExtensions.map(ext => nameWithoutExt + ext);
  
    const fileNames = data.map(file => file.name);
  
    return expectedFileNames.every(name => fileNames.includes(name));
  }


  async function editMetaDeta(url,key) {
    try {
      const response = await fetch(
        url,
        {
          method: 'PUT',
          credentials: 'include', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            editing_data : data,
            key:dataKey, 

          })
        }
      );

      // Log the raw response for debugging
      const rawResponse = await response.text();
      console.log('Raw response:', rawResponse);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(rawResponse);
        } catch {
          errorData = { error: `Server returned status ${response.status}` };
        }
        console.log('Data sent failed:', response.status, errorData.error || 'Unknown error');
        setError(errorData.error || 'Data sent  failed');
        return null;
      }else{

      // Parse JSON only if response is OK
      const data = JSON.parse(rawResponse);
     
      console.log('Data Sent Successfully:', data);
      }
      // return data;
    } catch (error) {
      console.error('Fetch Error:', error.message);
      setError(`Network error: ${error.message}`);
      return null;
    }
    
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    console.log("key name",dataKey)
    if (inputType==='text' && data){
      if (dataCategory==="geospatial"){
      await editMetaDeta(`http://localhost:8000/manage-data/get-update-delete-geospatial/${ItemId}/`,data)
      }else if (dataCategory==="document"){
        await editMetaDeta(`http://localhost:8000/manage-data/get-update-delete-document/${ItemId}/`,data)
      }else if (dataCategory==="map"){
        await editMetaDeta(`http://localhost:8000/manage-data/get-update-delete-map/${ItemId}/`,data)
      }else if (dataCategory==="analysis"){
        await editMetaDeta(`http://localhost:8000/manage-data/get-update-delete-analysis/${ItemId}/`,data)
      }else{
        console.log("no category found")
        return
      }

    }else if (inputType==="file"){
         if (!data) {
              setUploadStatus('Please select a file');
              return;
            }

        //   validate if files matches
           
            if(dataCategory==="geospatial" && dataToEdit && ['shp'].includes(dataToEdit.split('.').pop().toLowerCase()) && Array.isArray(data) && data.length > 1){
            
              const nameWithoutExt = dataToEdit.slice(0, dataToEdit.lastIndexOf('.'));
              
              const allPresent = isCompleteShapefileSet(data, nameWithoutExt);

              if (allPresent) {
                console.log("✅ Complete SHP file set detected.");
              } else {
                console.log("❌ Missing one or more required SHP files.");
              }

             
             
            
          }else{

                if(dataCategory==="geospatial" && dataToEdit && Array.isArray(data) && data[0].name === dataToEdit){
                  console.log("geospatial single editing",dataToEdit, data)
                } else if(dataCategory!=="geospatial" && dataToEdit && Array.isArray(data) && data[0].name ===  dataToEdit.split('/').pop()){
                  console.log("non-geospatial single editing",dataToEdit, data)
                }
                else{
                  console.log("current data",dataToEdit,data)
                  setError("unknown error, retry. If error persist, talk to support")
                  return

                }
            }


           
               setUploadStatus('Uploading...');
               setProgress(0);
               const ws = new WebSocket('ws://localhost:8000/ws/editfile/');
           
               ws.onopen = async () => {
                 console.log('WebSocket opened');
                 const primaryFile = data.find(f => f.name.toLowerCase().endsWith('.shp')) || data[0];
                 const metaRequest = new FileUploadRequest1();
                 const metadata = new FileMetaData1();
                 metadata.setFileName(primaryFile.name);
                 metadata.setFileId(ItemId);
                 metadata.setDataCategory(dataCategory);
                 metaRequest.setMetaData(metadata);
                 metaRequest.setFileName(primaryFile.name);
                 ws.send(metaRequest.serializeBinary());
                 console.log('Metadata sent:', primaryFile.name);
           
                 let totalBytes = data.reduce((sum, file) => sum + file.size, 0);
                 let bytesSent = 0;
           
                 for (const file of data) {
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
                     const chunkRequest = new FileUploadRequest1();
                     chunkRequest.setChunkData(value);
                     chunkRequest.setFileName(file.name); // Set for each chunk
                     ws.send(chunkRequest.serializeBinary());
                     chunksSent += 1;
                     bytesSent += value.length;
                     console.log(`Sent chunk ${chunksSent}/${totalChunks} for ${file.name}`);
                     setProgress(Math.round((bytesSent / totalBytes) * 100));
                   }
                 }
           
                 const endRequest = new FileUploadRequest1();
                 endRequest.setEndSignal(true);
                 endRequest.setFileName(primaryFile.name); // Optional, for consistency
                 ws.send(endRequest.serializeBinary());
                 console.log('End signal sent');
               };
           
               ws.onmessage = (event) => {
                 const response = FileUploadResponse1.deserializeBinary(new Uint8Array(event.data));
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

    }
  };

 
  return (
    <form onSubmit={handleSubmit}>
        {Array.isArray(dataToEdit) && dataToEdit.length > 0 ? (
    <h2>
      Editing{" "}
      <span>
        {(dataToEdit.find((f) => f.name.toLowerCase().endsWith(".shp")) || dataToEdit[0]).name}
      </span>
    </h2>
  ) : (
    <h1>
      Editing <span>{dataToEdit}</span>
    </h1>
  )}

       {inputType === 'text' ? 

       (<div className="form-group">
        <label htmlFor="">{dataToEdit}</label>
       
        <input
          type="text"
          id="text_data"
          name="text_data"
          onChange={handleChange}
          
          placeholder="Enter text"
        />
       </div>) : (
        <div className="form-group">
            <label htmlFor=""> Editing..... {dataToEdit}</label>
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
                        onChange={handleChange}
                        multiple
                        required
                        // value={data}
                        id="fileUpload"
                        name="file_data"
                        placeholder="Enter text"
                        style={{ display: 'none' }}
                        />
                    </label>
                </div>
        </div>
      )}
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Submit</button>
    </form>
  );
};
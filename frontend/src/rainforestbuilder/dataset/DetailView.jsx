import './DetailView.css';
import DatasetHeader from './DatasetHeader';
import React, { useEffect, useContext, useState, useRef } from 'react';
import { MapContainer, TileLayer ,useMap, LayersControl} from 'react-leaflet';
import { IpynbRenderer } from "react-ipynb-renderer";

// Jupyter theme
import "react-ipynb-renderer/dist/styles/monokai.css";

// Jupyter theme

import 'leaflet/dist/leaflet.css';
import VectorTileLayer from './CustomVectorTileLayer';
import {DetailViewIdContext } from '../../utils/context';

const { BaseLayer } = LayersControl;

export function MapDetailView() {
  const [mapContent, setMapContent] = useState(null);
  const [data,setData]= useState(null)
  const [error, setError] = useState(null);
  const { sharedValue:ItemId} = useContext(DetailViewIdContext);

  const apiUrl = `http://localhost:8000/manage-data/get-update-delete-map/${ItemId}/`; // Django endpoint

  useEffect(() => {
    // Step 1: Fetch document metadata from Django
    fetch(apiUrl,{
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Document not found');
        }
        return response.json();
      })
      .then(data => {
        setData(data)
        const fileUrl = "http://127.0.0.1:8000" + data.file; // Get the file URL from the response
        if (!fileUrl) {
          setError('No file available for this document');
          return;
        }

        // Step 2: Fetch the file itself and determine its type
        fetch(fileUrl,{
          method: 'GET',
          credentials: 'include',
        })
          .then(response => {
            const contentType = response.headers.get('Content-Type');
            return response.blob().then(blob => ({ contentType, blob }));
          })
          .then(({ contentType, blob }) => {
            if (contentType.includes('text/plain')) {
              blob.text().then(text => setDocumentContent(<pre>{text}</pre>));
            } else if (contentType.includes('image/')) {
              const imageUrl = URL.createObjectURL(blob);
              setMapContent(<img src={imageUrl} alt="Document" style={{ maxWidth: '100%' }} />);
            } else if (contentType.includes('application/pdf')) {
              const pdfUrl = URL.createObjectURL(blob);
              setMapContent(
                <embed src={pdfUrl} type="application/pdf" width="100%" height="100%" minheight='100%' />
              );
            } else if (contentType.includes('text/html')) {
              blob.text().then(html => setMapContent(<div dangerouslySetInnerHTML={{ __html: html }} />));
            } else {
              setError(`Unsupported file type: ${contentType}`);
            }
          })
          .catch(err => {
            console.error('Error fetching file:', err);
            setError('Error loading file');
          });
      })
      .catch(err => {
        console.error('Error fetching document metadata:', err);
        setError(err.message);
      });
  }, [apiUrl]);

    return (
      <div>
        <div className="content-wrapper">
              <DatasetHeader />
              <div className="flex h-full">
                  <div className="h-full flex-[7] flex-col">
                  <p className='text-green'>Loading document...</p>
                          <div style={{height:window.innerHeight}} className=" item-container" >
                         
                              {/* <p style={{color:'black'}}>doc view goes here</p> */}
                              
                              {error ? (
                              <p>{error}</p>
                              ) : mapContent ? (
                              mapContent
                              ) : (
                              <p>Loading document...</p>
                            )}
                                

                          </div>
  
                  </div>
                  <div className="flex-col full  flex-3 bg-white items-start justify-start border-2 border-[whitesmoke] pl-0 w-full">
                  {data && (
                <div className="flex-col mt-[50px] h-full flex-3 bg-white items-start justify-start border-2 border-[whitesmoke] p-[20x] pl-0 w-full">
                  <label className="text-[seagreen] mb-10">Data Properties</label>
                  <div className="flex mb-5">
                    <label style={{ textAlign: 'left' }} className="text-black pd-0">file url</label>
                    <p>{data.file}</p>
                  </div>
                  
                  
                  <div className="flex mb-5">
                    <label style={{ textAlign: 'left' }} className="text-black pd-0">description</label>
                    <p>{data.description}</p>
                  </div>
                  <div className="flex mb-5">
                    <label style={{ textAlign: 'left' }} className="text-black pd-0">date captured</label>
                    <p>{data.date_captured}</p>
                  </div>
                  <div className="flex mb-5">
                    <label style={{ textAlign: 'left' }} className="text-black pd-0">uploaded at</label>
                    <p>{data.uploaded_at}</p>
                  </div>
                </div>
              )}
                      
                  </div>
              </div>
      </div>
  
        
      </div>
    );
  }

  
export function DocumentDetailView() {
  const [documentContent, setDocumentContent] = useState(null);
  const [data,setData]= useState(null)
  const [error, setError] = useState(null);
  const { sharedValue:ItemId} = useContext(DetailViewIdContext);

  const apiUrl = `http://localhost:8000/manage-data/get-update-delete-document/${ItemId}/`; // Django endpoint
   

  useEffect(() => {
    // Step 1: Fetch document metadata from Django
    fetch(apiUrl,{
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Document not found');
        }
        return response.json();
      })
      .then(data => {
        setData(data)
        const fileUrl = "http://127.0.0.1:8000" + data.file; // Get the file URL from the response
        if (!fileUrl) {
          setError('No file available for this document');
          return;
        }

        // Step 2: Fetch the file itself and determine its type
        fetch(fileUrl,{
          method: 'GET',
          credentials: 'include',
        })
          .then(response => {
            const contentType = response.headers.get('Content-Type');
            return response.blob().then(blob => ({ contentType, blob }));
          })
          .then(({ contentType, blob }) => {
            if (contentType.includes('text/plain')) {
              blob.text().then(text => setDocumentContent(<pre>{text}</pre>));
            } else if (contentType.includes('image/')) {
              const imageUrl = URL.createObjectURL(blob);
              setDocumentContent(<img src={imageUrl} alt="Document" style={{ maxWidth: '100%' }} />);
            } else if (contentType.includes('application/pdf')) {
              const pdfUrl = URL.createObjectURL(blob);
              setDocumentContent(
                <embed src={pdfUrl} type="application/pdf" width="100%" height="100%" />
              );
            } else if (contentType.includes('text/html')) {
              blob.text().then(html => setDocumentContent(<div dangerouslySetInnerHTML={{ __html: html }} />));
            }
            else {
              setError(`Unsupported file type: ${contentType}`);
            }
          })
          .catch(err => {
            console.error('Error fetching file:', err);
            setError('Error loading file');
          });
      })
      .catch(err => {
        console.error('Error fetching document metadata:', err);
        setError(err.message);
      });
  }, [apiUrl]);

    return (
      <div>
        <div className="content-wrapper">
              <DatasetHeader />
              <div className="flex h-full">
                  <div className="h-full flex-[7] flex-col">
                  <p className='text-green'>Loading document...</p>
                          <div style={{height:window.innerHeight}} className="item-container" >
                         
                              {/* <p style={{color:'black'}}>doc view goes here</p> */}
                              
                              {error ? (
                              <p>{error}</p>
                              ) : documentContent ? (
                              documentContent
                              ) : (
                              <p>Loading document...</p>
                            )}
                                

                          </div>
  
                  </div>
                  <div className="flex-col full  flex-3 bg-white items-start justify-start border-2 border-[whitesmoke] pl-0 w-full">
                  {data && (
                <div className="flex-col mt-[50px] h-full flex-3 bg-white items-start justify-start border-2 border-[whitesmoke] p-[20x] pl-0 w-full">
                  <label className="text-[seagreen] mb-10">Data Properties</label>
                  <div className="flex mb-5">
                    <label style={{ textAlign: 'left' }} className="text-black pd-0">file url</label>
                    <p>{data.file}</p>
                  </div>
                  
                  
                  <div className="flex mb-5">
                    <label style={{ textAlign: 'left' }} className="text-black pd-0">description</label>
                    <p>{data.description}</p>
                  </div>
                  <div className="flex mb-5">
                    <label style={{ textAlign: 'left' }} className="text-black pd-0">date captured</label>
                    <p>{data.date_captured}</p>
                  </div>
                  <div className="flex mb-5">
                    <label style={{ textAlign: 'left' }} className="text-black pd-0">uploaded at</label>
                    <p>{data.uploaded_at}</p>
                  </div>
                </div>
              )}
                      
                  </div>
              </div>
      </div>
  
        
      </div>
    );
  }



  function MapUpdater({ bounds }) {
    const map = useMap();
    useEffect(() => {
      if (bounds) {
        const mapBounds = [
          [bounds[1], bounds[0]], // [minLat, minLon]
          [bounds[3], bounds[2]], // [maxLat, maxLon]
        ];
        map.fitBounds(mapBounds);
        console.log('Map bounds set to:', mapBounds);
      }
    }, [bounds, map]);
    return null;
  }
  

  const IpynbComponent = ({url}) => {
    const [notebook, setNotebook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      fetch(url, {
        method: 'GET',
        credentials: 'include',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch notebook: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setNotebook(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error loading notebook:", err);
          setError(err.message);
          setLoading(false);
        });
    }, [url]);
  
    if (loading) return <p>Loading notebook...</p>;
    if (error) return <p>Error loading notebook: {error}</p>;
    if (!notebook) return <p>No notebook data available</p>;
  
    return (
      <div className="jupyter-notebook-container" style={{
        height: "calc(100% - 30px)",
        overflowY: "auto",
        padding: "10px"
      }}>
        <IpynbRenderer
          ipynb={notebook}
          syntaxTheme="xonokai"
          language="python"
          bgTransparent={true}
          formulaOptions={{
            renderer: "mathjax",
            katex: {
              delimiters: "gitlab",
              katexOptions: {
                fleqn: false,
              },
            }
          }}
        />
      </div>
    );
  };


  export function AnalysisGeospatialDetailView({ data_file_path,tiles_id,isGeoPath,title_type }) {
    const [tileJson, setTileJson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
  
    useEffect(() => {
      
      if (!data_file_path) return;
      console.log("in the analysis component",data_file_path,tiles_id,title_type)
      console.log("path", data_file_path);
      const tile_urls = data_file_path;

      const fetchTileJson = async () => {
        
        const tileJsonDataArray = [];
        for (let i = 0; i < tile_urls.length; i++) { // Fixed loop condition
          const file = tile_urls[i];
          const fileExtension = file.split('.').pop().toLowerCase(); // Use current file
          const isCog = ['cog', 'tif', 'tiff'].includes(fileExtension);
          const isMbtiles = fileExtension === 'mbtiles';
          let tileJsonUrl = null;
          console.log("file",file)
      
          if (isCog) {
            tileJsonUrl = `http://localhost:8001/cog/WebMercatorQuad/tilejson.json?url=${encodeURIComponent(`/media/tiles/${tiles_id}/${file}`)}`;
          } else if (isMbtiles) {
            tileJsonUrl = `http://127.0.0.1:8000/tileserver/${file}/${tiles_id}/tiles`;
          }
      
          console.log('TileJSON URL:', tileJsonUrl);
      
          if (tileJsonUrl) {
            setLoading(true);
            console.log('Fetching TileJSON from:', tileJsonUrl);
            try {
              const res = await fetch(tileJsonUrl, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
              });
              console.log('Response Status:', res.status);
              if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
              const tileJsonData = await res.json();
              console.log('Parsed TileJSON Data:', tileJsonData);
              tileJsonDataArray.push(tileJsonData);
            } catch (error) {
              console.error('TileJSON Fetch Error:', error.message);
              setError(error.message);
            }
            setLoading(false);
          }
        }
        setTileJson(tileJsonDataArray); // Set all TileJSON data at once
      };

      fetchTileJson();
    }, [data_file_path]);
  
    const getTileLayer = () => {
      if (!tileJson || !tileJson.length) return null;
      console.log('TileJSON:', tileJson);
    
      let vectorLayers = [];
      let rasterLayers = [];
      for (let i = 0; i < tileJson.length; i++) { // Fixed loop condition
        const file = data_file_path[i];
        // Get corresponding file for isVector check
        const isVector = tileJson[i].tiles[0].endsWith('.pbf') || tileJson[i].tiles[0].endsWith('.mvt') || file.endsWith('.mbtiles');
        console.log('Is Vector:', isVector);
        if (isVector) {
          vectorLayers.push(
            <VectorTileLayer
              key={`vector-${i}`} // Added key
              url={tileJson[i].tiles[0]}
              attribution={tileJson[i].attribution || ''}
              minZoom={tileJson[i].minzoom}
              maxZoom={tileJson[i].maxzoom}
            />
          );
        } else {
          rasterLayers.push(
            <TileLayer
              key={`raster-${i}`} // Added key
              url={tileJson[i].tiles[0]}
              attribution={tileJson[i].attribution || ''}
              minZoom={tileJson[i].minzoom}
              maxZoom={tileJson[i].maxzoom}
            />
          );
        }
      }

      return [...vectorLayers, ...rasterLayers];
    };
  
    return (
      <div className="h-full w-full  flex-col"> {/* Remove w-[600px], keep h-full */}
         
        <div className="h-full w-full ">
        {title_type}
          {loading ? (
            <p style={{ color: 'black' }}>Loading geospatial data...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>Error: {error}</p>
          ) : tileJson ? (
            <MapContainer
            center={tileJson[0].center ? tileJson[0].center.slice(0, 2) : [0, 0]}
            zoom={tileJson[0].minzoom || 2}
            style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              zIndex={1} // Explicitly set as baselayer
            />
              
              {getTileLayer()}
              <MapUpdater bounds={tileJson[0].bounds} />
              
            </MapContainer>
          ) : (
            <p style={{ color: 'black' }}>No tile data available</p>
          )}
        </div>
      </div>
    );
  }


  export function AnalysisDetailView() {
    const [analysisContent, setAnalysisContent] = useState(null);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isGeoGath, setIsGeoGath] = useState(false);
  
    const { sharedValue: ItemId } = useContext(DetailViewIdContext);
    const apiUrl = `http://localhost:8000/manage-data/get-update-delete-analysis/${ItemId}/`;
  
    // Fetch data
    useEffect(() => {
      fetch(apiUrl, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Document not found');
          }
          return response.json();
        })
        .then(data => {
          setData(data);
          const fileUrl = "http://127.0.0.1:8000" + data.file;
          if (!fileUrl) {
            setError('No file available for this document');
            return;
          }
  
          fetch(fileUrl, {
            method: 'GET',
            credentials: 'include',
          })
            .then(response => {
              const contentType = response.headers.get('Content-Type');
              return response.blob().then(blob => ({ contentType, blob }));
            })
            .then(({ contentType, blob }) => {
              if (contentType.includes('text/plain')) {
                blob.text().then(text => setAnalysisContent(<pre>{text}</pre>));
              } else if (contentType.includes('image/')) {
                const imageUrl = URL.createObjectURL(blob);
                setAnalysisContent(<img src={imageUrl} alt="Document" style={{ maxWidth: '100%' }} />);
              } else if (contentType.includes('application/pdf')) {
                const pdfUrl = URL.createObjectURL(blob);
                setAnalysisContent(<embed src={pdfUrl} type="application/pdf" width="100%" height="100%" />);
              } else if (contentType.includes('text/html')) {
                blob.text().then(html => setAnalysisContent(<div dangerouslySetInnerHTML={{ __html: html }} />));
              } else if (contentType.includes('application/octet-stream')) {
                if (data.file?.endsWith('.ipynb')) {
                  const url = "http://127.0.0.1:8000" + data.file;
                  setAnalysisContent(<IpynbComponent url={url} />);
                }
              } else {
                setError(`Unsupported file type: ${contentType}`);
              }
            })
            .catch(err => {
              console.error('Error fetching file:', err);
              setError('Error loading file');
            });
        })
        .catch(err => {
          console.error('Error fetching document metadata:', err);
          setError(err.message);
        });
    }, [apiUrl]);
  
    // Update isGeoGath based on data
    useEffect(() => {
      if (data) {
        // Define what makes it geospatial (e.g., presence of tile paths)
        const isGeospatial = data.input_tile_paths?.length > 0 || data.output_tile_paths?.length > 0;
        setIsGeoGath(isGeospatial);
        console.log("isGeoGath updated to:", isGeospatial);
      }
    }, [data]);
  
    return (
      <div>
        <div className="content-wrapper">
          <DatasetHeader />
          <div className="flex h-full">
            <div className="h-full flex-[7] flex-col">
              <p className="text-green">Loading document...</p>
              <div className="flex-col h-[500px] item-container">
                <div className="h-full w-full">
                  <h1 className="text-[green]">Analysis Script</h1>
                  {error ? (
                    <p>{error}</p>
                  ) : analysisContent ? (
                    analysisContent
                  ) : (
                    <p>Loading document...</p>
                  )}
                </div>
                {console.log("Geospatial block entered, rendering with data:", data)}
                {isGeoGath ? (
                  <div className="flex mt-0 flex gap-2 w-full h-full">
                    <div className="flex-1 w-full h-full">
                      <AnalysisGeospatialDetailView
                        data_file_path={data.input_tile_paths}
                        tiles_id={data.input_id}
                        title_type={<h1 className="text-[green]">Input Data</h1>}
                      />
                    </div>
                    <div className="flex-1 h-full">
                      <AnalysisGeospatialDetailView
                        data_file_path={data.output_tile_paths}
                        tiles_id={data.output_id}
                        title_type={<h1 className="text-[green]">Output Data</h1>}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex-col full flex-3 bg-white items-start justify-start border-2 border-[whitesmoke] pl-0 w-full">
              {data && (
                <div className="flex-col mt-[50px] h-full flex-3 bg-white items-start justify-start border-2 border-[whitesmoke] p-[20x] pl-0 w-full">
                  <label className="text-[seagreen] mb-10">Data Properties</label>
                  <div className="flex mb-5">
                    <label style={{ textAlign: 'left' }} className="text-black pd-0">file url</label>
                    <p>{data.file}</p>
                  </div>
                  <div className="flex mb-5">
                    <label style={{ textAlign: 'left' }} className="text-black pd-0">description</label>
                    <p>{data.description}</p>
                  </div>
                  <div className="flex mb-5">
                    <label style={{ textAlign: 'left' }} className="text-black pd-0">date captured</label>
                    <p>{data.date_captured}</p>
                  </div>
                  <div className="flex mb-5">
                    <label style={{ textAlign: 'left' }} className="text-black pd-0">uploaded at</label>
                    <p>{data.uploaded_at}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }



  


  


  // function MapUpdater({ bounds }) {
  //   const map = useMap();
  //   useEffect(() => {
  //     if (bounds) {
  //       map.fitBounds([
  //         [bounds[1], bounds[0]], // [minLat, minLon]
  //         [bounds[3], bounds[2]], // [maxLat, maxLon]
  //       ]);
  //     }
  //   }, [bounds, map]);
  //   return null;
  // }
  
  // export function GeospatialDetailView() {
  //   const [data, setData] = useState(null);
  //   const [tileJson, setTileJson] = useState(null);
  //   const hasFetched = useRef(false);
  
  //   async function fetchGeospatialData(id) {
  //     try {
  //       const response = await fetch(
  //         `http://127.0.0.1:8000/manage-data/get-update-delete-geospatial/${id}/`,
  //         {
  //           method: 'GET',
  //           credentials: 'include',
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  
  //       if (!response.ok) {
  //         if (response.status === 404) {
  //           console.log("Geospatial data with id", id, "not found");
  //         }
  //         return null;
  //       }
  
  //       const data = await response.json();
  //       setData(data);
  //       return data;
  //     } catch (error) {
  //       console.error('Authorization Error:', error.message);
  //       return null;
  //     }
  //   }
  
  //   useEffect(() => {
  //     async function handleFetch() {
  //       if (hasFetched.current) return;
  //       hasFetched.current = true;
  
  //       const geo_id = 189; // Updated to match tiles/205
  //       await fetchGeospatialData(geo_id);
  //     }
  //     handleFetch();
  //   }, []);
  
  //   let tileJsonUrl = null
  //   const is_cog = data.file.split('.').at(-1)==="cog"

  //   if(data && is_cog){
  //     tileJsonUrl=`http://localhost:8001/cog/WebMercatorQuad/tilejson.json?url=${encodeURIComponent(data.file)}`
      
  //   }else if (!cog){
      


  //   }
  
  //   useEffect(() => {
  //     if (tileJsonUrl) {
  //       console.log('Fetching TileJSON from:', tileJsonUrl);
  //       fetch(tileJsonUrl, {
  //         method: 'GET',
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       })
  //         .then((res) => {
  //           console.log('Response Status:', res.status);
  //           return res.text().then((text) => ({ status: res.status, text }));
  //         })
  //         .then(({ status, text }) => {
  //           console.log('Raw TileJSON Response:', text);
  //           if (status !== 200) {
  //             throw new Error(`TileJSON fetch failed with status: ${status}`);
  //           }
  //           try {
  //             const tileJsonData = JSON.parse(text);
  //             console.log('Parsed TileJSON Data:', tileJsonData);
  //             setTileJson(tileJsonData);
  //           } catch (e) {
  //             throw new Error(`JSON Parse Error: ${e.message}`);
  //           }
  //         })
  //         .catch((error) => {
  //           console.error('TileJSON Fetch Error:', error);
  //         });
  //     }
  //   }, [tileJsonUrl]);
  
  //   return (
  //     <div>
  //       <div className="content-wrapper">
  //         <DatasetHeader />
  //         <div className="w-full flex-[7] flex-col">
  //           <div className="flex">
  //             <div className="flex-[7] item-container" style={{ height: '500px' }}>
  //               {tileJson ? (
  //                 <MapContainer
  //                   center={tileJson.center.slice(0, 2)} // [lat, lon]
  //                   zoom={tileJson.center[2]} // Initial zoom from TileJSON
  //                   style={{ height: '100%', width: '100%' }}
  //                 >
  //                   <TileLayer
  //                     url={tileJson.tiles[0].replace('@1x', '')} // Remove @1x for Leaflet compatibility
  //                     attribution="Rendered with TiTiler"
  //                     minZoom={tileJson.minzoom}
  //                     maxZoom={tileJson.maxzoom}
  //                   />
  //                   <MapUpdater bounds={tileJson.bounds} />
  //                 </MapContainer>
  //               ) : (
  //                 <p style={{ color: 'black' }}>
  //                   {data ? 'Loading raster...' : 'Fetching data...'}
  //                 </p>
  //               )}
  //             </div>
  //             {data ? (
  //               <div className="flex-col mt-[50px] flex-3 bg-white items-start justify-start border-2 border-[whitesmoke] pl-0 w-full">
  //                 <label className="text-[seagreen] mb-10" htmlFor="">
  //                   Data Properties
  //                 </label>
  //                 <div className="flex mb-5">
  //                   <label style={{ textAlign: 'left' }} className="text-black pd-0">
  //                     file url
  //                   </label>{' '}
  //                   <p>{data.file}</p>
  //                 </div>
  //                 <div className="flex mb-5">
  //                   <label style={{ textAlign: 'left' }} className="text-black pd-0">
  //                     type of data
  //                   </label>{' '}
  //                   <p>{data.type_of_data}</p>
  //                 </div>
  //                 <div className="flex mb-5">
  //                   <label style={{ textAlign: 'left' }} className="text-black pd-0">
  //                     data type
  //                   </label>{' '}
  //                   <p>{data.data_type}</p>
  //                 </div>
  //                 <div className="flex mb-5">
  //                   <label style={{ textAlign: 'left' }} className="text-black pd-0">
  //                     description
  //                   </label>{' '}
  //                   <p>{data.description}</p>
  //                 </div>
  //                 <div className="flex mb-5">
  //                   <label style={{ textAlign: 'left' }} className="text-black pd-0">
  //                     date captured
  //                   </label>{' '}
  //                   <p>{data.date_captured}</p>
  //                 </div>
  //               </div>
  //             ) : (
  //               <p>no data found</p>
  //             )}
  //           </div>
  //           <div className="flex-3 h-64 overflow-y-auto">
  //             <p style={{ color: 'black' }}>How to Read Data in Notebook</p>
  //             {/* Add notebook instructions if needed */}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }


  // function MapUpdater({ bounds }) {
  //   const map = useMap();
  //   useEffect(() => {
  //     if (bounds) {
  //       const mapBounds = [
  //         [bounds[1], bounds[0]], // [minLat, minLon]
  //         [bounds[3], bounds[2]], // [maxLat, maxLon]
  //       ];
  //       map.fitBounds(mapBounds);
  //       // map.setMaxBounds(mapBounds); // Lock panning
  //       // map.setMinZoom(6);
  //       // map.setMaxZoom(18);
  //       console.log('Map bounds set to:', mapBounds);
  //     }
  //   }, [bounds, map]);
  //   return null;
  // }
  
  export function GeospatialDetailView() {
    const [data, setData] = useState(null);
    const [tileJson, setTileJson] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasFetched = useRef(false);
    const { sharedValue: ItemId } = useContext(DetailViewIdContext);

    async function fetchGeospatialData(id) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/manage-data/get-update-delete-geospatial/${id}/`,
          {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (!response.ok) {
          console.log('Geospatial data with id', id, response.status === 404 ? 'not found' : 'error');
          return null;
        }
        const data = await response.json();
        setData(data);
        return data;
      } catch (error) {
        console.error('Authorization Error:', error.message);
        setError(error.message);
        return null;
      }
    }
  
    useEffect(() => {
      async function handleFetch() {
        if (hasFetched.current) return;
        hasFetched.current = true;
      
        await fetchGeospatialData(ItemId);
        setLoading(false);
      }
      handleFetch();
    }, [ItemId]); // Added ItemId to dependency array
  
    useEffect(() => {
      if (!data || !data.tile_paths) return;
      console.log("path", data.tile_paths);
      const tile_urls = data.tile_paths;

      const fetchTileJson = async () => {
        const tileJsonDataArray = [];
        for (let i = 0; i < tile_urls.length; i++) { // Fixed loop condition
          const file = tile_urls[i];
          const fileExtension = file.split('.').pop().toLowerCase(); // Use current file
          const isCog = ['cog', 'tif', 'tiff'].includes(fileExtension);
          const isMbtiles = fileExtension === 'mbtiles';
          let tileJsonUrl = null;
          console.log("file",file)
      
          if (isCog) {
            tileJsonUrl = `http://localhost:8001/cog/WebMercatorQuad/tilejson.json?url=${encodeURIComponent(`/media/tiles/${data.id}/${file}`)}`;
          } else if (isMbtiles) {
            tileJsonUrl = `http://127.0.0.1:8000/tileserver/${file}/${data.id}/tiles`;
          }
      
          console.log('TileJSON URL:', tileJsonUrl);
      
          if (tileJsonUrl) {
            setLoading(true);
            console.log('Fetching TileJSON from:', tileJsonUrl);
            try {
              const res = await fetch(tileJsonUrl, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
              });
              console.log('Response Status:', res.status);
              if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
              const tileJsonData = await res.json();
              console.log('Parsed TileJSON Data:', tileJsonData);
              tileJsonDataArray.push(tileJsonData);
            } catch (error) {
              console.error('TileJSON Fetch Error:', error.message);
              setError(error.message);
            }
            setLoading(false);
          }
        }
        setTileJson(tileJsonDataArray); // Set all TileJSON data at once
      };

      fetchTileJson();
    }, [data]);
  
    const getTileLayer = () => {
      if (!tileJson || !tileJson.length) return null;
      console.log('TileJSON:', tileJson);
    
      let vectorLayers = [];
      let rasterLayers = [];
      for (let i = 0; i < tileJson.length; i++) { // Fixed loop condition
        const file = data.tile_paths[i]; // Get corresponding file for isVector check
        const isVector = tileJson[i].tiles[0].endsWith('.pbf') || tileJson[i].tiles[0].endsWith('.mvt') || file.endsWith('.mbtiles');
        console.log('Is Vector:', isVector);
        if (isVector) {
          vectorLayers.push(
            <VectorTileLayer
              key={`vector-${i}`} // Added key
              url={tileJson[i].tiles[0]}
              attribution={tileJson[i].attribution || ''}
              minZoom={tileJson[i].minzoom}
              maxZoom={tileJson[i].maxzoom}
            />
          );
        } else {
          rasterLayers.push(
            <TileLayer
              key={`raster-${i}`} // Added key
              url={tileJson[i].tiles[0]}
              attribution={tileJson[i].attribution || ''}
              minZoom={tileJson[i].minzoom}
              maxZoom={tileJson[i].maxzoom}
            />
          );
        }
      }

      return [...vectorLayers, ...rasterLayers];
    };
  
    return (
      <div>
        <div className="content-wrapper">
          <DatasetHeader />
          <div className="w-full flex-[7] flex-col">
            <div className="flex">
              <div className="flex-[7] item-container" style={{ height: '500px' }}>
                {loading ? (
                  <p style={{ color: 'black' }}>Loading geospatial data...</p>
                ) : error ? (
                  <p style={{ color: 'red' }}>Error: {error}</p>
                ) : tileJson && tileJson.length > 0 ? (
                  <MapContainer
                    center={tileJson[0].center.slice(0, 2)} // Fixed index
                    zoom={tileJson[0].minzoom} // Fixed index
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      zIndex={1} // Explicitly set as baselayer
                    />
                    {getTileLayer()}
                    <MapUpdater bounds={tileJson[0].bounds} />
                  </MapContainer>
                ) : (
                  <p style={{ color: 'black' }}>No tile data available</p>
                )}
              </div>
              {data && (
                <div className="flex-col mt-[50px] flex-3 bg-white items-start justify-start border-2 border-[whitesmoke] pl-0 w-full">
                  <label className="text-[seagreen] mb-10">Data Properties</label>
                  <div className="flex mb-5">
                    <label style={{ textAlign: 'left' }} className="text-black pd-0">file url</label>
                    <p>{data.file}</p>
                  </div>
                  <div className="flex mb-5">
                    <label style={{ textAlign: 'left' }} className="text-black pd-0">type of data</label>
                    <p>{data.type_of_data}</p>
                  </div>
                  <div className="flex mb-5">
                    <label style={{ textAlign: 'left' }} className="text-black pd-0">data type</label>
                    <p>{data.data_type}</p>
                  </div>
                  <div className="flex mb-5">
                    <label style={{ textAlign: 'left' }} className="text-black pd-0">description</label>
                    <p>{data.description}</p>
                  </div>
                  <div className="flex mb-5">
                    <label style={{ textAlign: 'left' }} className="text-black pd-0">date captured</label>
                    <p>{data.date_captured}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-3 h-64 overflow-y-auto">
              <p style={{ color: 'black' }}>How to Read Data in Notebook</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
import './DetailView.css';
import DatasetHeader from './DatasetHeader';
import React, { useEffect, useContext, useState, useRef } from 'react';
import { MapContainer, TileLayer ,useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import VectorTileLayer from './CustomVectorTileLayer';

export function MapDetailView() {
    

  return (
    <div>
      <div className="content-wrapper">
            <DatasetHeader />
            <div className="flex">
                <div className="w-full flex-[7] flex-col">
                        <div className=" item-container" >
                            <p style={{color:'black'}}>doc view goes here</p>
                        
                        </div>

                </div>
                <div className="flex-col mt-[50px] flex-3 bg-white items-start justify-start border-2 border-[whitesmoke] pl-0 w-full">
                    <p>property view goes here</p>
                    
                </div>
            </div>
    </div>

      
    </div>
  );
}



export function DocumentDetailView() {

    return (
      <div>
        <div className="content-wrapper">
              <DatasetHeader />
              <div className="flex">
                  <div className="w-full flex-[7] flex-col">
                          <div className=" item-container" >
                              <p style={{color:'black'}}>doc view goes here</p>
                          
                          </div>
  
                  </div>
                  <div className="flex-col mt-[50px] flex-3 bg-white items-start justify-start border-2 border-[whitesmoke] pl-0 w-full">
                      <p>property view goes here</p>
                      
                  </div>
              </div>
      </div>
  
        
      </div>
    );
  }


  export function AnalysisDetailView() {

    return (
      <div>
        <div className="content-wrapper">
              <DatasetHeader />
              <div className="flex">
                  <div className="w-full flex-[7] flex-col">
                          <div className=" item-container" >
                              <p style={{color:'black'}}>doc view goes here</p>
                          
                          </div>
  
                  </div>
                  <div className="flex-col mt-[50px] flex-3 bg-white items-start justify-start border-2 border-[whitesmoke] pl-0 w-full">
                      <p>property view goes here</p>
                      
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


  function MapUpdater({ bounds }) {
    const map = useMap();
    useEffect(() => {
      if (bounds) {
        const mapBounds = [
          [bounds[1], bounds[0]], // [minLat, minLon]
          [bounds[3], bounds[2]], // [maxLat, maxLon]
        ];
        map.fitBounds(mapBounds);
        // map.setMaxBounds(mapBounds); // Lock panning
        // map.setMinZoom(6);
        // map.setMaxZoom(18);
        console.log('Map bounds set to:', mapBounds);
      }
    }, [bounds, map]);
    return null;
  }
  
  export function GeospatialDetailView() {
    const [data, setData] = useState(null);
    const [tileJson, setTileJson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasFetched = useRef(false);
  
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
        const geoId = 207; // Replace with dynamic ID if needed
        await fetchGeospatialData(geoId);
        setLoading(false);
      }
      handleFetch();
    }, []);
  
    useEffect(() => {
      if (!data) return;
  
      const fileExtension = data.file.split('.').pop().toLowerCase();
      const isCog = ['cog', 'tif', 'tiff'].includes(fileExtension);
      const isMbtiles = fileExtension === 'mbtiles';
      let tileJsonUrl = null;
  
      if (isCog) {
        tileJsonUrl = `http://localhost:8001/cog/WebMercatorQuad/tilejson.json?url=${encodeURIComponent(data.file)}`;
      } else if (isMbtiles) {
        const userId = data.file.match(/\/media\/tiles\/(\d+)\/tiles\.mbtiles/)?.[1];
        console.log('Extracted userId:', userId);
        if (userId) {
          tileJsonUrl = `http://127.0.0.1:8000/tileserver/${userId}/tiles`;
        }
      }
  
      console.log('TileJSON URL:', tileJsonUrl);
  
      if (tileJsonUrl) {
        setLoading(true);
        console.log('Fetching TileJSON from:', tileJsonUrl);
        fetch(tileJsonUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })
          .then((res) => {
            console.log('Response Status:', res.status);
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
          })
          .then((tileJsonData) => {
            console.log('Parsed TileJSON Data:', tileJsonData);
            setTileJson(tileJsonData);
            setLoading(false);
          })
          .catch((error) => {
            console.error('TileJSON Fetch Error:', error.message);
            setError(error.message);
            setLoading(false);
          });
      }
    }, [data]);
  
    const getTileLayer = () => {
      if (!tileJson) return null;
      console.log('TileJSON:', tileJson);
    
      const isVector = tileJson.tiles[0].endsWith('.pbf') || tileJson.tiles[0].endsWith('.mvt') || data.file.endsWith('.mbtiles');
      console.log('Is Vector:', isVector);
    
      if (isVector) {
        return (
          <VectorTileLayer
            url={tileJson.tiles[0]}
            attribution={tileJson.attribution || ''}
            minZoom={tileJson.minzoom}
            maxZoom={tileJson.maxzoom}
          />
        );
      } else {
        return (
          <TileLayer
            url={tileJson.tiles[0]}
            attribution={tileJson.attribution || ''}
            minZoom={tileJson.minzoom}
            maxZoom={tileJson.maxzoom}
          />
        );
      }
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
                ) : tileJson ? (
                  <MapContainer
                    center={tileJson.center.slice(0, 2)}
                    zoom={tileJson.minzoom}
                    style={{ height: '100%', width: '100%' }}
                  >
                    {getTileLayer()}
                    <MapUpdater bounds={tileJson.bounds} />
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
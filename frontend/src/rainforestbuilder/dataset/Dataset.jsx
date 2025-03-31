import './Dataset.css';
import DatasetHeader from './DatasetHeader';
import ItemsCard from './ItemsCard';
import React, { useEffect, useContext, useState, useRef } from 'react';
import { CategoryOfDataClickedContext } from '../../utils/context';
import Modal from '../../utils/Modal';
import { GeospatialDataUpload, DocumentDataUpload, MapDataUpload } from './Uploads';
import FormSlider from './FormSlider';

function DatasetView() {
  const { sharedValue: buttonText } = useContext(CategoryOfDataClickedContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef(null);
  const currentUrl = useRef(null);
  const lastFetchedPage = useRef(0);
  const isFetching = useRef(false); // Prevent concurrent fetches

  const fetchData = async (pageNum, url) => {
    if (isFetching.current || pageNum <= lastFetchedPage.current) {
      console.log(`Fetch skipped: fetching=${isFetching.current}, page=${pageNum}, lastFetched=${lastFetchedPage.current}`);
      return;
    }
    isFetching.current = true;
    console.log(`Fetching: ${url}/?page=${pageNum}&page_size=20`);
    setLoading(true);
    try {
      const response = await fetch(`${url}/?page=${pageNum}&page_size=20`, {
        method: 'GET',
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }
      const result = await response.json();
      console.log('Response:', result);
      console.log('Raw data:', result.data);
  
      const newData = result.data || [];
      console.log('New data before filter:', newData.length);
  
      // Only filter duplicates if we're appending to existing data (not on page 1)
      const filteredData = pageNum === 1 
        ? newData 
        : newData.filter(newItem => 
            !data.some(existingItem => existingItem.id === newItem.id && existingItem.type === newItem.type)
          );
      console.log('Filtered data:', filteredData.length);
  
      setData((prevData) => {
        const updatedData = pageNum === 1 ? filteredData : [...prevData, ...filteredData];
        console.log('Updated data:', updatedData);
        return updatedData;
      });
  
      setHasNext(result.has_next || false);
      if (filteredData.length > 0 && result.current_page === pageNum) {
        setPage(pageNum + 1);
        lastFetchedPage.current = pageNum;
        console.log(`Page set to: ${pageNum + 1}`);
      } else {
        console.log('No new data added or page mismatch');
      }
    } catch (error) {
      console.error('Fetch error:', error.message);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    console.log('buttonText changed to:', buttonText);
  
    // Reset state fully
    setData([]);
    setPage(1);
    setHasNext(true);
    setLoading(false);
    lastFetchedPage.current = 0;
    isFetching.current = false;
  
    let url;
    switch (buttonText) {
      case "Geospatial Datasets":
        url = "http://127.0.0.1:8000/manage-data/geospatial-data";
        break;
      case "Maps":
        url = "http://127.0.0.1:8000/manage-data/map-data";
        break;
      case "Documents":
        url = "http://127.0.0.1:8000/manage-data/document-data";
        break;
      case "Analysis Assets":
        url = "http://127.0.0.1:8000/manage-data/analysis-data";
        break;
      default:
        url = "http://127.0.0.1:8000/manage-data/all-data";
    }
  
    currentUrl.current = url;
    fetchData(1, url);
  
    return () => {
      isFetching.current = false; // Cleanup
    };
  }, [buttonText]);

  useEffect(() => {
    const fetchNextPage = async () => {
      if (!hasNext || loading || !currentUrl.current || page <= lastFetchedPage.current) {
        console.log(`Fetch skipped: hasNext=${hasNext}, loading=${loading}, url=${currentUrl.current}, page=${page}, lastFetched=${lastFetchedPage.current}`);
        return;
      }
      fetchData(page, currentUrl.current);
    };
  
    let timeoutId;
    const handleScroll = () => {
      const grid = gridRef.current;
      if (!grid || !hasNext || loading || !currentUrl.current) {
        console.log(`Scroll skipped: grid=${!!grid}, hasNext=${hasNext}, loading=${loading}, url=${currentUrl.current}`);
        return;
      }
  
      const { scrollTop, scrollHeight, clientHeight } = grid;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          console.log('Scroll triggered, fetching page:', page);
          fetchNextPage();
        }, 300); // Debounce scroll-triggered fetches
      }
    };
  
    const grid = gridRef.current;
    if (grid) {
      grid.removeEventListener('scroll', handleScroll);
      grid.addEventListener('scroll', handleScroll);
      console.log('Scroll listener attached for:', currentUrl.current);
    }
  
    return () => {
      if (grid) {
        grid.removeEventListener('scroll', handleScroll);
        console.log('Scroll listener removed');
      }
      clearTimeout(timeoutId);
    };
  }, [hasNext, loading, page, buttonText]); // Add buttonText as a dependency

  const handleUploadChange = (e) => {
    const value = e.target.value;
    console.log("Upload selected:", value);

    let content;
    switch (value) {
      case 'Geospatia':
        content = <GeospatialDataUpload />;
        break;
      case 'Documents':
        content = <DocumentDataUpload />;
        break;
      case 'Analysis Assets':
        content = <FormSlider />;
        break;
      case 'Maps':
        content = <MapDataUpload />;
        break;
      default:
        content = null;
    }

    if (content) {
      setModalContent(content);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <div>
      <div className="content-wrapper">
        <DatasetHeader />
        <div className="flex">
          <div className="flex-col mt-[50px] flex-1 bg-white items-start justify-start border-2 border-[whitesmoke] pl-0 w-full">
            <h1 style={{ color: 'seagreen', marginBottom: '30px', marginTop: '20px', width: '100%' }}>
              Advanced Filtering
            </h1>
            <label className="mr-[100%] pl-0 self-start" style={{ color: 'black' }} htmlFor="">
              Start Date
            </label>
            <input className="mb-[30px]" type="date" />
            <label className="mr-[100%]" style={{ color: 'black' }} htmlFor="">
              End Date
            </label>
            <input className="mb-[30px]" type="date" />
            <button style={{ backgroundColor: 'seagreen', color: 'white', padding: '10px 20px', borderRadius: '5px' }}>
              Query
            </button>
            <p>map search will come here</p>
          </div>

          <div className="w-full flex-[8] flex-col">
            <div
              style={{
                zIndex: '20',
                alignSelf: 'center',
                textAlign: 'center',
                padding: '10px 0',
                marginTop: 50,
                width: '84vw',
                backgroundColor: 'white',
                border: '1px solid whitesmoke',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  alignSelf: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  marginLeft: '10px',
                }}
              >
                <button
                  style={{
                    background: 'seagreen',
                    width: '100px',
                    height: '50px',
                    borderRadius: '10px',
                    color: 'white',
                  }}
                >
                  Filter
                </button>
                <input
                  placeholder="search item"
                  style={{
                    marginLeft: '250px',
                    width: '700px',
                    height: '40px',
                    border: '1px solid green',
                    color: 'black',
                    borderRadius: '10px',
                  }}
                />
              </div>

              <div style={{ marginLeft: 'auto', marginRight: '10px' }}>
                <select
                  onChange={handleUploadChange}
                  className="upload_select"
                  style={{
                    margin: 0,
                    background: 'seagreen',
                    width: '150px',
                    height: '50px',
                    color: 'white',
                    borderRadius: '10px',
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Upload
                  </option>
                  <option value="Geospatia">Geospatial</option>
                  <option value="Documents">Documents</option>
                  <option value="Analysis Assets">Analysis Assets</option>
                  <option value="Maps">Maps</option>
                </select>
              </div>
            </div>

            <div className="flex-[9] grid-container" ref={gridRef} key={buttonText}>
              {data.length > 0 ? (
                data.map((item) => (
                  <ItemsCard key={`${item.type}-${item.id}`} item={item} />
                ))
              ) : (
                <p style={{ textAlign: 'center', color: 'seagreen' }}>
                  No data available for {buttonText}
                </p>
              )}
              {loading && <p style={{ textAlign: 'center', color: 'seagreen' }}>Loading...</p>}
            </div>

            <p style={{ alignSelf: 'center', color: 'seagreen', marginLeft: '40%', marginTop: '10px' }}>
              {buttonText}
            </p>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
}

export default DatasetView;
import './Dataset.css';
import DatasetHeader from './DatasetHeader';
import ItemsCard from './ItemsCard';
import React, { useEffect, useContext, useState, useRef } from 'react';
import { CategoryOfDataClickedContext} from '../../utils/context';
import { useNavigate,useLocation} from 'react-router-dom';
import Modal from '../../utils/Modal';
import { GeospatialDataUpload, DocumentDataUpload, MapDataUpload } from './Uploads';
import FormSlider from './FormSlider';

const copyToClipboard = async (text) => {
  try {
    // Check if we're in a secure context and clipboard API is available
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      alert("Link copied to clipboard!");
      return;
    }
    
    // For insecure contexts or when clipboard API is not available
    // Use the selection API approach
    if (window.getSelection) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'absolute';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      textArea.setAttribute('readonly', '');
      textArea.style.fontSize = '12pt'; // Prevent zooming on iOS
      
      document.body.appendChild(textArea);
      
      // Select the text
      textArea.select();
      textArea.setSelectionRange(0, 99999); // For mobile devices
      
      // Try to copy using the modern approach first
      try {
        const successful = await navigator.clipboard.writeText(text);
        alert("Link copied to clipboard!");
      } catch (clipboardErr) {
        // If modern clipboard fails, inform user to copy manually
        textArea.focus();
        alert("Please manually copy the selected text (Ctrl+C or Cmd+C)");
      }
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(textArea);
      }, 100);
      
      return;
    }
    
    // Final fallback - show in prompt
    prompt('Copy this link manually:', text);
    
  } catch (err) {
    console.error('Copy to clipboard failed:', err);
    prompt('Copy this link manually:', text);
  }
};


function DatasetView() {
  const { sharedValue: buttonText } = useContext(CategoryOfDataClickedContext);
  const [ search_query, setSearch_Query] = useState('')
  const [shareItemLink,setShareItemLink]  =useState('')

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

    const navigate = useNavigate()
    const location = useLocation();


  const handleValueChange = (event) => {
    setSearch_Query(event.target.value);
};


const handleKeyDown = async(event) => {
  
  if (event.key === 'Enter') {
    event.preventDefault();
    let url=''
    if (buttonText ==="Geospatial Datasets"){
      url = "http://192.168.1.200:8000/manage-data/semantic-search-geospatial/";
    }
    if (buttonText ==="Maps"){
      url = "http://192.168.1.200:8000/manage-data/semantic-search-map/";
      
    }
    if (buttonText ==="Analysis Assets"){
      url = "http://192.168.1.200:8000/manage-data/semantic-search-analysis/";
    }
    if (buttonText ==="Documents"){
      url = "http://192.168.1.200:8000/manage-data/semantic-search-document/";
      
    }

    if (buttonText ==="All"){
      url = "http://192.168.1.200:8000/manage-data/semantic-search-all/";
      
    }

       if (search_query){
        
          
          // setError(null); // Clear previous errors
          try {
            const response = await fetch(
              url,
              {
                method: 'POST',
                credentials: 'include', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  search_query 
                  
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
              console.log('Submission failed:', response.status, errorData.error || 'Unknown error');
              // setError(errorData.error || 'Login failed');
              return null;
            }
      
            // Parse JSON only if response is OK
            const result = JSON.parse(rawResponse);
          
            setData(result.data || [])
            
            // setError(null);
            console.log('Login successful:', data);
            return data;
          } catch (error) {
            console.error('Fetch Error:', error.message);
            setError(`Network error: ${error.message}`);
            return null;
          }
        };

       } 



}

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
    // This will set the CSRF cookie
    async function fetchisAuthData(){
    const response=await fetch('http://192.168.1.200:8000/manage-data/is_user_authenticated/',  {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      // alert("User is Logged out, Redirecting to login");
      navigate('/login-user', { state: { from: window.location.pathname } });
      // return null;
    }
    // const data = await response.json();
    console.log("User is Logged In")
  }

  fetchisAuthData()
  
  }, []);

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

  if (buttonText === "Geospatial Datasets" && !search_query) {
    url = "http://192.168.1.200:8000/manage-data/geospatial-data";
  } else if (buttonText === "Maps"  && !search_query) {
    url = "http://192.168.1.200:8000/manage-data/map-data";
  } else if (buttonText === "Documents" && !search_query) {
    url = "http://192.168.1.200:8000/manage-data/document-data";
  } else if (buttonText === "Analysis Assets" && !search_query) {
    url = "http://192.168.1.200:8000/manage-data/analysis-data";
  } else if (buttonText==="All" && !search_query) {
    url = "http://192.168.1.200:8000/manage-data/all-data";
  }

  else if (buttonText === "Geospatial Datasets" && search_query) {
    url = "http://192.168.1.200:8000/manage-data/semantic-search-geospatial/";
  } 
  else if (buttonText === "Maps"  && search_query) {
    url = "http://192.168.1.200:8000/manage-data/semantic-search-map";
  } else if (buttonText === "Documents" && search_query) {
    url = "http://192.168.1.200:8000/manage-data/semantic-search-document";
  } else if (buttonText === "Analysis Assets" && search_query) {
    url = "http://192.168.1.200:8000/manage-data/semantic-search-analysis";
  } else if (buttonText==="All" && search_query) {
    url = "http://192.168.1.200:8000/manage-data/semantic-search-all";
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

  useEffect(() => {
  if (shareItemLink) {
    console.log("shareItemLink updated:", shareItemLink);
    setModalContent(
      <div>
        <p>Share this link:</p>
        <input
          type="text"
          value={shareItemLink}
          readOnly
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          onClick={(e) => e.target.select()} // Select text on click for easy copying
        />
        <button
          onClick={() => copyToClipboard(shareItemLink)}
          style={{ backgroundColor: 'seagreen', color: 'white', padding: '8px 16px', borderRadius: '5px' }}
        >
          Copy Link
        </button>
      </div>
    );
    setIsModalOpen(true);
  }
}, [shareItemLink]);

  return (
    <div>
      <div className="content-wrapper">
        <DatasetHeader />
        <div className="flex">
          
          <div className="w-full flex-1 flex-col">
            <div
              style={{
            zIndex: '20',
            margin: '50px auto 0 auto', // Centers the container horizontally
            textAlign: 'center',
            padding: '10px 0',
            width: '84vw',
            maxWidth: '1200px', // Optional: set max width for very large screens
            backgroundColor: 'white',
            // border: '1px solid whitesmoke',
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
                  gap: '100px',
                  // marginLeft: '30px',
                  // marginRight: '30px',
                }}
              >
                <button
                  style={{
                    background: 'seagreen',
                    width: '100px',
                    height: '50px',
                    borderRadius: '10px',
                    color: 'white',
                    // marginRight:'10vw'
                  }}
                >
                  Filter
                </button>
                <input
                  placeholder="AI Search"
                  value={search_query}
                  onChange={handleValueChange}
                  onKeyDown={handleKeyDown}
                  style={{
                    // marginLeft: '250pxmarginLeft: '250px',',
                    
                    width: '700px',
                    height: '40px',
                    border: '1px solid green',
                    color: 'black',
                    borderRadius: '10px',
                  }}
                />

                <div style={{}}>
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

              
            </div>

            <div className="flex-[9] grid-container" ref={gridRef} key={buttonText}>
              {data.length > 0 ? (
                data.map((item) => (
                  <ItemsCard key={`${item.type}-${item.id}`} item={item} setShareItemLink={setShareItemLink} />
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
import React, { useContext, useEffect, useState } from 'react';
import { DetailViewIdContext } from '../../utils/context';
import { useNavigate } from 'react-router-dom';

export function ItemsCard({ item }) {
  const { setSharedValue } = useContext(DetailViewIdContext);
  const [thumbnailCards, setThumbnailCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Reset thumbnailCards state to avoid stale data
    setThumbnailCards([]);

    // Check if item has tile_paths and process them
    if (item.type === 'geospatial' && item.tile_paths && Array.isArray(item.tile_paths)) {
      console.log("Yes it is geospatial");
      
      // Create a separate card for each tile path
      const cards = item.tile_paths.map((filePath, index) => {
        const fileExtension = filePath.split('.').pop().toLowerCase();
        const isCog = ['cog', 'tif', 'tiff'].includes(fileExtension);
        const isMbtiles = fileExtension === 'mbtiles';
        let thumbnailSrc = '';

        if (isMbtiles) {
          thumbnailSrc = `http://127.0.0.1:8000/media/thumbnails/${item.id}/${filePath}_thumb.jpg`;
        } else if (isCog) {
          thumbnailSrc = `http://localhost:8001/cog/preview.png?url=${encodeURIComponent(`/media/tiles/${item.id}/${filePath}`)}`;
        } else {
          return null; // Skip if neither mbtiles nor COG
        }

        // Return a single card object with all necessary data
        return {
          id: `${item.id}-${index}`,
          title: `${item.file ? item.file.split('/').pop() : 'Untitled'} - Tile ${index + 1}`,
          description: item.description || 'No description available',
          thumbnailSrc,
          fileType: fileExtension,
          originalItemId: item.id,
          originalItemType: item.type
        };
      }).filter(Boolean); // Remove null entries

      setThumbnailCards(cards);
    } else if (item.file) {
      // Handle non-geospatial types (e.g., py, ipynb)
      const fileExtension = item.file.split('.').pop().toLowerCase();
      let thumbnailSrc = '';

      if (fileExtension === 'py') {
        thumbnailSrc = 'https://i.pinimg.com/474x/dd/86/e1/dd86e167a140b312fff9f1a86ae2762e.jpg';
      } else if (fileExtension === 'ipynb') {
        thumbnailSrc = 'https://i.pinimg.com/236x/50/51/e2/5051e2f0d89fa913ab0f394d1e6464be.jpg';
      }
      else if (item.thumbnail){
        thumbnailSrc = `http://127.0.0.1:8000/media/${item.thumbnail}`;
      }

      // Create a single card for non-geospatial item
      setThumbnailCards([{
        id: item.id,
        title: item.file ? item.file.split('/').pop() : 'Untitled',
        description: item.description || 'No description available',
        thumbnailSrc,
        fileType: fileExtension,
        originalItemId: item.id,
        originalItemType: item.type
      }]);
    }
  }, [item]); // Depend on the entire item object

  const handleButtonOnClick = (event, cardData) => {
    event.stopPropagation();
    const buttonText = event.target.innerText.trim();
    console.log('Button clicked:', buttonText, 'Item type:', cardData.originalItemType);

    if (buttonText === 'view') {
      const itemType = cardData.originalItemType || '';
      console.log('View clicked for item type:', itemType);
      setSharedValue(cardData.originalItemId);
      if (itemType === 'map') {
        setTimeout(() => navigate('/map-detail-view'), 0);
      } else if (itemType === 'geospatial') {
        setTimeout(() => navigate('/geo-detail-view'), 0);
      } else if (itemType === 'analysis') {
        setTimeout(() => navigate('/analysis-detail-view'), 0);
      } else if (itemType === 'document') {
        setTimeout(() => navigate('/doc-detail-view'), 0);
      } else {
        console.log('Unknown item type:', itemType);
      }
    } else if (buttonText === 'download') {
      console.log('Download clicked');
    } else if (buttonText === 'edit') {
      console.log('Edit clicked');
    } else if (buttonText === 'delete') {
      console.log('Delete clicked');
    }
  };

  return (
    <>
      {thumbnailCards.length > 0 ? (
        thumbnailCards.map((cardData) => (
          <div key={cardData.id} className="card bg-base-100 w-96 shadow-sm mb-4">
            {cardData.thumbnailSrc ? (
              <figure className="px-10 pt-10 overflow-hidden" style={{ height: '240px' }}>
                <img 
                  src={cardData.thumbnailSrc} 
                  alt={`${cardData.fileType} thumbnail`} 
                  className="rounded-xl object-contain w-full h-full"
                />
              </figure>
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded-t-lg">
                <p className="text-gray-500">No thumbnail available</p>
              </div>
            )}
            <div className="card-body items-center text-center">
              <h2 className="card-title">{cardData.title}</h2>
              <p>{cardData.description}</p>
              <div className="flex flex-row gap-3 card-actions">
                <button
                  onClick={(e) => handleButtonOnClick(e, cardData)}
                  style={{ backgroundColor: 'white', color: 'seagreen' }}
                  className="text-black-100"
                >
                  view
                </button>
                <button
                  onClick={(e) => handleButtonOnClick(e, cardData)}
                  style={{ backgroundColor: 'white', color: 'seagreen' }}
                  className="btn btn-primary"
                >
                  download
                </button>
                <button
                  onClick={(e) => handleButtonOnClick(e, cardData)}
                  style={{ backgroundColor: 'white', color: 'seagreen' }}
                  className="btn btn-primary"
                >
                  edit
                </button>
                <button
                  onClick={(e) => handleButtonOnClick(e, cardData)}
                  style={{ backgroundColor: 'white', color: 'seagreen' }}
                  className="btn btn-primary"
                >
                  delete
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="card bg-base-100 w-96 shadow-sm">
          <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded-t-lg">
            <p className="text-gray-500">No thumbnails available</p>
          </div>
          <div className="card-body items-center text-center">
            <h2 className="card-title">{item.file ? item.file.split('/').pop() : 'Untitled'}</h2>
            <p>{item.description || 'No description available'}</p>
            <div className="flex flex-row gap-3 card-actions">
              <button
                onClick={(e) => handleButtonOnClick(e, { originalItemId: item.id, originalItemType: item.type })}
                style={{ backgroundColor: 'white', color: 'seagreen' }}
                className="text-black-100"
              >
                view
              </button>
              <button
                onClick={(e) => handleButtonOnClick(e, { originalItemId: item.id, originalItemType: item.type })}
                style={{ backgroundColor: 'white', color: 'seagreen' }}
                className="btn btn-primary"
              >
                download
              </button>
              <button
                onClick={(e) => handleButtonOnClick(e, { originalItemId: item.id, originalItemType: item.type })}
                style={{ backgroundColor: 'white', color: 'seagreen' }}
                className="btn btn-primary"
              >
                edit
              </button>
              <button
                onClick={(e) => handleButtonOnClick(e, { originalItemId: item.id, originalItemType: item.type })}
                style={{ backgroundColor: 'white', color: 'seagreen' }}
                className="btn btn-primary"
              >
                delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ItemsCard;
import React, { useContext, useEffect, useState } from 'react';
import { DetailViewIdContext } from '../../utils/context';
import { useNavigate } from 'react-router-dom';

export function ItemsCard({ item }) {
  const { setSharedValue } = useContext(DetailViewIdContext);
  const [thumbnail, setThumbnail] = useState(null);
  const navigate = useNavigate();

  const fileExtension = item.file.split('.').pop().toLowerCase();
  const isCog = ['cog', 'tif', 'tiff'].includes(fileExtension);

  useEffect(() => {
    let src = null;

    if (item.thumbnail) {
      src = "http://127.0.0.1:8000/media/" + item.thumbnail;
      setThumbnail(
        <figure className="px-10 pt-10">
          <img src={src} alt={fileExtension} className="rounded-xl" />
        </figure>
      );
    } else if (isCog) {
      console.log("is Cog",isCog,item.file)
      // Use TiTiler /cog/preview.png for COG thumbnail
      src = `http://localhost:8001/cog/preview.png?url=${encodeURIComponent("/media/"+item.file)}`;
      setThumbnail(
        <figure className="px-10 pt-10">
          <img src={src} alt={fileExtension} className="rounded-xl" style={{ maxWidth: '100%', height: 'auto' }} />
        </figure>
      );
    } else if (fileExtension === "py") {
      src = "https://i.pinimg.com/474x/dd/86/e1/dd86e167a140b312fff9f1a86ae2762e.jpg";
      setThumbnail(
        <figure className="px-10 pt-10">
          <img src={src} alt={fileExtension} className="rounded-xl" />
        </figure>
      );
    } else if (fileExtension === "ipynb") {
      src = "https://i.pinimg.com/236x/50/51/e2/5051e2f0d89fa913ab0f394d1e6464be.jpg";
      setThumbnail(
        <figure className="px-10 pt-10">
          <img src={src} alt={fileExtension} className="rounded-xl" />
        </figure>
      );
    } else {
      src = ""; // Placeholder or default image
      setThumbnail(
        <figure className="px-10 pt-10">
          <img src={src} alt={fileExtension} className="rounded-xl" />
        </figure>
      );
    }
  }, [item.file, item.thumbnail, fileExtension, isCog]);

  const handleButtonOnClick = (event) => {
    event.stopPropagation();
    const buttonText = event.target.innerText.trim();
    console.log("Button clicked:", buttonText, "Item type:", item.type);

    if (buttonText === "view") {
      const itemType = item.type || "";
      console.log("View clicked for item type:", itemType);
      if (itemType === "map") {
        setSharedValue(item.id);
        setTimeout(() => navigate('/map-detail-view'), 0);
      } else if (itemType === "geospatial") {
        setSharedValue(item.id);
        setTimeout(() => navigate('/geo-detail-view'), 0);
      } else if (itemType === "analysis") {
        setSharedValue(item.id);
        setTimeout(() => navigate('/analysis-detail-view'), 0);
      } else if (itemType === "document") {
        setSharedValue(item.id);
        setTimeout(() => navigate('/doc-detail-view'), 0);
      } else {
        console.log("Unknown item type:", itemType);
      }
    } else if (buttonText === "download") {
      console.log("Download clicked");
    } else if (buttonText === "edit") {
      console.log("Edit clicked");
    } else if (buttonText === "delete") {
      console.log("Delete clicked");
    }
  };

  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      {thumbnail}
      <div className="card-body items-center text-center">
        <h2 className="card-title">{item.file.split('/').pop()}</h2>
        <p>{item.description || 'No description available'}</p>
        <div className="flex flex-row gap-3 card-actions">
          <button
            onClick={handleButtonOnClick}
            style={{ backgroundColor: 'white', color: 'seagreen' }}
            className="text-black-100"
          >
            view
          </button>
          <button
            onClick={handleButtonOnClick}
            style={{ backgroundColor: 'white', color: 'seagreen' }}
            className="btn btn-primary"
          >
            download
          </button>
          <button
            onClick={handleButtonOnClick}
            style={{ backgroundColor: 'white', color: 'seagreen' }}
            className="btn btn-primary"
          >
            edit
          </button>
          <button
            onClick={handleButtonOnClick}
            style={{ backgroundColor: 'white', color: 'seagreen' }}
            className="btn btn-primary"
          >
            delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemsCard;
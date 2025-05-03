import './DasboardHearder.css';
import RainforestBuilder from './RainforestBuilder.png';
import { CategoryOfDataClickedContext } from '../../utils/context';
import { useContext, useEffect } from 'react';

function DasboardHearder() {
  // const { sharedValue: buttonText } = useContext(CategoryOfDataClickedContext);
  const { sharedValue, setSharedValue } = useContext(CategoryOfDataClickedContext);

  const handleNavigateToDataView=(event)=>{
    const buttonText = event.target.innerText.trim();  // Access the inner text of the clicked button
    if (buttonText){
        setSharedValue(buttonText)  
        console.log(buttonText)
    }
    // navigate('/data-view'); 

}

  useEffect(() => {
    if (sharedValue) {
      console.log(sharedValue);
    }
  }, [sharedValue]);

  // Map buttonText values to their corresponding tab href values
  const getTabClass = (tabHref) => {
    const tabMatches = {
      '/analysis_resource': 'Analysis Assets',
      '/maps': 'Maps',
      '/documents': 'Documents',
      '/raster': 'Geospatial Datasets',
      '/all-dataset/': 'All'
    };

    // Check if the current buttonText matches this tab
    const isActive = sharedValue === tabMatches[tabHref];
    return `tab ${isActive ? 'active' : ''}`;
  };

  return (
    <div className="header">
      <nav className="navbar">
        {/* Logo on the left */}
        <div className="logo flex flex-row">
          <a href="/">
            <img src={RainforestBuilder} alt="Rainforest Builder" />
          </a>
          <h1>RBGH GEOSPATIAL DASHBOARD</h1>
        </div>
       

        {/* Tabs on the right */}
        <ul className="tabs right">
        

          {/* <li  className={getTabClass('/analysis_resource')}>
            <a onClick={handleNavigateToDataView} href="#">Analysis Assets</a>
          </li>

          <li className={getTabClass('/documents')}>
            <a onClick={handleNavigateToDataView} href="#">Documents</a>
          </li>

          <li className={getTabClass('/maps')}>
            <a onClick={handleNavigateToDataView} href="#">Maps</a>
          </li>

          <li className={getTabClass('/all-dataset/')}>
            <a onClick={handleNavigateToDataView} href="#">All</a>
          </li> */}
        </ul>
      </nav>
    </div>
  );
}

export default DasboardHearder;
import './DatasetHeader.css';
import RainforestBuilder from './RainforestBuilder.png';
import { CategoryOfDataClickedContext } from '../../utils/context';
import { useContext, useEffect } from 'react';

function DatasetHeader() {
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
      '/all-dataset/': 'All',
      '/departments/':'Departments',
      '/compartments/':'Compartments'


    };

    // Check if the current buttonText matches this tab
    const isActive = sharedValue === tabMatches[tabHref];
    return `tab ${isActive ? 'active' : ''}`;
  };

  return (
    <div className="header">
      <nav className="navbar">
        {/* Logo on the left */}
        <div className="logo">
          <a href="/">
            <img src={RainforestBuilder} alt="Rainforest Builder" />
          </a>
        </div>

        {/* Tabs on the right */}
        <ul className="tabs right">
        {/* <li className={getTabClass('/departments/')}>
            <a onClick={handleNavigateToDataView} href="#">Departments</a>
          </li>
          <li className={getTabClass('/compartments/')}>
            <a onClick={handleNavigateToDataView} href="#">Compartments</a>
          </li> */}
          <li className={getTabClass('/raster')}>
            <a onClick={handleNavigateToDataView} href="#">Geospatial Datasets</a>
            <ul className="dropdown">
              <li>
                <a href="/collected_dataset">Raster</a>
              </li>
              <li>
                <a href="/analysis_result">Vector</a>
              </li>
            </ul>
          </li>

          <li  className={getTabClass('/analysis_resource')}>
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
          </li>
         
        </ul>
      </nav>
    </div>
  );
}

export default DatasetHeader;
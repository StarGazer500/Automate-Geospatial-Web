import './DatasetHeader.css';
import RainforestBuilder from './RainforestBuilder.png'

function DatasetHeader() {
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
          

        <li className="tab">
            <a href="/raster">Geospatial Dataset</a>
            <ul className="dropdown">
                <li>
                <a href="/collected_dataset">Raster</a>
                </li>
                <li>
                <a href="/analysis_result">Vector</a>
                </li>
            </ul>
        </li>

        {/* <li className="tab">
            <a href="/raster">Vector Dataset</a>
            <ul className="dropdown">
                <li>
                <a href="/collected_dataset">Collected Dataset</a>
                </li>
                <li>
                <a href="/analysis_result">Analysis Results</a>
                </li>
                
            </ul>
        </li> */}

         
            <li className="tab">
              <a href="/analysis_resource">Analysis Assests</a>
            </li>

          <li className="tab">
              <a href="/documents">Documents</a>
            </li>

            <li className="tab">
              <a href="/maps">Maps</a>
            </li>

            

            <li className="tab">
            <a href="/all-dataset/">All</a>
          </li>

        </ul>
      </nav>
    </div>
  );
}

export default DatasetHeader;
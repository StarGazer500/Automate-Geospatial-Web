import './Header.css';
import RainforestBuilder from './RainforestBuilder.png'

function Header() {
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
            <a href="/datasets/">Datasets</a>
            {/* <ul className="dropdown">
              <li>
                <a href="/raster">Raster Dataset</a>
                <ul className="dropdown">
                  <li>
                    <a href="/collected_dataset">Collected Dataset</a>
                  </li>
                  <li>
                    <a href="/analysis_result">Analysis Results</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="/vector">Vector Dataset</a>
                <ul className="dropdown">
                  <li>
                    <a href="/collected_dataset">Collected Dataset</a>
                  </li>
                  <li>
                    <a href="/analysis_result">Analysis Results</a>
                  </li>
                </ul>
              </li>
            </ul> */}
          </li>

          <li className="tab">
            <a href="/maps/">Maps</a>
          </li>
          <li className="tab">
            <a href="/documents/">Documents</a>
          </li>
          <li className="tab">
            <a href="/analysis_references/">Dashboards</a>
          </li>
          <li className="tab">
            <a href="/analysis_references/">Analysis Resources</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
import './Homepage.css'
import Header from '../../utils/Header'
import RainforestBuilder from './RainforestBuilder.png'

function Homepage(){
    return(
        <div className="content-wrapper">
            <Header/>
            <div className="sections-container">
                <section className="section">
                    <img 
                        src="https://i.pinimg.com/736x/46/ee/33/46ee3324e0e5aa5b5e853310b251185c.jpg" 
                        alt="Rainforest" 
                        className="section-image"
                    />
                    <p className="section-description">
                        Data and Automated Script Management for Rainforest Builder
                    </p>
                </section>
                <section className="section">
                    <h1 >Manage Dataset</h1>
                    <p >This platform assist the GIS Analyst to manage Collected/Raw Datasets and Analysis Results Datasets.
                        The Dataset can be in the form of Raster Dataset or Vector Dataset. Users can add new datasets, view existing datasets, download, or conduct further analysis.
                    </p>
                    <button className='btn'>Datasets</button>

                    
                </section>

                <section className="section">
                    <h1 >Manage Documents</h1>
                    <p >This platform assist the GIS Analyst to manage Documents such as Pdfs and Reports. Users can add documents, view, share and download.
                    </p>
                    <button className='btn'>Documents</button>                    
                </section>

                <section className="section">
                    <h1 >Manage Maps</h1>
                    <p >This platform assist the GIS Analyst to manage Generated Maps. The User can add New Maps, view maps, edit maps download and share.
                    </p>
                    <button className='btn'>Maps</button>                    
                </section>

                <section className="section">
                    <h1 >Manage Analysis Resources</h1>
                    <p >This platform assist the GIS Analyst to manage Analysis Referenes. This allows the GIS Analyst to manage Analysis Results and their Associated Input data, output data, Results script, associated maps, reports and Analysis Discussion.
                    </p> 
                    <button className='btn'>Analysis Resources</button>                   
                </section>
            </div>



        </div>
    )
}


export default Homepage
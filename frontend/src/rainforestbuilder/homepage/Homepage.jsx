import './Homepage.css'
import Header from '../../utils/Header'
import RainforestBuilder from './RainforestBuilder.png'
import { Link,useNavigate,} from 'react-router-dom';
import{CategoryOfDataClickedContext} from '../../utils/context'
import { useContext,useEffect} from 'react';



function Homepage(){
    const navigate = useNavigate()
    const { sharedValue, setSharedValue } = useContext(CategoryOfDataClickedContext);

    const handleNavigateToDataView=(event)=>{
        const buttonText = event.target.innerText.trim();  // Access the inner text of the clicked button
        if (buttonText){
            setSharedValue(buttonText)  
        }
        setTimeout(() => navigate('/data-view'), 0);


    }


 // In your App.js or similar initialization component


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
                        {/* Data and Automated Script Management for Rainforest Builder */}
                    </p>
                </section>
                <section className="section">
                    <h1 >Manage Geospatial Dataset</h1>
                    <p >TThis platform is designed to support GIS Analysts in managing both raw and analysis result datasets, whether in raster or vector format. It enables users to easily upload, view, download, and export datasets in various formats such as GeoTIFF, Shapefile, and GeoJSON. Analysts can conduct spatial analyses, apply geospatial operations like reclassification, buffering, and raster algebra, and build automated workflows for repeated tasks. The platform also allows for the addition and viewing of metadata, ensuring clarity on dataset origins, resolution, and other critical attributes. Version control is integrated, allowing users to track changes over time, making it a comprehensive tool for dataset management and spatial analysis.
                    </p>
                    <button onClick={handleNavigateToDataView} className='btn'>Geospatial Datasets</button>

                    
                </section>

                <section className="section">
                    <h1 >Manage Documents</h1>
                    <p >This platform is designed to help GIS Analysts manage documents like PDFs and reports related to their work. It allows users to easily upload, view, and organize documents, making it simple to store important resources such as research reports, project summaries, and analysis results. Users can also share documents with colleagues or external collaborators, ensuring smooth communication and data sharing. Additionally, the platform provides the ability to download documents for offline use or further processing, making it a versatile tool for document management within GIS projects.

                    </p>
                    <button onClick={handleNavigateToDataView} className='btn'>Documents</button>                    
                </section>

                <section className="section">
                    <h1 >Manage Maps</h1>
                    <p >TThis platform is designed to help GIS Analysts efficiently manage generated maps, supporting a range of tasks from creation to sharing. Users can easily add new maps, view them in an interactive viewer, and edit map layers or symbology as needed. The platform also allows users to download maps in various formats (e.g., PNG, PDF, GeoPDF) for offline use or inclusion in reports. Additionally, maps can be shared with colleagues, stakeholders, or clients, ensuring seamless collaboration and communication of spatial data. Whether for analysis or presentation, the platform streamlines the management and dissemination of GIS maps.
                    </p>
                    <button onClick={handleNavigateToDataView} className='btn'>Maps</button>                    
                </section>
               
                <section className="section">
                    <h1 >Manage Analysis Assets</h1>
                    <p >This platform helps GIS Analysts manage all resources related to their analyses in a centralized and organized way. It allows users to store and track analysis results alongside their associated input data, output data, and analysis scripts. Analysts can also link related resources, such as maps generated during the analysis, supporting reports, and discussions, ensuring everything is easily accessible and connected. Whether reviewing previous work or sharing results with colleagues, the platform provides a streamlined way to manage and document all aspects of the analytical process, facilitating better insights, collaboration, and reproducibility of analyses.
                    </p> 
                    <button  onClick={handleNavigateToDataView} className='btn'>Analysis Assets</button>                   
                </section>
            </div>



        </div>
    )
}


export default Homepage
import './Dataset.css'
import DatasetHeader from './DatasetHeader'

import ItemsCard from './ItemsCard'

function DatasetView(){
    return(
        <div>
        <div className="content-wrapper">
            <DatasetHeader/>
            <div style={{ 
                    zIndex: '20', 
                    alignSelf: 'center', 
                    textAlign: 'center', 
                    padding: '10px 0', 
                    marginTop: 50, 
                    width: '88vw', 
                    backgroundColor: 'white', 
                    border: '1px solid whitesmoke', 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px' // Adds consistent spacing between elements
                    }}> 
                    <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px', // Smaller gap between select and input
                        marginLeft: '10px' // Some padding on the left
                    }}>
                        <select style={{ 
                        margin: 0, 
                        color: 'green' 
                        }} placeholder='search dataset'> 
                        <option value="" disabled selected>Select dataset</option> 
                        <option value="dataset1">Field Dataset</option> 
                        <option value="dataset2">Processed Dataset</option> 
                        </select> 
                        <input placeholder='search item' style={{
                        border: '1px solid green',
                        color: 'black',
                        borderRadius: '5px',
                        
                    
                        }}/>
                    </div>
                    
                    <div style={{ 
                        marginLeft: 'auto', // This pushes the button to the right
                        marginRight: '10px' // Some padding on the right
                    }}>
                        <button style={{
                        background: 'green',
                        width: '100px',
                        height: '50px',
                        borderRadius: '10px',
                        color: 'white'
                        }}>Add Dataset</button>
                    </div>
            </div>
        
            
                <div className="grid-container" >
                    <ItemsCard/>
                    <ItemsCard/>
                    <ItemsCard/>
                    <ItemsCard/>
                    <ItemsCard/>
                    <ItemsCard/>
                    <ItemsCard/>
                    <ItemsCard/>
                    <ItemsCard/>
                    <ItemsCard/>
                    <ItemsCard/>
                    <ItemsCard/>
 
                </div>
               

            </div>
           



        </div>
        
    )
}


export default DatasetView
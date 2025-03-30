import './Dataset.css'
import DatasetHeader from './DatasetHeader'

import ItemsCard from './ItemsCard'

function DatasetView(){
    return(
        <div>
        <div className="content-wrapper">
        <DatasetHeader/>
            <div className='flex '>
                 <div className=' flex-col mt-[50px] flex-1 bg-white items-start justify-start  border-2 border-[whitesmoke] pl-0 w-full'>
                            <h1 style={{color:"seagreen",marginBottom:"30px",marginTop:'20px',width:'100%'}}>Advanced Filtering</h1>
                           
                            <label className="mr-[100%] pl-0  self-start " style={{color:'black'}} htmlFor="">Start Date</label>
                             <input className="mb-[30px]" type='date'></input>
                            <label className='mr-[100%]' style={{color:'black'}} htmlFor="">End Date</label>
                            <input className="mb-[30px]" type='date'></input> 
                            
                        {/* <select className = "upload_select" style={{ 
                                    margin: 0, 
                                
                                    background: 'white',
                                    marginBottom:'30px',
                                    width: '150px',
                                    height: '50px',
                                    color: 'green' ,
                                    borderRadius: '10px',
                                    }} placeholder='search dataset'> 
                                    <option value="" disabled selected>Upload</option> 
                                    <option value="dataset1">Geospatial</option> 
                                    <option value="dataset2">Documents</option> 
                                    <option value="dataset2">Analysis Assets</option> 
                                    <option value="dataset2">Maps</option> 
                                    </select>  */}

                                    {/* <select className = "upload_select" style={{ 
                                    margin: 0, 
                                
                                    background: 'white',
                                    marginBottom:'30px',
                                    width: '150px',
                                    height: '50px',
                                    color: 'green' ,
                                    borderRadius: '10px',
                                    }} placeholder='search dataset'> 
                                    <option value="" disabled selected>Upload</option> 
                                    <option value="dataset1">Geospatial</option> 
                                    <option value="dataset2">Documents</option> 
                                    <option value="dataset2">Analysis Assets</option> 
                                    <option value="dataset2">Maps</option> 
                                    </select>  */}

                                    {/* <select className = "upload_select" style={{ 
                                    margin: 0, 
                                
                                    background: 'white',
                                    marginBottom:'30px',
                                    width: '150px',
                                    height: '50px',
                                    color: 'green' ,
                                    borderRadius: '10px',
                                    }} placeholder='search dataset'> 
                                    <option value="" disabled selected>Upload</option> 
                                    <option value="dataset1">Geospatial</option> 
                                    <option value="dataset2">Documents</option> 
                                    <option value="dataset2">Analysis Assets</option> 
                                    <option value="dataset2">Maps</option> 
                                    </select>  */}
                                    <button style={{backgroundColor:'seagreen'}}>Query</button>
                                    <p>map search will come here</p>

                    </div>
                       
                    <div className=' w-full flex-[8] flex-col'>
            
                                <div className='' style={{ 
                                            zIndex: '20', 
                                            alignSelf: 'center', 
                                            textAlign: 'center', 
                                            padding: '10px 0', 
                                            marginTop: 50, 
                                            // marginLeft:'139px',
                                            width: '84vw', 
                                            // marginRight:'78px',
                                            backgroundColor: 'white', 
                                            border: '1px solid whitesmoke', 
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px' // Adds consistent spacing between elements
                                            }}> 
                                            <div style={{ 
                                                alignSelf:'center',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px', // Smaller gap between select and input
                                                marginLeft: '10px' // Some padding on the left
                                            }}>
                                                <button style={{
                                                background: 'seagreen',
                                                width: '100px',
                                                height: '50px',
                                                borderRadius: '10px',
                                                color: 'white'
                                                }}>Filter</button> 
                                                <input placeholder='search item' style={{
                                                marginLeft:'250px',
                                                // alignSelf:'center',
                                                width:'700px',
                                                height:'40px',
                                                
                                                border: '1px solid green',
                                                color: 'black',
                                                borderRadius: '10px',
                                                
                                            
                                                }}/>
                                            </div>
                                            
                                            <div style={{ 
                                                marginLeft: 'auto', // This pushes the button to the right
                                                marginRight: '10px' // Some padding on the right
                                            }}>


                                            <select className = "upload_select" style={{ 
                                                margin: 0, 
                                            
                                                background: 'seagreen',
                                                width: '150px',
                                                height: '50px',
                                                color: 'white' ,
                                                borderRadius: '10px',
                                                }} placeholder='search dataset'> 
                                                <option value="" disabled selected>Upload</option> 
                                                <option value="dataset1">Geospatial</option> 
                                                <option value="dataset2">Documents</option> 
                                                <option value="dataset2">Analysis Assets</option> 
                                                <option value="dataset2">Maps</option> 
                                                </select> 

                                            
                                            </div>
                                    </div>


                       
                                        <div  className="flex-[9] grid-container" >
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

                                        <p style={{alignSelf:'center',color:'seagreen',marginLeft:'40%',marginTop:'10px'
                                        }}>Geospatial</p>

                                

                        </div>
             </div>
               

            </div>
           



        </div>
        
    )
}


export default DatasetView
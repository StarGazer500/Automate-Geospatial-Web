import React, { useEffect, useContext, useState, useRef } from 'react';
import DasboardHearder from './DasboardHearder';
import './Dashboard.css';
import MapComponent from './MapComponent';

export function Dashboard() {
    return (
        <div className='content-wrapper'>
            <DasboardHearder/>
            <div className='mt-15'>
                <div className=' flex  flex-row text-[blue]'>
                {/* <div className='flex flex-row'>
                    <label className='w-100' for="interval">Select Forest Reserve:</label>
                    <select id="reserve" name="reserve">
                        <option value="Anwiaso East">Anwiaso East</option>
                        <option value="Anwiaso South">Anwiaso South</option>
                        <option value="Upper Wassa">Upper Wassa</option>
                    </select>
                </div> */}

                
                    <div className='flex flex-row'>
                        <label className='w-100' for="interval">Select Start Date:</label>
                        <input type='date'></input>
                    </div>
                    <div className='flex flex-row'>
                        <label className='w-100' for="interval">Select End Date:</label>
                        <input type='date'></input>
                    </div>
                
                <div className='flex flex-row' >
                <label className='w-100' for="interval">Select Time View:</label>
                <select id="interval" name="interval">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
                </div>

                </div>
                <div className='flex flex-row'>
                    <div className='border-2 bg-yellow-200 border-[whitesmoke] h-screen flex flex-col flex-[1]'>
                        <h1 className='bird text-[blue]'>QC Activities</h1>
                        <h1 className='bird text-[blue]'>Damages</h1>
                        <h1 className='bird text-[blue]'>RBGH Compartments</h1>
                        <h1 className='bird text-[blue]'>RBGH Sub-compartments</h1>
                        <h1 className='bird text-[blue]'>RBGH Roads</h1>
                       

                    </div>
                    <div className='border-2 border-[whitesmoke] h-screen flex flex-row flex-[9]'>
                        
                       
                        <div className='border-2 border-[whitesmoke] flex-[4]'>
                        <MapComponent/>

                        </div>
                        <div className='border-2 border-[whitesmoke] flex-[6]'>
                        <h1 className='text-[blue]'>This is chart part</h1>

                        </div>
                    </div>

                </div>

            </div>
  
           
        </div>
    )
}
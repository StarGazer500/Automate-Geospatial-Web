// RNDDashboard.jsx
import React, { useEffect, useContext, useState, useRef } from 'react';
import RNDDasboardHearder from './RNDDasboardHearder';
import './RndDashshboard.css';
import RNDMapComponent from './RNDMapComponent';

export function RNDDashboard() {
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [chartData, setChartData] = useState(null)
    const [timeView, setTimeView] = useState("")
    const [selectedOperation, setSelectedOperation] = useState("Seed Production")

    // Handle change for start date
    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    // Handle change for end date
    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    // Handle operation selection
    const handleOperationSelect = (operation) => {
        setSelectedOperation(operation);
        console.log(`${operation} selected`);
    };

    return (
        <div className='content-wrapper'>
            <RNDDasboardHearder/>
            
            {/* Fixed top controls section */}
            <div className='mt-15'>
                <div className='flex flex-row text-[blue] gap-4 mb-4 items-center relative z-[1000]'>
                    <button 
                        className={`px-4 py-2 rounded transition-colors duration-200 ${
                            selectedOperation === 'Seed Collection' 
                                ? 'bg-blue-700 text-white shadow-xl ring-4 ring-blue-200 border-2 border-blue-400 transform scale-105' 
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                        onClick={() => handleOperationSelect('Seed Collection')}
                    >
                        Seed Collection
                    </button>
                    
                    <button 
                        className={`px-4 py-2 rounded transition-colors duration-200 ${
                            selectedOperation === 'Seed Processing And Storage' 
                                ? 'bg-green-700 text-white shadow-xl ring-4 ring-green-200 border-2 border-green-400 transform scale-105' 
                                : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                        onClick={() => handleOperationSelect('Seed Processing And Storage')}
                    >
                        Seed Processing And Storage
                    </button>
                    
                    <button 
                        className={`px-4 py-2 rounded transition-colors duration-200 ${
                            selectedOperation === 'Seed Dispatch' 
                                ? 'bg-orange-700 text-white shadow-xl ring-4 ring-orange-200 border-2 border-orange-400 transform scale-105' 
                                : 'bg-orange-500 hover:bg-orange-600 text-white'
                        }`}
                        onClick={() => handleOperationSelect('Seed Dispatch')}
                    >
                        Seed Dispatch
                    </button>
                    
                    <button 
                        className={`px-4 py-2 rounded transition-colors duration-200 ${
                            selectedOperation === 'Seed Nursery' 
                                ? 'bg-purple-700 text-white shadow-xl ring-4 ring-purple-200 border-2 border-purple-400 transform scale-105' 
                                : 'bg-purple-500 hover:bg-purple-600 text-white'
                        }`}
                        onClick={() => handleOperationSelect('Seed Nursery')}
                    >
                        Seed Nursery
                    </button>

                     <button 
                        className={`px-4 py-2 rounded transition-colors duration-200 ${
                            selectedOperation === 'Seed Survival' 
                                ? 'bg-purple-700 text-white shadow-xl ring-4 ring-purple-200 border-2 border-purple-400 transform scale-105' 
                                : 'bg-purple-500 hover:bg-purple-600 text-white'
                        }`}
                        onClick={() => handleOperationSelect('Seed Survival')}
                    >
                        Seed Survival
                    </button>
                </div>

                {/* Main content area with fixed positioning */}
                <div className='flex flex-row h-[calc(100vh-200px)]'>
                    {/* Left sidebar */}
                    {/* <div className='border-2 bg-yellow-200 border-[whitesmoke] flex flex-col flex-[1] p-4 overflow-y-auto'>
                        <h1 className='bird text-[blue] mb-2'>QC Activities</h1>
                        <h1 className='bird text-[blue] mb-2'>Damages</h1>
                        <h1 className='bird text-[blue] mb-2'>RBGH Compartments</h1>
                        <h1 className='bird text-[blue] mb-2'>RBGH Sub-compartments</h1>
                        <h1 className='bird text-[blue] mb-2'>RBGH Roads</h1>
                    </div> */}
                    
                    {/* Main content area */}
                    <div className='border-2 border-[whitesmoke] flex flex-row flex-[9]'>
                        {/* Map section */}
                        <div className='border-2 border-[whitesmoke] flex-[3] relative'>
                            <div className='absolute inset-0'>
                                <RNDMapComponent />
                            </div>
                        </div>
                        
                        {/* Chart section */}
                        <div className='border-2 border-[whitesmoke] flex-[7] p-4 overflow-y-auto'>
                            <h1 className='text-[blue]'>This is chart part</h1>
                            {/* {chartData ? <DashBoardChart chartData={chartData}/> : null} */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


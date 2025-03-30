import React from 'react';
import { createRoot } from 'react-dom/client';
// import { ThemeProvider } from '@material-tailwind/react';
import './index.css';
import App from './App';
import {InputGeospatialProvider,OutputGeospatialProvider,DocumentProvider,MapProvider,AnalysisAssetProvider} from './utils/provider';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <InputGeospatialProvider>
      <OutputGeospatialProvider>
          <AnalysisAssetProvider>
              <MapProvider>
                <DocumentProvider>
                  <App />
                </DocumentProvider>
              </MapProvider>        
          </AnalysisAssetProvider>
        </OutputGeospatialProvider>
    </InputGeospatialProvider>
  </React.StrictMode>
);

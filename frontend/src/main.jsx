import React from 'react';
import { createRoot } from 'react-dom/client';
// import { ThemeProvider } from '@material-tailwind/react';
import './index.css';
import App from './App';

import {InputGeospatialProvider,OutputGeospatialProvider,DocumentProvider,MapProvider,AnalysisAssetProvider,CategoryOfDataClickedProvider,IsComponentUsedInFormSliderClickedProvider} from './utils/provider';

const root = createRoot(document.getElementById('root'));
import { BrowserRouter } from 'react-router-dom'


root.render(
  <React.StrictMode>
    <BrowserRouter>
    <IsComponentUsedInFormSliderClickedProvider>
      
      <CategoryOfDataClickedProvider>
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
      </CategoryOfDataClickedProvider>
      </IsComponentUsedInFormSliderClickedProvider>
    </BrowserRouter>
  </React.StrictMode>
);

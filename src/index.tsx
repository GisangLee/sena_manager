import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, defaultSystem} from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
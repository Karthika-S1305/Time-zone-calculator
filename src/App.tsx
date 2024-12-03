import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import store from './store/store';
import { Provider } from 'react-redux';
import Dashboard from './components/Dashboard';
import { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import TimeCalculator from './components/TimeCalculator';
import { Route, Routes, Navigate } from 'react-router-dom'; // Make sure Navigate is imported
import AddCountry from './components/AddCountry';

const theme = createTheme({
  typography: {
    fontFamily: "'Roboto', sans-serif",
    fontSize: 14,
  },
});

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            
            <Sidebar open={isSidebarOpen} onClose={toggleSidebar} />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                transition: 'margin 0.3s',
                marginLeft: isSidebarOpen ? '250px' : '0px',
                padding: '20px',
              }}
            >
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-country" element={<AddCountry />} />
                <Route path="/time-calculator" element={<TimeCalculator />} />
              </Routes>
            </Box>
          </Box>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default App;

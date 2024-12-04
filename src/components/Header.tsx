import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {

  const location = useLocation();
  const getPageTitle = () => {
    switch(location.pathname){
      case "/dashboard":
        return "Dashboard";
      case "/add-country":
        return "Add Country";
      case "/time-calculator":
        return "Time Calculator";
      default:
        return "Country Time Zone";    
    }
  }
  return (
    <AppBar
      position="fixed"
      sx={{
        transition: 'margin 0.3s',
        marginLeft: isSidebarOpen ? 250 : 0,
        width: isSidebarOpen ? `calc(100% - 250px)` : '100%',
      }}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div">
          {getPageTitle()}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

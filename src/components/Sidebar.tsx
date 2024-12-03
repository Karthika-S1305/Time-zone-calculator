import React from "react";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Calculate, Dashboard } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation(); // Get the current URL path

  const SidebarList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={onClose}>
      <List>
        {["Dashboard", "Add Country", "Time Calculator"].map((text, index) => {
          const to =
            text === "Time Calculator"
              ? "/time-calculator"
              : text === "Add Country"
              ? "/add-country"
              : "/dashboard";

          const isActive = location.pathname === to; 

          return (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={Link}
                to={to}
                onClick={onClose}
                sx={{
                  backgroundColor: isActive ? "#f0f0f0" : "transparent", 
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                <ListItemIcon>
                  {index === 0 ? <Dashboard /> : index === 1 ? <TravelExploreIcon /> : <Calculate />}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{
                    color: isActive ? "blue" : "black", 
                    fontWeight: isActive ? "bold" : "normal",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Drawer
      open={open}
      variant="persistent"
      anchor="left"
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 250,
          transition: "width 0.3s",
          backgroundColor: "white",
        },
      }}
    >
      {SidebarList}
    </Drawer>
  );
};

export default Sidebar;

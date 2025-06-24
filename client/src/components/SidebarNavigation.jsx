// components/SidebarNavigation.js
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Box,
  Divider,
  Typography,
  Switch,
  FormControl,
  MenuItem,
  Select,
  FormControlLabel,
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ExploreIcon from '@mui/icons-material/Explore';
import ForumIcon from '@mui/icons-material/Forum';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PsychologyIcon from '@mui/icons-material/Psychology'; // NEW ICON

const drawerWidth = 240;

const SidebarNavigation = ({
  isAdmin,
  onChange,
  darkMode,
  setDarkMode,
  language,
  handleLanguageChange,
  isAdminToggle,
}) => {
  const navItems = [
    { label: 'Home', icon: <HomeIcon />, index: 0 },
    { label: 'Disease Search', icon: <ExploreIcon />, index: 1 },
    { label: 'Risk Assessment', icon: <AssessmentIcon />, index: 2 },
    { label: 'Hospital Locator', icon: <LocalHospitalIcon />, index: 3 },
    { label: 'Community Forum', icon: <ForumIcon />, index: 4 },
    { label: 'Disease Predictor', icon: <PsychologyIcon />, index: 5 }, // ✅ NEW ITEM
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          padding: 2,
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <Typography variant="h6" sx={{ mb: 2, px: 1 }}>
          Disease Dashboard
        </Typography>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton onClick={() => onChange(item.index)}>
                {item.icon}
                <ListItemText sx={{ ml: 1 }} primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <Select value={language} onChange={handleLanguageChange}>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="hi">हिंदी</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
          label={darkMode ? 'Dark Mode' : 'Light Mode'}
        />

        <FormControlLabel
          control={<Switch checked={isAdmin} onChange={isAdminToggle} />}
          label={<><AdminPanelSettingsIcon sx={{ fontSize: 18, mr: 1 }} /> Admin</>}
        />
      </Box>
    </Drawer>
  );
};

export default SidebarNavigation;

// App.js
import React, { useState, useMemo, useEffect } from 'react';
import SidebarNavigation from './components/SidebarNavigation';
import Home from './components/Home';
import DiseaseSearch from './components/DiseaseSearch';
import DiseaseDetails from './components/DiseaseDetails';
import AdminPanel from './components/AdminPanel';
import AdminHospitalManager from './components/AdminHospitalManager';
import RiskAssessmentTool from './components/RiskAssessmentTool';
import CommunityPosts from './components/CommunityPosts';
import HospitalLocator from './components/HospitalLocator';
import DiseasePredictor from './components/DiseasePredictor';

import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Snackbar,
  Alert,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useMediaQuery,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
  BottomNavigation,
  BottomNavigationAction
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ForumIcon from '@mui/icons-material/Forum';
import PsychologyIcon from '@mui/icons-material/Psychology';

import { useTranslation } from 'react-i18next';
import './i18n';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [filterSymptom, setFilterSymptom] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { t, i18n } = useTranslation();
  const isMobile = useMediaQuery('(max-width:600px)');

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: { main: '#7BD756' } // ✅ green theme
      },
    }), [darkMode]);

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  useEffect(() => {
    socket.on('new-alert', (msg) => setAlertMessage(msg));
    return () => socket.off('new-alert');
  }, []);

  const drawer = (
    <SidebarNavigation
      isAdmin={isAdmin}
      onChange={(i) => {
        setActiveTab(i);
        if (isMobile) setMobileOpen(false);
      }}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      language={i18n.language}
      handleLanguageChange={handleLanguageChange}
      isAdminToggle={() => setIsAdmin(prev => !prev)}
    />
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {isMobile ? (
          <>
            <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
              <Toolbar>
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={() => setMobileOpen(!mobileOpen)}
                >
                  <MoreVertIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ ml: 2 }}>
                  Disease Dashboard
                </Typography>
              </Toolbar>
            </AppBar>
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              ModalProps={{ keepMounted: true }}
              sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 } }}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <Drawer
            variant="permanent"
            sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 } }}
          >
            {drawer}
          </Drawer>
        )}

        <Box component="main" sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          mt: isMobile ? 8 : 0,
          mb: isMobile ? 7 : 0,
          width: '100%',
          overflowY: 'auto'
        }}>
          {isAdmin ? (
            <>
              <AdminPanel />
              <AdminHospitalManager />
              <CommunityPosts isAdmin={isAdmin} currentUser="Admin" />
            </>
          ) : (
            <>
              {activeTab === 0 && <Home />}
              {activeTab === 1 && (
                <>
                  <Typography variant="h4" gutterBottom>{t('diseaseDashboard')}</Typography>
                  <FormControl sx={{ minWidth: 180, mb: 2 }}>
                    <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} displayEmpty>
                      <MenuItem value="">Sort By</MenuItem>
                      <MenuItem value="name_asc">Name (A-Z)</MenuItem>
                      <MenuItem value="name_desc">Name (Z-A)</MenuItem>
                      <MenuItem value="symptomCount_asc">Fewest Symptoms</MenuItem>
                      <MenuItem value="symptomCount_desc">Most Symptoms</MenuItem>
                    </Select>
                  </FormControl>

                  <DiseaseSearch
                    sortBy={sortBy}
                    filterSymptom={filterSymptom}
                    onSelectDisease={setSelectedDisease}
                  />
                  {selectedDisease && (
                    <DiseaseDetails
                      disease={selectedDisease}
                      onClose={() => setSelectedDisease(null)}
                    />
                  )}
                </>
              )}
              {activeTab === 2 && <RiskAssessmentTool />}
              {activeTab === 3 && <HospitalLocator selectedDisease={selectedDisease?.name} />}
              {activeTab === 4 && <CommunityPosts isAdmin={isAdmin} currentUser="Anonymous" />}
              {activeTab === 5 && <DiseasePredictor />}
            </>
          )}

          <Snackbar
            open={!!alertMessage}
            autoHideDuration={5000}
            onClose={() => setAlertMessage('')}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity="info" onClose={() => setAlertMessage('')} sx={{ width: '100%' }}>
              {alertMessage}
            </Alert>
          </Snackbar>
        </Box>

        {/* ✅ Bottom Nav for Mobile */}
        {isMobile && (
          <BottomNavigation
            showLabels={false}
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ position: 'fixed', bottom: 0, width: '100%', borderTop: '1px solid #ccc', zIndex: 1200 }}
          >
            <BottomNavigationAction icon={<HomeIcon />} />
            <BottomNavigationAction icon={<ExploreIcon />} />
            <BottomNavigationAction icon={<AssessmentIcon />} />
            <BottomNavigationAction icon={<LocalHospitalIcon />} />
            <BottomNavigationAction icon={<ForumIcon />} />
            <BottomNavigationAction icon={<PsychologyIcon />} />
          </BottomNavigation>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;

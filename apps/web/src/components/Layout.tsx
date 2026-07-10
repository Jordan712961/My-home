import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  TrendingDown as WeightIcon,
  Hotel as SleepIcon,
  Restaurant as MealIcon,
  FitnessCenter as WorkoutIcon,
  LocalDrink as WaterIcon,
  Notes as JournalIcon,
  SentimentSatisfied as MoodIcon,
  LocalHospital as SymptomIcon,
  Smoking as SubstanceIcon,
  Favorite as CravingIcon,
  EmojiEvents as AbstinenceIcon,
  Target as GoalIcon,
  CheckCircle as HabitIcon,
  BarChart as AnalyticsIcon,
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';
import { RootState } from '../store/store';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const menuItems: MenuItem[] = [
    { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { label: 'Weight', path: '/weight', icon: <WeightIcon /> },
    { label: 'Sleep', path: '/sleep', icon: <SleepIcon /> },
    { label: 'Meals', path: '/meals', icon: <MealIcon /> },
    { label: 'Workouts', path: '/workouts', icon: <WorkoutIcon /> },
    { label: 'Water', path: '/water', icon: <WaterIcon /> },
    { label: 'Journal', path: '/journal', icon: <JournalIcon /> },
    { label: 'Moods', path: '/moods', icon: <MoodIcon /> },
    { label: 'Symptoms', path: '/symptoms', icon: <SymptomIcon /> },
    { label: 'Substance Use', path: '/substance-use', icon: <SubstanceIcon /> },
    { label: 'Cravings', path: '/cravings', icon: <CravingIcon /> },
    { label: 'Abstinence', path: '/abstinence', icon: <AbstinenceIcon /> },
    { label: 'Goals', path: '/goals', icon: <GoalIcon /> },
    { label: 'Habits', path: '/habits', icon: <HabitIcon /> },
    { label: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: 1300 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            {drawerOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <span style={{ fontSize: 24, fontWeight: 'bold' }}>Health & Wellness</span>
          </Box>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              {user?.fullName}
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            marginTop: 8,
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setDrawerOpen(false);
              }}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          marginTop: 8,
        }}
      >
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;

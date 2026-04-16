import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  ShoppingCart,
  Store,
  Person,
  Groups,
  RequestQuote,
  Inventory,
  Notifications,
  Settings,
  Logout,
  ChevronRight
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Orders', icon: <ShoppingCart />, path: '/orders' },
    { text: 'Shops', icon: <Store />, path: '/shops' },
    { text: 'Artisans', icon: <Person />, path: '/artisans' },
    { text: 'Customers', icon: <Groups />, path: '/customers' },
    { text: 'Quotes', icon: <RequestQuote />, path: '/quotes' },
    { text: 'Products', icon: <Inventory />, path: '/products' },
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: '#B87333',
          background: 'linear-gradient(135deg, #B87333 0%, #C9A44C 100%)',
          boxShadow: '0 4px 12px rgba(184, 115, 51, 0.2)'
        }}
      >
        <Toolbar sx={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
            onClick={() => navigate('/')}
          >
            🟤🟡 Songir Copper-Brass
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'white', 
                  color: '#B87333',
                  width: 40,
                  height: 40
                }}
              >
                A
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#FFF6E5',
            width: 280,
          }
        }}
      >
        <Box sx={{ p: 2, backgroundColor: '#B87333', color: 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            🟤🟡 Songir Dashboard
          </Typography>
          <Typography variant="body2">
            Traditional Copper-Brass Artisans
          </Typography>
        </Box>

        <List sx={{ pt: 0 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                backgroundColor: isActive(item.path) ? 'rgba(184, 115, 51, 0.1)' : 'transparent',
                borderLeft: isActive(item.path) ? '4px solid #C9A44C' : 'none',
                mb: 1,
                '&:hover': {
                  backgroundColor: 'rgba(184, 115, 51, 0.1)'
                }
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? '#B87333' : '#3E2723' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 600 : 400,
                  color: isActive(item.path) ? '#B87333' : '#3E2723'
                }}
              />
              {isActive(item.path) && <ChevronRight sx={{ color: '#B87333' }} />}
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <List>
          <ListItem button>
            <ListItemIcon><Settings /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><Logout /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: '#C9A44C' }}>A</Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>Admin User</Typography>
            <Typography variant="caption" color="text.secondary">admin@songir.com</Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Person fontSize="small" /></ListItemIcon>
          My Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
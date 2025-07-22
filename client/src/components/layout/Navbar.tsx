import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Select,
  FormControl,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Quiz as QuizIcon,
  Analytics as AnalyticsIcon,
  Person as PersonIcon,
  Language as LanguageIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const menuItems = [
    { label: t('nav.home'), path: '/', icon: <HomeIcon /> },
    { label: t('nav.quizzes'), path: '/quizzes', icon: <QuizIcon /> },
    ...(user ? [
      { label: t('nav.analytics'), path: '/analytics', icon: <AnalyticsIcon /> },
      { label: t('nav.profile'), path: '/profile', icon: <PersonIcon /> },
    ] : []),
  ];

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
        <PersonIcon sx={{ mr: 1 }} />
        {t('nav.profile')}
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <LogoutIcon sx={{ mr: 1 }} />
        {t('common.logout')}
      </MenuItem>
    </Menu>
  );

  const mobileMenu = (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    >
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
          {!user && (
            <>
              <ListItem
                component={Link}
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemText primary={t('nav.login')} />
              </ListItem>
              <ListItem
                component={Link}
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemText primary={t('nav.register')} />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 'bold'
            }}
          >
            QuizDeGogo
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Language Selector */}
          <FormControl sx={{ mx: 1, minWidth: 80 }}>
            <Select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value as string)}
              variant="outlined"
              size="small"
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '& .MuiSvgIcon-root': {
                  color: 'white',
                },
              }}
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="ja">日本語</MenuItem>
            </Select>
          </FormControl>

          {user ? (
            <>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar 
                  alt={user.username} 
                  src={user.avatar}
                  sx={{ width: 32, height: 32 }}
                >
                  {user.username?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
            </>
          ) : (
            !isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/login"
                  variant="outlined"
                  sx={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}
                >
                  {t('nav.login')}
                </Button>
                <Button 
                  color="secondary" 
                  component={Link} 
                  to="/register"
                  variant="contained"
                >
                  {t('nav.register')}
                </Button>
              </Box>
            )
          )}
        </Toolbar>
      </AppBar>
      {renderMenu}
      {mobileMenu}
    </>
  );
};

export default Navbar;
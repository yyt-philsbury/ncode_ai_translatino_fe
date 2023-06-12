import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PagePropsType } from 'pages/_app';
import React from 'react';

function Navbar(props: PagePropsType) {
  const { mode, setMode } = props;

  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = !!anchorEl;

  const handleOpenMenu = (
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setAnchorEl(evt.currentTarget);
  };

  const handleMenuClose = (path?: string) => () => {
    setAnchorEl(null);
    if (path) {
      router.push(path);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <IconButton
            sx={{
              display: {
                xs: 'block',
                sm: 'none',
              },
            }}
            onClick={handleOpenMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose()}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleMenuClose('/translate')}>
              Translate
            </MenuItem>
            <MenuItem onClick={handleMenuClose('/archive')}>Archive</MenuItem>
            <MenuItem onClick={handleMenuClose('/settings')}>Settings</MenuItem>
          </Menu>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              display: {
                xs: 'none',
                sm: 'block',
              },
            }}
          >
            <Link href="/translate">
              <Button>TRANSLATE</Button>
            </Link>
            <Link href="/archive" style={{ textDecoration: 'none' }}>
              <Button>ARCHIVE</Button>
            </Link>
            <Link href="/settings" style={{ textDecoration: 'none' }}>
              <Button>SETTINGS</Button>
            </Link>
          </Stack>

          {mode === 'light' && (
            <IconButton
              onClick={() => {
                setMode('dark');
              }}
            >
              <DarkModeIcon />
            </IconButton>
          )}
          {mode === 'dark' && (
            <IconButton
              onClick={() => {
                setMode('light');
              }}
            >
              <LightModeIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      {/* Empty toolbar to move content down because we want fixed position */}
      <Toolbar />
    </Box>
  );
}

export default Navbar;


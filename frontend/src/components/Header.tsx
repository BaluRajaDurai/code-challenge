import { AppBar, Toolbar, useMediaQuery } from '@mui/material';
import LaptopIcon from '@mui/icons-material/Laptop';

const Header: React.FunctionComponent = () => {
  const isMobile = useMediaQuery('(max-width: 600px)');

  return (
    // Navbar component for the app
    <AppBar
      position='static'
      style={{
        height: isMobile ? '80px' : '100px',
        backgroundColor: '#0000CD',
      }}
    >
      <Toolbar style={{ marginTop: '5px' }}>
        <LaptopIcon style={{ fontSize: isMobile ? 30 : 40, marginRight: '5px' }} />
        <p
          style={{
            fontSize: isMobile ? 20 : 30,
            fontWeight: 'bold',
          }}
        >
          YouScience Coding-Challenge
        </p>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

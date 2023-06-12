import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { getLocalSettings, setLocalSettings } from 'api/settings';
import Navbar from 'components/NavBar';
import { PagePropsType } from 'pages/_app';
import React, { useState } from 'react';

const SettingsPage = (props: PagePropsType) => {
  const { setMode, mode } = props;

  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const [temp, setTemp] = useState(1);
  const [top_p, setTopP] = useState(1);
  const [systemMsg, setSystemMsg] = useState('');

  React.useEffect(() => {
    getLocalSettings().then(settings => {
      if (settings) {
        setApiKey(settings.apiKey || '');
        setTemp(settings.temp);
        setTopP(settings.top_p);
        setSystemMsg(settings.systemMsg);
      }
    });
  }, []);

  const handleSaveSettings = () => {
    setLocalSettings({
      apiKey,
      temp,
      top_p,
      systemMsg,
    });
  };

  const handleToggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  return (
    <Box minHeight="100vh" bgcolor="background.default">
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Navbar setMode={setMode} mode={mode} />
        <TextField
          label="ChatGPT API Key"
          color="primary"
          variant="outlined"
          fullWidth
          type={showApiKey ? 'text' : 'password'}
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleToggleApiKeyVisibility} edge="end">
                  {showApiKey ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="ChatGPT System Message"
          variant="outlined"
          fullWidth
          value={systemMsg}
          onChange={e => setSystemMsg(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Temperature (0 to 2) defaults to 1"
          variant="outlined"
          fullWidth
          value={temp}
          onChange={e => setTemp(Number(e.target.value))}
          sx={{ mb: 2 }}
          type="number"
        />
        <TextField
          label="top_p (0 to 1) defaults to 1"
          variant="outlined"
          fullWidth
          value={top_p}
          onChange={e => setTopP(Number(e.target.value))}
          sx={{ mb: 2 }}
          type="number"
        />
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </Container>
    </Box>
  );
};

export default SettingsPage;


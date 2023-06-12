import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React from 'react';

const HelpPage = () => {
  return (
    <Box
      sx={{
        height: 'parent',
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'center',
        // background: 'linear-gradient(to bottom, #4a148c, #880e4f)',
        // color: '#fff',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            my: 4,
            // textAlign: 'center',
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            ncode.syosetu ChatGPT Translator
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Don't wait anymore for translation groups to catch up to raws!
          </Typography>
          <Button href="/translate">Try It Now!</Button>
        </Box>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            About Our Service
          </Typography>
          <Typography variant="body1" gutterBottom>
            Use ChatGPT to translate Japanese web novels from ncode.syosetu. AI
            does a surprisingly good job of producing understandable text -
            unlike typical ML translation.
          </Typography>
        </Box>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Why Use Us?
          </Typography>
          <Typography variant="body1" gutterBottom>
            You can always create a ChatGPT account and manually copy-paste
            text, but it's a pain in the ass for the following reasons (trust me
            I tried):
          </Typography>
          <Typography variant="body1" gutterBottom>
            1) There's no auto saving of translated chapters so it takes a lot
            of copy pasting and self organizing to read the chapters again
          </Typography>
          <Typography variant="body1" gutterBottom>
            2) ChatGPT has a max token limit so for really long chapters you
            have to break it down yourself
          </Typography>
          <Typography variant="body1" gutterBottom>
            3) Unless you pay an additional $20.00 USD / month ChatGPT isn't
            always available
          </Typography>
          <Typography variant="body1" gutterBottom>
            4) You have to self track bookmarks and ncode URLs which is much
            harder to do due to language barrier
          </Typography>
        </Box>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            What do I need?
          </Typography>
          <Typography variant="body1" gutterBottom>
            You need a ChatGPT account (free to create) and an API key. You will
            be charged for API usage but it's pretty cheap. As of 5/25/2023, the
            cost of using the 3.5-turbo model is $0.002 / 1K tokens prompt and
            response. The cost of one translated chapter comes out to about
            $0.02 USD for 3000 words input and 3000 words output.
          </Typography>
        </Box>
        <Box sx={{ my: 4 }}>
          <Typography variant="body2" align="center">
            © 2023 Web Novel Translator AI. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HelpPage;


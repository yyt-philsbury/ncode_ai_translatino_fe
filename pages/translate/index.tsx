import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  BookType,
  ChapterType,
  saveBookToDisk,
  saveChapterToDisk,
} from 'api/archive';
import { getBookIntro, getChapter, getCleanedUrlInfo } from 'api/core';
import { getBooksDb, getChaptersDb } from 'api/db';
import { getPrevUrls, PrevUrlsType, saveUrl } from 'api/prev_urls';
import Navbar from 'components/NavBar';
import { PagePropsType } from 'pages/_app';
import React, { useState } from 'react';

export type TextInfoType = {
  id: string;
  startTranslating: boolean;
  errorText: string;
  rawText: string;
  translatedText: string;
  handleTranslationDone: (
    id: string,
    isTitle: boolean,
    translatedText: string,
    errorText: string,
  ) => void;
};

const TranslationPage = (props: PagePropsType) => {
  const { setMode, mode } = props;

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [lines, setLines] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errText, setErrTxt] = React.useState('');
  const [isUsingCache, setIsUsingCache] = React.useState(false);
  const [prevUrls, setPrevUrls] = React.useState<PrevUrlsType[]>([]);

  React.useEffect(() => {
    getPrevUrls().then(payload => {
      setPrevUrls(payload);
    });
  }, []);

  const handleTranslate = (url: string, forceFetch: boolean) => {
    setErrTxt('');
    setIsUsingCache(false);
    setTitle('');
    setLines([]);

    try {
      const urlInfo = getCleanedUrlInfo(url);
      if (!urlInfo.chapterUrl)
        throw new Error('URL does not point to a chapter');
    } catch (err) {
      if (err instanceof Error) {
        setErrTxt(err.message);
      }
      return;
    }

    const urlInfo = getCleanedUrlInfo(url);
    const { chapterUrl } = urlInfo;
    if (!chapterUrl) throw new Error('URL does not point to a chapter');

    setIsLoading(true);
    getBooksDb()
      .getItem<BookType>(urlInfo.bookUrl)
      .then(async book => {
        // If book info not found, get book intro and cache it
        if (!book) {
          const ret = await getBookIntro(urlInfo);
          await saveBookToDisk(urlInfo, ret.title, ret.author, ret.summary);
        }
        // Check chapter cache
        const chapter = await getChaptersDb().getItem<ChapterType>(chapterUrl);
        if (forceFetch || !chapter) {
          const result = await getChapter(urlInfo);
          await saveChapterToDisk(urlInfo, result);
          setTitle(result.title);
          setLines(result.lines);
          setIsUsingCache(false);
        } else if (chapter) {
          setTitle(chapter.title);
          setLines(chapter.lines);
          setIsUsingCache(true);
        }

        await saveUrl(urlInfo);
        const newPrevUrls = await getPrevUrls();
        setPrevUrls(newPrevUrls);
      })
      .catch(err => {
        if (err instanceof Error) {
          setErrTxt(err.message);
          console.error(err);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Box minHeight={'100vh'} bgcolor={'background.default'}>
      <Navbar setMode={setMode} mode={mode} />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center" gutterBottom>
              Translation Results
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              disablePortal
              id="combo-box-demo"
              options={prevUrls.map(e => `${e.url}`)}
              inputValue={url}
              onInputChange={(_event, value) => {
                if (value) {
                  // const newUrl = value.split(' | ')[0].trim();
                  setUrl(value);
                } else setUrl('');
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="ncode.syosetu.com/XXX/X"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}
            />
          </Grid>
          <Grid item container xs={12} spacing={2}>
            <Grid item>
              <Button
                onClick={() => handleTranslate(url, false)}
                sx={{ mb: 2 }}
              >
                Translate
              </Button>
            </Grid>
            {isUsingCache && (
              <Grid item>
                <Button
                  onClick={() => handleTranslate(url, true)}
                  sx={{ mb: 2 }}
                >
                  Re-translate
                </Button>
              </Grid>
            )}
            <Grid item>
              <Button
                onClick={() => {
                  if (mode === 'light') {
                    setMode('dark');
                  } else setMode('light');
                }}
                sx={{ mb: 2 }}
              >
                Switch Mode
              </Button>
            </Grid>
          </Grid>
          {errText && (
            <Grid item xs={12}>
              <Typography>{errText}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            {isLoading && <CircularProgress />}
            {isUsingCache && <Typography>Using cached translation</Typography>}
            {!isLoading && (
              <>
                <Typography textAlign="center">{`${title}`}</Typography>
                {lines.map((line, idx) => {
                  return (
                    <div key={idx.toString()}>
                      <Typography>{`${line}`}</Typography>
                      <br />
                    </div>
                  );
                })}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TranslationPage;


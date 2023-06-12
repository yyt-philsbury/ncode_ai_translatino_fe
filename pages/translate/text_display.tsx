import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import React from 'react';
import { delay } from 'utils/delay';

import { TextInfoType } from '.';

function TextDisplay(props: TextInfoType) {
  const {
    id,
    startTranslating,
    errorText,
    rawText,
    translatedText,
    handleTranslationDone,
  } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (startTranslating) {
      const beginTranslate = async () => {
        try {
          // const result = await translate(preparedText[i]);
          // translatedText.push(result.choices[0].message.content);
          // handleTranslationDone(id, '')

          console.log(`starting ${id}`);

          if (rawText.trim().length === 0) {
            handleTranslationDone(id, `blank ${id}`, '');
            return;
          }

          await delay(5000);
          handleTranslationDone(id, `translated text ${id}`, '');

          // if (rawText.trim().length === 0) {
          //   handleTranslationDone(id, rawText, '');
          // } else {
          //   await delay(5000);
          //   handleTranslationDone(id, `translated text ${id}`, '');
          // }
        } catch (error) {
          console.error('Error translating:', error);
        } finally {
          setIsLoading(false);
        }
      };

      setIsLoading(true);
      beginTranslate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTranslating]);

  const textToDisplay = React.useMemo((): string => {
    if (!translatedText && !errorText) return rawText;
    return translatedText || errorText;
  }, [rawText, translatedText, errorText]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        {isLoading && <CircularProgress />}
        {`${textToDisplay}`}
      </Grid>
    </Grid>
  );
}

export default TextDisplay;


import { getLocalSettings } from 'api/settings';
import axios, { AxiosError } from 'axios';
import parseUrl from 'parse-url';
import lzString = require('lz-string/libs/lz-string.min.js');

export type UrlInfoType = {
  site: string;
  url: string;
  bookUrl: string;
  chapterUrl?: string;
};

export type FetchBookResultType = {
  title: string;
  summary: string;
  author: string;
};

export type FetchChapterResultType = {
  title: string;
  lines: string[];
};

export const getCleanedUrlInfo = (url: string): UrlInfoType => {
  try {
    const parsedUrl = parseUrl(url, true);
    switch (parsedUrl.resource) {
      case 'ncode.syosetu.com':
        break;
      default:
        throw new Error(`Do not support parsing ${parsedUrl.resource}`);
    }
  } catch (err) {
    throw new Error('Not a URL');
  }

  const parsedInfo = parseUrl(url, true);
  const cleanedUrl = `https://${parsedInfo.resource}${parsedInfo.pathname}`;
  switch (parsedInfo.resource) {
    case 'ncode.syosetu.com':
      const path = parsedInfo.pathname.split('/');
      return {
        site: 'ncode.syosetu.com',
        url: cleanedUrl,
        bookUrl: `https://ncode.syosetu.com/${path[1]}`,
        chapterUrl: path[2]
          ? `https://ncode.syosetu.com/${path[1]}/${path[2]}`
          : undefined,
      };
    default:
      throw new Error(`Not supported resource ${parsedInfo.resource}`);
  }
};

export const getBookIntro = async (urlInfo: UrlInfoType) => {
  const { bookUrl } = urlInfo;

  const settings = await getLocalSettings();
  if (!settings?.apiKey) throw new Error('Missing ChatGPT API Key');

  let ret: FetchBookResultType;
  switch (urlInfo.site) {
    case 'ncode.syosetu.com':
      try {
        const rsp = await axios.get('/v1/core/book', {
          // signal: AbortSignal.timeout(7000),
          // timeout: 7000,
          params: {
            url: bookUrl,
          },
          headers: {
            Authorization: `Bearer ${settings.apiKey}`,
          },
        });

        ret = rsp.data as FetchBookResultType;
        break;
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.data?.message) {
            throw new Error(`${err.code}: ${err.response?.data?.message}`);
          } else if (err.response?.data?.error) {
            throw new Error(`${err.code}: ${err.response?.data?.error}`);
          }
          throw new Error(`${err.code}: ${err.message} `);
        }
        throw err;
      }
    default:
      throw new Error(`Invalid URL ${urlInfo.site}`);
  }

  return ret;
};

export const getChapter = async (
  urlInfo: UrlInfoType,
): Promise<FetchChapterResultType> => {
  const { chapterUrl } = urlInfo;
  if (!chapterUrl) throw new Error('Invalid URL');

  const settings = await getLocalSettings();
  if (!settings?.apiKey) throw new Error('Missing ChatGPT API Key');

  let ret: FetchChapterResultType;
  switch (urlInfo.site) {
    case 'ncode.syosetu.com':
      try {
        const rsp = await axios.get('/v1/core/chapter', {
          // signal: AbortSignal.timeout(7000),
          // timeout: 7000,
          params: {
            url: chapterUrl,
          },
          headers: {
            Authorization: `Bearer ${settings.apiKey}`,
          },
        });

        ret = JSON.parse(
          lzString.decompressFromUTF16(rsp.data),
        ) as FetchChapterResultType;
        break;
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.data) {
            throw new Error(`${err.response.status}: ${err.response?.data}`);
          }
          throw new Error(`${err.code}: ${err.message} `);
        }
        throw err;
      }
    default:
      throw new Error(`Invalid URL ${urlInfo.site}`);
  }

  return ret;
};


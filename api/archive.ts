import { getCleanedUrlInfo, UrlInfoType } from 'api/core';
import { getBooksDb, getChaptersDb } from 'api/db';

export type ChapterType = {
  title: string;
  lines: string[];
};

export type BookType = {
  title: string;
  author: string;
  summary: string;
  chapterUrls: string[];
};

export const getBooks = async (): Promise<({ url: string } & BookType)[]> => {
  const ret: ({ url: string } & BookType)[] = [];
  await getBooksDb().iterate((value, url) => {
    const bookInfo = JSON.parse(value as string) as BookType;
    ret.push({ url, ...bookInfo });
  });

  return ret;
};

export const saveBookToDisk = async (
  urlInfo: UrlInfoType,
  title: string,
  author: string,
  summary: string,
) => {
  const book = await getBooksDb().getItem<BookType>(urlInfo.bookUrl);
  if (!book) {
    await getBooksDb().setItem<BookType>(urlInfo.bookUrl, {
      title,
      author,
      summary,
      chapterUrls: [],
    });
  } else {
    await getBooksDb().setItem<BookType>(urlInfo.bookUrl, {
      title,
      author,
      summary,
      chapterUrls: book.chapterUrls,
    });
  }
};

export const modifyBookInfo = async (
  url: string,
  title?: string,
  author?: string,
) => {
  const parsedUrl = getCleanedUrlInfo(url);
  const { bookUrl } = parsedUrl;

  const bookInfo = await getBooksDb().getItem<BookType>(bookUrl);
  if (bookInfo) {
    bookInfo.title = title || bookInfo.title;
    bookInfo.author = author || bookInfo.author;
    await getBooksDb().setItem<BookType>(bookUrl, bookInfo);
  }
};

export const saveChapterToDisk = async (
  urlInfo: UrlInfoType,
  chapter: ChapterType,
) => {
  const { chapterUrl, bookUrl, url } = urlInfo;
  if (!chapterUrl) throw new Error(`${url} is not a link to a chapter`);

  const bookInfo = await getBooksDb().getItem<BookType>(bookUrl);
  if (!bookInfo) {
    throw new Error('Missing book entry - cannot insert chapter');
  }

  const index = bookInfo.chapterUrls.findIndex(e => e === chapterUrl);
  if (index === -1) {
    bookInfo.chapterUrls.push(chapterUrl);
    await getBooksDb().setItem(bookUrl, bookInfo);
  } else {
    bookInfo[index] = chapterUrl;
    await getBooksDb().setItem(bookUrl, bookInfo);
  }

  await getChaptersDb().setItem(chapterUrl, chapter);
};


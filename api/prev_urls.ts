import { BookType, ChapterType } from 'api/archive';
import { UrlInfoType } from 'api/core';
import { getBooksDb, getChaptersDb, getPrevUrlsDb } from 'api/db';

export type PrevUrlsType = {
  bookTitle: string;
  chapterTitle: string;
  url: string;
};

export const getPrevUrls = async (): Promise<PrevUrlsType[]> => {
  const prevUrls = await getPrevUrlsDb().getItem<PrevUrlsType[]>('prevUrls');
  return prevUrls?.reverse() || [];
};

export const saveUrl = async (urlInfo: UrlInfoType) => {
  const { chapterUrl } = urlInfo;
  if (!chapterUrl) throw new Error('Not a valid chapter url');

  const book = await getBooksDb().getItem<BookType>(urlInfo.bookUrl);
  const chapter = await getChaptersDb().getItem<ChapterType>(chapterUrl);

  if (!book || !chapter)
    throw new Error(`Book / Chapter missing from cache for ${urlInfo.url}`);

  let prevUrls = await getPrevUrlsDb().getItem<PrevUrlsType[]>('prevUrls');
  if (!prevUrls) {
    await getPrevUrlsDb().setItem<PrevUrlsType[]>('prevUrls', [
      { bookTitle: book.title, chapterTitle: chapter.title, url: urlInfo.url },
    ]);
    return;
  }

  prevUrls = prevUrls.filter(e => e.url !== urlInfo.url);
  prevUrls = [
    ...prevUrls.slice(-29),
    {
      bookTitle: book.title,
      chapterTitle: chapter.title,
      url: urlInfo.url,
    },
  ];

  await getPrevUrlsDb().setItem<PrevUrlsType[]>('prevUrls', prevUrls);
  return;
};


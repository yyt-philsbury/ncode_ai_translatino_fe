import localforage from 'localforage';

const BOOKS_DB_NAME = 'novel_ai_books';
const CHAPTERS_DB_NAME = 'novel_ai_chapters';
const SETTINGS_DB_NAME = 'novel_ai_settings';
const PREV_URLS_DB_NAME = 'novel_ai_prev_urls';

let chaptersDb: LocalForage;
let booksDb: LocalForage;
let settingsDb: LocalForage;
let prevUrlsDb: LocalForage;

export const getPrevUrlsDb = () => {
  if (!prevUrlsDb) {
    prevUrlsDb = localforage.createInstance({
      name: PREV_URLS_DB_NAME,
      driver: localforage.INDEXEDDB,
    });
  }
  return prevUrlsDb;
};

export const getBooksDb = () => {
  if (!booksDb) {
    booksDb = localforage.createInstance({
      name: BOOKS_DB_NAME,
      driver: localforage.INDEXEDDB,
    });
  }
  return booksDb;
};

export const getChaptersDb = () => {
  if (!chaptersDb) {
    chaptersDb = localforage.createInstance({
      name: CHAPTERS_DB_NAME,
      driver: localforage.INDEXEDDB,
    });
  }
  return chaptersDb;
};

export const getSettingsDb = () => {
  if (!settingsDb) {
    settingsDb = localforage.createInstance({
      name: SETTINGS_DB_NAME,
      driver: localforage.INDEXEDDB,
    });
  }
  return settingsDb;
};


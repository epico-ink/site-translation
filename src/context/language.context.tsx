import { Locale } from "../translations/types";
import locales from "../translations/locales";
import { locales as langLocales } from "../translations/config";

import { commonFiles, nonCommonFiles } from "../constants/files.constants";
/**
 * Language Context
 */

export const getLocalizationProps = (languageID: string, namespace: string) => {
  const lang: Locale = langLocales.includes(languageID as Locale)
    ? (languageID as Locale)
    : "en";
  const locale: any = locales[lang];
  const strings: any = locale[namespace];
  const translations = {
    ...strings,
  };
  return {
    locale: lang || "en",
    translations,
    namespace,
  };
};

export const getAllLocalization = (languageID: string) => {
  const lang: Locale = langLocales.includes(languageID as Locale)
    ? (languageID as Locale)
    : "en";

  let translations = {};
  let locale = locales[lang];
  let localeNamespace = Object.keys(locale);

  localeNamespace.forEach((namespace) => {
    const strings = locale[namespace];

    translations = { ...translations, ...strings };
  });

  return {
    locale: lang || "en",
    translations,
    namespace: "all",
  };
};

export const getNonCommonPaths = async (languageID: string) => {
  const lang: Locale = langLocales.includes(languageID as Locale)
    ? (languageID as Locale)
    : "en";

  let nonCommons;

  for (const key in nonCommonFiles) {
    //check if nonCommon[key] exist in target lang
    const filePath = `src/translations/locales/${lang}/${nonCommonFiles[key]}`;

    const imports = await import(
      `src/translations/locales/${lang}/${nonCommonFiles[key]}`
    );

    const strings = imports.default;

    for (let string in strings) {
      nonCommons = { ...nonCommons, [string]: filePath };
    }
  }

  return {
    nonCommons,
  };
};

export const getCommonPaths = async (languageID: string) => {
  const lang: Locale = langLocales.includes(languageID as Locale)
    ? (languageID as Locale)
    : "en";

  let commons;

  for (const key in commonFiles) {
    const filePath = `src/translations/locales/${lang}/${commonFiles[key]}`;
    const imports = await import(
      `src/translations/locales/${lang}/${commonFiles[key]}`
    );
    const strings = imports.default;

    for (let string in strings) {
      commons = { ...commons, [string]: filePath };
    }
  }
  return {
    commons,
  };
};

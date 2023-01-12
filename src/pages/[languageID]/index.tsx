import React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { locales } from "../../translations/config";
import {
  getLocalizationProps,
  LanguageProvider,
} from "../../context/language.context";
import { Localization, SourceLanguage } from "../../translations/types";
import { Home } from "../../containers/Home/Home";

export interface IHomePageProps {
  localization?: Localization;
  sourceLanguage?: SourceLanguage;
}

const HomePage: NextPage<IHomePageProps> = ({
  localization,
  sourceLanguage,
}) => {
  // const strings = typeof localization?.translations;

  return (
    <>
      {/* <LanguageProvider localization={localization}>
        <Home />
      </LanguageProvider> */}
      <Home
        namespace={localization?.namespace}
        translations={localization?.translations}
        sourceLanguage={sourceLanguage.translations}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const sourceLanguage = getLocalizationProps("en", "home");
  const localization = getLocalizationProps(
    ctx.params?.languageID as string,
    "home"
  );

  return {
    props: {
      localization,
      sourceLanguage,
    },
    revalidate: 20,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: locales.map((languageID) => ({ params: { languageID } })),
    fallback: false,
  };
};

export default HomePage;

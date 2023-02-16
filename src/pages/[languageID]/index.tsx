import React, { useEffect } from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { locales } from "../../translations/config";
import {
  getAllLocalization,
  getCommonPaths,
  getNonCommonPaths,
} from "../../context/language.context";
import { LANGUAGES } from "../../constants/language.constants";
import { Localization, SourceLanguage } from "../../translations/types";
import { Home } from "../../containers/Home/Home";
import {
  Dialog,
  Box,
  Typography,
  Button,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../context/auth.context";
import { useRouter } from "next/router";
export interface IHomePageProps {
  localization?: Localization;
  sourceLanguage?: SourceLanguage;
  nonCommonPaths?: any;
  commonPaths?: any;
}

const HomePage: NextPage<IHomePageProps> = ({
  localization,
  sourceLanguage,
  nonCommonPaths,
  commonPaths,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { accessToken, setAccessToken } = useAuth();
  const { replace } = useRouter();
  const loginWithGithub = () => {
    setIsLoading(true);
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" +
        process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID +
        "&scope=repo"
    );
  };

  const loginAnonymously = async () => {
    setIsLoading(true);
    const token = await fetch(
      "https://intvgdsy4fjbc23oufhllxo2ru0sihpe.lambda-url.ap-northeast-1.on.aws/",
      {
        method: "GET",
        headers: {
          origin: "http://localhost:3001/",
        },
      }
    );
    const data = await token.json();
    if (data) {
      setAccessToken(data.token);
    }
    replace(`/[languageID]`, `/${LANGUAGES[0].languageID}`);
  };

  return (
    <>
      <Dialog open={accessToken ? false : true}>
        <Box maxWidth={500}>
          <DialogTitle>Login with Github</DialogTitle>
          <Typography sx={{ padding: 3 }}>
            We require you to login with Github to make pull requests to the
            repository. Authorize the app to continue.
          </Typography>
          <Box margin={2}>
            {isLoading && (
              <CircularProgress
                style={{
                  justifyContent: "center",
                  display: "flex",
                  margin: "auto",
                }}
              />
            )}
            {!isLoading && (
              <div
                style={{
                  justifyContent: "center",
                  display: "flex",
                  margin: "auto",
                  width: "fit-content",
                }}
              >
                <Button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#000",
                    color: "#fff",
                    margin: "2rem",
                  }}
                  onClick={loginWithGithub}
                >
                  Login
                </Button>
                <Button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#022",
                    color: "#fff",
                    margin: "2rem",
                  }}
                  onClick={loginAnonymously}
                >
                  Login Anonymously
                </Button>
              </div>
            )}
          </Box>
        </Box>
      </Dialog>
      <Home
        nonCommonPaths={nonCommonPaths}
        commonPaths={commonPaths}
        translations={localization?.translations}
        sourceLanguage={sourceLanguage.translations}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const sourceLanguage = getAllLocalization("en");

  const allLocalization = getAllLocalization(ctx.params?.languageID as string);

  const commonPaths = await getCommonPaths(ctx.params?.languageID as string);

  const nonCommonPaths = await getNonCommonPaths(
    ctx.params?.languageID as string
  );

  return {
    props: {
      // uniqueProperties,
      commonPaths: commonPaths.commons,
      nonCommonPaths: nonCommonPaths.nonCommons,
      localization: allLocalization,
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

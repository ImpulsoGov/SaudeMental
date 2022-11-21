import { useState } from 'react';
import Head from 'next/head';
import App from 'next/app';
import { useRouter } from 'next/router';

import { Footer } from '@impulsogov/design-system';
import { NavBar } from '@impulsogov/design-system';
import '../styles/globals.css';


import { getData } from '../services/getData';
import { LAYOUT } from '../querys/LAYOUT';
import { Context } from '../contexts/Context';


function MyApp(props) {
  const { Component, pageProps } = props;
  const [city, setCity] = useState("Aracaju - SE")
  const router = useRouter();
  let path = router.pathname;
  return (
    <>
      <Head>
        <title>Saúde Mental</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Context.Provider value={[city, setCity]}>
        <NavBar
          user={null}
          municipio={city}
          setMunicipio={setCity}
          data={props.res[0].municipios}
          theme={{
            logoProjeto: path === "/"
              ? props.res[0].logos[0].logo.url
              : props.res[0].logos[1].logo.url,
            cor: path === "/" ? "ColorSM" : "WhiteSM"
          }}
          menu={props.res[0].menus}
          SeletorTipo={1}
          NavBarIconBranco={props.res[0].buttonImages[2].image.url}
          NavBarIconDark={props.res[0].buttonImages[1].image.url}
        />
        <Component {...pageProps} />

        <Footer
          contactCopyright={{
            email: props.res[0].contactCopyrights[0].email,
            copyright: props.res[0].contactCopyrights[0].copyright
          }}
          theme={{
            logoProjeto: props.res[0].logos[0].logo.url,
            logoImpulso: props.res[0].logos[3].logo.url,
            cor: "SM"
          }}
          menu={props.res[0].menus}

          links={props.res[0].menus}

          address={{
            first: "",
            second: ""
          }}

          socialMediaURLs={[
            {
              url: props.res[0].socialMedias[0].url,
              logo: props.res[0].socialMedias[0].logo.url
            },
            {
              url: props.res[0].socialMedias[1].url,
              logo: props.res[0].socialMedias[1].logo.url
            },
            {
              url: props.res[0].socialMedias[2].url,
              logo: props.res[0].socialMedias[2].logo.url
            }
          ]}
        />
      </Context.Provider>
    </>
  )
}

MyApp.getInitialProps = async (context) => {
  const pageProps = await App.getInitialProps(context)
  const res = [
    await getData(LAYOUT),
  ]
  return {
    ...pageProps,
    res
  }
}

export default MyApp



import { getSession, SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import App from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Footer, NavBar } from '@impulsogov/design-system';
import '../styles/globals.css';


import { Context } from '../contexts/Context';
import { LAYOUT } from '../querys/LAYOUT';
import { getData } from '../services/getData';

import { useWindowWidth } from '../helpers/useWindowWidth';
import { alterarSenha, solicitarNovaSenha, validarCodigo } from '../services/esqueciMinhaSenha';
import { criarSenha, primeiroAcesso } from '../services/primeiroAcesso';
import { validacao, validateCredentials } from '../services/validateCredentials';
import style from '../styles/MyApp.module.css';

import { addUserDataLayer } from '../hooks/addUserDataLayer';
import { rotaDinamica } from '../hooks/rotaDinamica';

import TagManager from "react-gtm-module";
import Analytics from '../components/Analytics/Analytics';
import { hotjar } from 'react-hotjar';
const tagManagerArgs = {
  gtmId: "GTM-MLMCMBM",
};

function MyApp(props) {
  const { Component, pageProps: { session, ...pageProps } } = props;
  const [city, setCity] = useState("Aracaju - SE");
  const router = useRouter();
  const dynamicRoute = router.asPath;
  let path = router.pathname;
  let width = useWindowWidth();

  const nome = props.ses == null || typeof (props.ses) == undefined ? "" : props.ses.user.nome;
  const cargo = props.ses != null ? props.ses.user.cargo : "";
  const [status, setStatus] = useState();
  const [isLoading, setLoading] = useState(true);
  const [active, setMode] = useState(true);
  useEffect(() => TagManager.initialize(tagManagerArgs), []);
  useEffect(() => rotaDinamica(router), [router.events]);
  useEffect(() => addUserDataLayer(props.ses), [props.ses]);
  useEffect(() => setMode(true), [dynamicRoute]);

  useEffect(() => {
    hotjar.initialize(3494073, 6);
  }, []);

  useEffect(() => {
    if (hotjar.initialized() && props.ses && props.ses.user) {
      hotjar.identify(props.ses.user.id,
        {
          nome: props.ses.user.nome,
          id: props.ses.user.id,
          cargo: props.ses.user.cargo,
          municipio: props.ses.user.municipio,
          unidade_saude: props.ses.user.unidade_saude,
          municipio_id_sus: props.ses.user.municipio_id_sus,
          is_test_user: (props.ses.user.cargo == 'Impulser') && !props.ses.user.mail.includes('@impulsogov.org') && !props.ses.user.municipio.includes('Impulsolândia')
        });
    }
  }, [props.ses]);

  return (
    <>
      <Head>
        <title>Saúde Mental</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Context.Provider value={ [city, setCity] }>
        <SessionProvider session={ session } refetchInterval={ 60 * 60 } refetchOnWindowFocus={ true } clientMaxAge={ 8 * 60 * 60 }>
          <Auth setStatus={ setStatus }>
            { isLoading &&
              <NavBar
                user={ {
                  nome: nome,
                  cargo: cargo,
                  button: { label: "sair" },
                  label: props.ses == null || typeof (props.ses) == undefined ? "Entrar" : nome[0],
                  login: signIn,
                  logout: signOut,
                  validarCredencial: validateCredentials,
                  validacao: validacao
                } }
                login={ {
                  titulo: "Faça o login para ver os indicadores do seu município."
                } }
                municipio={ city }
                setMunicipio={ setCity }
                data={ props.res[0].municipios }
                theme={ {
                  logoProjeto: width > 1000 ?
                    path == '/' ? props.res[0].logoSms[0].logo[0].url : props.res[0].logoSms[0].logo[1].url :
                    props.res[0].logoSms[0].logo[0].url,
                  cor: path == '/' ? "ColorSM" : "WhiteSM",
                  logoLink: props.ses ? '/inicio' : '/'
                } }
                seletorMunicipios={ path == '/analise' }
                showMenuMobile={ {
                  states: {
                    active: active,
                    setMode: setMode
                  }
                } }
                menu={
                  props.ses ? [
                    props.ses ? { label: "Inicio", url: "/inicio" } : { label: "Inicio", url: "/" },
                    props.res[0].menus[1],
                    props.res[0].menus[2]
                  ] : [
                    props.res[0].menus[0],
                    props.res[0].menus[1],
                  ]
                }
                NavBarIconBranco={ props.res[0].logoMenuMoblies[0].logo.url }
                NavBarIconDark={ props.res[0].logoMenuMoblies[1].logo.url }
                esqueciMinhaSenha={ {
                  reqs: {
                    mail: solicitarNovaSenha,
                    codigo: validarCodigo,
                    alterarSenha: alterarSenha
                  },
                  chamadas: {
                    sucesso: "Agora é só clicar no botão ENTRAR com seu e-mail e a senha criada.",
                    aviso: "Caso não lembre o e-mail cadastrado, entre em contato conosco através do e-mail (saudemental@impulsogov.org)."
                  }
                } }
                ModalInicio={ {
                  titulo: "Faça o login para ver os indicadores do seu município.",
                  chamada: "Se você já possui uma senha, clique em ENTRAR. Caso o seu município seja parceiro e seu acesso já foi autorizado, clique em PRIMEIRO ACESSO para criar a sua senha.",
                  botaoPrincipal: {
                    label: "entrar",
                  },
                  botaoSecundario: {
                    label: "primeiro acesso",
                  },
                  botaoAjuda: {
                    label: "ESTOU COM PROBLEMAS NO LOGIN",
                    link: "https://wa.me/message/HAR5RB43UWVEG1"
                  }
                } }
                primeiroAcesso={ {
                  reqs: {
                    mail: primeiroAcesso,
                    codigo: validarCodigo,
                    alterarSenha: criarSenha,
                  },
                  titulos: {
                    mail: "Boas vindas! Precisamos que você crie uma senha para acessar os indicadores do seu município."
                  },
                  chamadas: {
                    sucesso: "Agora é só clicar no botão ENTRAR com seu e-mail e a senha criada.",
                    mail: "Se você é de um município parceiro e ainda não tem senha cadastrada, siga os próximos passos.",
                    aviso: "Digite o e-mail cadastrado para receber um código de autorização de criação da senha."
                  }
                } }
              />
            }

            <main className={ style["main-content"] }>
              <Component { ...pageProps } />
            </main>

            <Footer
              theme={ {
                logoProjeto: props.res[0].logoSms[0].logo[0].url,
                logoImpulso: props.res[0].logoImpulsos[0].logo.url,
                cor: "SM"
              } }
              logoLink={ props.ses ? '/inicio' : '/' }
              address={ {
                first: "",
                second: "",
              } }
              contactCopyright={ {
                copyright: props.res[0].copyrights[0].copyright,
                email: props.res[0].copyrights[0].contato,
              } }
              links={ [{ label: "Inicio", url: "/inicio" }, { label: "Sobre", url: "/sobre" }, { label: "Termo de Uso e Politica de Privacidade", url: "/termo-e-privacidade" }] }
              socialMediaURLs={ [
                { url: props.res[0].socialMedias[0].url, logo: props.res[0].socialMedias[0].logo.url },
                { url: props.res[0].socialMedias[1].url, logo: props.res[0].socialMedias[1].logo.url },
                { url: props.res[0].socialMedias[2].url, logo: props.res[0].socialMedias[2].logo.url },
              ] }
            />

          </Auth>
        </SessionProvider>
        <Analytics USER_ID={props.ses?.user.id}/>
      </Context.Provider>
    </>
  );
}

function Auth({ children, setStatus }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { data: status } = useSession({ required: false });
  setStatus(status);
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}

MyApp.getInitialProps = async (context) => {
  const pageProps = await App.getInitialProps(context);
  const res = [
    await getData(LAYOUT),
  ];
  const ses = await getSession(context);
  return {
    ...pageProps,
    res,
    ses,
  };
};

export default MyApp


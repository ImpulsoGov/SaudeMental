import { ButtonLight, PanelSelectorSM, TituloTexto } from '@impulsogov/design-system';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { redirectHomeNotLooged } from '../../helpers/RedirectHome';
import style from '../duvidas/Duvidas.module.css';
import Ambulatorio from './ambulatorio';
import ConsultorioNaRua from './consultorio-na-rua';
import ReducaoDeDanos from './reducao-de-danos';
import Resumo from './resumo';

export async function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);
  if (redirect) return redirect;
  return { props: {} };
}
export default function Paineis() {
  const router = useRouter();
  const [activeTabIndex, setActiveTabIndex] = useState(Number(router.query?.painel));
  const [activeTitleTabIndex, setActiveTitleTabIndex] = useState(0);
  useEffect(() => {
    setActiveTabIndex(Number(router.query?.painel));
  }, [router.query?.painel]);
  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: { painel: activeTabIndex }
    },
    undefined, { shallow: true }
    );
  }, [activeTabIndex]);

  return (
    <div>
      <div className={ style.BotaoVoltar }>
        <ButtonLight
          icone={ { posicao: 'right', url: 'https://media.graphassets.com/8NbkQQkyRSiouNfFpLOG' } }
          label='VOLTAR'
          link='/inicio' />
        <div style={ { position: 'relative', left: '70%' } }>
          <ButtonLight
            icone={ { posicao: 'right', url: 'https://media.graphassets.com/yaYuyi0KS3WkqhKPUzro' } }
            label='CENTRAL DE AJUDA'
            link='/central-de-ajuda' />
        </div>
      </div>

      <TituloTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        titulo='Outros serviços RAPS'
        texto=''
      />

      <PanelSelectorSM
        panel={ Number(router.query?.painel) }
        states={ {
          activeTabIndex: Number(activeTabIndex),
          setActiveTabIndex: setActiveTabIndex,
          activeTitleTabIndex: activeTitleTabIndex,
          setActiveTitleTabIndex: setActiveTitleTabIndex
        } }
        components={ [[
          <Resumo key={ 'resumo-outros-raps' } />,
          <Ambulatorio key={ 'ambulatorio' } />,
          <ConsultorioNaRua key={ 'consultorionarua' } />,
          <ReducaoDeDanos key={ 'reducaodedanos' } />
        ]] }
        subtitles={ [
          [
            {
              label: 'RESUMO',
            },
            {
              label: 'AMBULATÓRIO DE SAÚDE MENTAL',
            },
            {
              label: 'CONSULTÓRIO NA RUA',
            },
            {
              label: 'REDUÇÃO DE DANOS',
            },
          ]
        ] }
        titles={ [
          {
            label: ''
          }
        ] }
      />
    </div>
  );
}

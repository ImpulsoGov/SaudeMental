import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from '@impulsogov/design-system';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { v1 as uuidv1 } from 'uuid';
import { redirectHomeNotLooged } from '../../../helpers/RedirectHome';
import { mostrarCardsDeResumoAmbulatorio } from '../../../helpers/mostrarDadosDeAmbulatorio';
import { getAcoesReducaoDeDanos, getAcoesReducaoDeDanos12meses, getAtendimentosAmbulatorioResumoUltimoMes, getAtendimentosConsultorioNaRua, getAtendimentosConsultorioNaRua12meses } from '../../../requests/outros-raps';

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const Resumo = () => {
  const { data: session } = useSession();
  const [consultorioNaRua, setConsultorioNaRua] = useState([]);
  const [consultorioNaRua12Meses, setConsultorioNaRua12Meses] = useState([]);
  const [reducaoDanos, setReducaoDanos] = useState([]);
  const [reducaoDanos12Meses, setReducaoDanos12Meses] = useState([]);
  const [ambulatorioUltMes, setAmbulatorioUltMes] = useState([]);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setConsultorioNaRua(await getAtendimentosConsultorioNaRua(municipioIdSus));
      setConsultorioNaRua12Meses(
        await getAtendimentosConsultorioNaRua12meses(municipioIdSus)
      );
      setReducaoDanos(await getAcoesReducaoDeDanos(municipioIdSus));
      setReducaoDanos12Meses(await getAcoesReducaoDeDanos12meses(municipioIdSus));

      if (mostrarCardsDeResumoAmbulatorio(municipioIdSus)) {
        setAmbulatorioUltMes(
          await getAtendimentosAmbulatorioResumoUltimoMes(municipioIdSus)
        );
      }
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  const getDadosConsultorioNaRua = () => {
    return consultorioNaRua.find((item) =>
      item.periodo === 'Último período' && item.tipo_producao === 'Todos');
  };

  const getDadosConsultorioNaRua12meses = () => {
    return consultorioNaRua12Meses.find((item) =>
      item.tipo_producao === 'Todos');
  };

  const getDadosReducaoDanos = () => {
    return reducaoDanos.find((item) =>
      item.periodo === 'Último período'
      && item.estabelecimento === 'Todos'
      && item.profissional_vinculo_ocupacao === 'Todas'
    );
  };

  const getDadosReducaoDanos12meses = () => {
    return reducaoDanos12Meses.find((item) =>
      item.estabelecimento === 'Todos'
      && item.profissional_vinculo_ocupacao === 'Todas'
    );
  };

  const getDadosAmbulatorioUltimoMes = () => {
    return ambulatorioUltMes.find((item) =>
      item.periodo === 'Último período'
      && item.estabelecimento === 'Todos'
      && item.ocupacao === 'Todas'
    );
  };

  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=''
        botao={ {
          label: '',
          url: ''
        } }
        titulo='<strong>Resumo</strong>'
      />

      { mostrarCardsDeResumoAmbulatorio(session?.user.municipio_id_ibge) &&
        <>
          <GraficoInfo
            titulo='Ambulatório de Saúde Mental'
            fonte='Fonte: BPA/SIASUS - Elaboração Impulso Gov'
            link={ { label: 'Mais informações', url: '/outros-raps?painel=1' } }
          />

          <Grid12Col
            items={ [
              <>
                { ambulatorioUltMes.length !== 0
                  ? <CardInfoTipoA
                    key={ uuidv1() }
                    indicador={ getDadosAmbulatorioUltimoMes().procedimentos_realizados }
                    titulo={ `Total de atendimentos em ${getDadosAmbulatorioUltimoMes().nome_mes}` }
                    indice={ getDadosAmbulatorioUltimoMes().dif_procedimentos_realizados_anterior }
                    indiceDescricao='últ. mês'
                  />
                  : <Spinner theme='ColorSM' />
                }
              </>,
              <>
                { ambulatorioUltMes.length !== 0
                  ? <CardInfoTipoA
                    key={ uuidv1() }
                    indicador={ getDadosAmbulatorioUltimoMes().procedimentos_por_hora }
                    titulo={ `Total de atendimentos por hora trabalhada em ${getDadosAmbulatorioUltimoMes().nome_mes}` }
                    indice={ getDadosAmbulatorioUltimoMes().dif_procedimentos_por_hora_anterior }
                    indiceDescricao='últ. mês'
                  />
                  : <Spinner theme='ColorSM' />
                }
              </>,
            ] }
          />
        </>
      }

      <GraficoInfo
        titulo='Consultório na Rua'
        fonte='Fonte: SISAB - Elaboração Impulso Gov'
        link={ { label: 'Mais informações', url: '/outros-raps?painel=2' } }
      />

      <Grid12Col
        items={ [
          <>
            { consultorioNaRua.length !== 0
              ? <CardInfoTipoA
                key={ uuidv1() }
                indicador={ getDadosConsultorioNaRua().quantidade_registrada }
                titulo={ `Total de atendimentos em ${getDadosConsultorioNaRua().nome_mes}` }
                indice={ getDadosConsultorioNaRua().dif_quantidade_registrada_anterior }
                indiceDescricao='últ. mês'
              />
              : <Spinner theme='ColorSM' />
            }
          </>,
          <>
            { consultorioNaRua12Meses.length !== 0
              ? <CardInfoTipoA
                key={ uuidv1() }
                indicador={ getDadosConsultorioNaRua12meses().quantidade_registrada }
                titulo={ `Total de atendimentos entre ${getDadosConsultorioNaRua12meses().a_partir_do_mes}/${getDadosConsultorioNaRua12meses().a_partir_do_ano} e ${getDadosConsultorioNaRua12meses().ate_mes}/${getDadosConsultorioNaRua12meses().ate_ano}` }
                indice={ getDadosConsultorioNaRua12meses().dif_quantidade_registrada_anterior }
                indiceDescricao='doze meses anteriores'
              />
              : <Spinner theme='ColorSM' />
            }
          </>,
        ] }
      />

      <GraficoInfo
        titulo='Ações de redução de danos'
        fonte='Fonte: BPA/SIASUS - Elaboração Impulso Gov'
        link={ { label: 'Mais informações', url: '/outros-raps?painel=3' } }
      />

      <Grid12Col
        items={ [
          <>
            { reducaoDanos.length !== 0
              ? <CardInfoTipoA
                key={ uuidv1() }
                indicador={ getDadosReducaoDanos().quantidade_registrada }
                titulo={ `Total de ações de redução de danos em ${getDadosReducaoDanos().nome_mes}` }
                indice={ getDadosReducaoDanos().dif_quantidade_registrada_anterior }
                indiceDescricao='últ. mês'
              />
              : <Spinner theme='ColorSM' />
            }
          </>,
          <>
            { reducaoDanos12Meses.length !== 0
              ? <CardInfoTipoA
                key={ uuidv1() }
                indicador={ getDadosReducaoDanos12meses().quantidade_registrada }
                titulo={ `Total ações de redução de danos entre ${getDadosReducaoDanos12meses().a_partir_do_mes}/${getDadosReducaoDanos12meses().a_partir_do_ano} e ${getDadosReducaoDanos12meses().ate_mes}/${getDadosReducaoDanos12meses().ate_ano}` }
                indice={ getDadosReducaoDanos12meses().dif_quantidade_registrada_anterior }
                indiceDescricao='doze meses anteriores'
              />
              : <Spinner theme='ColorSM' />
            }
          </>,
        ] }
      />
    </div>
  );
};

export default Resumo;

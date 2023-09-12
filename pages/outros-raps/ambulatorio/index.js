import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getAtendimentosAmbulatorioResumoUltimoMes } from "../../../requests/outros-raps";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const Ambulatorio = () => {
  const { data: session } = useSession();
  const [atendimentosUltimoMes, setAtendimentosUltimoMes] = useState([]);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setAtendimentosUltimoMes(await getAtendimentosAmbulatorioResumoUltimoMes(municipioIdSus));
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  const obterAtendimentoGeralUltimoMes = useCallback((atendimentos) => {
    const atendimentoGeral = atendimentos.find((atendimento) =>
      atendimento.ocupacao === 'Todas'
      && atendimento.periodo === 'Último período'
      && atendimento.estabelecimento === 'Todos'
    );

    return atendimentoGeral;
  }, []);

  const obterPropsCardTotalDeAtendimentos = useCallback(() => {
    const atendimentoGeral = obterAtendimentoGeralUltimoMes(atendimentosUltimoMes);

    return {
      titulo: `Total de atendimentos em ${atendimentoGeral.nome_mes}`,
      indicador: atendimentoGeral.procedimentos_realizados,
      indice: atendimentoGeral.dif_procedimentos_realizados_anterior,
      indiceDescricao: 'ult. mês',
      key: `${atendimentoGeral.procedimentos_realizados}${atendimentoGeral.dif_procedimentos_realizados_anterior}`
    };
  }, [atendimentosUltimoMes, obterAtendimentoGeralUltimoMes]);

  // const obterPropsCardTotalDeAtendimentosPorHora = useCallback(() => {
  //   const atendimentoGeral = obterAtendimentoGeralUltimoMes(atendimentosUltimoMes);

  //   return {
  //     titulo: `Total de atendimentos por hora trabalhada em ${atendimentoGeral.nome_mes}`,
  //     indicador: atendimentoGeral.procedimentos_realizados,
  //     indice: atendimentoGeral.dif_procedimentos_realizados_anterior,
  //     indiceDescricao: 'ult. mês',
  //     key: `${atendimentoGeral.procedimentos_realizados}${atendimentoGeral.dif_procedimentos_realizados_anterior}`
  //   };
  // }, [atendimentosUltimoMes, obterAtendimentoGeralUltimoMes]);

  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=""
        botao={{
          label: '',
          url: ''
        }}
        titulo="<strong>Ambulatório de Saúde Mental</strong>"
      />

      <GraficoInfo
        titulo="Ambulatório de Saúde Mental"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />

      <Grid12Col
        proporcao='6-6'
        items={[
          <>{
            atendimentosUltimoMes.length !== 0
              ? <CardInfoTipoA {...obterPropsCardTotalDeAtendimentos()} />
              : <Spinner theme='ColorSM' />
          }</>,
          // <>{
          //   atendimentosUltimoMes.length !== 0
          //     ? <CardInfoTipoA {...obterPropsCardTotalDeAtendimentos()} />
          //     : <Spinner theme='ColorSM' />
          // }</>
        ]}
      />

      <GraficoInfo
        titulo="Atendimentos"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />

      <GraficoInfo
        titulo="Total de atendimentos"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
        tooltip="Indicador é calculado a partir de divisão do total de procedimentos registradas pelo total de horas de trabalho estabelecidas em contrato. De tal modo, dados podem apresentar valores subestimados no caso de férias, licenças, feriados e números de finais de semana no mês."
      />

      <GraficoInfo
        titulo="Atendimentos por horas trabalhadas"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
        tooltip="Indicador é calculado a partir da divisão do total de atendimentos registrados pelo total de horas de trabalho dos profissionais estabelecidas em contrato. De tal modo, valores podem apresentar subnotificação em caso de férias, licenças, feriados, números de maior número de finais de semana no mês."
      />

      <GraficoInfo
        titulo="Pirâmide etária de atendidos"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />

      <GraficoInfo
        titulo="Atendimentos por profissional"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />
    </div>
  );
};

export default Ambulatorio;

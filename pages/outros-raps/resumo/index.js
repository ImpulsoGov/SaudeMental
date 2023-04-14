import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { v1 as uuidv1 } from 'uuid';
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getAcoesReducaoDeDanos, getAcoesReducaoDeDanos12meses, getAtendimentosConsultorioNaRua, getAtendimentosConsultorioNaRua12meses } from "../../../requests/outros-raps";
import naRuaJSON from "../dadosrecife/consultorioNaRua.json";
import naRua12MesesJSON from "../dadosrecife/consultorioNaRua12.json";
import reducaoDeDanosJSON from "../dadosrecife/reducaoDeDanos.json";
import reducaoDeDanos12JSON from "../dadosrecife/reducaoDeDanos12.json";

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
  const [ambulatorioResumo, setAmbulatorioResumo] = useState([]);
  const [ambulatorioUltMes, setAmbulatorioUltMes] = useState([]);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      if (municipioIdSus === '261160') {
        setConsultorioNaRua(naRuaJSON);
        setConsultorioNaRua12Meses(naRua12MesesJSON);
        setReducaoDanos(reducaoDeDanosJSON);
        setReducaoDanos12Meses(reducaoDeDanos12JSON);
      }
      else {
        setConsultorioNaRua(await getAtendimentosConsultorioNaRua(municipioIdSus));
        setConsultorioNaRua12Meses(await getAtendimentosConsultorioNaRua12meses(municipioIdSus));
        setReducaoDanos(await getAcoesReducaoDeDanos(municipioIdSus));
        setReducaoDanos12Meses(await getAcoesReducaoDeDanos12meses(municipioIdSus));
      }
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  const getDadosConsultorioNaRua = () => {
    return consultorioNaRua.find((item) =>
      item.periodo === "Último período" && item.tipo_producao === "Todos");
  };

  const getDadosConsultorioNaRua12meses = () => {
    return consultorioNaRua12Meses.find((item) =>
      item.tipo_producao === "Todos");
  };

  const getDadosReducaoDanos = () => {
    return reducaoDanos.find((item) =>
      item.periodo === "Último período"
      && item.estabelecimento === "Todos"
      && item.estabelecimento_linha_perfil === "Todas"
      && item.estabelecimento_linha_idade === "Todas"
    );
  };

  const getDadosReducaoDanos12meses = () => {
    return reducaoDanos12Meses.find((item) =>
      item.estabelecimento === "Todos"
      && item.estabelecimento_linha_perfil === "Todas"
      && item.profissional_vinculo_ocupacao === "Todas"
      && item.estabelecimento_linha_idade === "Todas"
    );
  };

  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=""
        titulo="<strong>Resumo</strong>"
      />

      <GraficoInfo
        titulo="Ambulatório de Saúde Mental"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
        link={ { label: 'Mais informações', url: '/outros-raps?painel=1' } }
      />
      <Grid12Col
        items={ [
          <>
            {
              <CardInfoTipoA
                key={ uuidv1() }
                indicador={ 100 }
                titulo={ `Total de atendimentos em ${["ate_mes"]}` }
                indice={ -141 }
                indiceDescricao="últ. mês"
              />
            }
          </>,
          <>
            {
              <CardInfoTipoA
                key={ uuidv1() }
                indicador={ 100 }
                titulo={ `Total de atendimentos por hora trabalhada em Julho` }
                indice={ -141 }
                indiceDescricao="doze meses anteriores"
              />
            }
          </>,
        ] }
      />



      <GraficoInfo
        titulo="Consultório na Rua"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
        link={ { label: 'Mais informações', url: '/outros-raps?painel=2' } }
      />

      <Grid12Col
        items={ [
          <>
            { consultorioNaRua.length !== 0 &&
              <CardInfoTipoA
                key={ uuidv1() }
                indicador={ getDadosConsultorioNaRua().quantidade_registrada }
                titulo={ `Total de atendimentos em ${getDadosConsultorioNaRua().nome_mes}` }
                indice={ getDadosConsultorioNaRua().dif_quantidade_registrada_anterior }
                indiceDescricao="últ. mês"
              />
            }
          </>,
          <>
            { consultorioNaRua12Meses.length !== 0 &&
              <CardInfoTipoA
                key={ uuidv1() }
                indicador={ getDadosConsultorioNaRua12meses().quantidade_registrada }
                titulo={ `Total de atendimentos entre ${getDadosConsultorioNaRua12meses().a_partir_do_mes}/${getDadosConsultorioNaRua12meses().a_partir_do_ano} e ${getDadosConsultorioNaRua12meses().ate_mes}/${getDadosConsultorioNaRua12meses().ate_ano}` }
                indice={ getDadosConsultorioNaRua12meses().dif_quantidade_registrada_anterior }
                indiceDescricao="doze meses anteriores"
              />
            }
          </>,
        ] }
      />

      <GraficoInfo
        titulo="Ações de redução de danos"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
        link={ { label: 'Mais informações', url: '/outros-raps?painel=3' } }
      />

      <Grid12Col
        items={ [
          <>
            { reducaoDanos.length !== 0 &&
              <CardInfoTipoA
                key={ uuidv1() }
                indicador={ getDadosReducaoDanos().quantidade_registrada }
                titulo={ `Total de ações de redução de danos em ${getDadosReducaoDanos().nome_mes}` }
                indice={ getDadosReducaoDanos().dif_quantidade_registrada_anterior }
                indiceDescricao="últ. mês"
              />
            }
          </>,
          <>
            { reducaoDanos12Meses.length !== 0 &&
              <CardInfoTipoA
                key={ uuidv1() }
                indicador={ getDadosReducaoDanos12meses().quantidade_registrada }
                titulo={ `Total ações de redução de danos entre ${getDadosReducaoDanos12meses().a_partir_do_mes}/${getDadosReducaoDanos12meses().a_partir_do_ano} e ${getDadosReducaoDanos12meses().ate_mes}/${getDadosReducaoDanos12meses().ate_ano}` }
                indice={ getDadosReducaoDanos12meses().dif_quantidade_registrada_anterior }
                indiceDescricao="doze meses anteriores"
              />
            }
          </>,
        ] }
      />
    </div>
  );
};

export default Resumo;

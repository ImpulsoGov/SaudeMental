import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { v1 as uuidv1 } from 'uuid';
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getAtendimentosConsultorioNaRua, getAtendimentosConsultorioNaRua12meses } from "../../../requests/outros-raps";
import naRuaJSON from "../dadosrecife/consultorioNaRua.json";
import naRua12MesesJSON from "../dadosrecife/consultorioNaRua12.json";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const Resumo = () => {
  const { data: session } = useSession();
  const [consultorioNaRua, setConsultorioNaRua] = useState([]);
  const [consultorioNaRua12Meses, setConsultorioNaRua12Meses] = useState([]);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      if (municipioIdSus === '261160') {
        setConsultorioNaRua(naRuaJSON);
        setConsultorioNaRua12Meses(naRua12MesesJSON);
      }
      else {
        setConsultorioNaRua(await getAtendimentosConsultorioNaRua(municipioIdSus));
        setConsultorioNaRua12Meses(await getAtendimentosConsultorioNaRua12meses(municipioIdSus));
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
        titulo="Referência de Saúde Mental"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
        link={ { label: 'Mais informações', url: '/cuidado-compartilhado?painel=1' } }
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
        link={ { label: 'Mais informações', url: '/cuidado-compartilhado?painel=2' } }
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
            {
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
        link={ { label: 'Mais informações', url: '/cuidado-compartilhado?painel=3' } }
      />

      <Grid12Col
        items={ [
          <>
            {
              <CardInfoTipoA
                key={ uuidv1() }
                indicador={ 100 }
                titulo={ `Total de ações de redução de danos em Julho)` }
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
                titulo={ `Total ações de redução de danos entre Julho/2022 e Julho/2022` }
                indice={ -141 }
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

import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getAtendimentosPorCaps, getPerfilDeAtendimentos, getResumoPerfilDeAtendimentos } from "../../../requests/caps";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const AtendimentoIndividual = () => {
  const { data: session } = useSession();
  const [perfilAtendimentos, setPerfilAtendimentos] = useState([]);
  const [resumoPerfilAtendimentos, setResumoPerfilAtendimentos] = useState();
  const [atendimentosPorCaps, setAtendimentosPorCaps] = useState([]);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setPerfilAtendimentos(await getPerfilDeAtendimentos(municipioIdSus));
      setResumoPerfilAtendimentos(
        await getResumoPerfilDeAtendimentos(municipioIdSus)[0]
      );
      setAtendimentosPorCaps(await getAtendimentosPorCaps(municipioIdSus));
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  const agregarPorEstabelecimentoLinha = (atendimentos) => {
    const atendimentosAgregados = [];

    atendimentos.forEach((atendimento) => {
      const {
        estabelecimento,
        nome_mes: nomeMes,
        estabelecimento_linha_perfil: estabelecimentoLinha,
        perc_apenas_atendimentos_individuais: porcentagemAtendimentos,
        dif_perc_apenas_atendimentos_individuais: difPorcentagemAtendimentosAnterior
      } = atendimento;

      const estabelecimentoLinhaEncontrada = atendimentosAgregados
        .find((item) => item.estabelecimentoLinha === estabelecimentoLinha);

      if (!estabelecimentoLinhaEncontrada) {
        atendimentosAgregados.push({
          nomeMes,
          estabelecimentoLinha,
          atendimentosPorEstabelecimento: [{
            estabelecimento,
            porcentagemAtendimentos,
            difPorcentagemAtendimentosAnterior
          }]
        });
      } else {
        estabelecimentoLinhaEncontrada.atendimentosPorEstabelecimento.push({
          estabelecimento,
          porcentagemAtendimentos,
          difPorcentagemAtendimentosAnterior
        });
      }
    });

    return atendimentosAgregados;
  };

  const getCardsAtendimentosPorCaps = (atendimentos) => {
    const atendimentosPorCapsUltimoPeriodo = atendimentos
      .filter(({ periodo, estabelecimento }) => periodo === "Último período" && estabelecimento !== "Todos");

    const atendimentosAgregados = agregarPorEstabelecimentoLinha(atendimentosPorCapsUltimoPeriodo);

    const cardsAtendimentosPorCaps = atendimentosAgregados.map(({
      estabelecimentoLinha, atendimentosPorEstabelecimento, nomeMes
    }) => (
      <>
        <GraficoInfo
          titulo={ `CAPS ${estabelecimentoLinha}` }
          descricao={ `Dados de ${nomeMes}` }
        />

        <Grid12Col
          items={
            atendimentosPorEstabelecimento.map((item) => (
              <CardInfoTipoA
                titulo={ item.estabelecimento }
                indicador={ item.porcentagemAtendimentos }
                indicadorSimbolo="%"
                indice={ item.difPorcentagemAtendimentosAnterior }
                indiceSimbolo="p.p."
                indiceDescricao="últ. mês"
                key={ uuidv1() }
              />
            ))
          }
          proporcao="3-3-3-3"
        />
      </>
    ));

    return cardsAtendimentosPorCaps;
  };

  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=""
        titulo="<strong>Atendimentos individuais </strong>"
      />

      <GraficoInfo
        descricao="Taxa dos usuários frequentantes no mês que realizaram apenas atendimentos individuais"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      {
        atendimentosPorCaps.length !== 0
        && getCardsAtendimentosPorCaps(atendimentosPorCaps)
      }

      <GraficoInfo
        titulo="Total de atendimentos"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />

      <GraficoInfo
        titulo="Atendimentos por horas trabalhadas"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />
    </div>
  );
};

export default AtendimentoIndividual;

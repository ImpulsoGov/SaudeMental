import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
// import {
//   getPerfilUsuariosPorEstabelecimento,
//   getResumoNovosUsuarios,
//   getAbandonoCoortes,
//   getAtendimentosPorCaps,
//   getProcedimentosPorEstabelecimento,
//   getResumoProcedimentosPorTempoServico,
//   getProcedimentosPorHora
// } from "../../../requests/caps";
import atendPorCaps from "../atendimentoindividuais/porCaps.json";
import novosResumo from "../novosusuarios/novosResumo.json";
import perfPorEstabelecimento from "../perfildousuario/perfilPorEstabelecimento.json";
import procePorEstabelecimento from "../procedimentosporusuarios/porEstabelecimento.json";
import procePorTempoServicoResumo from "../procedimentosporusuarios/porTempoServicoResumo.json";
import procePorHora from "../producao/porHora.json";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const Resumo = () => {
  const { data: session } = useSession();
  const [procedimentosPorHora, setProcedimentosPorHora] = useState(procePorHora);
  const [procedimentoPorTempoServicoResumo, setProcedimentosPorTempoServicoResumo] = useState(procePorTempoServicoResumo[0]);
  const [procedimentosPorEstabelecimento, setProcedimentosPorEstabelecimento] = useState(procePorEstabelecimento);
  const [atendimentoPorCaps, setAtendimentoPorCaps] = useState(atendPorCaps);
  const [novosUsuariosResumo, setNovosUsuariosResumo] = useState(novosResumo);
  const [perfilPorEstabelecimento, setPerfilPorEstabelecimento] = useState(perfPorEstabelecimento);
  const [filtroEstabelecimento, setFiltroEstabelecimento] = useState({
    value: "Todos", label: "Todos"
  });

  // useEffect(() => {
  //   const getDados = async (municipioIdSus) => {
  //     setProcedimentosPorHora(await getProcedimentosPorHora(municipioIdSus));
  //     setProcedimentosPorTempoServicoResumo(await getResumoProcedimentosPorTempoServico(municipioIdSus)[0]);
  //     setProcedimentosPorEstabelecimento(await getProcedimentosPorEstabelecimento(municipioIdSus));
  //     setAtendimentoPorCaps(await getAtendimentosPorCaps(municipioIdSus));
  //     setNovosUsuariosResumo(await getResumoNovosUsuarios(municipioIdSus));
  //     setPerfilPorEstabelecimento(await getPerfilUsuariosPorEstabelecimento(municipioIdSus));
  //   };

  //   if (session?.user.municipio_id_ibge) {
  //     getDados(session?.user.municipio_id_ibge);
  //   }
  // }, []);

  const getDadosUltimoPeriodo = (lista) => {
    return lista.filter((item) => item.periodo === "Último período");
  };

  const getDadosDeEstabelecimentoFiltrado = (lista, filtro) => {
    return lista.find((item) => item.estabelecimento === filtro);
  };

  const getCardsResumoUsuarios = (perfilUsuarios, novosUsuarios, filtroEstabelecimento) => {
    const perfilUsuariosUltimoPeriodo = getDadosUltimoPeriodo(perfilUsuarios);
    const novosUsuariosUltimoPeriodo = getDadosUltimoPeriodo(novosUsuarios);
    const perfilUsuariosDeEstabelecimento = getDadosDeEstabelecimentoFiltrado(perfilUsuariosUltimoPeriodo, filtroEstabelecimento);
    const novosUsuariosDeEstabelecimento = getDadosDeEstabelecimentoFiltrado(novosUsuariosUltimoPeriodo, filtroEstabelecimento);

    return (
      <>
        <GraficoInfo
          descricao={ `Dados de ${perfilUsuariosDeEstabelecimento.nome_mes}` }
        />

        <Grid12Col
          proporcao="4-4-4"
          items={ [
            <>
              {
                <CardInfoTipoA
                  key={ uuidv1() }
                  fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
                  indicador={ perfilUsuariosDeEstabelecimento.ativos_mes }
                  indice={ perfilUsuariosDeEstabelecimento.dif_ativos_mes_anterior }
                  indiceDescricao="últ. mês"
                  link={ {
                    label: 'Mais Informações',
                    url: '/'
                  } }
                  titulo="Usuários que frequentaram"
                  tooltip="a"
                />
              }
            </>,
            <>
              {
                <CardInfoTipoA
                  key={ uuidv1() }
                  fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
                  indicador={ perfilUsuariosDeEstabelecimento.tornandose_inativos }
                  indice={ perfilUsuariosDeEstabelecimento.dif_tornandose_inativos_anterior }
                  indiceDescricao="últ. mês"
                  titulo="Tornaram-se inativos"
                  tooltip="a"
                />
              }
            </>,
            <>
              {
                <CardInfoTipoA
                  key={ uuidv1() }
                  fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
                  indicador={ novosUsuariosDeEstabelecimento.usuarios_novos }
                  indice={ novosUsuariosDeEstabelecimento.dif_usuarios_novos_anterior }
                  indiceDescricao="últ. mês"
                  link={ {
                    label: 'Mais Informações',
                    url: '/'
                  } }
                  titulo="Novos usuários"
                  tooltip="a"
                />
              }
            </>,
          ] }
        />
      </>
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
        titulo="Usuários de CAPS"
      />

      {
        novosUsuariosResumo.length !== 0 &&
        perfilPorEstabelecimento.length !== 0 &&
        getCardsResumoUsuarios(
          perfilPorEstabelecimento,
          novosUsuariosResumo,
          filtroEstabelecimento.value
        )
      }

      <GraficoInfo
        titulo="Taxa de não adesão"
        fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
        descricao="Conjunto de usuários com 1º procedimento em Março/2022 e abandono até Agosto/2022"
        tooltip="Porcentagem dos usuários que entraram nos serviços CAPS e deixaram de frequentar o serviço  nos 6 meses posteriores."
        link={ { label: 'Mais informações', url: '/caps?painel=3' } }
      />
      
      <Grid12Col
          proporcao="3-3-3-3"
          items={ [
            <>
                <CardInfoTipoA
                  indicador='2'
                  indice='10'
                  indiceDescricao="p.p. semestre anterior"
                  indicadorSimbolo="%"
                />
            </>,
            <>
                <CardInfoTipoA
                  indicador='85'
                  fonte='Vida'
                  indicadorSimbolo="%"
                  titulo="CAPS com maior taxa"
                />
            </>,
            <>
                <CardInfoTipoA
                  indicador='30 a 40 anos'
                  fonte='Masculino'
                  titulo="Perfil do usuário"
                />
            </>,
            <>
                 <CardInfoTipoA
                  indicador='22 usuários'
                  fonte='Uso de subs. psicoativa'
                  titulo="CID mais frequente"
                />
            </>,
          ] }
        />


      <GraficoInfo
        titulo="Usuários que realizaram apenas atendimentos individuais"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
        descricao="Dados de Setembro"
        tooltip="Porcentagem do total de usuários que frequentaram serviços CAPS no mês que realizou apenas atendimentos individuais."
        link={ { label: 'Mais informações', url: '/caps?painel=4' } }
      />
      
      <Grid12Col
          proporcao="3-3-3-3"
          items={ [
            <>
                <CardInfoTipoA
                  indicador='2'
                  indice='10'
                  indiceDescricao="p.p. semestre anterior"
                  indicadorSimbolo="%"
                />
            </>,
            <>
                <CardInfoTipoA
                  indicador='85'
                  fonte='Vida'
                  indicadorSimbolo="%"
                  titulo="CAPS com maior taxa"
                />
            </>,
            <>
                <CardInfoTipoA
                  indicador='30 a 40 anos'
                  fonte='Masculino'
                  titulo="Perfil do usuário"
                />
            </>,
            <>
                 <CardInfoTipoA
                  indicador='22 usuários'
                  fonte='Uso de subs. psicoativa'
                  titulo="CID mais frequente"
                />
            </>,
          ] }
        />


      <GraficoInfo
        titulo="Procedimento por usuário"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
        descricao="Dados de Setembro"
        tooltip="Média de procedimentos realizados por usuários que frequentaram CAPS no mês de referência."
        link={ { label: 'Mais informações', url: '/caps?painel=5' } }
      />
      <Grid12Col
          proporcao="4-4-4"
          items={ [
            <>
                <CardInfoTipoA
                  indicador='2'
                  indice='10'
                  indiceDescricao="últ. mês"
                />
            </>,
            <>
                <CardInfoTipoA
                  indicador='CAPS Borboleta'
                  fonte='600'
                  titulo="CAPS com maior número"
                />
            </>,
            <>
                <CardInfoTipoA
                  indicador='Mais de 5 anos no serviço'
                  fonte='Média de 1,4 procedimentos no mês'
                  titulo="Usuários que mais realizam procedimentos são os que estão há"
                />
            </>,
          ] }
        />

      <GraficoInfo
        titulo="Produção"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
        descricao="Dados de Setembro"
        link={ { label: 'Mais informações', url: '/caps?painel=6' } }
      />
      <Grid12Col
          proporcao="4-4-4"
          items={ [
            <>
                <CardInfoTipoA
                  indicador='2'
                  indice='2'
                  indiceDescricao="últ. mês"
                  titulo="Total de procedimentos"
                />
            </>,
            <>
                <CardInfoTipoA
                  indicador='1'
                  indice='1'
                  indiceDescricao="últ. mês"
                  titulo="Procedimentos BPA"
                />
            </>,
            <>
                <CardInfoTipoA
                  indicador='1'
                  indice='1'
                  indiceDescricao="últ. mês"
                  titulo="Procedimentos RAAS"
                />
            </>,
          ] }
        />
    </div>
  );
};

export default Resumo;

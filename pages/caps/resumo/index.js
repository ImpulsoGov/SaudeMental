import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { v1 as uuidv1 } from "uuid";
import resumoMunicipiosJSON from "../../../dados/caps_resumo_totais_por_municipio.json";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const Resumo = () => {
  const { data: session } = useSession();
  const [resumoMunicipio, setResumoMunicipio] = useState();

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      const resumoFiltrado = resumoMunicipiosJSON.caps_resumo_totais_por_municipio
        .find((item) => item.unidade_geografica_id_sus === municipioIdSus);

      setResumoMunicipio(resumoFiltrado);
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

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

      { resumoMunicipio
        ? (
          <>
            <GraficoInfo
              titulo="Usuários de CAPS"
              descricao={ `Dados de ${resumoMunicipio.nome_mes_ativos}` }
            />

            <Grid12Col
              proporcao="4-4-4"
              items={ [
                <CardInfoTipoA
                  key={ uuidv1() }
                  fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
                  indicador={ resumoMunicipio.ativos_mes }
                  indice={ resumoMunicipio.dif_ativos_mes_anterior }
                  indiceDescricao="últ. mês"
                  titulo="Usuários que frequentaram"
                  tooltip="Usuários que tiveram ao menos um procedimento registrado em BPA-i ou RAAS no mês de referência (exceto acolhimento inicial)."
                />,
                <CardInfoTipoA
                  key={ uuidv1() }
                  fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
                  indicador={ resumoMunicipio.tornandose_inativos }
                  indice={ resumoMunicipio.dif_tornandose_inativos_anterior }
                  indiceDescricao="últ. mês"
                  titulo="Tornaram-se inativos"
                  tooltip="Usuários que, no mês de referência, completaram três meses sem ter nenhum procedimento registrado em BPA-i ou RAAS (exceto acolhimento inicial)."
                />,
                <CardInfoTipoA
                  key={ uuidv1() }
                  fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
                  indicador={ resumoMunicipio.usuarios_novos }
                  indice={ resumoMunicipio.dif_usuarios_novos_anterior }
                  indiceDescricao="últ. mês"
                  titulo="Novos usuários"
                  tooltip="Usuários que tiveram o primeiro procedimento registrado em RAAS no mês de referência."
                />,
              ] }
            />
          </>
        )
        : <Spinner theme="SM" />
      }

      { resumoMunicipio
        ? (
          <>
            <GraficoInfo
              titulo="Taxa de não adesão"
              fonte="Fonte: RAAS/SIASUS - Elaboração Impulso Gov"
              descricao={ `Conjunto de usuários com 1º procedimento em ${resumoMunicipio.a_partir_do_mes}/${resumoMunicipio.a_partir_do_ano} e não adesão até ${resumoMunicipio.ate_mes}/${resumoMunicipio.ate_ano}` }
              tooltip="Porcentagem dos usuários que entraram nos serviços CAPS e deixaram de frequentar o serviço  nos 3 meses posteriores."
              link={ { label: 'Mais informações', url: '/caps?painel=3' } }
            />

            <Grid12Col
              proporcao="4-4-4"
              items={ [
                <>
                  <CardInfoTipoA
                    indicador={ resumoMunicipio.usuarios_coorte_nao_aderiram }
                    indicadorSimbolo="%"
                    titulo="Taxa de não adesão acumulada"
                    fonte="Todos os estabelecimentos"
                  />
                </>,
                <>
                  <CardInfoTipoA
                    indicador={ resumoMunicipio.maior_taxa_nao_adesao }
                    fonte={ resumoMunicipio.maior_taxa_estabelecimento_nao_adesao }
                    indicadorSimbolo="%"
                    titulo="CAPS com maior taxa"
                  />
                </>,
                <>
                  <CardInfoTipoA
                    indicador={ resumoMunicipio.predominio_faixa_etaria }
                    fonte={ resumoMunicipio.predominio_sexo }
                    titulo="Perfil do usuário"
                  />
                </>,
                // <>
                //   <CardInfoTipoA
                //     indicador={ `${resumoMunicipio.predominio_condicao_grupo_cid10_usuarios} usuários` }
                //     fonte={ resumoMunicipio.predominio_condicao_grupo_descricao_curta_cid10 }
                //     titulo="CID mais frequente"
                //   />
                // </>,
              ] }
            />
          </>
        )
        : <Spinner theme="SM" />
      }

      { resumoMunicipio
        ? (
          <>
            <GraficoInfo
              titulo="Usuários que realizaram apenas atendimentos individuais"
              fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
              descricao={ `Dados de ${resumoMunicipio.nome_mes_atendimentos_individuais}` }
              tooltip="Porcentagem do total de usuários que frequentaram serviços CAPS no mês que realizou apenas atendimentos individuais."
              link={ { label: 'Mais informações', url: '/caps?painel=4' } }
            />

            <Grid12Col
              proporcao="3-3-3-3"
              items={ [
                <>
                  <CardInfoTipoA
                    indicador={ resumoMunicipio.perc_apenas_atendimentos_individuais }
                    indice={ resumoMunicipio.dif_perc_apenas_atendimentos_individuais }
                    indiceDescricao="p.p. semestre anterior"
                    indicadorSimbolo="%"
                  />
                </>,
                <>
                  <CardInfoTipoA
                    indicador={ resumoMunicipio.maior_taxa_atendimentos_individuais }
                    fonte={ resumoMunicipio.maior_taxa_estabelecimento_atendimentos_individuais }
                    indicadorSimbolo="%"
                    titulo="CAPS com maior taxa"
                  />
                </>,
                <>
                  <CardInfoTipoA
                    indicador={ resumoMunicipio.faixa_etaria_atendimentos_individuais }
                    fonte={ resumoMunicipio.sexo_atendimentos_individuais }
                    titulo="Perfil do usuário"
                  />
                </>,
                <>
                  <CardInfoTipoA
                    indicador={ resumoMunicipio.usuarios_cid_atendimentos_individuais }
                    indicadorSimbolo=" usuários"
                    fonte={ resumoMunicipio.cid_grupo_atendimentos_individuais }
                    titulo="CID mais frequente"
                  />
                </>,
              ] }
            />
          </>
        )
        : <Spinner theme="SM" />
      }

      {
        resumoMunicipio
          ? (
            <>
              <GraficoInfo
                titulo="Procedimento por usuário"
                fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
                descricao={ `Dados de ${resumoMunicipio.nome_mes_proced_usuario}` }
                tooltip="Média de procedimentos realizados por usuários que frequentaram CAPS no mês de referência."
                link={ { label: 'Mais informações', url: '/caps?painel=5' } }
              />

              <Grid12Col
                proporcao="4-4-4"
                items={ [
                  <>
                    <CardInfoTipoA
                      indicador={ resumoMunicipio.procedimentos_por_usuario }
                      indice={ resumoMunicipio.dif_procedimentos_por_usuario_anterior_perc }
                      indiceSimbolo="%"
                      indiceDescricao="últ. mês"
                    />
                  </>,
                  <>
                    <CardInfoTipoA
                      indicador={ resumoMunicipio.maior_taxa_estabelecimento_procedimentos_por_usuario }
                      fonte={ resumoMunicipio.maior_taxa_procedimentos_por_usuario }
                      titulo="CAPS com maior número"
                    />
                  </>,
                  <>
                    <CardInfoTipoA
                      indicador={ `${resumoMunicipio.tempo_servico_maior_taxa} no serviço` }
                      fonte={ `Média de ${resumoMunicipio.maior_taxa_procedimentos_tempo_servico} procedimentos no mês` }
                      titulo="Usuários que mais realizam procedimentos são os que estão há"
                    />
                  </>,
                ] }
              />
            </>
          )
          : <Spinner theme="SM" />
      }

      { resumoMunicipio
        ? (
          <>
            <GraficoInfo
              titulo="Produção"
              fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
              descricao={ `Dados de ${resumoMunicipio.nome_mes_procedimentos_hora}` }
              link={ { label: 'Mais informações', url: '/caps?painel=6' } }
            />

            <Grid12Col
              proporcao="4-4-4"
              items={ [
                <>
                  <CardInfoTipoA
                    indicador={ resumoMunicipio.procedimentos_registrados_total }
                    indice={ resumoMunicipio.dif_procedimentos_registrados_total_anterior }
                    indiceDescricao="últ. mês"
                    titulo="Total de procedimentos"
                  />
                </>,
                <>
                  <CardInfoTipoA
                    indicador={ resumoMunicipio.procedimentos_registrados_bpa }
                    indice={ resumoMunicipio.dif_procedimentos_registrados_bpa_anterior }
                    indiceDescricao="últ. mês"
                    titulo="Procedimentos BPA"
                  />
                </>,
                <>
                  <CardInfoTipoA
                    indicador={ resumoMunicipio.procedimentos_registrados_raas }
                    indice={ resumoMunicipio.dif_procedimentos_registrados_raas_anterior }
                    indiceDescricao="últ. mês"
                    titulo="Procedimentos RAAS"
                  />
                </>,
              ] }
            />
          </>
        )
        : <Spinner theme="SM" />
      }
    </div>
  );
};

export default Resumo;

import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner } from '@impulsogov/design-system';
import React, { useMemo } from 'react';
import { ordenarCrescentePorPropriedadeDeTexto } from '../../utils/ordenacao';

const CardsResumoEstabelecimentos = ({
  resumo,
  propriedadesCard
}) => {
  const estabelecimentosLinhaDePerfilGeral = useMemo(() => {
    const dadosFiltrados = resumo.filter((item) => item.estabelecimento_linha_perfil === 'Geral');

    return ordenarCrescentePorPropriedadeDeTexto(
      dadosFiltrados,
      'estabelecimento'
    );
  }, [resumo]);

  const estabelecimentosLinhaDePerfilAD = useMemo(() => {
    const dadosFiltrados = resumo.filter((item) => item.estabelecimento_linha_perfil === 'Álcool e outras drogas');

    return ordenarCrescentePorPropriedadeDeTexto(
      dadosFiltrados,
      'estabelecimento'
    );
  }, [resumo]);

  return (
    <>
      { resumo.length !== 0
        ? <>
          <GraficoInfo
            titulo={ `CAPS ${estabelecimentosLinhaDePerfilGeral[0].estabelecimento_linha_perfil}` }
            descricao={ `Dados de ${estabelecimentosLinhaDePerfilGeral[0].nome_mes}` }
          />

          <Grid12Col
            items={
              estabelecimentosLinhaDePerfilGeral.map((item) => (
                <CardInfoTipoA
                  titulo={ item[propriedadesCard.estabelecimento] }
                  indicador={ item[propriedadesCard.quantidade] }
                  indice={ item[propriedadesCard.difAnterior] }
                  indiceSimbolo={ item[propriedadesCard.simbolo] }
                  indiceDescricao={ item[propriedadesCard.descricao] }
                  key={ `${item.id}-${item[propriedadesCard.difAnterior]}` }
                />
              ))
            }
            proporcao='3-3-3-3'
          />

          <GraficoInfo
            titulo={ `CAPS ${estabelecimentosLinhaDePerfilAD[0].estabelecimento_linha_perfil}` }
            descricao={ `Dados de ${estabelecimentosLinhaDePerfilAD[0].nome_mes}` }
          />

          <Grid12Col
            items={
              estabelecimentosLinhaDePerfilAD.map((item) => (
                <CardInfoTipoA
                  titulo={ item[propriedadesCard.estabelecimento] }
                  indicador={ item[propriedadesCard.quantidade] }
                  indice={ item[propriedadesCard.difAnterior] }
                  indiceSimbolo={ item[propriedadesCard.simbolo] }
                  indiceDescricao={ item[propriedadesCard.descricao] }
                  key={ `${item.id}-${item[propriedadesCard.difAnterior]}` }
                />
              ))
            }
            proporcao='3-3-3-3'
          />
        </>
        : <Spinner theme='ColorSM' />
      }
    </>
  );
};

export default CardsResumoEstabelecimentos;

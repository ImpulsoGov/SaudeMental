import { CardInfoTipoA, GraficoInfo, Grid12Col, Spinner } from '@impulsogov/design-system';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ordenarCrescentePorPropriedadeDeTexto } from '../../utils/ordenacao';

const CardsResumoEstabelecimentos = ({
  dados,
  propriedades,
  indiceSimbolo,
  indiceDescricao
}) => {
  const estabelecimentosLinhaDePerfilGeral = useMemo(() => {
    const dadosFiltrados = dados.filter((item) => item.estabelecimento_linha_perfil === 'Geral');

    return ordenarCrescentePorPropriedadeDeTexto(
      dadosFiltrados,
      'estabelecimento'
    );
  }, [dados]);

  const estabelecimentosLinhaDePerfilAD = useMemo(() => {
    const dadosFiltrados = dados.filter((item) => item.estabelecimento_linha_perfil === 'Álcool e outras drogas');

    return ordenarCrescentePorPropriedadeDeTexto(
      dadosFiltrados,
      'estabelecimento'
    );
  }, [dados]);

  return (
    <>
      { dados.length !== 0
        ? <>
          <GraficoInfo
            titulo={ `CAPS ${estabelecimentosLinhaDePerfilGeral[0].estabelecimento_linha_perfil}` }
            descricao={ `Dados de ${estabelecimentosLinhaDePerfilGeral[0].nome_mes}` }
          />

          <Grid12Col
            items={
              estabelecimentosLinhaDePerfilGeral.map((item) => (
                <CardInfoTipoA
                  titulo={ item[propriedades.estabelecimento] }
                  indicador={ item[propriedades.quantidade] }
                  indice={ item[propriedades.difAnterior] }
                  indiceSimbolo={ indiceSimbolo }
                  indiceDescricao={ indiceDescricao }
                  key={ `${item.id}-${item[propriedades.difAnterior]}` }
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
                  titulo={ item[propriedades.estabelecimento] }
                  indicador={ item[propriedades.quantidade] }
                  indice={ item[propriedades.difAnterior] }
                  indiceSimbolo={ indiceSimbolo }
                  indiceDescricao={ indiceDescricao }
                  key={ `${item.id}-${item[propriedades.difAnterior]}` }
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

CardsResumoEstabelecimentos.defaultProps = {
  indiceSimbolo: '',
  indiceDescricao: '',
};

CardsResumoEstabelecimentos.propTypes = {
  dados: PropTypes.array.isRequired,
  propriedades: PropTypes.shape({
    estabelecimento: PropTypes.string,
    quantidade: PropTypes.string,
    difAnterior: PropTypes.string,
  }).isRequired,
  indiceSimbolo: PropTypes.string,
  indiceDescricao: PropTypes.string,
};

export default CardsResumoEstabelecimentos;

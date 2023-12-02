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
  const nomeMes = dados.length !== 0 ? dados[0].nome_mes : '';

  const agrupadosPorLinhaDePerfil = useMemo(() => {
    const dadosAgrupados = dados.reduce((agrupados, item) => {
      const { estabelecimento_linha_perfil: linhaDePerfil } = item;
      agrupados[linhaDePerfil] = agrupados[linhaDePerfil] || [];
      agrupados[linhaDePerfil].push(item);
      return agrupados;
    }, {});

    return dadosAgrupados;
  }, [dados]);

  const cardsPorLinhaDePerfil = useMemo(() => {
    const cards = [];

    for (const linhaDePerfil in agrupadosPorLinhaDePerfil) {
      const ordenadosPorEstabelecimento = ordenarCrescentePorPropriedadeDeTexto(
        agrupadosPorLinhaDePerfil[linhaDePerfil],
        'estabelecimento'
      );

      cards.push(
        <div key={ linhaDePerfil }>
          <GraficoInfo
            titulo={ `CAPS ${linhaDePerfil}` }
            descricao={ `Dados de ${nomeMes}` }
          />

          <Grid12Col
            items={
              ordenadosPorEstabelecimento.map((item) => (
                <CardInfoTipoA
                  titulo={ item[propriedades.estabelecimento] }
                  indicador={ item[propriedades.quantidade] }
                  indice={ item[propriedades.difAnterior] }
                  indiceSimbolo={ indiceSimbolo }
                  indiceDescricao={ indiceDescricao }
                  key={ `${item.id}-${item[propriedades.quantidade]}` }
                />
              ))
            }
            proporcao='3-3-3-3'
          />
        </div>
      );
    }

    return cards;
  }, [
    agrupadosPorLinhaDePerfil,
    indiceDescricao,
    indiceSimbolo,
    nomeMes,
    propriedades.difAnterior,
    propriedades.estabelecimento,
    propriedades.quantidade
  ]);

  return (
    <>
      { dados.length !== 0
        ? cardsPorLinhaDePerfil
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

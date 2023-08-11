import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';
import {
  CORES_GRAFICO_DONUT,
  COR_GRAFICO_DONUT_SEM_DADOS,
  QUANTIDADE_CORES_GRAFICO_DONUT
} from '../../constants/GRAFICO_DONUT';
import { agruparItensQueUltrapassamPaleta } from '../../helpers/graficoDonut';
import styles from './Tabelas.module.css';

const TabelaGraficoDonut = ({ labels, data }) => {
  const colunas = useMemo(() => [
    {
      field: 'nome',
      headerName: labels.colunaHeader,
      sortable: false,
      flex: 190,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'quantidade',
      headerName: labels.colunaQuantidade,
      sortable: false,
      flex: 190,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => {
        const { posicao, valor, dadosZerados } = params.value;
        return (
          <div
            className={ styles.ColunaQuantidadeTabelaGraficoDonut }
            style={ {
              backgroundColor: dadosZerados
                ? COR_GRAFICO_DONUT_SEM_DADOS
                : CORES_GRAFICO_DONUT[posicao],
            } }
          >
            <p>{ valor }</p>
          </div>
        );
      }
    },
  ], [labels]);

  const formatarDadosEmLinhas = useCallback(() => {
    let indiceDadosAgrupados = -1;

    if (data.length > QUANTIDADE_CORES_GRAFICO_DONUT) {
      const dadosAgrupados = agruparItensQueUltrapassamPaleta(data);

      indiceDadosAgrupados = dadosAgrupados.findIndex(({ nome }) => nome === 'Outros');
    }

    return data.map(({ nome, quantidade }, index) => ({
      id: uuidV4(),
      nome,
      quantidade: {
        posicao: indiceDadosAgrupados >= 0 && index >= indiceDadosAgrupados
          ? indiceDadosAgrupados
          : index,
        valor: quantidade,
        dadosZerados: false
      }
    }));
  }, [data]);

  const obterLinhaParaDadosZerados = useCallback(() => [{
    id: uuidV4(),
    nome: 'Sem usuários nessa competência',
    quantidade: {
      posicao: 0,
      valor: 0,
      dadosZerados: true
    }
  }], []);

  const linhas = useMemo(() => {
    return data.length !== 0
      ? formatarDadosEmLinhas()
      : obterLinhaParaDadosZerados();
  }, [formatarDadosEmLinhas, obterLinhaParaDadosZerados, data]);

  return (
    <DataGrid
      sx={ {
        '& .MuiDataGrid-columnHeaderTitle': {
          fontWeight: 'bold',
          fontSize: '16px',
          lineHeight: '1.2rem',
          whiteSpace: 'normal',
          textAlign: 'center'
        },
        '& .MuiDataGrid-cell--textRight': {
          paddingRight: 0,
          paddingLeft: 0
        },
        height: '70vh',
        border: 'none'
      } }
      rows={ linhas }
      columns={ colunas }
      disableColumnMenu
      autoPageSize
      initialState={ {
        sorting: {
          sortModel: [{ field: 'quantidade', sort: 'desc' }],
        },
      } }
    />
  );
};

TabelaGraficoDonut.propTypes = {
  labels: PropTypes.shape({
    colunaHeader: PropTypes.string,
    colunaQuantidade: PropTypes.string,
  }),
  data: PropTypes.shape({
    nome: PropTypes.string,
    quantidade: PropTypes.number,
  }),
}.isRequired;

export default TabelaGraficoDonut;

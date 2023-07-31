import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';
import {
  CORES_GRAFICO_DONUT,
  COR_GRAFICO_DONUT_SEM_DADOS,
  QUANTIDADE_CORES_GRAFICO_DONUT
} from '../../constants/GRAFICO_DONUT';
import { agruparQuantidadesPequenas } from '../../helpers/graficoCID';
import styles from './Tabelas.module.css';

const TabelaCid = ({ labels, cids }) => {
  const colunas = useMemo(() => [
    {
      field: 'condicaoSaude',
      headerName: labels.colunaCid,
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

    if (cids.length > QUANTIDADE_CORES_GRAFICO_DONUT) {
      const dadosAgrupados = agruparQuantidadesPequenas(cids);

      indiceDadosAgrupados = dadosAgrupados.findIndex(({ condicaoSaude }) => condicaoSaude === 'Outros');
    }

    return cids.map(({ condicaoSaude, quantidade }, index) => ({
      id: uuidV4(),
      condicaoSaude,
      quantidade: {
        posicao: indiceDadosAgrupados >= 0 && index >= indiceDadosAgrupados
          ? indiceDadosAgrupados
          : index,
        valor: quantidade,
        dadosZerados: false
      }
    }));
  }, [cids]);

  const obterLinhaParaDadosZerados = useCallback(() => [{
    id: uuidV4(),
    condicaoSaude: 'Sem usuários nessa competência',
    quantidade: {
      posicao: 0,
      valor: 0,
      dadosZerados: true
    }
  }], []);

  const linhas = useMemo(() => {
    return cids.length !== 0
      ? formatarDadosEmLinhas()
      : obterLinhaParaDadosZerados();
  }, [formatarDadosEmLinhas, obterLinhaParaDadosZerados, cids]);

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

TabelaCid.propTypes = {
  labels: PropTypes.shape({
    colunaCid: PropTypes.string,
    colunaQuantidade: PropTypes.string,
  }),
  cids: PropTypes.shape({
    condicaoSaude: PropTypes.string,
    quantidade: PropTypes.number,
  }),
}.isRequired;

export default TabelaCid;

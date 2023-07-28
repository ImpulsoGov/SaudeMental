import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';
import {
  CORES_GRAFICO_DONUT,
  COR_GRAFICO_DONUT_SEM_DADOS,
  QUANTIDADE_CORES_GRAFICO_DONUT
} from '../../constants/GRAFICO_DONUT';
import { agruparCidsPequenos } from '../../helpers/graficoCID';

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
        const { posicao, valor, semDados } = params.value;
        return (
          <div style={ {
            backgroundColor: semDados
              ? COR_GRAFICO_DONUT_SEM_DADOS
              : CORES_GRAFICO_DONUT[posicao],
            width: '100%',
            height: '100%',
            textAlign: 'right',
            paddingRight: '12px',
          } }>
            <p>{ valor }</p>
          </div>
        );
      }
    },
  ], [labels]);

  const formatarDadosEmLinhas = useCallback(() => {
    let dados = cids;
    let indiceCidOutros = -1;

    if (cids.length > QUANTIDADE_CORES_GRAFICO_DONUT) {
      dados = agruparCidsPequenos(cids);
      indiceCidOutros = dados.findIndex(({ condicaoSaude }) => condicaoSaude === 'Outros');
    }

    return cids.map(({ condicaoSaude, quantidade }, index) => ({
      id: uuidV4(),
      condicaoSaude,
      quantidade: {
        posicao: indiceCidOutros >= 0 && index >= indiceCidOutros
          ? indiceCidOutros
          : index,
        valor: quantidade,
        semDados: false
      }
    }));
  }, [cids]);

  const obterLinhaParaDadosVazios = useCallback(() => [{
    id: uuidV4(),
    condicaoSaude: `Sem ${labels.colunaQuantidade.toLowerCase()} nessa competência`,
    quantidade: {
      posicao: 0,
      valor: 0,
      semDados: true
    }
  }], [labels.colunaQuantidade]);

  const linhas = useMemo(() => {
    return cids.length !== 0
      ? formatarDadosEmLinhas()
      : obterLinhaParaDadosVazios();
  }, [formatarDadosEmLinhas, obterLinhaParaDadosVazios, cids]);
  console.log(linhas);

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

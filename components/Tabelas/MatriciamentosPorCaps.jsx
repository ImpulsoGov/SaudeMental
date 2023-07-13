import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import React, { useCallback, useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';

const StyledDataGrid = styled(DataGrid)(() => ({
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '1.2rem',
    whiteSpace: 'normal',
    textAlign: 'center'
  },
  '.MuiDataGrid-row': {
    color: '#9ba4a5'
  },
  '& .LinhaTotalGeral': {
    fontWeight: 'bold',
  }
}));

const TabelaMatriciamentosPorCaps = ({ matriciamentos }) => {
  const colunas = useMemo(() => [
    {
      field: 'estabelecimento',
      sortable: false,
      headerName: 'CAPS',
      flex: 350,
    },
    {
      field: 'quantidadeRegistrada',
      sortable: false,
      headerName: 'Matriciamentos realizados',
      flex: 280,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'faltamNoAno',
      sortable: false,
      headerName: 'Faltam no ano',
      flex: 180,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'mediaMensalParaMeta',
      sortable: false,
      headerName: 'Média mensal para completar a meta',
      flex: 320,
      headerAlign: 'center',
      align: 'center',
    },
  ], []);

  const transformarDadosEmLinhas = useCallback((dados) => {
    return dados.map(({
      estabelecimento,
      quantidade_registrada: quantidadeRegistrada,
      faltam_no_ano: faltamNoAno,
      media_mensal_para_meta: mediaMensalParaMeta,
    }) => ({
      id: uuidV4(),
      estabelecimento,
      quantidadeRegistrada,
      faltamNoAno,
      mediaMensalParaMeta,
      total: false
    }));
  }, []);

  const somarLinhasDeColuna = useCallback((linhas, coluna) => {
    return linhas.reduce((acc, cur) => acc + cur[coluna], 0);
  }, []);

  const calcularMediaLinhasDeColuna = useCallback((linhas, coluna) => {
    const soma = somarLinhasDeColuna(linhas, coluna);

    return (soma / linhas.length).toFixed(2);
  }, [somarLinhasDeColuna]);

  const linhasCompletas = useMemo(() => {
    const linhas = transformarDadosEmLinhas(matriciamentos);

    const linhaTotalGeral = {
      id: uuidV4(),
      estabelecimento: 'Total geral',
      quantidadeRegistrada: somarLinhasDeColuna(linhas, 'quantidadeRegistrada'),
      faltamNoAno: somarLinhasDeColuna(linhas, 'faltamNoAno'),
      mediaMensalParaMeta: calcularMediaLinhasDeColuna(linhas, 'mediaMensalParaMeta'),
      total: true
    };

    return [...linhas, linhaTotalGeral];
  }, [matriciamentos, somarLinhasDeColuna, transformarDadosEmLinhas, calcularMediaLinhasDeColuna]);

  return (
    <StyledDataGrid
      rows={ linhasCompletas }
      columns={ colunas }
      autoHeight
      hideFooter
      disableColumnMenu
      getRowClassName={ (params) => params.row.total && `LinhaTotalGeral` }
      initialState={ {
        sorting: {
          sortModel: [{ field: 'quantidadeRegistrada', sort: 'asc' }],
        },
      } }
    />
  );
};

export default TabelaMatriciamentosPorCaps;

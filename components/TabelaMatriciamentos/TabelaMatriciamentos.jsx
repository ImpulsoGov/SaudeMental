import { DataGrid } from '@mui/x-data-grid';
import React, { useCallback, useMemo } from 'react';

const TabelaMatriciamentosPorCaps = ({ matriciamentos }) => {
  const colunas = useMemo(() => [
    {
      field: 'estabelecimento',
      headerName: 'CAPS',
      width: 350
    },
    {
      field: 'quantidadeRegistrada',
      headerName: 'Matriciamentos realizados',
      width: 300
    },
    {
      field: 'faltamNoAno',
      headerName: 'Faltam no ano',
      width: 200
    },
    {
      field: 'mediaMensalParaMeta',
      headerName: 'Média mensal para completar a meta',
      width: 350
    },
  ], []);

  const transformarDadosEmLinhas = useCallback((dados) => {
    return dados.map(({
      estabelecimento,
      quantidade_registrada: quantidadeRegistrada,
      faltam_no_ano: faltamNoAno,
      media_mensal_para_meta: mediaMensalParaMeta,
    }, index) => ({
      id: index,
      estabelecimento,
      quantidadeRegistrada,
      faltamNoAno,
      mediaMensalParaMeta
    }));
  }, []);

  const somarLinhasDeColuna = useCallback((linhas, coluna) => {
    const soma = linhas.reduce((acc, cur) => acc + cur[coluna], 0);

    return soma.toFixed(2);
  }, []);

  const linhasCompletas = useMemo(() => {
    const linhas = transformarDadosEmLinhas(matriciamentos);

    const ultimaLinha = linhas.slice(-1);

    const linhaTotalGeral = {
      id: ultimaLinha.id + 1,
      estabelecimento: 'Total geral',
      quantidadeRegistrada: somarLinhasDeColuna(linhas, 'quantidadeRegistrada'),
      faltamNoAno: somarLinhasDeColuna(linhas, 'faltamNoAno'),
      mediaMensalParaMeta: somarLinhasDeColuna(linhas, 'mediaMensalParaMeta')
    };

    return [...linhas, linhaTotalGeral];
  }, [matriciamentos, somarLinhasDeColuna, transformarDadosEmLinhas]);

  return (
    <DataGrid
      sx={ {
        '& .MuiDataGrid-columnHeaderTitle': {
          fontWeight: 'bold',
          fontSize: '16px'
        },
        '.MuiDataGrid-row:last-child': {
          fontWeight: 'bold',
          color: '#c3c8c9'
        },
        '.MuiDataGrid-row': {
          color: '#9ba4a5'
        }
      } }
      rows={ linhasCompletas }
      columns={ colunas }
      autoHeight
      hideFooter
    />
  );
};

export default TabelaMatriciamentosPorCaps;

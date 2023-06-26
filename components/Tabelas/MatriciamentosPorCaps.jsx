import { DataGrid } from '@mui/x-data-grid';
import React, { useCallback, useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';

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
      width: 280
    },
    {
      field: 'faltamNoAno',
      headerName: 'Faltam no ano',
      width: 180
    },
    {
      field: 'mediaMensalParaMeta',
      headerName: 'Média mensal para completar a meta',
      width: 320
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
      mediaMensalParaMeta
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
      mediaMensalParaMeta: calcularMediaLinhasDeColuna(linhas, 'mediaMensalParaMeta')
    };

    return [...linhas, linhaTotalGeral];
  }, [matriciamentos, somarLinhasDeColuna, transformarDadosEmLinhas, calcularMediaLinhasDeColuna]);

  return (
    <DataGrid
      sx={ {
        '& .MuiDataGrid-columnHeaderTitle': {
          fontWeight: 'bold',
          fontSize: '16px'
        },
        '.MuiDataGrid-row:last-child': {
          fontWeight: 'bold',
          color: '#9ba4a5'
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

import { DataGrid } from '@mui/x-data-grid';
import React, { useMemo } from 'react';

const TabelaProcedimentosPorCaps = ({ procedimentos }) => {
  const colunas = useMemo(() => [
    {
      field: 'tipoProcedimento',
      headerName: 'Procedimento',
      flex: 230,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'estabelecimento',
      headerName: 'Estabelecimento',
      flex: 150,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'quantidade',
      headerName: 'Quantidade registrada',
      flex: 100,
      align: 'right',
      headerAlign: 'right',
    }
  ], []);

  const linhas = useMemo(() => {
    if (procedimentos.length === 0) {
      return [{
        id: 1,
        tipoProcedimento: 'Sem procedimentos nesse(s) estabelecimento(s) durante essa(s) competência(s)',
        estabelecimento: '',
        quantidade: 0
      }];
    }

    return procedimentos;
  }, [procedimentos]);

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
        height: '70vh',
      } }
      rows={ linhas }
      columns={ colunas }
      autoPageSize
      disableColumnMenu
    />
  );
};

export default TabelaProcedimentosPorCaps;

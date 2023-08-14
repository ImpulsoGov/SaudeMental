import { DataGrid } from '@mui/x-data-grid';
import React, { useMemo } from 'react';

const TabelaProcedimentosPorCaps = ({ procedimentos }) => {
  const colunas = useMemo(() => [
    {
      field: 'procedimento',
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
      field: 'quantidadeRegistrada',
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
        procedimento: 'Sem procedimentos nesse(s) estabelecimento(s) durante essa(s) competência(s)',
        estabelecimento: '',
        quantidadeRegistrada: 0
      }];
    }

    return procedimentos.map(({
      id,
      procedimento,
      estabelecimento,
      procedimentos_registrados_total: quantidadeRegistrada
    }) => ({
      id,
      procedimento,
      estabelecimento,
      quantidadeRegistrada
    }));
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
      initialState={ {
        sorting: {
          sortModel: [{ field: 'quantidadeRegistrada', sort: 'desc' }],
        },
      } }
    />
  );
};

export default TabelaProcedimentosPorCaps;

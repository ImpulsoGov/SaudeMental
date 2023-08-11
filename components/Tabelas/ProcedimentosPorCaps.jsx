import { DataGrid } from '@mui/x-data-grid';
import React, { useMemo } from 'react';

const ProcedimentosPorCaps = ({ procedimentos }) => {
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
      flex: 190,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'quantidadeRegistrada',
      headerName: 'Quantidade registrada',
      flex: 140,
      align: 'right',
      headerAlign: 'right',
    }
  ], []);

  return (
    <>
      <DataGrid
        sx={ {
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
            fontSize: '16px',
            lineHeight: '1.2rem',
            whiteSpace: 'normal',
            textAlign: 'center'
          },
        } }
        rows={ procedimentos }
        columns={ colunas }
        autoHeight
        hideFooter
        disableColumnMenu
        initialState={ {
          sorting: {
            sortModel: [{ field: 'estabelecimento', sort: 'asc' }],
          },
        } }
      />
    </>
  );
};

export default ProcedimentosPorCaps;

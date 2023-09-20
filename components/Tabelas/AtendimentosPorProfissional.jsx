import { DataGrid } from '@mui/x-data-grid';
import React, { useMemo } from 'react';
const TabelaAtendimentosPorProfissional = ({ atendimentos }) => {
  const colunas = useMemo(() => [
    {
      field: 'profissional_nome',
      sortable: false,
      headerName: 'Nome do profissional',
      flex: 250,
    },
    {
      field: 'ocupacao',
      sortable: false,
      headerName: 'Categoria profissional',
      flex: 180,
    },
    {
      field: 'atendimentos_realizados',
      sortable: false,
      headerName: 'Atendimentos realizados',
      flex: 180,
      headerAlign: 'right',
      align: 'right',
    },
    {
      field: 'atendimentos_por_hora',
      sortable: false,
      headerName: 'Atendimentos por hora',
      flex: 180,
      headerAlign: 'right',
      align: 'right',
    },
  ], []);

  const linhas = useMemo(() => {
    if (atendimentos.length === 0) {
      return [{
        id: 1,
        atendimentos_por_hora: 'Sem atendimentos nesse(s) estabelecimento(s) durante essa(s) competência(s)',
        atendimentos_realizados: 'Sem atendimentos nesse(s) estabelecimento(s) durante essa(s) competência(s)',
        ocupacao: '',
        profissional_nome: ''
      }];
    }
    return atendimentos;
  }, [atendimentos]);

  return (
    <DataGrid
      sx={ {
        '& .MuiDataGrid-columnHeaderTitle': {
          fontWeight: 'bold',
          fontSize: '16px',
          lineHeight: '1.2rem',
          whiteSpace: 'normal',
          textAlign: 'center',
        },
        height: '70vh',
        marginBottom: '30px'
      } }
      rows={ linhas }
      columns={ colunas }
      autoPageSize
      disableColumnMenu
      initialState={ {
        sorting: {
          sortModel: [{ field: 'procedimentosRealizados', sort: 'asc' }],
        },
      } }
    />
  );
};

export default TabelaAtendimentosPorProfissional;

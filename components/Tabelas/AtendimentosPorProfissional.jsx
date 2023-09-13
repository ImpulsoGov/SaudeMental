import { Spinner } from '@impulsogov/design-system';
import { DataGrid } from '@mui/x-data-grid';
import React, { useMemo } from 'react';

const TabelaAtendimentosPorProfissional = ({ atendimentos }) => {
  const colunas = useMemo(() => [
    {
      field: 'profissionalNome',
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
      field: 'procedimentosRealizados',
      sortable: false,
      headerName: 'Atendimentos realizados',
      flex: 180,
      headerAlign: 'right',
      align: 'right',
    },
    {
      field: 'procedimentosPorHora',
      sortable: false,
      headerName: 'Atendimentos por hora',
      flex: 180,
      headerAlign: 'right',
      align: 'right',
    },
  ], []);

  const linhas = useMemo(() => {
    const atendimentosGerais = atendimentos.filter(({
      estabelecimento,
      ocupacao,
      estabelecimento_linha_perfil: linhaPerfil
    }) =>
      estabelecimento === 'Todos'
      && ocupacao !== 'Todas'
      && linhaPerfil === 'Todas'
    );

    return atendimentosGerais.map(({
      id,
      ocupacao,
      profissional_nome: profissionalNome,
      procedimentos_realizados: procedimentosRealizados,
      procedimentos_por_hora: procedimentosPorHora
    }) => ({
      id,
      ocupacao,
      profissionalNome,
      procedimentosRealizados,
      procedimentosPorHora,
    }));
  }, [atendimentos]);

  return (
    <>
      {atendimentos.length !== 0
        ? <DataGrid
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
        : <Spinner theme='ColorSM' />
      }
    </>
  );
};

export default TabelaAtendimentosPorProfissional;

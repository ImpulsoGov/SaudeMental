import { DataGrid } from '@mui/x-data-grid';
import React, { useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';
import styles from './Tabelas.module.css';

const TabelaDetalhamentoPorCaps = ({ usuariosPorCaps }) => {
  const colunas = useMemo(() => [
    {
      field: 'estabelecimento',
      headerName: 'Estabelecimento',
      width: 300
    },
    {
      field: 'generoPredominante',
      headerName: 'Gênero predominante',
      width: 220
    },
    {
      field: 'mediaIdade',
      headerName: 'Média de idade',
      width: 170
    },
    {
      field: 'frequentaramMes',
      headerName: 'Frequentaram no mês',
      width: 220
    },
    {
      field: 'usuariosAtivos',
      headerName: 'Usuários ativos',
      width: 180
    },
    {
      field: 'difUsuariosAtivosMesAnterior',
      headerName: 'Dif. usuários ativos no mês anterior',
      width: 320,
      renderCell: (params) => {
        return (
          <div className={
            params.value < 0 ? styles.TextoVermelho : styles.TextoCinza
          }>
            { params.value }
          </div>
        );
      }
    },
  ], []);

  const linhas = useMemo(() => {
    return usuariosPorCaps.map(({
      estabelecimento,
      sexo_predominante: generoPredominante,
      usuarios_idade_media: mediaIdade,
      ativos_mes: frequentaramMes,
      ativos_3meses: usuariosAtivos,
      dif_ativos_3meses_anterior: difUsuariosAtivosMesAnterior
    }) => ({
      id: uuidV4(),
      estabelecimento,
      generoPredominante,
      mediaIdade: Number(parseFloat(mediaIdade).toFixed(2)),
      frequentaramMes,
      usuariosAtivos,
      difUsuariosAtivosMesAnterior
    }));
  }, [usuariosPorCaps]);

  return (
    <div>
      <DataGrid
        sx={ {
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
            fontSize: '16px'
          },
        } }
        rows={ linhas }
        columns={ colunas }
        autoHeight
        hideFooter
      />
    </div>
  );
};

export default TabelaDetalhamentoPorCaps;

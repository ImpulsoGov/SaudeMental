import { DataGrid } from '@mui/x-data-grid';
import React, { useCallback, useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';
import styles from './Tabelas.module.css';

const TabelaDetalhamentoPorCaps = ({ usuariosPorCaps }) => {
  const definirCorDoIndicador = useCallback((indicador) => {
    if (indicador < 0) return styles.TextoVermelho;
    if (indicador > 0) return styles.TextoVerde;
    return styles.TextoCinza;
  }, []);

  const colunas = useMemo(() => [
    {
      field: 'estabelecimento',
      headerName: 'Estabelecimento',
      width: 250
    },
    {
      field: 'generoPredominante',
      headerName: 'Gênero predominante',
      width: 190,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'mediaIdade',
      headerName: 'Média de idade',
      width: 140,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'frequentaramMes',
      headerName: 'Frequentaram no mês',
      width: 190,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'usuariosAtivos',
      headerName: 'Usuários ativos',
      width: 150,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'difUsuariosAtivosMesAnterior',
      headerName: 'Dif. usuários ativos no mês anterior',
      width: 200,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        return (
          <div className={ definirCorDoIndicador(params.value) }>
            { params.value }
          </div>
        );
      }
    },
  ], [definirCorDoIndicador]);

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
            fontSize: '16px',
            lineHeight: '1.2rem',
            whiteSpace: 'normal',
            textAlign: 'center'
          },
        } }
        rows={ linhas }
        columns={ colunas }
        autoHeight
        hideFooter
        disableColumnMenu
      />
    </div>
  );
};

export default TabelaDetalhamentoPorCaps;

import React from 'react';
import { CardInfoTipoA, Grid12Col, Spinner } from '@impulsogov/design-system';

const CardsAtendimentoPorOcupacaoUltimoMes = ({
  atendimentoPsicologo,
  atendimentoPsiquiatra
}) => {
  return (
    <>
      {atendimentoPsicologo && atendimentoPsiquiatra
        ? <Grid12Col
          proporcao='3-3-3-3'
          items={[
            <CardInfoTipoA
              titulo={`Psicólogos em ${atendimentoPsicologo.nome_mes}`}
              indicador={atendimentoPsicologo.procedimentos_realizados}
              indice={atendimentoPsicologo.dif_procedimentos_realizados_anterior}
              indiceDescricao='ult. mês'
              key={`${atendimentoPsicologo.procedimentos_realizados}${atendimentoPsicologo.dif_procedimentos_realizados_anterior}`}
            />,
            <CardInfoTipoA
              titulo={`Psiquiatras em ${atendimentoPsiquiatra.nome_mes}`}
              indicador={atendimentoPsiquiatra.procedimentos_realizados}
              indice={atendimentoPsiquiatra.dif_procedimentos_realizados_anterior}
              indiceDescricao='ult. mês'
              key={`${atendimentoPsiquiatra.procedimentos_realizados}${atendimentoPsiquiatra.dif_procedimentos_realizados_anterior}`}
            />,
            <CardInfoTipoA
              titulo={`Atendimento por hora - Psicólogos - ${atendimentoPsicologo.nome_mes}`}
              indicador={atendimentoPsicologo.procedimentos_por_hora}
              indice={atendimentoPsicologo.dif_procedimentos_por_hora_anterior}
              indiceDescricao='ult. mês'
              tooltip={'Indicador é calculado a partir da divisão do total de atendimentos registrados pelo total de horas de trabalho dos profissionais estabelecidas em contrato. De tal modo, valores podem apresentar subnotificação em caso de férias, licenças, feriados, maior número de finais de semana no mês.'}
              key={`${atendimentoPsicologo.procedimentos_por_hora}${atendimentoPsicologo.dif_procedimentos_por_hora_anterior}`}
            />,
            <CardInfoTipoA
              titulo={`Atendimento por hora - Psiquiatras - ${atendimentoPsiquiatra.nome_mes}`}
              indicador={atendimentoPsiquiatra.procedimentos_por_hora}
              indice={atendimentoPsiquiatra.dif_procedimentos_por_hora_anterior}
              indiceDescricao='ult. mês'
              tooltip={'Indicador é calculado a partir da divisão do total de atendimentos registrados pelo total de horas de trabalho dos profissionais estabelecidas em contrato. De tal modo, valores podem apresentar subnotificação em caso de férias, licenças, feriados, maior número de finais de semana no mês.'}
              key={`${atendimentoPsiquiatra.procedimentos_por_hora}${atendimentoPsiquiatra.dif_procedimentos_por_hora_anterior}`}
            />
          ]}
        />
        : <Spinner theme='ColorSM' />
      }
    </>
  );
};

export default CardsAtendimentoPorOcupacaoUltimoMes;

import React from 'react';
import { CardInfoTipoA, Grid12Col, Spinner } from '@impulsogov/design-system';

const CardsAmbulatorioUltimoMes = ({ atendimento }) => {
  return (
    <>
      {atendimento
        ? <Grid12Col
          proporcao='6-6'
          items={[
            <CardInfoTipoA
              titulo={`Total de atendimentos em ${atendimento.nome_mes}`}
              indicador={atendimento.procedimentos_realizados}
              indice={atendimento.dif_procedimentos_realizados_anterior}
              indiceDescricao='ult. mês'
              key={`${atendimento.procedimentos_realizados}${atendimento.dif_procedimentos_realizados_anterior}`}
            />,
            <CardInfoTipoA
              titulo={`Total de atendimentos por hora trabalhada em ${atendimento.nome_mes}`}
              indicador={atendimento.procedimentos_por_hora}
              indice={atendimento.dif_procedimentos_por_hora_anterior}
              indiceDescricao='ult. mês'
              tooltip={'Indicador é calculado a partir da divisão do total de atendimentos registrados pelo total de horas de trabalho dos profissionais estabelecidas em contrato. De tal modo, valores podem apresentar subnotificação em caso de férias, licenças, feriados, maior número de finais de semana no mês.'}
              key={`${atendimento.procedimentos_por_hora}${atendimento.dif_procedimentos_por_hora_anterior}`}
            />
          ]}
        />
        : <Spinner theme='ColorSM' />
      }
    </>
  );
};

export default CardsAmbulatorioUltimoMes;

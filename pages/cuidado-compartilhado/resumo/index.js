import { TituloTexto, ButtonLight, GraficoInfo, TituloSmallTexto, Grid12Col, CardInfoTipoA, CardInfoTipoB } from "@impulsogov/design-system";
import style from "../../duvidas/Duvidas.module.css";

const Resumo = ({ }) => {
  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=""
        titulo="<strong>Resumo</strong>"
      />

      <GraficoInfo
        titulo="Cuidado compartilhado entre APS e CAPS"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
        link={{label: 'Mais informações',url: '/cuidado-compartilhado/aps-caps'}}
      />
      <Grid12Col
        items={[
          <CardInfoTipoB descricao="de 4823 atendimentos em saúde mental na APS" indicador={18} indicadorTotal={4823} indice={-4} indiceDescricao="últ. mês" titulo="Encaminhamentos para CAPS no mês de Junho" tooltip="Usuários que foram encaminhados para CAPS após atendimento em saúde mental ou abuso de substâncias pela Atenção Primária em Saúde"/>,
          <CardInfoTipoA key={ 1345 } indicador={ 0 } titulo="CAPS fora da meta de matriciamento em 2022 (até Agosto)" tooltip="CAPS que realizaram menos de dois matriciamentos por mês no ano, até o mês de referência" />,
        ]}
      />
      

      <GraficoInfo
        titulo="Cuidado compartilhado entre APS e Cuidado Ambulatorial"
        fonte="Fonte: SISAB - Elaboração Impulso Gov"
        link={{label: 'Mais informações',url: '/cuidado-compartilhado/aps-ambulatorio'}}
      />
      <Grid12Col
        items={[
          <CardInfoTipoB descricao="de 6.111 atendimentos em saúde mental na APS" indicador={472} indicadorTotal={6111} 
          indice={472} indiceDescricao="últ. mês" titulo="Encaminhamentos para cuidado ambulatorial no mês de Janeiro" 
          tooltip="Usuários que foram encaminhados para cuidado ambulatorial (incluindo referências em psicologia e outros centros de especialidades) após atendimento em saúde mental ou abuso de substâncias pela Atenção Primária em Saúde"/>,
        ]}
      />

      <GraficoInfo
        titulo="Cuidado compartilhado entre RAPS e Rede de Urgência e Emergência"
        descricao="Fonte: RAAS/SIASUS, BPA/SIASUS, AIH/SIHSUS.- Elaboração Impulso Gov"
        link={{label: 'Mais informações',url: '/cuidado-compartilhado/raps-hospitalar'}}
      />
      <Grid12Col
        items={[
          <CardInfoTipoB descricao="de 151 atendimentos em saúde mental na APS" indicador={63} indicadorTotal={151} titulo="Atendidos na RAPS nos últimos 6 meses antes da Internação" 
          tooltip="Usuários que tiveram ao menos um procedimento RAAS registrado em serviços RAPS dentro dos 6 meses anteriores a sua internação na rede hospitalar."/>,
          <CardInfoTipoB descricao="de 3 atendimentos em saúde mental na APS" indicador={0} indicadorTotal={3} titulo="Atendidos na RAPS até o mês seguinte à alta" 
          tooltip="Usuários que tiveram ao menos um procedimento RAAS registrado em serviços RAPS até o mês seguinte à alta de sua internação na rede hospitalar."/>
        ]}
      />
    </div>
  );
};

export default Resumo;

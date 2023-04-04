import { CardInfoTipoA, GraficoInfo, Grid12Col, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { v1 as uuidv1 } from 'uuid';
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
import { getAcoesReducaoDeDanos, getAcoesReducaoDeDanos12meses } from "../../../requests/outros-raps";

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const ReducaoDeDanos = () => {
  const { data: session } = useSession();
  const [acoes, setAcoes] = useState([]);
  const [acoes12meses, setAcoes12meses] = useState([]);

  useEffect(() => {
    const getDados = async (municipioIdSus) => {
      setAcoes(await getAcoesReducaoDeDanos(municipioIdSus));
      setAcoes12meses(await getAcoesReducaoDeDanos12meses(350950));
    };

    if (session?.user.municipio_id_ibge) {
      getDados(session?.user.municipio_id_ibge);
    }
  }, []);

  const getPropsCardUltimoPeriodo = (acoes) => {
    const acaoTodosUltimoPeriodo = acoes
      .find((acao) => acao.estabelecimento === "Todos" && acao.profissional_vinculo_ocupacao === "Todas" && acao.periodo === "Último período");

    return {
      key: uuidv1(),
      indicador: acaoTodosUltimoPeriodo["quantidade_registrada"],
      titulo: `Total de ações de redução de danos em ${acaoTodosUltimoPeriodo["nome_mes"]}`,
      indice: acaoTodosUltimoPeriodo["dif_quantidade_registrada_anterior"],
      indiceDescricao: "últ. mês"
    };
  };

  const getPropsCardUltimos12Meses = (acoes) => {
    const acaoTodosUltimos12Meses = acoes
      .find((acao) => acao.estabelecimento === "Todos" && acao.profissional_vinculo_ocupacao === "Todas");

    return {
      key: uuidv1(),
      indicador: acaoTodosUltimos12Meses["quantidade_registrada"],
      titulo: `Total de ações de redução de danos entre ${acaoTodosUltimos12Meses["a_partir_do_mes"]} de ${acaoTodosUltimos12Meses["a_partir_do_ano"]} e ${acaoTodosUltimos12Meses["ate_mes"]} de ${acaoTodosUltimos12Meses["ate_ano"]}`,
      indice: acaoTodosUltimos12Meses["dif_quantidade_registrada_anterior"],
      indiceDescricao: "doze meses anteriores"
    };
  };

  return (
    <div>
      <TituloSmallTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        texto=""
        titulo="<strong>Ações de Redução de Danos</strong>"
      />

      <GraficoInfo
        titulo="Ações de redução de danos realizadas"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />

      <Grid12Col
        items={ [
          <>
            { acoes.length !== 0 &&
              <CardInfoTipoA { ...getPropsCardUltimoPeriodo(acoes) } />
            }
          </>,
          <>
            { acoes12meses.length !== 0 &&
              <CardInfoTipoA { ...getPropsCardUltimos12Meses(acoes12meses) } />
            }
          </>,
        ] }
      />

      <GraficoInfo
        titulo="Histórico Temporal"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />
    </div>
  );
};

export default ReducaoDeDanos;

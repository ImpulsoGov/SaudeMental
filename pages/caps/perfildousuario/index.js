import { GraficoInfo, TituloSmallTexto } from "@impulsogov/design-system";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { redirectHomeNotLooged } from "../../../helpers/RedirectHome";
// import { getPerfilUsuariosPorEstabelecimento, getPerfilUsuarios } from "../../../requests/caps";
import ReactEcharts from "echarts-for-react";
import Select, { components } from "react-select";
import styles from "../Caps.module.css";
import usuariosAtivos from "./usuariosAtivos.json";

const CORES_GRAFICO_DONUT = ["#5367C9", "#6577CF", "#7685D4", "#8795DA", "#98A4DF", "#A9B3E4", "#BAC2E9", "#CAD0EE", "#D3D8F1", "#E0E4F5", "#8795DA", "#8795DA", "#8795DA"];

export function getServerSideProps(ctx) {
  const redirect = redirectHomeNotLooged(ctx);

  if (redirect) return redirect;

  return { props: {} };
}

const PerfilUsuario = () => {
  const { data: session } = useSession();
  const [perfil, setPerfil] = useState(usuariosAtivos);
  // const [perfilPorEstabelecimento, setPerfilPorEstabelecimento] = useState(usuariosPorEstabelecimento);
  const [filtroEstabelecimento, setFiltroEstabelecimento] = useState({
    value: "Todos", label: "Todos"
  });
  const [filtroCompetencia, setFiltroCompetencia] = useState({
    value: "", label: ""
  });

  // useEffect(() => {
  //   const getDados = async (municipioIdSus) => {
  //     setPerfil(await getPerfilUsuarios(520880));
  //     setPerfilPorEstabelecimento(
  //       await getPerfilUsuariosPorEstabelecimento(municipioIdSus)
  //     );
  //   };

  //   if (session?.user.municipio_id_ibge) {
  //     getDados(session?.user.municipio_id_ibge);
  //   }
  // }, []);

  const agregarPorEstabelecimentoEPeriodo = (perfil) => {
    const perfilAgregado = [];

    perfil.forEach((dado) => {
      const { estabelecimento, competencia, periodo, ativos_mes: quantidadeAtivos, usuario_condicao_saude: condicaoSaude } = dado;
      const perfilEncontrado = perfilAgregado
        .find((item) => item.estabelecimento === estabelecimento && item.periodo === periodo);

      if (!perfilEncontrado) {
        perfilAgregado.push({
          periodo,
          competencia,
          estabelecimento,
          ativosPorCondicao: [{ condicaoSaude, quantidadeAtivos }]
        });
      } else {
        const condicaoEncontrada = perfilEncontrado.ativosPorCondicao
          .find((item) => item.condicaoSaude === condicaoSaude);

        if (!condicaoEncontrada) {
          perfilEncontrado.ativosPorCondicao.push({ condicaoSaude, quantidadeAtivos });
        } else {
          condicaoEncontrada.quantidadeAtivos += quantidadeAtivos;
        }
      }
    });

    return perfilAgregado;
  };

  const getPropsFiltroEstabelecimento = (perfil) => {
    const optionsSemDuplicadas = [];

    perfil.forEach(({ estabelecimento }) => {
      const perfilEncontrado = optionsSemDuplicadas
        .find((item) => item.value === estabelecimento);

      if (!perfilEncontrado) {
        optionsSemDuplicadas.push({ value: estabelecimento, label: estabelecimento });
      }
    });

    const optionPersonalizada = ({ children, ...props }) => (
      <components.Control { ...props }>
        Estabelecimento: { children }
      </components.Control>
    );

    return {
      options: optionsSemDuplicadas,
      defaultValue: filtroEstabelecimento,
      selectedValue: filtroEstabelecimento,
      onChange: (selected) => setFiltroEstabelecimento({
        value: selected.value,
        label: selected.value
      }),
      isMulti: false,
      isSearchable: false,
      components: { Control: optionPersonalizada },
      styles: { control: (css) => ({ ...css, paddingLeft: '15px' }) },
    };
  };

  const getPropsFiltroCompetencia = (perfil) => {
    const perfilAgregado = agregarPorEstabelecimentoEPeriodo(perfil);
    const options = perfilAgregado
      .filter(({ estabelecimento }) => estabelecimento === filtroEstabelecimento.value)
      .map(({ periodo }) => ({
        value: periodo,
        label: periodo
      }));

    const optionPersonalizada = ({ children, ...props }) => (
      <components.Control { ...props }>
        Competência: { children }
      </components.Control>
    );

    return {
      options,
      defaultValue: filtroCompetencia,
      selectedValue: filtroCompetencia,
      onChange: (selected) => setFiltroCompetencia({
        value: selected.value,
        label: selected.value
      }),
      isMulti: false,
      isSearchable: false,
      components: { Control: optionPersonalizada },
      styles: { control: (css) => ({ ...css, paddingLeft: '15px' }) },
    };
  };

  const getOpcoesGraficoDonut = (perfil) => {
    const perfilAgregado = agregarPorEstabelecimentoEPeriodo(perfil);
    // setFiltroCompetencia(perfilAgregado[0].periodo);
    const perfilFiltrado = perfilAgregado
      .filter(({ estabelecimento, periodo }) =>
        estabelecimento === filtroEstabelecimento.value
        // && periodo === filtroCompetencia.value
      );

    const { ativosPorCondicao } = perfilFiltrado.find(({ periodo }) => {
      if (filtroCompetencia.value === "") {
        // setFiltroCompetencia(perfilFiltrado[0].periodo);

        return true;
      }

      return filtroCompetencia.value === periodo;
    });

    return {
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '80%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'inside',
            formatter: "{d}%",
            color: "#000000"
          },
          emphasis: {
            label: {
              show: true,
            }
          },
          labelLine: {
            show: false
          },
          data: ativosPorCondicao.map(({ condicaoSaude, quantidadeAtivos }, index) => ({
            value: quantidadeAtivos,
            name: !condicaoSaude ? "Sem informação" : condicaoSaude,
            itemStyle: {
              color: CORES_GRAFICO_DONUT[index]
            },
          }))
        }
      ]
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
        titulo="<strong>Perfil do usuário</strong>"
      />

      <GraficoInfo
        titulo="Perfil dos usuários ativos"
        descricao="Quantitativo de usuários com RAAS ou BPA movimentada nos últimos meses (exceto acolhimento inicial)."
        tooltip="a"
      />

      <GraficoInfo
        titulo="Panorama geral"
      />

      <GraficoInfo
        titulo="Detalhamento por estabelecimento"
      />

      <GraficoInfo
        titulo="CID dos usuários ativos"
        fonte="Fonte: BPA-i e RAAS/SIASUS - Elaboração Impulso Gov"
      />

      { perfil.length !== 0 &&
        <>
          <div className={ styles.Filtros }>
            <div className={ styles.Filtro }>
              <Select { ...getPropsFiltroEstabelecimento(perfil) } />
            </div>
            <div className={ styles.Filtro }>
              <Select { ...getPropsFiltroCompetencia(perfil) } />
            </div>
          </div>

          <div className={ styles.GraficoDonutContainer }>
            <ReactEcharts
              option={ getOpcoesGraficoDonut(perfil) }
              style={ { width: "40%", height: "100%" } }
            />
          </div>
        </>
      }

      <GraficoInfo
        titulo="Total de atendimentos"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />

      <GraficoInfo
        titulo="Atendimentos por horas trabalhadas"
        fonte="Fonte: BPA/SIASUS - Elaboração Impulso Gov"
      />
    </div>
  );
};

export default PerfilUsuario;

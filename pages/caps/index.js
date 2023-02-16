import { PanelSelector } from "@impulsogov/design-system";
import { useContext, useEffect, useState, useCallback } from "react";
import { Context } from "../../contexts/Context";
import { useRouter } from 'next/router';

const BASE_ENDPOINT = 'https://impulsoapi.herokuapp.com/suporte/municipios/';
const COMBINING_CHARS_REGEX = /\p{Diacritic}/gu;
const BLANK_SPACES_REGEX = /\s/g;

export default function Paineis() {
  const [city] = useContext(Context);
  const [panelLinks, setPanelLink] = useState([]);
  const [citySusId, setCitySusId] = useState('');

  const getNormalizedCityData = useCallback(() => {
    const lowerCity = city.toLowerCase();
    let [cityName, cityState] = lowerCity.split(' - ');

    if (BLANK_SPACES_REGEX.test(cityName)) {
      cityName = cityName.replace(BLANK_SPACES_REGEX, '-');
    }

    const normalizedCityName = cityName.normalize('NFD').replace(COMBINING_CHARS_REGEX, '');

    return {
      cityName: normalizedCityName,
      cityState,
    };
  }, [city]);

  useEffect(()=> {
    const getCitySusId = async () => {
      try {
        const { cityName, cityState } = getNormalizedCityData();
        const endpoint = `${BASE_ENDPOINT}?municipio_nome=${cityName}&sigla_uf=${cityState}`;
        const response = await fetch(endpoint);
        const [{ municipio_id_sus: susId }] = await response.json();

        setCitySusId(susId);
      } catch (error) {
        console.log(error);
      }
    }

    getCitySusId();

    if(city === "Aracaju - SE"){
      setPanelLink([
        "https://datastudio.google.com/embed/reporting/988e1312-3b59-455a-93c7-5c210f579ac6/page/p_gzdcpaaxpc",
        "https://datastudio.google.com/embed/reporting/988e1312-3b59-455a-93c7-5c210f579ac6/page/p_565p7422pc",
        "https://datastudio.google.com/embed/reporting/988e1312-3b59-455a-93c7-5c210f579ac6/page/p_sq3fdwu2pc",
        "https://datastudio.google.com/embed/reporting/988e1312-3b59-455a-93c7-5c210f579ac6/page/p_ks6mmf02pc",
        "https://datastudio.google.com/embed/reporting/988e1312-3b59-455a-93c7-5c210f579ac6/page/p_sb0vlo02pc",
        "https://datastudio.google.com/embed/reporting/988e1312-3b59-455a-93c7-5c210f579ac6/page/p_nh780y02pc",
        "https://datastudio.google.com/embed/reporting/988e1312-3b59-455a-93c7-5c210f579ac6/page/p_f72gfc12pc"
      ]);
    }
    if(city === "Recife - PE"){
      setPanelLink([
        "https://datastudio.google.com/embed/reporting/b1aca465-3494-4d99-a932-ec418300fe19/page/p_gzdcpaaxpc",
        "https://datastudio.google.com/embed/reporting/b1aca465-3494-4d99-a932-ec418300fe19/page/p_565p7422pc",
        "https://datastudio.google.com/embed/reporting/b1aca465-3494-4d99-a932-ec418300fe19/page/p_sq3fdwu2pc",
        "https://datastudio.google.com/embed/reporting/b1aca465-3494-4d99-a932-ec418300fe19/page/p_ks6mmf02pc",
        "https://datastudio.google.com/embed/reporting/b1aca465-3494-4d99-a932-ec418300fe19/page/p_sb0vlo02pc",
        "https://datastudio.google.com/embed/reporting/b1aca465-3494-4d99-a932-ec418300fe19/page/p_nh780y02pc",
        "https://datastudio.google.com/embed/reporting/b1aca465-3494-4d99-a932-ec418300fe19/page/p_f72gfc12pc"
      ]);
    }

    if(city === "Aparecida de Goiânia - GO"){
      setPanelLink([
        "https://datastudio.google.com/embed/reporting/6dc71cf6-e428-462a-807f-78e61d33fd57/page/p_gzdcpaaxpc",
        "https://datastudio.google.com/embed/reporting/6dc71cf6-e428-462a-807f-78e61d33fd57/page/p_565p7422pc",
        "https://datastudio.google.com/embed/reporting/6dc71cf6-e428-462a-807f-78e61d33fd57/page/p_sq3fdwu2pc",
        "https://datastudio.google.com/embed/reporting/6dc71cf6-e428-462a-807f-78e61d33fd57/page/p_ks6mmf02pc",
        "https://datastudio.google.com/embed/reporting/6dc71cf6-e428-462a-807f-78e61d33fd57/page/p_sb0vlo02pc",
        "https://datastudio.google.com/embed/reporting/6dc71cf6-e428-462a-807f-78e61d33fd57/page/p_nh780y02pc",
        "https://datastudio.google.com/embed/reporting/6dc71cf6-e428-462a-807f-78e61d33fd57/page/p_f72gfc12pc"
      ]);
    }
  }, [city, getNormalizedCityData]);

  const labels = [
    {
      label: "RESUMO",
    },
    {
      label: "PERFIL DE USUÁRIOS",
    },
    {
      label: "NOVOS USUÁRIOS",
    },
    {
      label: "TAXA DE ABANDONO",
    },
    {
      label: "ATENDIMENTOS INDIVIDUAIS",
    },
    {
      label: "PROCEDIMENTOS POR USUÁRIO",
    },
    {
      label: "PRODUÇÃO",
    },
  ];
  const router = useRouter();
  const panel = router.query?.painel;
  return (
    <div style={{fontFamily: "Inter"}}>
      <PanelSelector
        panel={Number(panel)}
        links={[panelLinks]}
        list={[labels]}
        titles={[{label:"Acompanhamento dos serviços CAPS"}]}
      />
    </div>
  )
}

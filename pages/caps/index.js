import { PanelSelector } from "@impulsogov/design-system";
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from "react";
import { Context } from "../../contexts/Context";
import { getCityData } from "../../services/getCityData";
import { getNormalizedCity } from "../../utils/getNormalizedCity";

const DEFAULT_CITY = 'Aracaju - SE';
const DEFAULT_CITY_SUS_ID = '280030';

export default function Paineis() {
  const [city] = useContext(Context);
  const [panelLinks, setPanelLink] = useState([]);
  const [citySusId, setCitySusId] = useState(city === DEFAULT_CITY ? DEFAULT_CITY_SUS_ID : '');

  useEffect(() => {
    const { cityName, cityState } = getNormalizedCity(city);

    getCityData(cityName, cityState)
      .then(({ municipio_id_sus: susId }) => setCitySusId(susId));

    console.log(citySusId);

    if (city === "Aracaju - SE") {
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
    if (city === "Recife - PE") {
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

    if (city === "Aparecida de Goiânia - GO") {
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
  }, [city, citySusId]);

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
    <div style={ { fontFamily: "Inter" } }>
      <PanelSelector
        panel={ Number(panel) }
        links={ [panelLinks] }
        list={ [labels] }
        titles={ [{ label: "Acompanhamento dos serviços CAPS" }] }
      />
    </div>
  );
}

const BASE_ENDPOINT = 'https://impulsoapi.herokuapp.com/suporte/municipios/';

export const getCitySusId = async (cityName, cityState) => {
  try {
    const endpoint = `${BASE_ENDPOINT}?municipio_nome=${cityName}&sigla_uf=${cityState}`;
    const response = await fetch(endpoint);
    const [{ municipio_id_sus: susId }] = await response.json();

    return susId;
  } catch (error) {
    console.error(error);
  }
}

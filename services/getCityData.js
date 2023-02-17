import axios from 'axios';

const API_URL = 'https://impulsoapi.herokuapp.com';

export const getCityData = async (cityName, cityState) => {
  try {
    const config = {
      method: 'get',
      url: `${API_URL}/suporte/municipios/?municipio_nome=${cityName}&estado_sigla=${cityState}`,
    };

    const { data } = await axios(config);

    return data[0];
  } catch (error) {
    console.error(error.response.data);
  }
};

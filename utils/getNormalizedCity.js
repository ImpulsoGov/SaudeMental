const COMBINING_CHARS_REGEX = /\p{Diacritic}/gu;
const BLANK_SPACES_REGEX = /\s/g;

export const getNormalizedCity = (city) => {
  const lowerCity = city.toLowerCase();
  let [cityName, cityState] = lowerCity.split(' - ');

  cityName = cityName.replace(BLANK_SPACES_REGEX, '-');

  const normalizedCityName = cityName.normalize('NFD').replace(COMBINING_CHARS_REGEX, '');

  return {
    cityName: normalizedCityName,
    cityState,
  };
};

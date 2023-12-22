import { useEffect, useState } from 'react';

function useRequest({
  periodos,
  requisicao,
  municipioIdSus,
  estabelecimento,
}) {
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState([]);
  // Controla mudanças a cada interação com filtros de estabelecimento/períodos
  // do gráfico de procedimentos por tempo de serviço
  useEffect(() => {
    if (municipioIdSus) {
      setLoading(true);
      // Cria um array de promises que, quando resolvidas, trarão os resultados das
      // requisições feitas à API para cada período de estabelecimento selecionados.
      // Essa abordagem foi adota para que as requisições feitas fossem o mais atômicas
      // possíveis para facilitar a reutilização do cache pelo navegador, ex: se
      // fizéssemos requisições passando todos os períodos selecionados numa mesma requisição,
      // quando o usuário selecionasse um novo período, seria feita uma nova requisição diferente
      // anterior:
      // 1ª requisição -> estabelecimento=Todos, periodos=Último período
      // Usuário adiciona Jun/23 no filtro múltiplo
      // 2ª requisição -> estabelecimento=Todos, periodos=Último período-Jun/23
      // Como a 2ª requisição é diferente da 1ª, a API é chamada novamente.
      // Da forma feita aqui, é feita uma requisição pra cada período selecio do estabelecimento:
      // 1ª requisição -> estabelecimento=Todos, periodos=Último período
      // Usuário adiciona Jun/23 no filtro múltiplo
      // Próximas requisições -> estabelecimento=Todos, periodos=Último período e estabelecimento=Todos, periodos=Jun/23
      // Como a requisição estabelecimento=Todos, periodos=Último período já foi feita antes, os dados em cache são usados e a API não é chamada para esse endpoint
      const promises = periodos.map(({ value: periodo }) => {
        return requisicao(
          municipioIdSus,
          estabelecimento.value,
          periodo
        );
      });
      // Resolve todas as promises das requisições (a ordem de resolução não importa)
      // A variável "respostas" é um array de arrays
      Promise.all(promises).then((respostas) => {
        // Transforma o array de arrays num só array com os dados de todas as requisições
        const respostasUnificadas = [].concat(...respostas);
        setDados(respostasUnificadas);
      });

      setLoading(false);
    }
  }, [municipioIdSus, estabelecimento.value, periodos, requisicao]);

  return {
    dados,
    loading
  };
}

export default useRequest;

import { ButtonLight } from '@impulsogov/design-system';
import { TituloTexto } from "@impulsogov/design-system";
import { MateriaisComplementares } from "@impulsogov/design-system";
import style from "../duvidas/Duvidas.module.css"

const Index = ({res}) => {
  return(
      <>
        <div className={style.BotaoVoltar}>
          <ButtonLight 
              icone={{posicao: 'right', url: 'https://media.graphassets.com/8NbkQQkyRSiouNfFpLOG'}} 
              label="VOLTAR" 
              link="/inicio"/>
          <div style={{position:"relative",left:"70%"}}>
            <ButtonLight
                icone={{posicao: 'right', url: 'https://media.graphassets.com/yaYuyi0KS3WkqhKPUzro'}}
                label="CENTRAL DE AJUDA"
                link="/central-de-ajuda"/>
          </div>
        </div>
        <TituloTexto 
          imagem= {{
            posicao: null,
            url: ''
          }}
          titulo= "Materiais complementares"
          texto="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat adipiscing elit, sed dosiih ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
        />
        <MateriaisComplementares
          modulo={[
            {concluido: true,formato: 'VIDEO',id: 1,link: '/',moduloID: 0,titulo: 'Introdução sobre a Capacitação'},
            {concluido: true,formato: 'VIDEO',id: 1,link: '/',moduloID: 1,titulo: 'Introdução sobre a Capacitação'},
            {concluido: false,formato: 'PPT',id: 2,link: '/',moduloID: 1,titulo: 'Introdução ao Indicador de Hipertensão + Introdução ao Indicador de Diabetes'},
            {concluido: false,formato: 'PDF',id: 1,link: '/',moduloID: 2,titulo: 'Introdução ao Previne Brasil'},
            {concluido: false,formato: 'QUIZ',id: 2,link: '/',moduloID: 2,titulo: 'Quizz de avaliação desses conteúdos'}
          ]}
          modulos={[
            {concluido: true,id: 0,liberado: true,tipo: 'MATERIAIS',titulo: 'Introdução aos indicadores de Hipertensão e Diabetes na APS'},
            {concluido: true,id: 1,liberado: true,tipo: 'MATERIAIS',titulo: 'Introdução aos indicadores de Hipertensão e Diabetes na APS'},
            {concluido: false,id: 2,liberado: true,tipo: 'MATERIAIS',titulo: 'Qualificação do registro e monitoramento de dados'},
            {concluido: false,id: 3,liberado: true,tipo: 'TUTORIAIS',titulo: 'Gestão de processos de trabalho'}
          ]}
          ultimoModulo={0}
        />
      </>
  )
}

export default Index;

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
          texto="Preparamos uma série de documentos e vídeos para te ajudar durante o uso do painel. São guias explicativos dos indicadores, gestão de processos, tutoriais e muito mais. Para acessar é só clicar no tema de interesse e depois no nome do material. Os documentos abrirão em PDF em uma outra guia do navegador e os vídeos abrirão em uma tela aqui mesmo."
        />
        <MateriaisComplementares
          modulos={[
            {concluido: true,id: 0,liberado: true,tipo: 'MATERIAIS',titulo: 'Guia dos indicadores'},
            {concluido: true,id: 1,liberado: true,tipo: 'MATERIAIS',titulo: 'Gestão de processos de trabalho'},
            {concluido: true,id: 2,liberado: true,tipo: 'MATERIAIS',titulo: 'Resolução de problemas'},
            {concluido: true,id: 3,liberado: true,tipo: 'TUTORIAIS',titulo: 'Como usar o painel?'}
          ]}
          modulo={[
            {concluido: true,formato: 'PDF',id: 0,link: 'https://media.graphassets.com/SzWf3r2ITFuffA39OyPF',moduloID: 0,titulo: 'Internações'},
            {concluido: false,formato: 'PDF',id: 0,link: 'https://media.graphassets.com/RA8T1VL8Syi3u0rFOLY1',moduloID: 0,titulo: 'Taxa de não adesão'},
            // {concluido: false,formato: 'PDF',id: 1,link: '/',moduloID: 0,titulo: 'Produção'},
            // {concluido: false,formato: 'PDF',id: 1,link: '/',moduloID: 1,titulo: 'Planilha de plano de ação'},
            // {concluido: false,formato: 'PDF',id: 1,link: '/',moduloID: 1,titulo: 'Rotinas de trabalho'}
          ]}
          ultimoModulo={0}
        />
      </>
  )
}

export default Index;

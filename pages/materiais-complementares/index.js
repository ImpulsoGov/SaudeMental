import { ButtonLight, MateriaisComplementares, TituloTexto } from '@impulsogov/design-system';
import style from "../duvidas/Duvidas.module.css";

const Index = ({ res }) => {
  return (
    <>
      <div className={ style.BotaoVoltar }>
        <ButtonLight
          icone={ { posicao: 'right', url: 'https://media.graphassets.com/8NbkQQkyRSiouNfFpLOG' } }
          label="VOLTAR"
          link="/inicio" />
        <div style={ { position: "relative", left: "70%" } }>
          <ButtonLight
            icone={ { posicao: 'right', url: 'https://media.graphassets.com/yaYuyi0KS3WkqhKPUzro' } }
            label="CENTRAL DE AJUDA"
            link="/central-de-ajuda" />
        </div>
      </div>
      <TituloTexto
        imagem={ {
          posicao: null,
          url: ''
        } }
        titulo="Materiais complementares"
        texto="Preparamos uma série de documentos e vídeos para te ajudar durante o uso do painel. São guias explicativos dos indicadores, gestão de processos, tutoriais e muito mais. Para acessar é só clicar no tema de interesse e depois no nome do material. Os documentos abrirão em PDF em uma outra guia do navegador e os vídeos abrirão em uma tela aqui mesmo."
      />
      <MateriaisComplementares
        modulos={ [
          { concluido: true, id: 0, liberado: true, tipo: 'MATERIAIS', titulo: 'Guia dos indicadores' },
          { concluido: true, id: 1, liberado: true, tipo: 'MATERIAIS', titulo: 'Gestão de processos de trabalho' },
          // { concluido: true, id: 2, liberado: true, tipo: 'MATERIAIS', titulo: 'Resolução de problemas' },
          // { concluido: true, id: 3, liberado: true, tipo: 'TUTORIAIS', titulo: 'Como usar o painel?' }
        ] }
        modulo={ [
          { concluido: true, formato: 'PDF', id: 0, link: 'https://media.graphassets.com/W1tOJ2wAS2qwTRgeIGDF', moduloID: 0, titulo: 'Internações', openInNewTab: true },
          { concluido: false, formato: 'PDF', id: 0, link: 'https://media.graphassets.com/X6sAJccwTl2CaD375MiY', moduloID: 0, titulo: 'Taxa de não adesão', openInNewTab: true },
          { concluido: false, formato: 'PDF', id: 1, link: 'https://media.graphassets.com/uyasYncETnaaqFeOoLzb', moduloID: 1, titulo: 'Uso de dados na gestão da RAPS', openInNewTab: true },
          { concluido: false, formato: 'PDF', id: 1, link: 'https://media.graphassets.com/B5HeOSApTS6vc8YFGkqM', moduloID: 1, titulo: 'Planilha de plano de ação', openInNewTab: true },
          // {concluido: false,formato: 'PDF',id: 1,link: '/',moduloID: 1,titulo: 'Rotinas de trabalho'}
        ] }
        ultimoModulo={ 0 }
      />
    </>
  );
};

export default Index;

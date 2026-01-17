import { TituloSmallTexto } from '@impulsogov/design-system';
export const getTextoCardsZerados = () => {
  return (
    <TituloSmallTexto
      imagem={ {
        posicao: null,
        url: ''
      } }
      texto={`<p style="font-size: 16px;">Alguns indicadores podem não estar disponíveis nessa página por falta de dados necessários para exibi-los. Verifique se existem problemas de registro.</p>
      <p style="font-size: 16px;">Em caso de dúvidas, entre em contato via nosso <a href="https://saudemental.impulsogov.org/duvidas">formulário de suporte</a>, <a href="https://wa.me/5511942642429">whatsapp</a> ou e-mail (<a href="mailto:saudemental@impulsogov.org">saudemental@impulsogov.org</a>).</p>`}
      botao={ {
        label: '',
        url: ''
      } }
      titulo=""
    />
  );
};
import axios from "axios";
import FormData from "form-data";
import { API_USUARIOS_URL } from "../constants/API_URL";

const validateCredentials = async (mail, senha) => {
  let data = new FormData();

  data.append('username', mail);
  data.append('password', senha);

  const config = {
    method: 'post',
    url: API_USUARIOS_URL + 'suporte/usuarios/token',
    data: data
  };

  const res = await axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error.response.data;
    });

  return res;
};

const validacao = (setResposta, validarCredencial, entrar, mail, senha, setEsperandoResposta) => {
  const res = async () => await validarCredencial(mail, senha);

  if (mail.length < 1 || senha.length < 1) {
    const msg_campo_vazio = "Preencha todos os campos";

    setResposta(msg_campo_vazio);

    return msg_campo_vazio;
  } else {
    res().then((response) => {
      if (typeof (response["access_token"]) !== "undefined") {
        entrar('credentials', { redirect: true, username: mail, password: senha });
      } else {
        setResposta(response["detail"]);
        setEsperandoResposta(false);
      }

      return res;
    });
  }
};

export { validacao, validateCredentials };

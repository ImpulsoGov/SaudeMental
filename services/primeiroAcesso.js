import axios from "axios";
import FormData from "form-data";
import { API_USUARIOS_URL } from "../constants/API_URL";

const primeiroAcessoClient = async (mail) => {
  const data = new FormData();

  data.append('mail', mail);

  let config = {
    method: 'post',
    url: API_USUARIOS_URL + 'suporte/ger_usuarios/primeiro-acesso',
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

const primeiroAcesso = async (mail) => {
  const res = await primeiroAcessoClient(mail);
  if (res?.success == true) return true;
  return false;
};

const criarSenhaClient = async (mail, codigo, nova_senha) => {
  let data = new FormData();

  data.append('mail', mail);
  data.append('codigo', codigo);
  data.append('nova_senha', nova_senha);

  let config = {
    method: 'post',
    url: API_USUARIOS_URL + 'suporte/ger_usuarios/criar-senha',
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

const criarSenha = async (mail, codigo, nova_senha) => {
  const res = await criarSenhaClient(mail, codigo, nova_senha);
  if (res?.success == true) return true;
  return false;
};

export { criarSenha, primeiroAcesso };


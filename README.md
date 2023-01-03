# Plataforma de indicadores de Impulso Saúde Mental


## :mag_right: Índice
1. [Contexto](#contexto)
2. [Estrutura do repositório](#estrutura)
3. [Rodando em produção](#rodando)
4. [Instruções para instalação e acesso ao projeto](#instalacao)
6. [Contribua](#contribua)
7. [Licença](#licenca)
*******

<div id='contexto'/>  

## Contexto

A plataforma de indicadores de Impulso Saúde Mental é uma solução gratuita, voltada a apoiar a gestão dos serviços de saúde mental municipal. A partir de dados abertos, apresentamos um panorama sobre o cuidado oferecido pela Rede da Atenção Psicossocial (RAPS) e sobre a relação desta com as demais redes de saúde que atendem demandas de saúde mental no município.

Para a realização da plataforma, desenvolvemos um conjunto de indicadores de acesso, produção, qualidade e perfil dos usuários atendidos na RAPS. Deste modo, proporcionamos uma ferramenta descomplicada para gestoras e gestores municipais realizarem diagnósticos do território e da população que atendem e monitorarem a qualidade dos serviços que estão sendo prestados.

A partir da coleta de dados do SIASUS, do SISAB e de demais bases abertas do Ministério da Saúde, os indicadores Impulso produzem informação visando responder às necessidades do gestor municipal para a tomada de decisões acertadas e consequente aprimoramento contínuo da prestação de serviços públicos

<div id='estrutura'/>  

 ## :milky_way: Estrutura do repositório

Esse repositório foi criado com [Create React App](https://github.com/facebook/create-react-app). Saiba mais em [Create React App documentação](https://facebook.github.io/create-react-app/docs/getting-started).


```plain
root
├─ components
├─ contexts
├─ pages
│  ├─ api
│  ├─ caps
│  ├─ cuidado-compartilhado
│  └──...
├─ public
├─ querys
├─ services
├─ styles
├─ utils
```

- componentes: componentes que podem ser reutilizados em outras partes das aplicações, como a barra de navegação.
- contexts: funções utilizadas pela contexts API do REACT/JS
- pages: páginas da aplicação
- public: imagens para utilização na aplicação.
- querys: arquivos com as querys de consulta ao graphCMS
- services: funções com requisições as serviços externos
- styles: css do estilo das aplicações.
- utils: codigos auxiliares

## Tecnologias 

A plataforma de indicadores de Impulso Saúde Mental é implementada com [Next.js](https://nextjs.org/) como principal tecnologia e utilizando SSR para melhor performance no lado do cliente.

Essa aplicação é construida com a biblioteca de componentes do [Design System](https://designsystem.impulsogov.org/) da ImpulsoGov

 <div id='rodando'/> 
 
## :gear: Rodando em produção

As nossas aplicações são rodadas na [vercel](https://vercel.com/).

## Execução local

```bash
yarn dev
```

```bash
npm run dev
```


## Execução produção

```bash
yarn start
```

## Instalação de dependencias

```bash
yarn
```


## Build

```bash
yarn build
```


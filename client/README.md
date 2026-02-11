# MiniBlog - React + Firebase

Projeto Mini Blog - Mini Blog - React + Firebase | Context API Aplicação full-stack de blog desenvolvida com React.js e Firebase como backend. Implementa autenticação de usuários com Firebase Auth, armazenamento de dados no Firestore Database, e gerenciamento de estado global usando React Context API. Funcionalidades completas de CRUD para postagens com interface responsiva.

![alt text](image.png)

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

Além disso, você precisará configurar um projeto no [Firebase](https://firebase.google.com/) para obter as credenciais necessárias.

---

## Configuração do Firebase

1. Acesse o [console do Firebase](https://console.firebase.google.com/) e crie um novo projeto.
2. Ative o **Firestore Database** no modo de teste.
3. Ative o **Authentication** e configure o provedor de autenticação desejado (por exemplo, Email/Password).
4. Copie as credenciais do seu projeto (API Key, Auth Domain, etc.) em **Configurações do Projeto** > **Configurações Gerais**.

---

## Configuração do Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto e adicione as credenciais do Firebase:

```env
REACT_APP_FIREBASE_API_KEY=SUA_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=SEU_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=SEU_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=SEU_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=SEU_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=SEU_APP_ID


### Scripts Disponíveis
1. No diretório do projeto, você pode executar:

npm start
Inicia o aplicativo no modo de desenvolvimento.
Abra http://localhost:3000 para visualizá-lo no navegador.

A página será recarregada automaticamente ao fazer alterações no código.
Você também verá erros de lint no console.

npm run build
Cria uma versão otimizada do aplicativo para produção na pasta build.
Os arquivos são minificados e o aplicativo está pronto para ser implantado.

### Funcionalidades
1. **Autenticação**: Login e registro de usuários com Firebase Authentication.
2. **CRUD de Posts**: Criação, leitura, edição e exclusão de posts com Firestore Database.
3. **Interface Responsiva**: Design responsivo para dispositivos móveis e desktops.
4. **Gerenciamento de Posts**: Dashboard para gerenciar os posts do usuário autenticado.


### Estrutura do Projeto

src/
├── components/       # Componentes reutilizáveis
├── context/          # Contexto para gerenciamento de estado global
├── firebase/         # Configuração do Firebase
├── hooks/            # Hooks personalizados
├── pages/            # Páginas principais do aplicativo
├── App.js            # Componente principal do aplicativo
├── index.js          # Ponto de entrada do React

### Como Contribuir
1. Faça um fork deste repositório.
2. Crie uma branch para sua feature (git checkout -b minha-feature).
3. Commit suas alterações (git commit -m 'Adiciona minha feature').
4. Faça o push para a branch (git push origin minha-feature).
5. Abra um Pull Request.

### Tecnologias Utilizadas
1. **React**: Biblioteca JavaScript para construção de interfaces de usuário.
1. **Firebase**: Plataforma para autenticação e banco de dados em tempo real.
1. **CSS Modules**: Estilização modular para componentes React.


### O que foi adicionado:
1. **Descrição do projeto**: Explicação sobre o que é o projeto e suas funcionalidades.
2. **Configuração do Firebase**: Instruções detalhadas para configurar o Firebase.
3. **Configuração do `.env`**: Passos para adicionar as credenciais do Firebase ao arquivo `.env`.
4. **Scripts disponíveis**: Explicação sobre os comandos `npm start` e `npm run build`.
5. **Estrutura do projeto**: Visão geral da organização dos arquivos.
6. **Como contribuir**: Guia para contribuir com o projeto.
7. **Tecnologias utilizadas**: Lista das principais tecnologias usadas.

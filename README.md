<h1 align="center">Agendamento de Quadras Faminas</h1>

---
<p align="center">
    <a href="#sobre">Sobre</a> •
    <a href="#documentacao">Documentação</a> •
    <a href="#instalacao">Instalação</a> •
    <a href="#autor">Autor</a>
</p>

<h2 id="sobre">✨ Sobre</h2>

Este projeto é uma aplicação web que permite usuários realizarem reservas para o uso das quadras. Os admins tem total controle das reservas e dos perfis.

O projeto tem 3 roles diferentes, cada um com sua função e telas.

<h2 id="documentacao">📝 Documentação</h2>

https://documenter.getpostman.com/view/29442674/2sAXxJga5d

<h2 id="instalacao">🚀 Como executar o projeto</h2>
Siga os passos abaixo para executar o projeto em seu ambiente local:



1. **Você precisa do banco de dados Postgre, as query para a criação dele está aqui: [Drive](https://drive.google.com/file/d/1k8VWYiDrJHr1_BPvTbdd-AbllvzUj5s9/view?usp=sharing)**
   
2. **Clone o repositório**
   ```bash
   git clone https://github.com/Victordplima/App-Quadras-Back.git
   ```
   
3. **Navegue até os arquivos**
   ```bash
   cd App-Quadras-Back
   ```

4. **Instalação de Dependências**
   ```bash
   npm install
   ```

5. **Configure o .env com as informações do banco de dados e o JWT_SECRET**
   ```env
    DB_HOST=
    DB_USER=
    DB_PASSWORD=
    DB_NAME=
    JWT_SECRET=
   ```

6. **Inicialização da Aplicação**
   ```bash
   npm run dev
   ```

<h2 id="autor">👨‍💻 Autor</h2>
https://github.com/Victordplima

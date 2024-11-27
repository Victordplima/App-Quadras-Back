// isso aqui só serve para quando for criar algum usuario direto no bd, só serve para pegar uma senha e criptografar

const bcrypt = require("bcryptjs");

const hashSenha = async (senha) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);
    console.log("Senha criptografada:", hashedPassword);
};

const senha = "senhaqualquer";
hashSenha(senha);

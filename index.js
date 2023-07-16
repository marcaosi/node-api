const express = require('express');

const app = express();
const port = 3000;
app.use(express.json());
let alunos = [];
let lastId = 0;

app.get('/', (req, res) => {
  res.json('oi');
});

app.get('/api/v1/aluno', (req, res) => {
  res.send(alunos);
});

app.get('/api/v1/aluno/:id', (req, res) => {
  const { id } = req.params;

  let aluno = null;

  alunos.forEach((a) => {
    if (Number(a.id) === Number(id)) {
      aluno = a;
    }
  });

  if (aluno == null) {
    return res.status(404).send({});
  }
  return res.status(200).send(aluno);
});

app.post('/api/v1/aluno', (req, res) => {
  const dados = req.body;

  try {
    if (!dados.nome || dados.nome.length === 0) {
      throw new Error('Campo nome é obrigatório.');
    }

    if (!dados.email || dados.email.length === 0) {
      throw new Error('Campo e-mail é obrigatório.');
    }

    const alunosComMesmoEmail = alunos.filter((a) => a.email === dados.email);

    if (alunosComMesmoEmail.length > 0) {
      throw new Error('Este e-mail já está cadastrado. Não pode repetir.');
    }

    const aluno = {
      nome: dados.nome,
      email: dados.email,
      id: lastId + 1,
    };
    lastId = aluno.id;

    alunos.push(aluno);

    return res.status(201).send(aluno);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

app.put('/api/v1/aluno/:id', (req, res) => {
  const { id } = req.params;
  const dados = req.body;

  try {
    if (!dados.nome || dados.nome.length === 0) {
      throw new Error('Campo nome é obrigatório.');
    }

    if (!dados.email || dados.email.length === 0) {
      throw new Error('Campo e-mail é obrigatório.');
    }

    const alunosComMesmoEmail = alunos.filter(
      (a) => a.email === dados.email && Number(id) !== Number(a.id),
    );

    if (alunosComMesmoEmail.length > 0) {
      throw new Error('Este e-mail já está cadastrado em outro aluno. Não pode repetir.');
    }

    const alunosEncontrados = alunos.filter((a) => Number(a.id) === Number(id));

    if (alunosEncontrados.length === 0) {
      throw new Error('Aluno não encontrado com este código.');
    }

    Object.keys(dados).forEach((chave) => {
      alunosEncontrados[0][chave] = dados[chave];
    });

    return res.status(200).send(alunosEncontrados[0]);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

app.delete('/api/v1/aluno/:id', (req, res) => {
  const { id } = req.params;

  let index = -1;

  alunos.forEach((a, i) => {
    if (Number(a.id) === Number(id)) {
      index = i;
    }
  });

  if (index === -1) {
    return res.status(404).end();
  }

  alunos = alunos.filter((a) => Number(a.id) !== Number(id));

  return res.status(203).send({});
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on ${port}`);
});

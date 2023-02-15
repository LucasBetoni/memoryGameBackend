const express = require('express');
const fs = require('fs');
const { fileURLToPath } = require('url');
const app = express()

const port = 3000;
const password = 'coelho';
const file_path = './public/{name}.mp3';


app.get('/requestaudio/:name', (req, res) => {

  if(req.query.pass !== password) { // Senha incorreta.
    res.status(401).json({'error': 'Not authorized! Check if the password is correct.'});
    return;
  }

  let name = req.params['name'].toLowerCase();
  let audio_filename = file_path.replace('{name}', encodeURIComponent(name));

  if(!fs.existsSync(audio_filename)) { // Arquivo não existe, temos que baixar ele da AWS.
    res.status(404).json({'error': 'Not Found! This audio does not exist, and we could not download it from AWS at this time...'}); // TODO: baixar da AWS (lembrete: checar limites diários/mensais antes de baixar).
    return;
  }

  //Enviar arquivo, que agora já existe.
  res.download(audio_filename);

})


app.get('/', (req, res) => {
  res.status(400).json({'error': 'Bad request! Use this format for the URL instead: '+ req.protocol +'://'+ req.headers.host +'/requestaudio/NAME?pass=PASSWORD'});
  // Alternativamente, se você não quiser deixar claro como usa a API, descomente o de baixo e comente o de cima.
  //res.status(400).json({'error': 'Bad request!'});
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
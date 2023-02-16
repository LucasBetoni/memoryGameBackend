const express = require('express');
const fs = require('fs');
const { fileURLToPath } = require('url');
const app = express()
const AWS = require('aws-sdk');

AWS.config.loadFromPath('./awscreds.json');

const Polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: 'us-east-1'
})

const port = 3000;
const password = 'coelho';
const file_path = './public/{name}.mp3';


app.get('/requestaudio/:name', (req, res) => {

  if(req.query.pass !== password) { // Senha incorreta.
    res.status(401).json({'error': 'Not authorized! Check if the password is correct.'});
    return;
  }

  let name = req.params['name'].trim().toLowerCase();
  let audio_filename = file_path.replace('{name}', encodeURIComponent(name));

  if(name == '') {
    res.status(404).json({'error': 'Not Found! Empty name not allowed.'});
    return;
  }

  if(!fs.existsSync(audio_filename)) { // Arquivo não existe, temos que baixar ele da AWS.
   // res.status(404).json({'error': 'Not Found! This audio does not exist, and we could not download it from AWS at this time...'});
    
    // TODO: baixar da AWS (lembrete: checar limites diários/mensais antes de baixar).
    
        // polly settup
        let pollyparams = {
          Text: name,
          TextType: "text",
          OutputFormat: "mp3",
          VoiceId: "Camila",
          Engine: "neural",
          LanguageCode: "pt-BR",
    
        };

        Polly.synthesizeSpeech(pollyparams, (err, data) => {
          if (err) {
            res.status(404).json({'error': 'Not Found! This audio does not exist, and we could not download it from AWS at this time...'});
   
              console.log(err.message)
          } else if (data) {
            if (data.AudioStream instanceof Buffer) {
                fs.writeFile(audio_filename, data.AudioStream, function(err) {
                    if (err) {
                      res.status(404).json({'error': 'Not Found! This audio does not exist, and we could not download it from AWS at this time...'});  
                      return console.log(err);
                    }
                    console.log("The file was saved!")
                    res.download(audio_filename);
                })
            }
        }
      })
    
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


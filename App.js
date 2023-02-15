const express = require('express');
const { fileURLToPath } = require('url');
const app = express()
const port = 3000
var fs = require('fs');



app.get('/requestaudio/:pass/:name', (req, res) => {
    console.log(req.params['pass']);
    console.log(req.params['name']);
  if(req.params['pass'] == 'coelho'){
    
   // try{
      var fileRequest = new File ('public/'+req.params['name']+'.mp3');
   // }catch{}

    if(fileRequest.exists()){
      res.sendFile(fileRequest);
    }
    else{
        res.sendStatus(404);
    }
  }
  else{
    res.sendStatus(401);
}
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
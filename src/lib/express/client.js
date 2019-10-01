const path = require('path');
const fs = require("fs");
const express = require('express');
const favicon = require('serve-favicon');
const config = require('../../config');

export default (app) => {

  // Paths 404 from url
  app.get(config.path.disabled, (req, res) => {
    res.status(404).sendFile(`${config.base}/views/404.html`);
  });

  // Point static path to client by default
  let client = config.client;
  let file = 'index';

  // If not exits client, when set internal default
  if (!fs.existsSync(config.client)) {
    client = `${config.base}/views/default`;
    file = config.mode;
    if (config['socket.io'].example) {
      app.use('/socket', express.static(`${client}/socket.html`));
      app.use('/token', express.static(`${client}/token.html`));
    }
  }

  app.use(express.static(client));
  app.use(favicon(path.join(client, 'favicon.ico')));

  // Folder client
  app.get('/*', (req, res) => {
    res.sendFile(`${client}/${file}.html`);
  });


  // Examples
  
  // app.use('/bower_components', express.static(`${config.root}/bower_components`));
  // app.get('/:url(admin)/*', (req, res) => {
  //     res.sendFile(`${config.client2}/index.html`);
  // });

}

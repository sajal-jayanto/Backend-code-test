const express = require('express')
const dotenv = require("dotenv").config();
const validator = require('express-joi-validation').createValidator({})
const fileUpload = require('express-fileupload');
const Joi = require('joi')
const config = require('./config')
const fs = require('fs');
const path = require('path');

const app = express()
app.use(express.json());
app.use(fileUpload());


/// Download File REST-API
app.get('/files/:publicKey', validator.params(
  Joi.object({
    publicKey: Joi.string().required()
  })
), async (req, res) => {
  const { publicKey } = req.params;
  if (config.publicKey !== publicKey) {
    throw new Error("Invalid public key.")
  }
  const directory = `${__dirname}/${process.env.FOLDER || "upload"}`;
  fs.readdir(directory, (err, files) => {
    if (err) return res.status(500).send(err);
    if (files.length === 0) {
      return res.status(200).send("There is no file to download");
    }
    const filePath = path.join(directory, files[0])
    res.status(200).download(filePath)
  })
})


/// Upload Any file REST-API
app.post('/files', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  try {
    const file = req.files.file;
    const uploadPath = `${__dirname}/${process.env.FOLDER || "upload"}/${file.name}`;
    await file.mv(uploadPath);

    res.status(201).json({
      message: 'File uploaded successfully',
      publicKey: config.publicKey,
      privateKey: config.privateKey
    })

  } catch (err) {
    res.status(500).send(err);
  }
})

/// Delete all file REST-API
app.delete("/files/:privateKey", validator.params(
  Joi.object({
    privateKey: Joi.string().required()
  })
), async (req, res) => {
  const { privateKey } = req.params;
  if (config.privateKey !== privateKey) {
    throw new Error("Invalid private key.")
  }
  const directory = `${__dirname}/${process.env.FOLDER || "upload"}`;
  fs.readdir(directory, (err, files) => {
    if (err) return res.status(500).send(err);
    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) return res.status(500).send(err);
      });
    }
  });
  res.status(200).send("Files deleted successfully.");
})

module.exports = app;

module.exports = function() {
  // let's import the needed modules
  const algosdk = require('algosdk');
  const fs = require('fs').promises;
  const limitTemplate = require("algosdk/src/logicTemplates/htlc");
  var algoutils = require("./algoutils");

  // constants to use for the Algod client
  const token = {
    'X-API-Key': `${process.env.API_KEY}` // 'YOUR PURESTAKE API KEY HERE'
  }

  const server = 'https://testnet-algorand.api.purestake.io/ps2';
  const port = '';
}
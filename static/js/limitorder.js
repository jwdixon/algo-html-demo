module.exports = function() {
  this.limitorder = function() {
    // Handle importing needed modules
    const algosdk = require('algosdk');
    const fs = require('fs');
    const limitTemplate = require("algosdk/src/logicTemplates/limitorder");

    console.log("loaded limitorder template.")
  }

}
module.exports = function () {
  // let's import the needed modules
  const algosdk = require('algosdk');
  const fs = require('fs').promises;
  const splitTemplate = require("algosdk/src/logicTemplates/split");
  var algoutils = require("./algoutils");

  // constants to use for the Algod client
  const token = {
    'X-API-Key': `${process.env.API_KEY}` // 'YOUR PURESTAKE API KEY HERE'
  }

  const server = 'https://testnet-algorand.api.purestake.io/ps2';
  const port = '';

  this.createSplitContract = async function (sender, recipient1, ratio1, 
    recipient2, ratio2) {
    // create the client
    let algodClient = new algosdk.Algodv2(token, server, port);

    let txParams = await algodClient.getTransactionParams().do();

    // INPUTS

    let receivers = [recipient1, recipient2];
    let ratn = parseInt(ratio1);
    let ratd = parseInt(ratio2);
    let expiryRound = txParams.lastRound + parseInt(10000);
    let minPay = 3000;
    let maxFee = 2000;  // we set the max fee to avoid account bleed from excessive fees

    // create the split contract template
    let split = new splitTemplate.Split(sender, receivers[0], receivers[1], ratn, ratd,
      expiryRound, minPay, maxFee);

    // store the TEAL program and the address of the contract
    let program = split.getProgram();
    let address = split.getAddress();

    // at this point you can write the contract to storage in order to reference it later
    // we're going to do that right now
    await fs.writeFile(`static/contracts/${address}`, program);

    // return the split contract's address on the blockchain
    return address;
  }

  this.executeSplitContract = async function (contractAddress, amount) {
    // read the TEAL program from local storage
    const data = await fs.readFile(`static/contracts/${contractAddress}`);
    let splitProgram = data;

    // create the client
    let algodClient = new algosdk.Algodv2(token, server, port);

    let txParams = await algodClient.getTransactionParams().do();

    let txnBytes = splitTemplate.getSplitFundsTransaction(splitProgram, amount, 
      txParams.firstRound, txParams.lastRound, txParams.fee, txParams.genesisHash);

    let tx = (await algodClient.sendRawTransaction(txnBytes).do());
    await algoutils.waitForConfirmation(algodClient, tx.txId);

    // return the transaction ID
    return tx.txId;
  }
}
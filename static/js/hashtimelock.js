module.exports = function() {
  // let's import the needed modules
  const algosdk = require('algosdk');
  const fs = require('fs').promises;
  const htlcTemplate = require("algosdk/src/logicTemplates/htlc");
  const crypto = require('crypto');
  var randomWords = require('random-words');
  var algoutils = require("./algoutils");

  // constants to use for the Algod client
  const token = {
    'X-API-Key': `${process.env.API_KEY}` // 'YOUR PURESTAKE API KEY HERE'
  }

  const server = 'https://testnet-algorand.api.purestake.io/ps2';
  const port = '';

  this.createHashTimeLockContract = async function(contractOwner, contractReceiver) {
    // create the client
    let algodClient = new algosdk.Algodv2(token, server, port);

    let txParams = await algodClient.getTransactionParams().do();

    // INPUTS
    let endRound = txParams.firstRound + parseInt(1000);
    let expiryRound = txParams.lastRound + parseInt(10000);
    let maxFee = 2000;  // we set the max fee to avoid account bleed from excessive fees
    
    // generate the preimage and image
    let hashFn = "sha256";

    // generation of an array of 8 random words (random-words is NOT CRYPTOGRAPHICALLY SECURE)
    let strRandomWords = randomWords(8).join(' ');

    let args = [strRandomWords];

    let hashImg = crypto.createHash('sha256').update(strRandomWords).digest('base64');

    let htlc = new htlcTemplate.HTLC(contractOwner, contractReceiver, hashFn, hashImg,
      expiryRound, maxFee);

    let program = htlc.getProgram();
    let address = htlc.getAddress();

    // at this point you can write the contract to storage in order to reference it later
    // we're going to do that right now
    await fs.writeFile(`static/contracts/${address}`, program);

    return [address, strRandomWords];
  }

  this.unlockHashTimeLockContract = async function(contractAddress, closeRemainderTo, 
    preimageBase64) {
    // create the client
    let algodClient = new algosdk.Algodv2(token, server, port);

    console.log(preimageBase64);

    let txParams = await algodClient.getTransactionParams().do();

    // read the TEAL program from local storage
    const data = await fs.readFile(`static/contracts/${contractAddress}`);
    let htlcProgram = data;

    let args = [ Buffer.from(preimageBase64, 'base64').toString('ascii') ];

    console.log(args);

    let lsig = algosdk.makeLogicSig(htlcProgram, args);

    // create a transaction closing out the HTLC to the recipient
    // this will fail if the preimage isn't correct
    let txn = {
      "from": contractAddress,
      // zero account
      "to": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ",
      "fee": 1,
      "type": "pay",
      "amount": 0,
      "firstRound": txParams.firstRound,
      "lastRound": txParams.lastRound,
      "genesisID": txParams.genesisID,
      "genesisHash": txParams.genesisHash,
      "closeRemainderTo": closeRemainderTo
    };

    // create logic signed transaction.
    let rawSignedTxn = algosdk.signLogicSigTransaction(txn, lsig);

    //Submit the lsig signed transaction
    let tx = (await algodClient.sendRawTransaction(rawSignedTxn.blob).do());
    console.log("Transaction: " + tx.txId);

    return tx.txId;
  }
}
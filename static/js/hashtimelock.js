module.exports = function() {
  // let's import the needed modules
  const algosdk = require('algosdk');
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

    console.log(args);

    let hashImg = crypto.createHash('sha256').update(strRandomWords).digest('base64');

    console.log(hashImg);

    let htlc = new htlcTemplate.HTLC(contractOwner, contractReceiver, hashFn, hashImg,
      expiryRound, maxFee);

    let program = htlc.getProgram();
    let lsig = algosdk.makeLogicSig(program, args);

    // NEEDS FUNDING - START HERE dixonjw 20210607

    //create a transaction
    let txn = {
      "from": htlc.getAddress(),
      "to": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ", // zero-address
      "fee": 1,
      "type": "pay",
      "amount": 0,
      "firstRound": txParams.firstRound,
      "lastRound": endRound,
      "genesisID": txParams.genesisID,
      "genesisHash": txParams.genesisHash,
      "closeRemainderTo": contractReceiver
    };
    // create logic signed transaction.
    let rawSignedTxn = algosdk.signLogicSigTransaction(txn, lsig);

    //Submit the lsig signed transaction
    let tx = (await algodClient.sendRawTransaction(rawSignedTxn.blob).do());
    console.log("Transaction : " + tx.txId);
    await algoutils.waitForConfirmation(algodClient, tx.txId);

    // return the transaction ID
    return tx.txId;
  }
}
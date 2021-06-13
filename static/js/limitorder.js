module.exports = function () {
  // let's import the needed modules
  const algosdk = require('algosdk');
  const fs = require('fs').promises;
  const limitTemplate = require("algosdk/src/logicTemplates/limitorder");
  var algoutils = require("./algoutils");

  // constants to use for the Algod client
  const token = {
    'X-API-Key': `${process.env.API_KEY}` // 'YOUR PURESTAKE API KEY HERE'
  }

  const server = 'https://testnet-algorand.api.purestake.io/ps2';
  const port = '';

  // private key mnemonic to reconstitute the account that owns the BUBBLE asset
  let bubblegumAccountMnemonic =
    "soft cloth blanket account dwarf title initial sweet retreat kiwi " +
    "minor maximum jaguar athlete excess sound ridge slow palm bid tackle " +
    "honey analyst absent clarify";

  this.createSignedBubblegumLimitContract = async function (contractOwner) {
    // create the client
    let algodClient = new algosdk.Algodv2(token, server, port);

    let txParams = await algodClient.getTransactionParams().do();

    // INPUTS

    let ratn = parseInt(1); // 1 BUBBLE
    let ratd = parseInt(1000000); // for 1 Algo
    let assetID = 15431290; // ID of the BUBBLE asset
    let minTrade = 999999;  // minimum number of microAlgos to accept
    let expiryRound = txParams.lastRound + parseInt(10000);
    let maxFee = 2000;  // we set the max fee to avoid account bleed from excessive fees

    // create the limit contract template
    let limit = new limitTemplate.LimitOrder(contractOwner, assetID, ratn, ratd,
      expiryRound, minTrade, maxFee);

    // store the TEAL program and the address of the contract
    let program = limit.getProgram();
    let address = limit.getAddress();

    // at this point you can write the contract to storage in order to reference it later
    // we're going to do that right now
    await fs.writeFile(`static/contracts/${address}`, program);
    
    // next, we fund the contract account with the minimum amount of microAlgos required
    // this is 100,000 (minimum) + 2,000 (the max fee)
    let assetOwner = algosdk.mnemonicToSecretKey(bubblegumAccountMnemonic);
    let note = algosdk.encodeObj("Contract funding transaction");
    let fundingTx = algosdk.makePaymentTxnWithSuggestedParams(assetOwner.addr, address, 
      100000 + maxFee, undefined, note, txParams);
    let signedFundingTx = fundingTx.signTxn(assetOwner.sk);
    let resultTx = (await algodClient.sendRawTransaction(signedFundingTx).do());
    await algoutils.waitForConfirmation(algodClient, resultTx.txId);

    // return the limit order's address on the blockchain
    return address;
  }

  this.executeBubblegumLimitContract = async function (contractAddress) {
    // read the TEAL program from local storage
    const data = await fs.readFile(`static/limitcontracts/${contractAddress}`);
    let limitProgram = data;

    // create the client
    let algodClient = new algosdk.Algodv2(token, server, port);

    // set the proper amounts
    let assetAmount = parseInt(1);
    let microAlgoAmount = parseInt(1000000);

    let txParams = await algodClient.getTransactionParams().do();

    // swap 1 BUBBLE for 1,000,000 microAlgos
    let assetOwner = algosdk.mnemonicToSecretKey(bubblegumAccountMnemonic);
    let secretKey = assetOwner.sk;
    let txnBytes = limitTemplate.getSwapAssetsTransaction(limitProgram, assetAmount,
      microAlgoAmount, secretKey, txParams.fee, txParams.firstRound, txParams.lastRound,
      txParams.genesisHash);

    let tx = (await algodClient.sendRawTransaction(txnBytes).do());
    console.log(tx);
    await algoutils.waitForConfirmation(algodClient, tx.txId);

    // return the transaction ID
    return tx.txId;
  }
}
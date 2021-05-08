module.exports = function () {
  // Handle importing needed modules
  const algosdk = require('algosdk');
  const fs = require('fs').promises;
  const limitTemplate = require("algosdk/src/logicTemplates/limitorder");
  var algoutils = require("./algoutils");

  let bubblegumAccountMnemonic =
    "soft cloth blanket account dwarf title initial sweet retreat kiwi " +
    "minor maximum jaguar athlete excess sound ridge slow palm bid tackle " +
    "honey analyst absent clarify";

  const token = {
    'X-API-Key': `${process.env.API_KEY}`
  }

  const server = 'https://testnet-algorand.api.purestake.io/ps2';
  const port = '';

  this.createSignedBubblegumLimitContract = async function (contractOwner) {
    let algodClient = new algosdk.Algodv2(token, server, port);

    let txParams = await algodClient.getTransactionParams().do();

    let ratn = parseInt(1);
    let ratd = parseInt(1000000);
    let assetID = 15431290;
    let minTrade = 999999;
    let expiryRound = txParams.lastRound + parseInt(1000);
    let maxFee = 2000;

    console.log('contractOwner: ' + contractOwner);

    let limit = new limitTemplate.LimitOrder(contractOwner, assetID, ratn, ratd,
      expiryRound, minTrade, maxFee);

    let limitProgram = limit.getProgram();
    let limitAddress = limit.getAddress();

    await fs.writeFile(`static/limitcontracts/${limitAddress}`, limitProgram);

    console.log('limit program written.');

    
    let assetOwner = algosdk.mnemonicToSecretKey(bubblegumAccountMnemonic);

    // fund contract account with 100000 microAlgos to cover minimum / fees

    let note = algosdk.encodeObj("Contract funding transaction");
    let fundingTx = algosdk.makePaymentTxnWithSuggestedParams(assetOwner.addr, limitAddress, 
      100000 + maxFee, undefined, note, txParams);
    let signedFundingTx = fundingTx.signTxn(assetOwner.sk);
    let resultTx = (await algodClient.sendRawTransaction(signedFundingTx).do());
    await algoutils.waitForConfirmation(algodClient, resultTx.txId);

    return limitAddress;
  }

  this.executeBubblegumLimitContract = async function (contractAddress) {
    const data = await fs.readFile(`static/limitcontracts/${contractAddress}`);
    let limitProgram = data;
    console.log('limit program read.');

    let algodClient = new algosdk.Algodv2(token, server, port);

    let assetAmount = parseInt(1);
    let microAlgoAmount = parseInt(1000000);

    let txParams = await algodClient.getTransactionParams().do();

    let assetOwner = algosdk.mnemonicToSecretKey(bubblegumAccountMnemonic);
    let secretKey = assetOwner.sk;

    let txnBytes = limitTemplate.getSwapAssetsTransaction(limitProgram, assetAmount,
      microAlgoAmount, secretKey, txParams.fee, txParams.firstRound, txParams.lastRound,
      txParams.genesisHash);

    let tx = (await algodClient.sendRawTransaction(txnBytes).do());
    console.log(tx);
    await algoutils.waitForConfirmation(algodClient, tx.txId);

    return tx.txId;
  }
}
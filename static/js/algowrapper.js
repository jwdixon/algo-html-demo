

function algo_connect() {
  return AlgoSigner.connect();
}

function algo_accounts() {
  return AlgoSigner.accounts({
    ledger: 'TestNet'
  });
}

function algo_account(account) {
  return AlgoSigner.algod({
    ledger: 'TestNet',
    path: `/v2/accounts/${account}`
  });
}

function algo_asset(asset) {
  return AlgoSigner.indexer({
    ledger: 'TestNet',
    path: `/v2/assets/${asset}`
  });
}

function algo_send(signedTx) {
  return AlgoSigner.send({
    ledger: 'TestNet',
    tx: signedTx.blob
  });
}

function algo_params() {
  return AlgoSigner.algod({
    ledger: 'TestNet',
    path: '/v2/transactions/params'
  });
}

function algo_pay_sign(from, to, amount, note, txParams) {
  return AlgoSigner.sign({
    from: from,
    to: to,
    amount: +amount,
    note: note,
    type: 'pay',
    fee: txParams['min-fee'],
    firstRound: txParams['last-round'],
    lastRound: txParams['last-round'] + 1000,
    genesisID: txParams['genesis-id'],
    genesisHash: txParams['genesis-hash'],
    flatFee: true
  });
}

function algo_assetcreation_sign(from, assetName, assetUnitName, assetTotal, assetDecimals, note, txParams) {
  return AlgoSigner.sign({
    from: from,
    assetName: assetName,
    assetUnitName: assetUnitName,
    assetTotal: +assetTotal,
    assetDecimals: +assetDecimals,
    note: note,
    type: 'acfg',
    fee: txParams['min-fee'],
    firstRound: txParams['last-round'],
    lastRound: txParams['last-round'] + 1000,
    genesisID: txParams['genesis-id'],
    genesisHash: txParams['genesis-hash'],
    flatFee: true
  });
}

function algo_assettransfer_sign(assetId, from, amount, to, note, txParams) {
  return AlgoSigner.sign({
    assetIndex: assetId,
    from: from,
    amount: +amount,
    to: to,
    note: note,
    type: 'axfer',
    fee: txParams['min-fee'],
    firstRound: txParams['last-round'],
    lastRound: txParams['last-round'] + 1000,
    genesisID: txParams['genesis-id'],
    genesisHash: txParams['genesis-hash'],
    flatFee: true
  });
}

function algo_assetoptin_sign(assetId, from, to, txParams) {
  return AlgoSigner.sign({
    assetIndex: assetId,
    from: from,
    amount: 0,
    to: to,
    type: 'axfer',
    fee: txParams['min-fee'],
    firstRound: txParams['last-round'],
    lastRound: txParams['last-round'] + 1000,
    genesisID: txParams['genesis-id'],
    genesisHash: txParams['genesis-hash'],
    flatFee: true
  });
}

function updateMicroAlgoConverter(microAlgoValue) {
  document.getElementById('microToAlgo').innerHTML = `${microAlgosToAlgos(microAlgoValue)} Algos`;
}

function microAlgosToAlgos(numMicroAlgos) {
  return (numMicroAlgos / 1000000).toFixed(6);
}
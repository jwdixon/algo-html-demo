# Algorand Features and Smart Contracts GUI Demo with AlgoSigner

This demo is designed to show you the different types of Algorand smart contracts as well as some example use cases for them.

Note: this demo focuses almost entirely on the Algorand smart contract workflow. You should have some basic knowledge of Node.js, and you should also be able to understand how to make a transaction on the Algorand blockchain.

## Before You Begin

 - **Please note that this demo has not been audited for security and should not be used in a production environment without modifications to enhance the security.**
 - You should have access to an Algorand node (this demo assumes you're using <a target="_blank" href="https://developer.purestake.io/">PureStake</a>).
 - You should have Node.js installed on your computer.
 - You should be using Google Chrome, because AlgoSigner only works on Google Chrome at this time.
 - You should have the <a target="_blank" href="https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm">AlgoSigner Google Chrome extension</a> installed, as this demo makes extensive use of it.
 - You should also make a couple of wallets on Algorand <strong>TestNet</strong> and use the <a target="_blank" href="https://testnet.algoexplorer.io/dispenser">TestNet ALGO Faucet</a> to generate Algos for them, as these exercises demonstrate how to move assets between two or more addresses.</p>

## Quick Start

1. In order to use this demo, you can either clone it using Git or download it as a .zip file.
2. Once you have the demo cloned or unpacked, replace the example API key in .env-EXAMPLE with the API key you use to make Algorand API requests.
3. Rename .env-EXAMPLE to .env in order to use your API key in Node.
4. Open a terminal or command prompt in the folder you unzipped to.
5. Run ```npm install``` to install dependencies.
6. Run ```node app.js``` to run the application.
7. Navigate to the server address in Google Chrome to use the demo.

## License

algo-html-demo is licensed under the MIT license. See the [LICENSE](https://github.com/jwdixon/algo-html-demo/blob/main/LICENSE) file for details.

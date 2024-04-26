const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const myTokenABI = [];
const myTokenAddress = '';
const myToken = new web3.eth.Contract(myTokenABI, myTokenAddress);
const myAccount = process.env.MY_ACCOUNT_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;
async function updateBalanceDisplay() {
  const balance = await myToken.methods.balanceOf(myAccount).call();
  document.getElementById('balanceDisplay').innerText = `Balance: ${balance}`;
}
async function transferTokens(toAddress, amount) {
  const nonce = await web3.eth.getTransactionCount(myAccount, 'latest');
  const txObject = {
    from: myAccount,
    to: myTokenAddress,
    data: myToken.methods.transfer(toAddress, amount).encodeABI(),
    gas: 2000000,
    nonce: nonce
  };
  const signPromise = web3.eth.accounts.signTransaction(txObject, privateKey);
  signPromise.then((signedTx) => {
    const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
    sentTx.on('receipt', (receipt) => {
      console.log('Transaction receipt:', receipt);
      updateBalanceDisplay();
    });
  }).catch((err) => {
    console.error('Sign failed', err);
  });
}
document.getElementById('transferButton').addEventListener('click', function() {
  const toAddress = document.getElementById('toAddress').value;
  const amount = document.getElementById('amount').value;
  transferTokens(toAddress, amount);
});
updateBalanceDisplay();
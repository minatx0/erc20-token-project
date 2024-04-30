require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const myTokenABI = [];
const myTokenAddress = '';
const myToken = new web3.eth.Contract(myTokenABI, myTokenAddress);
const myAccount = process.env.MY_ACCOUNT_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;

async function updateBalanceDisplay() {
    try {
        const balance = await myToken.methods.balanceOf(myAccount).call();
        const tokenDecimals = await myToken.methods.decimals().call();
        const readableBalance = balance / Math.pow(10, tokenDecimals);
        const tokenSymbol = await myToken.methods.symbol().call();
        
        const balanceDisplay = document.getElementById('balanceDisplay');
        if (balanceDisplay) {
            balanceDisplay.innerText = `Balance: ${readableBalance} ${tokenSymbol}`;
        } else {
            console.error('Balance display element not found');
        }
    } catch (err) {
        console.error('Failed to fetch balance: ', err);
    }
}

async function transferTokens(toAddress, amount) {
    try {
        if (!web3.utils.isAddress(toAddress)) {
            return console.error('Invalid address');
        }
        if (isNaN(amount) || amount <= 0) {
            return console.error('Invalid amount');
        }

        const nonce = await web3.eth.getTransactionCount(myAccount, 'latest');
        const gasPrice = await web3.eth.getGasPrice();
        const txObject = {
            from: myAccount,
            to: myTokenAddress,
            data: myToken.methods.transfer(toAddress, web3.utils.toWei(amount, 'ether')).encodeABI(),
            gasPrice: gasPrice,
            gas: 2000000,
            nonce: nonce,
        };

        const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);
        const sentTx = web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        sentTx.on('receipt', (receipt) => {
            console.log('Transaction receipt: ', receipt);
            updateBalanceDisplay();
        }).on('error', (err) => {
            console.error('Failed to send transaction', err);
        });
    } catch (err) {
        console.error('Failed to transfer tokens: ', err);
    }
}

function setupEventListeners() {
    myToken.events.Transfer({
        filter: {from: myAccount},
        fromBlock: 'latest'
    }, (error, event) => {
        if (error) {
            console.error('Transfer event error:', error);
        } else {
            console.log('Transfer event: ', event);
            updateBalanceDisplay();
        }
    });
}

if (document.getElementById('transferButton')) {
    document.getElementById('transferButton').addEventListener('click', function () {
        const toAddress = document.getElementById('toAddress').value;
        const amount = document.getElementById('amount').value;
        transferTokens(toAddress, amount);
    });
}

updateBalanceDisplay();
setupEventListeners();
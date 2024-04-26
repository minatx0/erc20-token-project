<!DOCTYPE html>
<html>
<head>
    <title>Web3 ERC-20 Interaction</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            flex-direction: column;
        }

        .container {
            max-width: 600px;
            width: 100%;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        h1 {
            color: #444;
            font-size: 24px;
            text-align: center;
            margin-bottom: 20px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            color: #666;
            margin-bottom: 5px;
        }

        .form-group input, .form-group button {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }

        .form-group button {
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .form-group button:hover {
            background-color: #0056b3;
        }

        .info-display {
            background-color: #f9f9f9;
            border-left: 4px solid #007bff;
            padding: 10px;
            margin-top: 20px;
        }

        @media (max-width: 768px) {
            body {
                padding: 10px;
            }

            .container {
                padding: 10px;
            }
        }
    </style>
</head>
<body>

<div class="container">
    <h1>ERC-20 Token Interaction</h1>
    <div class="form-group">
        <label for="walletAddress">Wallet Address</label>
        <input type="text" id="walletAddress" placeholder="Enter your wallet address">
    </div>
    <div class="form-group">
        <label for="tokenAmount">Amount to Send</label>
        <input type="number" id="tokenAmount" placeholder="Amount">
    </div>
    <div class="form-group">
        <button id="sendToken">Send Token</button>
    </div>
    <div class="info-display" id="transactionStatus">Transaction status will appear here</div>
</div>

<script src="https://cdn.jsdelivr.net/npm/web3@1.6.0/dist/web3.min.js"></script>
<script>
    // Initialize web3 instance
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            // Request account access
            ethereum.enable();
        } catch (error) {
            console.error("User denied account access");
        }
    } else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    // Example ERC-20 contract interactions
    const contractABI = []; // Add your ERC-20 ABI here
    const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    document.getElementById('sendToken').addEventListener('click', function() {
        const address = document.getElementById('walletAddress').value;
        const amount = document.getElementById('tokenAmount').value;
        // Add your logic to interact with the contract here.
        console.log(`Sending ${amount} tokens to ${address}...`);
        // Reminder: Adjust this example as needed to fit the contract's methods
    });
</script>
</body>
</html>
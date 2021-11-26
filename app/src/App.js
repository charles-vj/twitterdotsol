import { useEffect, useState } from 'react';
import './App.css';
import { Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import {
  Program, Provider, web3
} from '@project-serum/anchor';

import idl from './idl.json';
const { SystemProgram, Keypair } = web3;


let baseAccount = Keypair.generate();


const programID = new PublicKey(idl.metadata.address);


const network = clusterApiUrl('devnet');


const opts = {
  preflightCommitment: "processed"
}


const TWEETS = [
  'Lorem ipsum dolor sit amet.',
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, nesciunt!',
  'Lorem ipsum dolor, sit amet consectetur adipisicing elit.'
]

function App() {

  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [tweetList, setTweetList] = useState([]);

  const createTweetAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log("ping")
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      });
      console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
      await getTweetList();
  
    } catch(error) {
      console.log("Error creating BaseAccount account:", error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
          'Connected with Public Key:',
          response.publicKey.toString()
        );

        setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching TWEET list...');
      getTweetList()
    }
  }, [walletAddress]);


  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const getTweetList = async() => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      
      console.log("Got the account", account)
      setTweetList(account.tweetList)
  
    } catch (error) {
      console.log("Error in getTweetList: ", error)
      setTweetList(null);
    }
  }

  /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
   */
  const renderNotConnectedContainer = () => (
    <button className="wallet" onClick={connectWallet}>Connect Wallet</button>
  );

  const renderConnectedContainer = () => {
    // If we hit this, it means the program account hasn't be initialized.
    if (tweetList === null) {
      return (
        <div className="connected-container">
          <button className="btn" onClick={createTweetAccount}>
            Do One-Time Initialization For GIF Program Account
          </button>
        </div>
      )
    } 
    // Otherwise, we're good! Account exists. User can submit GIFs.
    else {
      return(
        <div className="connected-container">
          <div class="tweet">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              tweet();
            }}
          >
            <textarea placeholder="Wassup!!" name="" id="" cols="80" rows="8" value={inputValue} onChange={onInputChange}></textarea>
            
            <button type="submit" className="btn">
              Submit
            </button>
          </form>
          </div>
          <div className="tweet-grid">
            
            {tweetList.map((item, index) => (
              <div className="tw" key={index}>
                <h1>{item.tweetLink}</h1>
              </div>
            ))}
          </div>
        </div>
      )
    }
  }

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection, window.solana, opts.preflightCommitment,
    );
    return provider;
  }

  const tweet = async () => {
    if (inputValue.length === 0) {
      console.log("No tweet given!")
      return
    }
    console.log('Tweet:', inputValue);
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
  
      await program.rpc.addTweet(inputValue, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("Tweet successfully sent to program", inputValue)
  
      await getTweetList();
    } catch (error) {
      console.log("Error sending TWEET:", error)
    }
    
  };

  return (
    <>
    <div className="nav">
            <h1 className="logo">Tweesol</h1>
            {!walletAddress && renderNotConnectedContainer()}
        </div>
    <div className="App">
      <div class="text-content">
        <div class="header"><h1>Solana Twitter</h1></div>
        <div class="secondary-text">Hey there! This is Charles. This is a wall of tweets made on the solana blockchain. Do remember to connect your wallet or else you won't be able to tweet. Tell me what's happening</div>
        
      </div>
      
    </div>
    <div className="tweets">
      <div class="tweet-header"><h1>Wall of tweets</h1></div>
      {walletAddress && renderConnectedContainer()}
    </div>
    </>
  );
}

export default App;

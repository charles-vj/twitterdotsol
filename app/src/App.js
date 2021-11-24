import { useEffect, useState } from 'react';
import './App.css';


const TWEETS = [
  'Lorem ipsum dolor sit amet.',
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, nesciunt!',
  'Lorem ipsum dolor, sit amet consectetur adipisicing elit.'
]

function App() {

  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [tweetList, setTweetList] = useState([]);

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
      console.log('Fetching Tweet list...');
      setTweetList(TWEETS);
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

  /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
   */
  const renderNotConnectedContainer = () => (
    <button className="wallet" onClick={connectWallet}>Connect Wallet</button>
  );

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <div className="tweet-grid">
        {tweetList.map(tweet => (
          <div className="tw" key={tweet}>
            <h1>{tweet}</h1>
          </div>
        ))}
      </div>
    </div>
  );

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const tweet = async () => {
    if (inputValue.length > 0) {
      console.log('Tweet content:', inputValue);
    } else {
      console.log('Empty input. Try again.');
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
      <div class="tweet">
        <form action=""
          onSubmit={(event) => {
            event.preventDefault();
            tweet();
          }}>
          <textarea placeholder="Wassup!!" name="" id="" cols="80" rows="8" value={inputValue} onChange={onInputChange}></textarea>
          <button className="btn" type="submit">Tweet</button>
        </form>
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

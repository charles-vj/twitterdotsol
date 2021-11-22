
import './App.css';

function App() {
  return (
    <div className="App">
      <div class="text-content">
        <div class="header"><h1>Solana Twitter</h1></div>
        <div class="secondary-text">Hey there! This is Charles. This is a wall of tweets made on the solana blockchain. Do remember to connect your wallet or else you won't be able to tweet. Tell me what's happening</div>
      </div>
      <div class="tweet">
        <textarea placeholder="Wassup" name="" id="" cols="80" rows="8"></textarea>
        <button>Submit</button>
      </div>
    </div>
  );
}

export default App;

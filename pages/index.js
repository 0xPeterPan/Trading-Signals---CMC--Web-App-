import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import xposureLogo from '../assets/Xposure.png';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);
  
    console.log("Calling OpenAI...")
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text)

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }
  
  const onUserChangedText = (event) => {
	  {/* console.log(event.target.value); */}
	  setUserInput(event.target.value);
  };
  return (
    <div className="root">
      <Head>
        <title>Smart Trading Signals | Intelligence</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Trade in the Crypto Markets with Artificial Intelligence</h1>
          </div>
          <div className="header-subtitle">
            <h2>Have you been looking for good calls and reliable signals with actionable advices? You've got to the right place!</h2>
          </div>
        </div>
		    <div className="prompt-container">
          <textarea
          className="prompt-box"
			    placeholder="Enter in form of BTC or ETH, prices are provided by CoinMarketCap"
			    value={userInput}
			    onChange={onUserChangedText}
          />;
          <div className="prompt-buttons">
            <a className={isGenerating ? 'generate-button loading' : 'generate-button'}
            onClick={callGenerateEndpoint}>
              <div className="generate">
                {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
			        </div>
            </a>
          </div>
          {apiOutput && (
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Output</h3>
			        </div>
		        </div>
            <div className="output-content">
              <p>{apiOutput}</p>
		        </div>
		      </div>
          )}
        </div>
      </div>
      <div className="badge-container grow">
        <a
        href="https://buildspace.so/builds/ai-writer"
        target="_blank"
        rel="noreferrer"
        >
          <div className="badge">
            <Image src={xposureLogo} alt="Xposure Logo" />
            <p>built with ❤ by Xposure</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;

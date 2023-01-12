import axios from "axios";
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getCryptoPrice(crypto) {
  // Set the API endpoint and your API key
  const apiEndpoint = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest`;
  const apiKey = process.env.COINMARKET_API_KEY;

  // Set the request parameters
  const params = {
    symbol: crypto,
  };

  // Set the request headers
  const headers = {
    "X-CMC_PRO_API_KEY": apiKey,
  };

  try {
    // Send a GET request to the API endpoint
    const response = await axios.get(apiEndpoint, {
      params,
      headers,
    });

    // Return the current price of the cryptocurrency
    return response.data.data[crypto].quote.USD.price;
  } catch (error) {
    console.error(error);
	return null;  // or throw an error, depending on your needs
  }
}

const openai = new OpenAIApi(configuration);

const generateAction = async (req, res) => {
  const crypto = req.body.userInput;
  const cryptoPrice = await getCryptoPrice(crypto);
  const basePromptPrefix = ` Please provide insights or analysis on the following crypto: ${crypto} (price: $${cryptoPrice})\nProvide the potential return on investment (ROI)\nProvide more detailed information such as entry and exit points, stop loss and take profit levels, and any other relevant technical analysis indicators.\nRecommend the best cryptocurrency exchanges and trading platforms to use\nwith the example\nCrypto:\nCrypto Price:\nEntry Point:\nExit Point:\nStop Loss:\nTake Profit:\nTime Frame: \nPotential ROI: \nRisk Tolerance: \nTechnical Analysis Indicators: \nRecommended Exchange: \nRecommended Trading Platform: \nTechnical Analysis: `;

  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}\n`,
    temperature: 0.8,
    max_tokens: 500,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
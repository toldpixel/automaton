import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();
const openai = new OpenAI();

async function assistantHandler(inputText) {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Automaton",
      instructions: `Whenever I provide you with a text, extract all relevant information and return a JSON object with the following structure filled out: { 
    "instances": [
      {
        "name": "",
        "gpu": "",
        "storage": "",
        "network": "",
        "egress": "",
        "price_monthly": "",
        "price_hourly": ""
      }
    ]
  }  If a piece of information is missing or unavailable in the text, set the corresponding value to empty string "". Ensure the JSON response is valid, well-structured.
  `,
      model: "gpt-4o-mini",
    });

    const response = await assistant.chat({
      messages: [
        {
          role: "user",
          content: inputText,
        },
      ],
    });

    return response.data.choices[0].message.content;
  } catch (error) {}
}

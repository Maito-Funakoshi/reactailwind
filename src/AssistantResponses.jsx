import { useEffect } from 'react';
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const AssistantResponses = ({ messages, setMessages, assistants, setError }) => {
  const endpoint = `https://opendialogue1.openai.azure.com/`;
  const azureApiKey = `e1a905c26e7d418bb8ce8f95518c9f45`;
  const deploymentId = "gpt35turbo";
  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
  let assistant;

  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].role === "user") {
      const fetchData = async () => {
        for (let i = 0; i < assistants.length; i++) {
          try {
            assistant = assistants[i];
            const response = await client.getChatCompletions(deploymentId, [
              ...messages,
              { role: "system", content: `あなたの名前は${assistant}で、MBTI診断で${assistant}と診断されるパーソナリティを持ちます。他の${assistants.length - 1}人の人物もそれぞれの名前とMBTI特性を持っており、互いに認識しています。${assistant}として回答してください。` }
            ], { maxTokens: 256 });

            if (response.choices && response.choices.length > 0) {
              const botMessage = response.choices[0].message.content.trim();
              setMessages(prevMessages => [...prevMessages, { role: "assistant", content: `${assistant}: ${botMessage}` }]);
            }

          } catch (err) {
            setError(err);
            console.error("The sample encountered an error:", err);
          }
        }
      }
      fetchData();
    }
  }, [messages]);

  return null;
};

export default AssistantResponses;
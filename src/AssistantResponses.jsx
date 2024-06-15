import { useEffect } from 'react';
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const AssistantResponses = ({ messages, setMessages, inputAble, names, characters, chat, reflect, recipients, setError }) => {
  const endpoint = `https://opendialogue1.openai.azure.com/`;
  const azureApiKey = `e1a905c26e7d418bb8ce8f95518c9f45`;
  const deploymentId = "gpt35turbo";
//   const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
//   let name;
//   let character;

//   const client0 = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
//   const client1 = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
//   const client2 = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));

  const clients = names.map(() => new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey)));

  useEffect(() => {
    if (inputAble) {
      if (messages.length > 2　&& messages[messages.length - 1].role == "user") {
        const fetchData = async () => {
          let currentMessages = [...messages];
          for (let i = 0; i < names.length; i++) {
            const recipientNames =Object.keys(recipients);
            const recipientName = recipientNames[i];
            if (recipients[recipientName]) {
              try {
                // name = names[i];
                // character = characters[i];
                // const response = await client.getChatCompletions(deploymentId, [
                //   ...messages,
                //   { role: "system", content: `あなたの名前は${name}で、MBTI診断で${character}と診断されるパーソナリティを持ちます。他の${names.length - 1}人の人物もそれぞれの名前とMBTI特性を持っており、互いに認識しています。${character}として回答してください。` }
                // ], { maxTokens: 256 });

                // if (response.choices && response.choices.length > 0) {
                //   const botMessage = response.choices[0].message.content.trim();
                //   setMessages(prevMessages => [...prevMessages, { role: "assistant", content: `${botMessage}` }]);
                // }
                const modifiedMessages = [
                  { role: "system", content: `あなたは${names[i]}という名前のアシスタントです。あなたのMBTIは${characters[i]}です。${chat}` },
                    ...currentMessages.slice(1).map(message => ({...message, role: "user"}))
                ];
            
                const response = await clients[i].getChatCompletions(deploymentId, modifiedMessages);

                if (response.choices && response.choices.length > 0) {
                  const botMessage = response.choices[0].message.content.trim();
                  const assistantMessage = { role: "assistant", content: `${botMessage}`, name: `${names[i]}`};
                  currentMessages = [...currentMessages, assistantMessage];
                  setMessages(prevMessages => [...prevMessages, assistantMessage]);
                }
              } catch (err) {
                setError(err);
                console.error("The sample encountered an error:", err);
              }
            }
          }
        }
        fetchData();
      }
    }
    else if(!inputAble) {
      if (messages.length > 2) {
        const intervalId = setInterval(() => {
          const fetchData = async () => {
            let currentMessages = [...messages];
            for (let i = 0; i < names.length; i++) {
              const recipientNames =Object.keys(recipients);
              const recipientName = recipientNames[i];
              if (recipients[recipientName]) {
                try {
                  const modifiedMessages = [
                    { role: "system", content: `あなたは${names[i]}という名前のアシスタントです。あなたのMBTIは${characters[i]}です。${reflect}` },
                    ...currentMessages.slice(1).map(message => ({...message, role: "user"}))
                  ];
                        
                  const response = await clients[i].getChatCompletions(deploymentId, modifiedMessages, { maxTokens: 256 });
            
                  if (response.choices && response.choices.length > 0) {
                    const botMessage = response.choices[0].message.content.trim();
                    const assistantMessage = { role: "assistant", content: `${botMessage}`, name: `${names[i]}` };
                    currentMessages = [...currentMessages, assistantMessage];
                    setMessages(prevMessages => [...prevMessages, assistantMessage]);
                  }
                } catch (err) {
                  setError(err);
                  console.error("The sample encountered an error:", err);
                }
              }


            }
          }
          fetchData();
        }, 5000);

        return () => clearInterval(intervalId);
      }
    }
  }, [messages, inputAble]);

  return null;
};

export default AssistantResponses;
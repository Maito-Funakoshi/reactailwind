import { useEffect } from 'react';
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const AssistantResponses = ({ recipient, setRecipient, names, namesEng, messages, setMessages, inputAble, setInputAble, characters, chat, reflect, reflectChatCount, setReflectChatCount, setError }) => {
  const endpoint = `https://opendialogue1.openai.azure.com/`;
  const azureApiKey = `e1a905c26e7d418bb8ce8f95518c9f45`;
  const deploymentId = "gpt35turbo";
  const clients = names.map(() => new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey)));

  const maxContextMessages = 12;

  useEffect(() => {
    if (inputAble) {
      if (messages.length > 1　&& messages[messages.length - 1].role == "user") {
        const fetchData = async () => {
          let currentMessages = [...messages].slice(-maxContextMessages);
              try {
                const modifiedMessages = [
                  { role: "system", content: `あなたは${names[recipient]}という名前のアシスタントです。${chat} ${characters[recipient]}` },
                    ...currentMessages.map(message => ({...message, role: "user"}))
                ];
            
                const response = await clients[recipient].getChatCompletions(deploymentId, modifiedMessages);

                if (response.choices && response.choices.length > 0) {
                  const botMessage = response.choices[0].message.content.trim();
                  const assistantMessage = { role: "assistant", content: `${botMessage}`, name: `${namesEng[recipient]}`, mode: "chat"};
                  currentMessages = [...currentMessages, assistantMessage];
                  setMessages(prevMessages => [...prevMessages, assistantMessage]);
                  setRecipient((recipient + 1) % names.length);
                }
              } catch (err) {
                setError(err);
                console.error("The sample encountered an error:", err);
              }
        }
        fetchData();
      }
    }
    else if(!inputAble) {
      if (messages.length > 1 && reflectChatCount < 2) {
        const intervalId = setInterval(() => {
          const fetchData = async () => {
            let currentMessages = [...messages].slice(-maxContextMessages);
            for (let i = 0; i < names.length; i++) {
                try {
                  const modifiedMessages = [
                    { role: "system", content: `あなたは${names[i]}という名前のアシスタントです。${reflect} ${characters[i]}` },
                    ...currentMessages.map(message => ({...message, role: "user"}))
                  ];
                        
                  const response = await clients[i].getChatCompletions(deploymentId, modifiedMessages);
            
                  if (response.choices && response.choices.length > 0) {
                    const botMessage = response.choices[0].message.content.trim();
                    const assistantMessage = { role: "assistant", content: `${botMessage}`, name: `${namesEng[i]}`, mode: "reflect" };
                    currentMessages = [...currentMessages, assistantMessage];
                    setMessages(prevMessages => [...prevMessages, assistantMessage]);
                    setReflectChatCount(reflectChatCount + 1);
                    console.log(reflectChatCount);
                    console.log(inputAble);
                  }
                } catch (err) {
                  setError(err);
                  console.error("The sample encountered an error:", err);
                }
            }
          }
          fetchData();
        }, 5000);

        return () => clearInterval(intervalId);
      }
      else {
        setReflectChatCount(0);
        setInputAble(!inputAble);
      }
    }
  }, [messages, inputAble]);

  return null;
};

export default AssistantResponses;
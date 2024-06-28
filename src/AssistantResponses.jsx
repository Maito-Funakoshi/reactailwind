import { useEffect } from 'react';
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const AssistantResponses = ({ recipient, setRecipient, names, namesEng, messages, setMessages, inputAble, setInputAble, characters, chat, reflect, common, complementChat, complementReflect, summary, reflectChatCount, setReflectChatCount, setError }) => {
  //opendialogue1
//   const endpoint = `https://opendialogue1.openai.azure.com/`;
//   const azureApiKey = `e1a905c26e7d418bb8ce8f95518c9f45`;
//   const deploymentId = "gpt35turbo";
  //opendialogue2
  const endpoint = `https://opendialogue2.openai.azure.com/`;
  const azureApiKey = `5854afcc0daa4f919e0e124914a512d8`;
  const deploymentId = "gpt4o";
  //opendialogue3
//   const endpoint = `https://opendialogue3.openai.azure.com/`;
//   const azureApiKey = `87eb9e105c3d4b7c8ba57a050f547ca8`;
//   const deploymentId = "gpt4oGS";

  const clients = names.map(() => new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey)));

  const maxContextMessages = 100;

  useEffect(() => {
    if (inputAble) {
      if (messages.length > 1　&& messages[messages.length - 1].role == "user") {
        const makeResponse = async () => {
          let currentMessages = [...messages].slice(-maxContextMessages);
              try {
                const modifiedMessages = [
                  { role: "system", content: `あなたは${names[recipient]}という名前のアシスタントです。${chat} ${characters[recipient]}` },
                    ...currentMessages.map(message => ({...message, role: "user"}))
                ];
                let response = await clients[recipient].getChatCompletions(deploymentId, modifiedMessages);

                // 発言様式を整備する
                const odMessages = [
                    { role: "system", content: `${common}`},
                    { role: "user", content: `${response.choices[0].message.content.trim()}`}
                ];
                response = await clients[recipient].getChatCompletions(deploymentId, odMessages);

                // その他修正を適宜する
                const complementMessages = [
                    { role: "system", content: `${complementChat}`},
                    { role: "user", content: `${response.choices[0].message.content.trim()}`}
                ]
                response = await clients[recipient].getChatCompletions(deploymentId, complementMessages);

                // 返答を要約する
                const summaryMessages = [
                    { role: "system", content: `${summary}`},
                    { role: "user", content: `${response.choices[0].message.content.trim()}`}
                ]
                response = await clients[recipient].getChatCompletions(deploymentId, summaryMessages);

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
        makeResponse();
      }
    }
    else if (!inputAble) {
        if (messages.length > 1 && messages[messages.length - 2].role == "user") {
            const makeResponse = async () => {
                let currentMessages = [...messages].slice(-maxContextMessages);
                for(let i = 0; i < names.length; i++){
                    try {
                        const modifiedMessages = [
                            { role: "system", content: `あなたは${names[i]}という名前のアシスタントです。${reflect} ${characters[i]}` },
                            ...currentMessages.map(message => ({ ...message, role: "user" }))
                        ];
                        let response = await clients[i].getChatCompletions(deploymentId, modifiedMessages);

                        // 発言様式を整備する
                        const odMessages = [
                            { role: "system", content: `${common}` },
                            { role: "user", content: `${response.choices[0].message.content.trim()}` }
                        ];
                        response = await clients[recipient].getChatCompletions(deploymentId, odMessages);

                        // その他修正を適宜する
                        const complementMessages = [
                            { role: "system", content: `${complementReflect}` },
                            { role: "user", content: `${response.choices[0].message.content.trim()}` }
                        ];
                        response = await clients[recipient].getChatCompletions(deploymentId, complementMessages);

                        // 返答を要約する
                        const summaryMessages = [
                            { role: "system", content: `${summary}` },
                            { role: "user", content: `${response.choices[0].message.content.trim()}` }
                        ];
                        response = await clients[recipient].getChatCompletions(deploymentId, summaryMessages);

                        if (response.choices && response.choices.length > 0) {
                            const botMessage = response.choices[0].message.content.trim();
                            const assistantMessage = { role: "assistant", content: `${botMessage}`, name: `${namesEng[i]}`, mode: "reflect" };
                            currentMessages = [...currentMessages, assistantMessage];
                            setMessages(prevMessages => [...prevMessages, assistantMessage]); 
                            
                            console.log(i);
                        }
                    } catch (err) {
                        setError(err);
                        console.error("The sample encountered an error:", err);
                    }
                }
            };
            makeResponse();
        } else {
            setInputAble(!inputAble);
        }
    }
  }, [messages, inputAble]);

  return null;
};

export default AssistantResponses;
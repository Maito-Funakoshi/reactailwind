import { useEffect } from 'react';
import OpenAI from "openai";

const AssistantResponses = ({ names, namesEng, messages, setMessages, inputAble, setInputAble, characters, chat, reflect, common, complementChat, complementReflect, summary, reflectChatCount, endReflectingMessage, setError }) => {
  //openaidialogue1
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  })

  const maxContextMessages = 100;

  useEffect(() => {
    if (inputAble) {
      if (messages.length > 4　&& messages[messages.length - 1].role == "user") {
        const makeResponse = async () => {
          let currentMessages = [...messages].slice(-maxContextMessages);
              try {
                const chatMessages = [
                  { role: "system", content: `あなたは${names[0]}という名前のアシスタントです。以下の設定をもとに返答を作成してください。${chat} あなたの特徴は以下の通りです。${characters[0]}` },
                    ...currentMessages.map(message => ({...message, role: "user"}))
                ];

                let response = await openai.chat.completions.create({
                  model: "gpt-4o",
                  messages: chatMessages,
                  frequency_penalty: 2
                })

                // 発言様式を整備する
                const commonMessages = [
                    { role: "system", content: `${common}`},
                    { role: "user", content: `${response.choices[0].message.content.trim()}`}
                ];
                response = await openai.chat.completions.create({
                  model: "gpt-4o",
                  messages: commonMessages,
                  frequency_penalty: 2
                })

                // // その他修正を適宜する
                // const complementMessages = [
                //     { role: "system", content: `${complementChat}`},
                //     { role: "user", content: `${response.choices[0].message.content.trim()}`}
                // ]
                // response = await clients[0].getChatCompletions(deploymentId, complementMessages);

                // // 返答を要約する
                // const summaryMessages = [
                //     { role: "system", content: `${summary}`},
                //     { role: "user", content: `${response.choices[0].message.content.trim()}`}
                // ]
                // response = await clients[0].getChatCompletions(deploymentId, summaryMessages);

                if (response.choices && response.choices.length > 0) {
                  const botMessage = response.choices[0].message.content.trim();
                  const assistantMessage = { role: "assistant", content: `${botMessage}`, name: `${namesEng[0]}`, mode: "chat"};
                  currentMessages = [...currentMessages, assistantMessage];
                  setMessages(prevMessages => [...prevMessages, assistantMessage]);
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
        if (messages.length > 4 && messages[messages.length - 1].role == "user") {
            const makeResponse = async () => {
              let currentMessages = [...messages].slice(-maxContextMessages);
                for(let i = 0; i < names.length * reflectChatCount; i++){
                    let j = i % names.length;
                    try {
                        const reflectMessages = [
                            { role: "system", content: `あなたは${names[j]}という名前のアシスタントで、${names[(j + 1) % names.length]}と${names[(j + 2) % names.length]}に向かって話しかけています。以下の設定をもとに返答を作成してください。${reflect} あなたの特徴は以下の通りです。${characters[j]}` },
                            ...currentMessages.map(message => ({ ...message, role: "user" }))
                        ];

                        let response = await openai.chat.completions.create({
                          model: "gpt-4o",
                          messages: reflectMessages,
                          // 4802=？　30=?　177776=あなた　157351=でしょう　44900=ください　103554=しょう　7128=か　165732=かな　25885=私　16407=思　15121=です　14429=ます
                          logit_bias: {4802:-100, 30:-100, 177776:-100, 157351:-100, 44900:-100, 103554:-100, 7128:-100, 165732:-100, 25885:3, 16407:3, 15121:3, 14429:3}
                        })

                        // 発言様式を整備する
                        const commonMessages = [
                            { role: "system", content: `${common}` },
                            { role: "user", content: `${response.choices[0].message.content.trim()}` }
                        ];

                        response = await openai.chat.completions.create({
                          model: "gpt-4o",
                          messages: commonMessages,
                          logit_bias: {4802:-100, 30:-100, 177776:-100, 157351:-100, 44900:-100, 103554:-100, 7128:-100, 165732:-100, 25885:3, 16407:3, 15121:3, 14429:3}
                        })

                        // // その他修正を適宜する
                        // const complementMessages = [
                        //     { role: "system", content: `${complementReflect}` },
                        //     { role: "user", content: `${response.choices[0].message.content.trim()}` }
                        // ];
                        // response = await clients[j].getChatCompletions(deploymentId, complementMessages);

                        // // 返答を要約する
                        // const summaryMessages = [
                        //     { role: "system", content: `${summary}` },
                        //     { role: "user", content: `${response.choices[0].message.content.trim()}` }
                        // ];
                        // response = await clients[j].getChatCompletions(deploymentId, summaryMessages);

                        if (response.choices && response.choices.length > 0) {
                            const botMessage = response.choices[0].message.content.trim();
                            const assistantMessage = { role: "assistant", content: `${botMessage}`, name: `${namesEng[j]}`, mode: "reflect" };
                            currentMessages = [...currentMessages, assistantMessage];
                            setMessages(prevMessages => [...prevMessages, assistantMessage]); 
                        }
                        if (i == names.length * reflectChatCount - 1) {
                            setMessages(prevMessages => [...prevMessages, {role: "assistant", content: `${endReflectingMessage}`, name: `${namesEng[0]}`, mode: "chat" }]); 
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
  }, [messages]);

  return null;
};

export default AssistantResponses;
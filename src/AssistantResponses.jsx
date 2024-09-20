import { useEffect } from 'react';
import OpenAI from "openai";

const AssistantResponses = ({ names, namesEng, messages, setMessages, theme, setTheme, inputAble, setInputAble, characters, chat, reflect, common, complementChat, complementReflect, summary, reflectChatCount, endReflectingMessage, setError }) => {
  //openaidialogue1
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  })

  useEffect(() => {
    if (inputAble) {
      if (messages.length > 4　&& messages[messages.length - 1].role == "user") {
        const makeResponse = async () => {
              try {
                const chatMessages = [
                  { role: "system", content: `あなたは${names[0]}という名前のアシスタントです。以下の設定をもとに返答を作成してください。${chat} ただしトークテーマは${theme}です。あなたの特徴は以下の通りです。${characters[0]}` },
                    ...messages.map(message => ({...message, role: "user"}))
                ];
                let response = await openai.chat.completions.create({
                  model: "gpt-4o",
                  messages: chatMessages,
                  temperature: 1.2
                })

                // 発言様式を整備する
                const commonMessages = [
                    { role: "system", content: `${common}`},
                    { role: "user", content: `${response.choices[0].message.content.trim()}`}
                ];
                response = await openai.chat.completions.create({
                  model: "gpt-4o",
                  messages: commonMessages,
                  temperature: 1.2
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
                // response = await openai.chat.completions.create({
                //   model: "gpt-4o",
                //   messages: summaryMessages,
                //   temperature: 1.2
                // })

                if (response.choices && response.choices.length > 0) {
                  const botMessage = response.choices[0].message.content.trim();
                  const assistantMessage = { role: "assistant", content: `${botMessage}`, name: `${namesEng[0]}`, mode: "chat"};
                  setMessages(prevMessages => [...prevMessages, assistantMessage]);
                }
              } catch (err) {
                setError(err);
                console.error("The sample encountered an error:", err);
              }
        }
        if (messages.length == 5){
          setTheme(messages[messages.length - 1]);
        }
        makeResponse();
        console.log(theme);
      }
    }
    else if (!inputAble) {
        if (messages.length > 4 && messages[messages.length - 2].role == "user") {
            const makeResponse = async () => {
                for(let i = 0; i < names.length * reflectChatCount; i++){
                    let j = i % names.length;
                    try {
                        const reflectMessages = [
                            { role: "system", content: `あなたは${names[j]}という名前のアシスタントで、${names[(j + 1) % names.length]}と${names[(j + 2) % names.length]}に向かって話しています。以下の設定をもとに返答を作成してください。${reflect} あなたの特徴は以下の通りです。${characters[j]}` },
                            ...messages.map(message => ({ ...message, role: "user" }))
                        ];
                        let response = await openai.chat.completions.create({
                          model: "gpt-4o",
                          messages: reflectMessages,
                          // 4802=？　30=?　177776=あなた　157351=でしょう　44900=ください　42993=ょ　103554=しょう　7128=か　165732=かな　177401=ユー　25885=私　16407=思　15121=です　14429=ます
                          logit_bias: {4802:-100, 30:-100, 177776:-100, 157351:-100, 44900:-100, 42993:-100, 103554:-100, 7128:-100, 165732:-100, 177401:1, 25885:2, 16407:2, 15121:2, 14429:2},
                          temperature: 1.2
                        })

                        // 発言様式を整備する
                        const commonMessages = [
                            { role: "system", content: `${common}` },
                            { role: "user", content: `${response.choices[0].message.content.trim()}` }
                        ];
                        response = await openai.chat.completions.create({
                          model: "gpt-4o",
                          messages: commonMessages,
                          logit_bias: {4802:-100, 30:-100, 177776:-100, 157351:-100, 44900:-100, 42993:-100, 103554:-100, 7128:-100, 165732:-100, 177401:2, 25885:2, 16407:2, 15121:2, 14429:2},
                          temperature: 1.2
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
                        // response = await openai.chat.completions.create({
                        //   model: "gpt-4o",
                        //   messages: summaryMessages,
                        //   logit_bias: {4802:-100, 30:-100, 177776:-100, 157351:-100, 44900:-100, 42993:-100, 103554:-100, 7128:-100, 165732:-100, 177401:2, 25885:2, 16407:2, 15121:2, 14429:2},
                        //   temperature: 1.2
                        // })

                        if (response.choices && response.choices.length > 0) {
                            const botMessage = response.choices[0].message.content.trim();
                            const assistantMessage = { role: "assistant", content: `${botMessage}`, name: `${namesEng[j]}`, mode: "reflect" };
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
  }, [messages, inputAble]);

  return null;
};

export default AssistantResponses;
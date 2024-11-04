import { useEffect } from 'react';
import OpenAI from "openai";

const AssistantResponses = ({ names, namesEng, messages, setMessages, theme, setTheme, inputAble, setInputAble, characters, chat, reflect, turns, reflectChatCount, endReflectingMessage, setError }) => {
  //openaidialogue1
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  })

  useEffect(() => {
    if (inputAble) {
      if (messages.length > names.length + 1　&& messages[messages.length - 1].role == "user") {
        const makeResponse = async () => {
              try {
                const randomIndex = Math.floor(Math.random() * names.length);

                const chatMessages = [
                  { 
                    role: "system", 
                    content: `
                      あなたは${names[randomIndex]}という名前のアシスタントです。
                      あなたの特徴は以下の通りです。
                      ${characters[randomIndex]}
                      以下の設定をもとに返答を作成してください。
                      ${chat} 
                      ユーザのお悩み「${theme}」から話題が離れないようにしてください。
                    ` 
                  },
                    ...messages
                ];
                let response = await openai.chat.completions.create({
                  // "https://platform.openai.com/chat-completions"のFine-tuningにてトレーニングデータをJSON LINESファイルで設定し、"Output model"をmodelに指定する
                  model: "gpt-4o",
                  messages: chatMessages,
                  temperature: 1.2
                })

                // // 発言様式を整備する
                // const commonMessages = [
                //     { role: "system", content: `${common}`},
                //     { role: "user", content: `${response.choices[0].message.content.trim()}`}
                // ];
                // response = await openai.chat.completions.create({
                //   model: "gpt-4o",
                //   messages: commonMessages,
                //   temperature: 1.2
                // })
                // console.log(response.choices[0].message.content.trim())

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
                  const assistantMessage = { role: "assistant", content: `${botMessage}`, name: `${namesEng[randomIndex]}`, mode: "chat"};
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
      }
    }
    else if (!inputAble) {
        if (messages.length > 4 && messages[messages.length - 2].role == "user") {
            const makeResponse = async () => {
                for(let i = 0; i < names.length * reflectChatCount; i++) {
                    const index = i % names.length;
                    const turn = Math.floor(i / names.length);
                    try {
                        const reflectMessages = [
                          { 
                            role: "system", 
                            content: `
                              あなたは${names[index]}という名前のアシスタントで、${names[(index + 1) % names.length]}と${names[(index + 2) % names.length]}と話しています。
                              ${i !== names.length * reflectChatCount - 1 ? 
                                `あなたの次には${names[(index + 1) % names.length]}が発言します。` : 
                                "会話はこれで終了します。"
                              }
                              あなたの特徴は以下の通りです。
                              ${characters[index]}
                            `
                          },
                            ...messages
                        ];
                        let response = await openai.chat.completions.create({
                          model: "gpt-4o",
                          messages: reflectMessages,
                          // 4802=？　30=?　177776=あなた　157351=でしょう　44900=ください　42993=ょ　103554=しょう　7128=か　165732=かな　3369=object 1752=Object 177401=ユー　25885=私　16407=思　15121=です 14429=ます 
                          logit_bias: {177776:-100, 44900:-100, 3369:-100, 1752:-100, 177401:3},
                          temperature: 1.2
                        })
                        console.log("response1: " + response.choices[0].message.content.trim());



                        const editedMessages = [
                          { 
                            role: "system", 
                            content: `
                              あなたは以下の条件を満たすように最後の返答を再編集してください。
                              ただし150文字以内で出力してください。
                              ${reflect} 
                              ${turns[turn]} 
                              ユーザのお悩み「${theme}」から話題が離れないようにしてください。
                            `
                          },
                          ...messages.map(message => ({ ...message, role: "user" })),
                          { role: "user", content: `${response.choices[0].message.content.trim()}` }
                        ];
                        response = await openai.chat.completions.create({
                          model: "gpt-4o",
                          messages: editedMessages,
                          // 4802=？　30=?　177776=あなた　157351=でしょう　44900=ください　42993=ょ　103554=しょう　7128=か　165732=かな　3369=object 1752=Object 177401=ユー　25885=私　16407=思　15121=です 14429=ます 
                          logit_bias: {177776:-100, 44900:-100, 3369:-100, 1752:-100, 177401:3},
                          temperature: 1.2
                        })
                        console.log("response2: " + response.choices[0].message.content.trim());








                        // // 発言様式を整備する
                        // const commonMessages = [
                        //     { role: "system", content: `${common}` },
                        //     { role: "user", content: `${response.choices[0].message.content.trim()}` }
                        // ];
                        // response = await openai.chat.completions.create({
                        //   model: "gpt-4o",
                        //   messages: commonMessages,
                        //   temperature: 1.2
                        // })
                        // console.log(response.choices[0].message.content.trim())

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
                            const assistantMessage = { role: "assistant", content: `${botMessage}`, name: `${namesEng[index]}`, mode: "reflect" };
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
                setInputAble(!inputAble);
            };
            makeResponse();
        }
    }
  }, [messages, inputAble]);

  return null;
};

export default AssistantResponses;
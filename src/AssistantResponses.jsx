import { useEffect } from 'react';
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const AssistantResponses = ({ messages, setMessages, names, characters, setError }) => {
  const endpoint = `https://opendialogue1.openai.azure.com/`;
  const azureApiKey = `e1a905c26e7d418bb8ce8f95518c9f45`;
  const deploymentId = "gpt35turbo";

//   const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));

  const client0 = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
  const client1 = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
  const client2 = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
//   let name;
//   let character;

  useEffect(() => {
    if (messages.length > 1) {
      const fetchData = async () => {
        for (let i = 0; i < clients.length; i++) {
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
            if (i == 0) {
                //履歴を代入
                const messages0 = [{ role: "system", content: `あなたは${names[0]}という名前のアシスタントです。あなたのMBTIは${characters[0]}です。あなたは一回の発言で120文字まで話すことができます。`}]
                const modifiedMessages = messages.slice(1);
                messages0 = [...messages0, ...modifiedMessages];
                //返信を作成
                const response0 = await client0.getChatCompletions(deploymentId, messages0, { maxTokens: 256 });
                //ログに追加
                if (response0.choices && response0.choices.length > 0) {
                    const botMessage0 = response0.choices[0].message.content.trim();
                    setMessages(prevMessages => [...prevMessages, { role: "assistant", content: `${botMessage0}` }]);
                }
            }
            if (i == 1) {
                //履歴を代入
                const messages1 = [{ role: "system", content: `あなたは${names[1]}という名前のアシスタントです。あなたのMBTIは${characters[1]}です。あなたは一回の発言で120文字まで話すことができます。`}]
                const modifiedMessages = messages.slice(1);
                messages1 = [...messages1, ...modifiedMessages];
                //返信を作成
                const response1 = await client1.getChatCompletions(deploymentId, messages1, { maxTokens: 256 });
                //ログに追加
                if (response1.choices && response1.choices.length > 0) {
                    const botMessage1 = response1.choices[0].message.content.trim();
                    setMessages(prevMessages => [...prevMessages, { role: "assistant", content: `${botMessage1}` }]);
                }
            }
            if (i == 2) {
                //履歴を代入
                const messages2 = [{ role: "system", content: `あなたは${names[2]}という名前のアシスタントです。あなたのMBTIは${characters[2]}です。あなたは一回の発言で120文字まで話すことができます。`}]
                const modifiedMessages = messages.slice(1);
                messages2 = [...messages2, ...modifiedMessages];
                //返信を作成
                const response2 = await client2.getChatCompletions(deploymentId, messages1, { maxTokens: 256 });
                //ログに追加
                if (response2.choices && response2.choices.length > 0) {
                    const botMessage2 = response2.choices[0].message.content.trim();
                    setMessages(prevMessages => [...prevMessages, { role: "assistant", content: `${botMessage2}` }]);
                }
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
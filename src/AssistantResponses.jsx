import { useEffect } from 'react';
import OpenAI from "openai";

const AssistantResponses = ({ names, namesEng, messages, setMessages, chatMessages, setChatMessages, reflectMessages, setReflectMessages, theme, setTheme, inputAble, setInputAble, characters, chat, reflect, turns, reflectChatCount, endReflectingMessage, setError }) => {
  //openaidialogue1
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  })

  let assistantMessage = {};
  useEffect(() => {
    if (inputAble) {
      if (messages.length > names.length + 1　&& messages[messages.length - 1].role == "user") {
        const makeResponse = async () => {
              try {
                const randomIndex = Math.floor(Math.random() * names.length);

                const baseMessages = [
                  { 
                    role: "system", 
                    content: `
                      あなたは${names[randomIndex]}という名前のアシスタントです。
                      あなたの特徴は以下の通りです。
                      ${characters[randomIndex]}
                      以下の設定をもとに返答を作成してください。
                      ${chat} 
                      話題が「${theme}」から離れないようにしてください。
                    ` 
                  },
                    ...messages
                ];
                let response = await openai.chat.completions.create({
                  // "https://platform.openai.com/chat-completions"のFine-tuningにてトレーニングデータをJSON LINESファイルで設定し、"Output model"をmodelに指定する
                  model: "gpt-4o",
                  messages: baseMessages,
                })

                if (response.choices && response.choices.length > 0) {
                  const botMessage = response.choices[0].message.content.trim();
                  assistantMessage = { role: "assistant", content: `${botMessage}`, name: `${namesEng[randomIndex]}`, mode: "chat"};
                  messages = [...messages, assistantMessage];
                  setMessages(messages);
                  chatMessages = [...chatMessages, assistantMessage];
                  setChatMessages(chatMessages);
                }

                // #####ボットにテストさせるための患者AIの実装################################################################################################
                // const patient = [
                //   "## 経歴・ライフスタイル" +
                //   "- 学習塾の事務の仕事を10年以上している。" +
                //   "- 埼玉県以外に住んだことがない。" +
                //   "- 現在は自粛しているが、旅行が好きである。" +
                //   "- 生き物が好きで、今は文鳥とメダカを飼っている。" +
                //   "- 緑の多い公園を散歩したり、野鳥観察をすることが多い。" +
                //   "- 休日が2日あるならば、1日は出かけて、もう1日はのんびりしたい。" +
                //   "- 姉御肌と言われる。" +
                //   "- 車の運転が好きで山道は問題ないが、首都高は走りたくない。" +
                //   "- 1日に1回はチョコレートを食べる。" +
                //   "- 景色のきれいな温泉宿でくつろぎたい。" +
                //   "## 性格特性" +
                //   "- Big Five 指標:" +
                //     "- 開放性 (Openness): 5.25" +
                //     "- 誠実性 (Conscientiousness): 5.17" +
                //     "- 外向性 (Extraversion): 5.58" +
                //     "- 協調性 (Agreeableness): 4.67" +
                //     "- 神経症傾向 (Neuroticism): 2.92" +
                //   "- KiSS18 スキル:" +
                //     "- 基本スキル (BasicSkill): 4.0" +
                //     "- 高度スキル (AdvancedSkill): 3.67" +
                //     "- 感情管理スキル (EmotionalManagementSkill): 4.0" +
                //     "- 攻撃管理スキル (OffenceManagementSkill): 4.0" +
                //     "- ストレス管理スキル (StressManagementSkill): 4.0" +
                //     "- 計画スキル (PlanningSkill): 4.0" +
                //   "- ATQ 指標:" +
                //     "- 恐怖 (Fear): 2.0" +
                //     "- フラストレーション (Frustration): 3.33" +
                //     "- 悲しみ (Sadness): 4.0" +
                //     "- 不快感 (Discomfort): 4.67" +
                //     "- 行動制御 (ActivationControl): 5.71" +
                //     "- 注意制御 (AttentionalControl): 5.4" +
                //     "- 抑制制御 (InhibitoryControl): 5.57" +
                //     "- 社交性 (Sociability): 5.4" +
                //     "- 高強度快感 (HighIntensityPleasure): 4.86" +
                //     "- ポジティブ感情 (PositiveAffect): 5.4" +
                //     "- 中立的感覚感受性 (NeutralPerceptualSensitivity): 6.8" +
                //     "- 感情的感覚感受性 (AffectivePerceptualSensitivity): 4.6" +
                //     "- 連想感受性 (AssociativeSensitivity): 4.0" +
                //   "- SMS 指標:" +
                //     "- 外向性 (Extraversion): 2.4" +
                //     "- 他者志向性 (OtherDirectedness): 2.0" +
                //     "- 行動性 (Acting): 3.0" +
                //     "## 人口統計情報" +
                //     "- 性別: 女性" +
                //     "- 年齢: 40-49歳" +
                //     "- 学歴: 四年制大学卒" +
                //     "- 雇用状況: 就業中" +
                //     "- 居住地域: 埼玉県" +
                //     "## テキストチャットの経験" +
                //     "- チャットを始めた年齢: 20-29歳" +
                //     "- チャットの頻度: 毎日" +
                //     "- チャットの相手: 家族, 同僚" +
                //     "- 典型的なチャット内容: 日常的な連絡事項や、愚痴など。" +
                //     "## 最近の悩み事" +
                //     "- 日々の仕事が忙しく、プライベートの時間を十分に確保できていない。" +
                //     "- 長時間座りっぱなしの仕事が多く、腰痛が悪化している。" +
                //     "- 最近、仕事のプレッシャーが増しており、リラックスする時間が減っている。" +
                //     "- 近年、体力の低下を感じており、以前のように旅行やアウトドア活動を楽しめていない。"
                // ]
                // let userResponse = await openai.chat.completions.create({
                //   model: "gpt-4o",
                //   messages: [
                //     { role: "system", 
                //       content: `
                //         あなたは以下の性格特性を持つ人物です。
                //         ${patient}
                //         あなたはオープンダイアローグという対話療法の場に赴いて悩みを相談します。
                //         ただし150文字以内で発言します。
                //         あなたは絶対に悩みを訴える患者役に徹してください。
                //         "## 発話内容の例" +
                //         "- 最近、仕事が忙しすぎてプライベートな時間が全然取れないんだけど、何か効率よくリフレッシュできる方法ってあるかな？平日の夜も疲れてしまって、何もする気が起きなくて困ってる。" +
                //         "- 腰痛が悪化していて、仕事中に椅子に長時間座っているのが本当に辛い。何か腰に優しい姿勢や、負担を軽減する方法があれば知りたいんだ。" +
                //         "- 旅行が趣味なんだけど、ここ数年は自粛や忙しさの影響で全然行けてない。特に温泉宿でゆっくりしたい気持ちが強いけど、最近オススメの温泉地とかあるかな？" +
                //         "- 文鳥を飼っているんだけど、最近少し元気がない気がして心配してる。餌や水の管理には気をつけてるつもりだけど、他に健康チェックする方法とか、気をつけるべきことがあれば教えてほしい。" +
                //         "- 休みの日には自然が豊かな公園でリフレッシュするのが好きで、野鳥観察も楽しみにしてる。最近だとどこの公園で色々な種類の野鳥が見られるのか、オススメのスポットがあれば教えてほしいな。" +
                //         "- 最近、日常的に仕事のプレッシャーを感じていて、特にミスがないかどうか常に気にしてしまう。どうすれば気持ちを落ち着けられるのか、アドバイスがあれば聞きたい。" +
                //         "- 以前は体力に自信があったけど、最近は少し動いただけで疲れてしまうことが増えてきた。簡単にできる体力づくりの方法とか、何か始めやすい運動があれば知りたいんだ。" +
                //         "- 最近、文鳥の餌がいつもと違うメーカーに変わったんだけど、それが原因で元気がないのか気になってる。どんな餌が良いのか、また文鳥にとって理想的な食事の種類があれば知りたい。" +
                //         "- 夕方になるとお菓子を食べたくなることが多く、特にチョコレートが欠かせない。健康を考えるとあまり良くないと分かっているんだけど、代わりに良いおやつがあれば知りたい。" +
                //         "- 最近、車を運転するのが少し億劫になってきた気がする。特に渋滞や混雑した場所を避けたいんだけど、リラックスして運転するためのコツや注意点があれば教えてほしい。" +
                //       `
                //     },
                //     ...messages
                //   ]
                // })
                // if (userResponse.choices && userResponse.choices.length > 0) {
                //   console.log("user speaks");
                //   const userMessage = { role: "user", content: `${userResponse.choices[0].message.content.trim()}`, name: "You", mode: "chat" };
                //   setMessages(prevMessages => [...prevMessages, userMessage]);
                //   setChatMessages(prevChatMessages => [...prevChatMessages, userMessage]);
                // }
                // #####################################################################################################################################

                let abstract = await openai.chat.completions.create({
                  model: "gpt-4o",
                  messages: [
                    {
                      role: 'system', 
                      content: `
                        あなたはここまでの会話を元にユーザーが抱える悩みを適切に要約します。
                      `
                    },
                    ...messages
                  ],
                })
                theme = abstract.choices[0].message.content
                setTheme(theme);

              } catch (err) {
                setError(err);
                console.error("The sample encountered an error:", err);
              }
        }
        makeResponse();
      }
    }
    else if (!inputAble) {
        if (messages.length > 4 && messages[messages.length - 2].role == "user") {
          const makeResponse = async () => {
            for (let i = 0; i < names.length * reflectChatCount; i++) {
              const index = i % names.length;
              const turn = Math.floor(i / names.length);
              try {
                let baseMessages = [
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
                      あなたは以下の設定に従って返答を出力してください。
                      ${reflect} 
                      また、以下の思考の流れの例を参考にしてください。ただしここにある話題に基づいて返答を出力しないでください。
                      ${turns[turn]} 
                      話題が「${theme}」から離れないようにしてください。
                    `
                  },
                  ...messages,
                ];
          
                let response = await openai.chat.completions.create({
                  model: "gpt-4o",
                  messages: baseMessages,
                  // 4802=？　30=?　177776=あなた　157351=でしょう　44900=ください　42993=ょ　103554=しょう　7128=か　165732=かな　3369=object 1752=Object 177401=ユー　25885=私　16407=思　15121=です 14429=ます 
                  logit_bias: {177776:-100, 44900:-100, 3369:-100, 1752:-100, 177401:3},
                });
                  
                if (response.choices && response.choices.length > 0) {
                  const botMessage = response.choices[0].message.content.trim();
                  const assistantMessage = { role: "assistant", content: `${botMessage}`, name: `${namesEng[index]}`, mode: "reflect" };
                  messages = [...messages, assistantMessage];
                  setMessages(messages);
                  reflectMessages = [...reflectMessages, assistantMessage];
                  setReflectMessages(reflectMessages);
                }
          
                if (i == names.length * reflectChatCount - 1) {
                  messages = [...messages, {role: "assistant", content: `${endReflectingMessage}`, name: `${namesEng[0]}`, mode: "chat" }]
                  setMessages(messages); 
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
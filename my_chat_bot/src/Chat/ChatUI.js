import React, { useState } from 'react';
import './ChatUI.css';
import axios from 'axios';
import {Configuration, OpenAIApi} from 'https://cdn.skypack.dev/openai';

const ChatUI= ()=> {
  const [inputValue, setInputValue] = useState(''); // input 창에 입력된 내용  

  const templateFront=`<div class="line"><span class="chat-box mine">`; // 추가되는 채팅의 html 형식 고정 앞부분
  const templateBack='</span></div>'; // 추가되는 채팅의 html 형식 고정 뒷부분

  const addChat = () => {
    let template=templateFront+inputValue+templateBack;
    let chatContent = document.querySelector('.chat-content');
    chatContent.insertAdjacentHTML('beforeend', template);
    setInputValue(''); 
    
    const configuration=new Configuration({
      apiKey: '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',
    });

    const openai=new OpenAIApi(configuration);

    openai.createCompletion({
      model:"text-davinci-002",
      prompt:inputValue,

    }).then((result)=>{
      console.log(result.data.choices[0].text);
      let front=`<div class="line"><span class="chat-box"></span>`;
      let back='</span></div>';
      template=front+result.data.choices[0].text+back;
      chatContent.insertAdjacentHTML('beforeend', template);
    })
  

  };

  return (
    <div>
      <div class="chat-content">
        <div class="line">
            <span class="chat-box">안녕?</span>
        </div>
        <div class="line">
            <span class="chat-box mine">안녕!</span>
        </div>
      </div>
      <input type="text" class="chat-box" value={inputValue} onChange={(e)=>setInputValue(e.target.value)} />
      <button onClick={addChat}>전송</button>
    </div>
    
  );
}

export default ChatUI;
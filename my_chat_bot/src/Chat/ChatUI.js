import React, { useRef, useState } from 'react';
import './ChatUI.css';
import axios from 'axios';

const ChatUI= ()=> {
  const [inputValue, setInputValue] = useState(''); // input 창에 입력된 내용  

  const templateFront=`<div class="line"><span class="chat-box mine">`; // 추가되는 채팅의 html 형식 고정 앞부분
  const templateBack='</span></div>'; // 추가되는 채팅의 html 형식 고정 뒷부분

  //전의 대화 누적
  let storedInputValue=useRef(inputValue); // input 창에 입력된 내용을 저장하는 변수

  const addChat = async() => {

    //이전에 입력한 내용을 합친 내용을 저장
    storedInputValue.current=storedInputValue.current+" "+inputValue; // input 창에 입력된 내용을 저장

    //입력창에 입력된 내용을 채팅창에 추가
    let template=templateFront+inputValue+templateBack;
    let chatContent = document.querySelector('.chat-content');
    chatContent.insertAdjacentHTML('beforeend', template);
    setInputValue(''); 

    //파파고 api를 이용해 영어로 번역된 값 받아오기
    // const english= await axios.get('https://localhost:5000/transleateToEnglish', {
    //   params: { prompt: storedInputValue.current },
    // });
    
    // axios를 이용해 서버에 get 요청을 보내고, 응답을 받아온다.
    const response = await axios.get('http://localhost:5000/chat', {
      params: { prompt: inputValue },
    });

    //파파고 api를 이용해 영어 답변을 한국어로 번역해 받아오기
    // const finalResponse= await axios.get('https://localhost:5000/transleateToKorean', {
    //   params: { prompt: response.data },
    // })

    let front=`<div class="line"><span class="chat-box">`;
    let back='</span></div>';
    template=front+response.data+back;
    chatContent.insertAdjacentHTML('beforeend', template);

  

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
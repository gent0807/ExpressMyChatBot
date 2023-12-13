const express = require("express");
const path = require("path");
const OpenAI=require("openai");

const openai = new OpenAI({
  apiKey: "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"
});

const app = express();

const request = require("request");
const client_id = "F4pmcTtDerRWGJpqxc1n";
const clent_secret= "KKjtYCtefP";

app.set("port", process.env.PORT || 5000);

app.use(express.static(path.join(__dirname, "my_chat_bot/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/my_chat_bot/build/index.html"));
});

//입력창에 입력된 한국어 문장을 파파고 api를 이용해 영어로 번역해주는 api
app.get('/translateToEnglish', async(req, res)=>{
  const api_url='https://openapi.naver.com/v1/papago/n2mt';
  const query=req.query.prompt;

  const options={
    url: api_url,
    form: {'source':'ko', 'target':'en', 'text':query},
    headers: {'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': clent_secret}
  };

  request.post(options, function(error, response, body){
    if (!error && response.statusCode == 200) {
      res.json(body);
    } else {
      console.log('error = ' + response.statusCode);
    }
  });

  
});

//영어로 번역된 문장을 openai api를 이용해 답변을 받아오는 api
app.get('/chat', async(req, res)=>{
  const prompt = req.query.prompt;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages:[
      {"role":"user", "content": prompt}
    ],
    max_tokens: 256,
  });
  
  res.send(response.choices[0].message.content);
});

//openai api를 이용해 받아온 영어 답변을 파파고 api를 이용해 한국어로 번역해주는 api
app.get('/translateToKorean', async(req, res)=>{
  const api_url='https://openapi.naver.com/v1/papago/n2mt';
  const query=req.query.prompt;

  const options={
    url: api_url,
    form: {'source':'en', 'target':'ko', 'text':query},
    headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret':clent_secret}
  };

  request.post(options, function(error, response, body){
    if (!error && response.statusCode == 200) {
      res.json(body);
    } else {
      console.log('error = ' + response.statusCode);
    }
  });
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "빈 포트에서 대기중..");
});
# 🤖 First Impression Assistant

ai가 환자의 초진을 하고, 내용을 정리하여 emr형식으로 보여줌.

#### <a href="https://versel-next-portfolio.vercel.app">🌐 바로 가기</a>

## 🖼️ 완성 이미지
<img width="1280" alt="image" src="">

## 🔄️ 개발 방식

openai에서 제공해주는 api를 활용하여 SSE로 구현
DB가 없기에 공유하기 위한 데이터를 url의 parameter로 제공하도록 구현

## 🔔 핵심 기능

- share : 사용자가 gpt와 대화하여 얻게 된 데이터를 다른 사용자에게 공유할 수 있는 기능 구현
- chat : gpt api를 활용하고 prompting을 통해 사용자의 초진을 진행할 수 있도록 구현
- sse : gpt가 생성한 토큰을 차례로 client에 보내줄 수 있도록 구현

## ⚙️ 기술 스택

<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
<img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">

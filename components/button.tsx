const getData = async () => {
  const response = await fetch(`http://localhost:3000/api/chatgpt`, {
    cache: 'no-store',
  });
  return await response.json();
};

const Button = async () => {
  const data = await getData();
  return <button onClick={() => console.log(data)}>메시지 보내기</button>;
};

export default Button;

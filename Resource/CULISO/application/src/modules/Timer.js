export default function Timer(s, callback) {
  console.log("타이머 실행");
  const time = s * 1000;
  let timer = setTimeout(() => {
    callback();
  }, time);

  return () => {
    clearTimeout(timer);
  };
}

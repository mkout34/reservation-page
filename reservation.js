document.getElementById("bookingForm").addEventListener("submit", function(event) {
  event.preventDefault(); // 폼 전송 방지

  const name = document.getElementById("name").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  const messageDiv = document.getElementById("message");

  if (name === "" || date === "" || time === "") {
    messageDiv.style.color = "red";
    messageDiv.textContent = "모든 정보를 입력해주세요.";
    return;
  }

  messageDiv.style.color = "blue";
  messageDiv.textContent = `${name}님의 ${date} ${time} 예약이 완료되었습니다!`;
});
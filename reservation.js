function submitBooking() {
  const id = document.getElementById('userId').value;
  const name = document.getElementById('userName').value;
  const phone = document.getElementById('userPhone').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  if (!id || !name || !phone || !date || !time) {
    alert("모든 항목을 입력해주세요.");
    return;
  }

  alert(`${name}님, ${date} ${time}에 예약이 완료되었습니다.`);
}
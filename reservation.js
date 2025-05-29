// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyDfAL5j8oduvr_p28DZF6MOuajgfv9Fe78",
  authDomain: "reservate-513d4.firebaseapp.com",
  projectId: "reservate-513d4",
  storageBucket: "reservate-513d4.appspot.com",
  messagingSenderId: "246180785408",
  appId: "1:246180785408:web:80edfcaa2f48980dfc97e5"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

window.addEventListener("DOMContentLoaded", () => {
  // 날짜 선택 시 검사
  document.getElementById("date").addEventListener("change", async function () {
    const selectedDate = this.value;
    const day = new Date(selectedDate).getDay();

    if (day === 0 || day === 6) {
      alert("토요일과 일요일은 예약할 수 없습니다.");
      this.value = "";
      return;
    }

    const snapshot = await db.collection("reservations")
      .where("date", "==", selectedDate).get();

    if (snapshot.size >= 5) {
      alert("해당 날짜는 예약이 마감되었습니다.");
      this.value = "";
    }
  });

  window.startReservation = async function () {
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!date || !time) {
      alert("날짜와 시간을 모두 선택해주세요.");
      return;
    }

    const snapshot = await db.collection("reservations")
      .where("date", "==", date)
      .where("time", "==", time).get();

    if (snapshot.size >= 2) {
      alert("해당 시간은 마감되었습니다. 다른 시간을 선택해주세요.");
      document.getElementById("reservationForm").style.display = "none";
    } else {
      alert("예약 가능한 시간입니다. 아래에 정보를 입력해주세요.");
      document.getElementById("reservationForm").style.display = "block";
    }
  }

  // 예약 폼 제출 시
  document.getElementById("reservationForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = document.getElementById("userId").value;
    const userName = document.getElementById("userName").value;
    const contact = document.getElementById("contact").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const symptom = document.getElementById("symptom").value;

    try {
      await db.collection("reservations").add({
        userId, userName, contact, date, time, symptom,
        createdAt: new Date()
      });

      alert("예약이 완료되었습니다!");
      document.getElementById("reservationForm").reset();
      document.getElementById("reservationForm").style.display = "none";
      loadReservationStatus(); // 예약 후 현황 갱신
    } catch (e) {
      console.error("예약 실패: ", e);
      alert("예약에 실패했습니다.");
    }
  });

  loadReservationStatus();
});

// 예약 현황 테이블 불러오기
async function loadReservationStatus() {
  const tbody = document.getElementById("statusTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";
  const snapshot = await db.collection("reservations").get();
  const countMap = {};

  snapshot.forEach(doc => {
    const data = doc.data();
    const key = `${data.date} ${data.time}`;
    countMap[key] = (countMap[key] || 0) + 1;
  });

  for (const [key, count] of Object.entries(countMap)) {
    const [date, time] = key.split(" ");
    const row = document.createElement("tr");
    row.innerHTML = `<td>${date}</td><td>${time}</td><td>${count}</td>`;
    tbody.appendChild(row);
  }
} 

// [1] Firebase 초기화
const firebaseConfig = {
  apiKey: "AIzaSyDfAL5j8oduvr_p28DZF6MOuajgfv9Fe78",
  authDomain: "reservate-513d4.firebaseapp.com",
  projectId: "reservate-513d4",
  storageBucket: "reservate-513d4.appspot.com",
  messagingSenderId: "246180785408",
  appId: "1:246180785408:web:80edfcaa2f48980dfc97e5"
};

// 초기화 안전하게 구성
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// [2~4] 모든 DOM 접근은 DOMContentLoaded 이후에 실행
window.addEventListener("DOMContentLoaded", () => {

  // 날짜 선택 시 조건 검사
  document.getElementById("date").addEventListener("change", async function () {
    const selectedDate = this.value;
    const day = new Date(selectedDate).getDay();

    // 토요일(6) / 일요일(0) 막기
    if (day === 0 || day === 6) {
      alert("토요일과 일요일은 예약할 수 없습니다.");
      this.value = "";
      return;
    }

    // 해당 날짜 예약 건수가 5건 이상이면 마감 처리
    const snapshot = await db.collection("reservations")
      .where("date", "==", selectedDate)
      .get();

    if (snapshot.size >= 5) {
      alert("해당 날짜는 예약이 마감되었습니다.");
      this.value = "";
    }
  });

  // 시간 선택 후 [현황 확인] 버튼 클릭 시
  window.checkAvailability = async function () {
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!date || !time) {
      alert("날짜와 시간을 모두 선택해주세요.");
      return;
    }

    const snapshot = await db.collection("reservations")
      .where("date", "==", date)
      .where("time", "==", time)
      .get();

    if (snapshot.size >= 2) {
      alert("해당 시간은 마감되었습니다. 다른 시간을 선택해주세요.");
      document.getElementById("reservationForm").style.display = "none";
    } else {
      alert("예약 가능한 시간입니다. 아래에 정보를 입력해주세요.");
      document.getElementById("reservationForm").style.display = "block";
    }
  }

  // 최종 예약 제출
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
        userId,
        userName,
        contact,
        date,
        time,
        symptom,
        createdAt: new Date()
      });

      alert("예약이 완료되었습니다!");
      document.getElementById("reservationForm").reset();
      document.getElementById("reservationForm").style.display = "none";

    } catch (e) {
      console.error("예약 실패: ", e);
      alert("예약에 실패했습니다.");
    }
  });
});

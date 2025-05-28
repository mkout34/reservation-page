// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyDfAL5j8oduvr_p28DZF6MOuajgfv9Fe78",
  authDomain: "reservate-513d4.firebaseapp.com",
  projectId: "reservate-513d4",
  storageBucket: "reservate-513d4.appspot.com",
  messagingSenderId: "246180785408",
  appId: "1:246180785408:web:80edfcaa2f48980dfc97e5"
};

// 초기화
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 데이터 로드 및 출력
async function loadReservationStatus() {
  const snapshot = await db.collection("reservations").get();
  const counts = {};

  snapshot.forEach(doc => {
    const { date, time } = doc.data();
    if (date && time) {
      const key = `${date} ${time}`;
      counts[key] = (counts[key] || 0) + 1;
    }
  });

  const tbody = document.querySelector("#statusTable tbody");
  tbody.innerHTML = "";

  Object.entries(counts).forEach(([key, count]) => {
    const [date, time] = key.split(" ");
    const row = document.createElement("tr");
    row.innerHTML = `<td>${date}</td><td>${time}</td><td>${count}</td>`;
    tbody.appendChild(row);
  });
}

loadReservationStatus();

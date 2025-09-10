// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBBk758KxSSXxxiYYNoGx5uTEsD_M_ZM1Q",
    authDomain: "lemoniot.firebaseapp.com",
    databaseURL: "https://lemoniot-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "lemoniot",
    storageBucket: "lemoniot.firebasestorage.app",
    messagingSenderId: "120557510666",
    appId: "1:120557510666:web:05bcadbb204a12e765bff3"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Referensi database
const soilRef = db.ref("lemon_project/soil_moisture");
const waterRef = db.ref("lemon_project/water_level");
const pumpRef = db.ref("lemon_project/pump_status");

// Update kelembaban tanah
soilRef.on("value", (snapshot) => {
  const value = snapshot.val();
  document.getElementById("soilMoisture").innerText = value + " %";
  updateSoilChart(value);
});

// Update level air
waterRef.on("value", (snapshot) => {
  const value = snapshot.val();
  if (value !== null) {
    document.getElementById("waterLevel").innerText = value + " %";
    const waterDiv = document.getElementById("waterFill");
    waterDiv.style.height = value + "%";
    document.getElementById("waterText").innerText = value + "%";
  }
});

// Update status pompa
pumpRef.on("value", (snapshot) => {
  document.getElementById("pumpStatus").innerText = snapshot.val();
});

// --- Chart.js setup ---
const ctx = document.getElementById("soilChart").getContext("2d");
const soilChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Soil Moisture (%)",
      data: [],
      borderColor: "blue",
      borderWidth: 2,
      fill: false,
      tension: 0.2
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { beginAtZero: true, title: { display: true, text: "Moisture (%)" } }
    }
  }
});

// Fungsi update grafik
function updateSoilChart(value) {
  const currentTime = new Date().toLocaleTimeString();
  soilChart.data.labels.push(currentTime);
  soilChart.data.datasets[0].data.push(value);

  // Batas data (10 terakhir)
  if (soilChart.data.labels.length > 10) {
    soilChart.data.labels.shift();
    soilChart.data.datasets[0].data.shift();
  }

  soilChart.update();
}

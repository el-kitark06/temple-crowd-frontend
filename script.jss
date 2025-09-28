// Backend URL (replace with your deployed backend URL)
const backendURL = "https://your-backend-url.com";

// Fetch live crowd levels and render chart
async function loadDashboard() {
  const ctx = document.getElementById("crowdChart");
  if (!ctx) return;

  try {
    const res = await fetch(`${backendURL}/api/crowd`);
    const data = await res.json();

    const labels = data.map(d => d.temple);
    const counts = data.map(d => d.crowd_level);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: "Current Crowd Level",
          data: counts
        }]
      }
    });

    document.getElementById("statusMessage").textContent = "Data updated just now ✅";
  } catch (err) {
    document.getElementById("statusMessage").textContent = "Failed to load data ❌";
  }
}

// Handle temple form
const form = document.getElementById("templeForm");
if (form) {
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const name = document.getElementById("templeName").value;
    const location = document.getElementById("templeLocation").value;

    await fetch(`${backendURL}/api/temples`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, location })
    });

    alert("Temple added!");
    loadTemples();
  });
}

// Load temple list
async function loadTemples() {
  const list = document.getElementById("templeList");
  if (!list) return;

  const res = await fetch(`${backendURL}/api/temples`);
  const temples = await res.json();

  list.innerHTML = "";
  temples.forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t.name} (${t.location})`;
    list.appendChild(li);
  });
}

// Load alerts
async function loadAlerts() {
  const list = document.getElementById("alertList");
  if (!list) return;

  const res = await fetch(`${backendURL}/api/alerts`);
  const alerts = await res.json();

  list.innerHTML = "";
  if (alerts.length === 0) {
    list.textContent = "No active alerts 🎉";
  } else {
    alerts.forEach(a => {
      const li = document.createElement("li");
      li.textContent = `⚠️ ${a.message}`;
      list.appendChild(li);
    });
  }
}

// Auto-run depending on page
window.onload = () => {
  loadDashboard();
  loadTemples();
  loadAlerts();
};

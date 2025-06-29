// --- Google Search ---
function googleSearch() {
  var text = document.getElementById("search").value;
  var cleanQuery = text.replace(" ", "+", text);
  var url = 'http://www.google.com/search?q=' + cleanQuery;
  window.open(url, '_blank').focus();
}

// --- Editable Text (with localStorage) ---
const editableText = document.getElementById('editable-text');
if (localStorage.getItem('savedText')) {
  editableText.textContent = localStorage.getItem('savedText');
}
editableText.addEventListener('input', function () {
  localStorage.setItem('savedText', this.textContent);
});

// --- Search Input Enter Key ---
const input = document.getElementById('search');
input.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    googleSearch();
  }
});

// --- Voice Search ---
let x = 0;
let recognition;
let silenceTimeout;

function voice() {
  if (!recognition) return;
  if (x == 0) {
    recognition.start();
    resetSilenceTimeout();
    x = 1;
  } else {
    recognition.stop();
    clearTimeout(silenceTimeout);
    x = 0;
  }
}

function resetSilenceTimeout() {
  clearTimeout(silenceTimeout);
  silenceTimeout = setTimeout(function () {
    recognition.stop();
  }, 5000); // 5 seconds of silence
}

if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-GB";

  recognition.onstart = function () {
    document.getElementById("search").value = "";
    document.getElementById("search").placeholder = "Speak now...";
  };

  recognition.onresult = function (event) {
    let transcript = event.results[event.results.length - 1][0].transcript;
    document.getElementById('search').value = transcript;
    resetSilenceTimeout();
  };

  recognition.onsoundend = function () {
    resetSilenceTimeout();
  };

  recognition.onspeechend = function () {
    resetSilenceTimeout();
  };

  recognition.onerror = function (event) {
    console.error('Recognition error: ' + event.error);
  };

  recognition.onend = function () {
    document.getElementById("search").placeholder = "Search here...";
    clearTimeout(silenceTimeout);
    x = 0;
  };
} else {
  console.error('webkitSpeechRecognition is not supported in this browser.');
}

// --- Theme Toggle (Dark/Light) ---
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.innerHTML = savedTheme === 'light'
    ? '<i class="fa-solid fa-moon"></i>'
    : '<i class="fa-solid fa-sun"></i>';
} else if (!prefersDark) {
  document.documentElement.setAttribute('data-theme', 'light');
  themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
}
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.innerHTML = next === 'light'
    ? '<i class="fa-solid fa-moon"></i>'
    : '<i class="fa-solid fa-sun"></i>';
});

// --- Customizable Quick Links (Apps) ---
const defaultApps = [
  { name: "Stack Overflow", url: "https://stackoverflow.com", icon: '<i class="fa-brands fa-stack-overflow"></i>' },
  { name: "Github", url: "https://github.com", icon: '<i class="fa-brands fa-github"></i>' },
  { name: "ChatGPT", url: "https://chatgpt.com", icon: '<img src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" style="height: 26px; width: 26px;" />' },
  { name: "Discord", url: "https://discord.com", icon: '<i class="fa-brands fa-discord"></i>' },
  { name: "YouTube", url: "https://youtube.com", icon: '<i class="fa-brands fa-youtube"></i>' },
  { name: "Spotify", url: "https://spotify.com", icon: '<i class="fa-brands fa-spotify"></i>' },
  { name: "Netflix", url: "https://netflix.com", icon: '<img src="https://iili.io/HMIU1g2.png" style="height: 24px; width: 24px" />' },
  { name: "Whatsapp", url: "https://web.whatsapp.com", icon: '<i class="fa-brands fa-whatsapp"></i>' },
  { name: "Jio Cinema", url: "https://jiocinema.com", icon: '<img src="https://jep-asset.akamaized.net/jio/svg-og/jiocinema_logo.png" style="height: 24px; width: 24px" />' },
  { name: "Amazon", url: "https://amazon.com", icon: '<i class="fa-brands fa-amazon"></i>' },
  { name: "Linkedin", url: "https://linkedin.com", icon: '<i class="fa-brands fa-linkedin"></i>' },
  { name: "Flipkart", url: "https://flipkart.com", icon: '<img src="https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Emblem.png" style="height: 24px; width: 32px" />' }
];

function getApps() {
  return JSON.parse(localStorage.getItem('customApps')) || defaultApps;
}

function setApps(apps) {
  localStorage.setItem('customApps', JSON.stringify(apps));
}

function renderApps() {
  const apps = getApps();
  const container = document.getElementById('apps-container');
  container.innerHTML = '';
  apps.forEach((app, idx) => {
    const a = document.createElement('a');
    a.href = app.url;
    a.target = '_blank';
    a.className = 'app-link';
    a.innerHTML = `
      <span class="app-icon">${app.icon}</span>
      <div class="label">
        <span class="name">${app.name}</span>
        <span class="url">${new URL(app.url).hostname}</span>
      </div>
      <button class="remove-app" data-idx="${idx}" title="Remove" style="margin-left:auto;background:none;border:none;color:red;cursor:pointer;">&times;</button>
    `;
    container.appendChild(a);
  });
  // Remove handler
  container.querySelectorAll('.remove-app').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = +btn.dataset.idx;
      const apps = getApps();
      apps.splice(idx, 1);
      setApps(apps);
      renderApps();
    });
  });
}

// Add app UI
document.getElementById('add-app-btn').onclick = function showAddAppPrompt() {
  const name = prompt('App name:');
  if (!name) return;
  const url = prompt('App URL (include https://):');
  if (!url) return;
  const icon = prompt('App icon HTML (FontAwesome or <img>):', '<i class="fa-brands fa-globe"></i>');
  const apps = getApps();
  apps.push({ name, url, icon });
  setApps(apps);
  renderApps();
};

// Initial render
renderApps();

const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const battleBtn = document.getElementById("battle-btn");
const clearUser = document.getElementById("clear");
const actionButtons = document.getElementById("action-buttons");
const reselectBtn = document.getElementById("reselect-btn");
const clearBtn = document.getElementById("clear-btn");
const resultSection = document.getElementById("result-section");
const loadingDiv = document.getElementById("loading");

battleBtn.addEventListener("click", handleBattle);
reselectBtn.addEventListener("click", resetGame);
clearBtn.addEventListener("click", clearResults);
clearUser.addEventListener("click", clearUserName);

async function handleBattle() {
  const user1 = player1Input.value.trim();
  const user2 = player2Input.value.trim();

  document.getElementById("error1").textContent = "";
  document.getElementById("error2").textContent = "";

  if (!user1 || !user2) {
    if (!user1)
      document.getElementById("error1").textContent = "⚠️ Enter a username!";
    if (!user2)
      document.getElementById("error2").textContent = "⚠️ Enter a username!";
    return;
  }

  // Show loading spinner
  loadingDiv.classList.remove("hidden");
  document.getElementById("form-section").classList.add("hidden");

  try {
    const data1 = await fetchUser(user1, "error1");
    const data2 = await fetchUser(user2, "error2");

    // Hide loading after fetch
    loadingDiv.classList.add("hidden");

    if (!data1 || !data2) {
      document.getElementById("form-section").classList.remove("hidden");
      return;
    }

    const score1 = calcScore(data1);
    const score2 = calcScore(data2);

    displayResults(data1, score1, data2, score2);
  } catch (err) {
    console.error("Fetch error:", err);
    loadingDiv.classList.add("hidden");
    document.getElementById("form-section").classList.remove("hidden");
  }
}

async function fetchUser(username, errorId) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) {
      document.getElementById(errorId).textContent =
        "❌ Invalid or non-existent username!";
      return null;
    }
    return await res.json();
  } catch (error) {
    document.getElementById(errorId).textContent =
      "⚠️ Network error, please try again!";
    return null;
  }
}

function calcScore(user) {
  return user.followers + user.following + user.public_repos * 0.5;
}

function displayResults(user1, score1, user2, score2) {
  resultSection.classList.remove("hidden");
  actionButtons.classList.remove("hidden");

  const player1Card = document.getElementById("player1-card");
  const player2Card = document.getElementById("player2-card");

  const winner1 = score1 > score2 ? "winner" : score1 < score2 ? "loser" : "";
  const winner2 = score2 > score1 ? "winner" : score2 < score1 ? "loser" : "";

  player1Card.className = `player-card ${winner1}`;
  player2Card.className = `player-card ${winner2}`;

  player1Card.innerHTML = generateCardHTML(user1, score1);
  player2Card.innerHTML = generateCardHTML(user2, score2);
}

function generateCardHTML(user, score) {
  return `
    <img src="${user.avatar_url}" alt="${user.login}" />
    <h3>${user.login}</h3>
    <p>Followers: ${user.followers}</p>
    <p>Following: ${user.following}</p>
    <p>Repos: ${user.public_repos}</p>
    <h2>Score: ${score}</h2>
  `;
}

function resetGame() {
  player1Input.value = "";
  player2Input.value = "";
  document.getElementById("form-section").classList.remove("hidden");
}

function clearResults() {
  // Completely clear player cards
  document.getElementById("player1-card").innerHTML = "";
  document.getElementById("player2-card").innerHTML = "";

  resultSection.classList.add("hidden");
  actionButtons.classList.add("hidden");

  player1Input.value = "";
  player2Input.value = "";

  document.getElementById("form-section").classList.remove("hidden");
}

function clearUserName() {
  player1Input.value = "";
  player2Input.value = "";
}

let selected = null;
let playWallet = 100;
let stake = 10;

const pages = ["menu", "register", "account", "game"];

function showPage(pageId) {
    pages.forEach(id => {
        document.getElementById(id).style.display =
            id === pageId ? "block" : "none";
    });
}

function showMenu() {
    showPage("menu");
}

function showGame() {
    showPage("game");
}

function showRegister() {
    showPage("register");
}

function showAccountInfo() {
    showPage("account");
}

function registerAccount() {
    const name = document.getElementById("regName").value.trim();
    const phone = document.getElementById("regPhone").value.trim();

    if (!name || !phone) {
        alert("Maqaa fi lakkoofsa bilbilaa guuti!");
        return;
    }

    const code = "SB" + Math.floor(100000 + Math.random() * 900000);

    localStorage.setItem("sbName", name);
    localStorage.setItem("sbPhone", phone);
    localStorage.setItem("sbCode", code);

    alert("Registration successful!");
    showMenu();
}

function copyCode() {
    const code = localStorage.getItem("sbCode");

    if (!code) {
        alert("Dura Register godhi!");
        return;
    }

    navigator.clipboard.writeText(code)
        .then(() => alert("Code copied!"))
        .catch(() => alert("Code copy gochuu hin dandeenye."));
}

function showAccountInfo() {
    document.getElementById("accountName").textContent =
        localStorage.getItem("sbName") || "-";

    document.getElementById("accountPhone").textContent =
        localStorage.getItem("sbPhone") || "-";

    document.getElementById("accountCode").textContent =
        localStorage.getItem("sbCode") || "-";

    document.getElementById("accountPlay").textContent = playWallet;

    showPage("account");
}

const grid = document.getElementById("numbers");

for (let i = 1; i <= 600; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "number";

    btn.onclick = function () {
        selected = i;

        document.querySelectorAll(".number").forEach(n => {
            n.classList.remove("selected");
        });

        btn.classList.add("selected");
    };

    grid.appendChild(btn);
}

const stakeInput = document.getElementById("stakeInput");

stakeInput.addEventListener("change", function () {
    stake = Number(stakeInput.value);

    if (stake < 1 || !Number.isInteger(stake)) {
        stake = 10;
        stakeInput.value = 10;
        alert("Stake sirrii galchi!");
    }
});

function playGame() {
    if (selected === null) {
        alert("Dura lakkoofsa filadhu!");
        return;
    }

    if (playWallet < stake) {
        alert("Play Wallet kee gahaa miti!");
        return;
    }

    playWallet -= stake;

    const winningNumber = Math.floor(Math.random() * 600) + 1;

    if (selected === winningNumber) {
        playWallet += stake * 5;
        document.getElementById("result").textContent =
            "Congratulations! You matched " + winningNumber;
    } else {
        document.getElementById("result").textContent =
            "Number drawn: " + winningNumber +
            ". Your number: " + selected;
    }

    document.getElementById("play").textContent = playWallet;
    document.getElementById("accountPlay").textContent = playWallet;
}
const params = new URLSearchParams(window.location.search);

if (params.get("page") === "game") {
    showGame();
}

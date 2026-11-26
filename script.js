let selected = null;

let mainWallet = Number(localStorage.getItem("sbMainWallet"));
let playWallet = Number(localStorage.getItem("sbPlayWallet"));

if (!localStorage.getItem("sbMainWallet")) {
    mainWallet = 1000;
}

if (!localStorage.getItem("sbPlayWallet")) {
    playWallet = 100;
}

let stake = 10;

function saveWallets() {
    localStorage.setItem("sbMainWallet", mainWallet);
    localStorage.setItem("sbPlayWallet", playWallet);
}

document.getElementById("main").textContent = mainWallet;
document.getElementById("play").textContent = playWallet;
function addTransaction(type, details) {
    let history = JSON.parse(
        localStorage.getItem("sbTransactions") || "[]"
    );

    history.unshift({
        type: type,
        details: details,
        date: new Date().toLocaleString()
    });

    localStorage.setItem(
        "sbTransactions",
        JSON.stringify(history)
    );
}

function showTransactionHistory() {
    const box = document.getElementById("transactionHistory");

    let history = JSON.parse(
        localStorage.getItem("sbTransactions") || "[]"
    );

    box.innerHTML = "";

    if (history.length === 0) {
        box.textContent = "No transactions yet.";
        return;
    }

    history.forEach(item => {
        const p = document.createElement("p");

        p.textContent =
            item.date + " - " + item.type + ": " + item.details;

        box.appendChild(p);
    });
}
function transferToPlay() {
    const amount = Number(
        document.getElementById("transferAmount").value
    );

    if (!Number.isInteger(amount) || amount < 1) {
        alert("Qarshii sirrii galchi!");
        return;
    }

    if (amount > mainWallet) {
        alert("Main Wallet kee gahaa miti!");
        return;
    }

    mainWallet -= amount;
    playWallet += amount;
    saveWallets();

    document.getElementById("main").textContent = mainWallet;
    document.getElementById("play").textContent = playWallet;
    document.getElementById("accountPlay").textContent = playWallet;
    addTransaction(
    "TRANSFER",
    amount + " points moved to Play Wallet"
);

    alert("Transfer successful!");
}

const pages = ["menu", "register", "account", "balance", "history", "game"];

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

    let code = localStorage.getItem("sbCode");

    if (!code) {
        code = "SB" + Math.floor(100000 + Math.random() * 900000);
    }

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

    showPage("account");
}

function showBalance() {
    document.getElementById("balanceMain").textContent = mainWallet;
    document.getElementById("balancePlay").textContent = playWallet;

    document.getElementById("balanceCoin").textContent =
        localStorage.getItem("sbCoin") || 0;

    showPage("balance");
}

function showHistory() {
    showTransactionHistory();
    showPage("history");
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

    const playPart = Math.min(playWallet, stake);
    const mainPart = stake - playPart;

    if (mainWallet < mainPart) {
        alert("Wallet kee keessatti qarshiin gahaan hin jiru!");
        return;
    }

    playWallet -= playPart;
    mainWallet -= mainPart;

    const winningNumber = Math.floor(Math.random() * 600) + 1;

    if (selected === winningNumber) {
        const prize = stake * 5;
        mainWallet += prize;

        document.getElementById("result").textContent =
            "Congratulations! You won " + prize +
            "! Number: " + winningNumber;
    } else {
        document.getElementById("result").textContent =
            "Number drawn: " + winningNumber +
            ". Your number: " + selected;
            addTransaction(
        "GAME",
        "Stake: " + stake +
        " points | " +
        (selected === winningNumber
            ? "WON! Prize: " + (stake * 5) + " points"
            : "LOST | Number drawn: " + winningNumber)
    );
    }

    document.getElementById("main").textContent = mainWallet;
    document.getElementById("play").textContent = playWallet;
    saveWallets();
    document.getElementById("accountPlay").textContent = playWallet;
}
const params = new URLSearchParams(window.location.search);

if (params.get("page") === "game") {
    showGame();
} else {
    const savedName = localStorage.getItem("sbName");
    const savedPhone = localStorage.getItem("sbPhone");

    if (savedName && savedPhone) {
        showMenu();
    } else {
        showRegister();
    }
}

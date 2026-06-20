const operators = ["+", "-", "*", "/", "%"];

const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");
const themeBtn = document.getElementById("theme-toggle");
const copyBtn = document.getElementById("copy-btn");

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.innerText;

        if(value === "C") display.value = "";

        else if(value === "⌫") display.value = display.value.slice(0,-1);

        else if(value === "="){
            calculate();
        }

        else if(value === ".") {
            const parts = display.value.split(/[\+\-\*\/%]/);

            const currentNumber = parts[parts.length - 1];

            if (currentNumber.includes(".")) {
                return;
            }
        }
        
        else{
            const lastChar =
                display.value[display.value.length - 1];

            if (
                operators.includes(value) &&
                operators.includes(lastChar)
            ) {
                return;
            }

            display.value += value;
        } 
    });
});

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if("0123456789./+-*".includes(key)) display.value += key;

    else if(key === "Escape") display.value = "";

    else if(key === "Backspace") display.value = display.value.slice(0,-1);

    else if(key === "Enter"){
        calculate();
    }

});

let history = JSON.parse(localStorage.getItem("history")) || [];

function renderHistory() {
    historyList.innerHTML = "";

    history.forEach((item) => {
        const li = document.createElement("li");
        li.innerText = item;
        historyList.appendChild(li);
    });

    clearHistoryBtn.style.display = 
        history.length === 0
            ? "none"
            : "block";

    historyList.scrollTop = historyList.scrollHeight;
}

renderHistory();

historyList.scrollTop = historyList.scrollHeight;

clearHistoryBtn.addEventListener("click", () => {
    history = [];

    localStorage.removeItem("history");

    renderHistory();
});

function calculate() {
    try {
        const expression = display.value;
        const result = eval(display.value);

        display.value = result;

        history.push(`${expression} = ${result}`);

        localStorage.setItem(
            "history",
            JSON.stringify(history)
        );

        renderHistory();

        }

    catch(error) {
        display.value = "Error";
    }
};

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("light")
               ? "light"
               : "dark"
    );
});

const savedTheme = localStorage.getItem("theme");

if(savedTheme === "light"){
    document.body.classList.add("light");
}

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(display.value);

    copyBtn.innerText = "Copied!";

    setTimeout(() =>{
        copyBtn.innerText = "Copy";
    },1500);
});

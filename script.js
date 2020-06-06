const calcScreen = document.getElementById('calcScreen');
const nums = Array.from(document.querySelectorAll('.nums'));
const operators = Array.from(document.querySelectorAll('.operators'));
const equals = document.getElementById('equals');
const clear = document.getElementById('clear');
let newCalculation = true; //to reset calculator if press num after equals
let preventDoubleOperator = true; // allow switching of operators during calculation
let preventDoubleEquals = false; // prevent errors when pressing equals consecutively or before anything is input
let preventDivideByZero = false;
let memory = 0;
let operator;

nums.forEach(num => num.addEventListener('click', updateScreenNum));

operators.forEach(operator => operator.addEventListener('click', selectOperator));

equals.addEventListener('click', calculate);

clear.addEventListener('click', clearScreen);

function updateScreenNum() {
    if (newCalculation == false || preventDivideByZero == true) {
        console.log("cleared")
        clearScreen();
    }
    if (calcScreen.textContent.trim().length <= 9) {
        Number(calcScreen.textContent) == 0 ? calcScreen.textContent = this.textContent: 
                        calcScreen.textContent += this.textContent;
    }
    preventDoubleOperator = true;
    preventDoubleEquals = true;
}

function selectOperator() {
    if (preventDivideByZero == true) {
        console.log("reset")
        clearScreen();
    }
    if (preventDoubleOperator == true) {
        if (!operator == "") {
            calculate();
            console.log(`answer: ${memory}`)
        }
        preventDoubleEquals = true;
        newCalculation = true;
        memory = Number(calcScreen.textContent);
        operator = this.textContent.trim();
        calcScreen.textContent = "0";
        preventDoubleOperator = false;
    } else operator = this.textContent.trim();
}

function calculate() {
    if (preventDoubleEquals == true) {
        let newNum = Number(calcScreen.textContent);
        let answer;
        if (operator == "+") {
            answer = add(memory, newNum);
        } else if (operator == "-") {
            answer = subtract(memory, newNum);
        } else if (operator == "*") {
            answer = multiply(memory, newNum);
        } else if (operator == "/") {
            if (!newNum == 0) {
                answer = divide(memory, newNum);
                answer = Math.round(answer * 1000000000) / 1000000000; //keep decimal place to 9 decimal place
            } else {
                answer = "Don't do it!";
                preventDivideByZero = true;
            }
        }
        calcScreen.textContent = answer;
        memory = answer;
        operator = "";
        newCalculation = false;
        preventDoubleOperator = true;
        preventDoubleEquals = false;
    }
}

function clearScreen() {
    memory = 0;
    operator = "";
    calcScreen.textContent = memory;
    newCalculation = true;
    preventDoubleOperator = true;
    preventDoubleEquals = true;
    preventDivideByZero = false;
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(operator , a, b) {
    return operator(a , b);
}
const calcScreen = document.getElementById('calcScreen');
const nums = Array.from(document.querySelectorAll('.nums'));
const operators = Array.from(document.querySelectorAll('.operators'));
const equals = document.getElementById('equals');
const clear = document.getElementById('clear');
let newCalculation = true; //to reset calculator if press num after equals
let preventDoubleOperator = true; // allow switching of operators during calculation
let preventDoubleEquals = true; // prevent errors when pressing equals consecutively
let memory;
let operator;

nums.forEach(num => num.addEventListener('click', updateScreenNum));

operators.forEach(operator => operator.addEventListener('click', selectOperator));

equals.addEventListener('click', calculate);

clear.addEventListener('click', clearScreen);

function updateScreenNum() {
    if (newCalculation == false) {
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
    if (preventDoubleOperator == true) {
        if (!operator == "") {
            calculate();
            console.log(`answer: ${memory}`)
        }
        preventDoubleEquals = true;
        newCalculation = true;
        memory = Number(calcScreen.textContent);
        console.log(memory);
        operator = this.textContent.trim();
        calcScreen.textContent = "0";
        preventDoubleOperator = false;
    } else operator = this.textContent.trim();
}

function calculate() {
    if (preventDoubleEquals == true) {
        let newNum = Number(calcScreen.textContent);
        let answer;
        console.log(operator);
        if (operator == "+") {
            answer = add(memory, newNum);
        } else if (operator == "-") {
            answer = subtract(memory, newNum);
        } else if (operator == "*") {
            answer = multiply(memory, newNum);
        } else if (operator == "/") {
            answer = divide(memory, newNum);
            answer = Math.round(answer * 1000000000) / 1000000000; //keep decimal place to 9 decimal place
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
    calcScreen.textContent = memory
    newCalculation = true;
    preventDoubleOperator = true;
    preventDoubleEquals = true;
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
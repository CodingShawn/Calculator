const calcScreen = document.getElementById('calcScreen');
const nums = Array.from(document.querySelectorAll('.nums'));
const operators = Array.from(document.querySelectorAll('.operators'));
const equals = document.getElementById('equals');
const clear = document.getElementById('clear');
let newCalculation = true; //to reset calculator if press num after equals
let preventDoubleOperator = true; // allow switching of operators during calculation
let preventDoubleEquals = false; // prevent errors when pressing equals consecutively or before anything is input
let preventDivideByZero = false;
let orderOfOperation = false;
let secondOrderOfOperation = false;
let tempMemory = 0;
let tempOperator = "";
let resetDisplay = false;
let memory = 0;
let operator;

nums.forEach(num => num.addEventListener('click', updateScreenNum));

operators.forEach(operator => operator.addEventListener('click', selectOperator));

equals.addEventListener('click', () => secondOrderOfOperation = false);
equals.addEventListener('click', () => {
        if (!operator == "") { // prevent bug that happens when hit equals before selecting operator
            calculate();
        }
    })

clear.addEventListener('click', clearScreen);

function updateScreenNum() {
    if (resetDisplay == true) { 
        //to fix errors that occur when showing partially finished calculations after hitting + or - after 
        //order of operations
        calcScreen.textContent = 0;
        resetDisplay = false;
    }
    if (newCalculation == false || preventDivideByZero == true) {
        // allow calculations by resetting calc after trying to divide by 0
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
        clearScreen();
    }
    let newOperator = this.textContent.trim();    
    if (preventDoubleOperator == true) {
        if (orderOfOperation == true && ((newOperator == "*") || (newOperator == "/"))) {
            //to allow ongoing calculations to occur during order of operation calculations
            secondOrderOfOperation = true;
        } else if (secondOrderOfOperation == true && ((newOperator == "+") || (newOperator == "-"))) {
            //to complete order of operation calculations after + or - before continuing further calculations
            secondOrderOfOperation = false;
        }
        if ((operator == "+" || operator == "-") && (newOperator == "*" || newOperator == "/")) {
            //to store initial operator and num in memory for final calculation in order of operation calculation
            orderOfOperation = true;
            tempMemory = memory;
            tempOperator = operator;
        } else if (!operator == "") {
            //to carry out calculations behind the scenes before pressing equals
            calculate();
        }
        setOperator(newOperator);
    } else operator = newOperator; //allow changing of operators before pressing equals/numbers
}

function calculate() {   
    if (preventDoubleEquals == true) {
        let newNum = Number(calcScreen.textContent);     
        let answer = compute(memory, newNum, operator);   
        calcScreen.textContent = answer;
        memory = answer;
        operator = "";
        newCalculation = false;
        preventDoubleOperator = true;
        preventDoubleEquals = false;
    }
    if (orderOfOperation == true && secondOrderOfOperation == false) {
        //final calculation in order of operations sequence
        computeOrderOfOperations();
        orderOfOperation = false;
        console.log('final calc')
        calcScreen.textContent = answer;
        resetDisplay = true;
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
    orderOfOperation = false;
    secondOrderOfOperation = false;
    resetDisplay = false;
}

function setOperator(newOperator) {
    preventDoubleEquals = true;
    newCalculation = true;
    memory = Number(calcScreen.textContent);
    operator = newOperator;
    if (resetDisplay == false) {
        //this block allows partial calculations to be shown during order of operations after + or -
        calcScreen.textContent = "0";
    }
    preventDoubleOperator = false;
}

function compute(oldNum, newNum, operator) {
    console.log(`memory = ${oldNum}, newNum = ${newNum}, operator = ${operator}`);
    let answer;
    if (operator == "+") {
        answer = add(oldNum, newNum);
    } else if (operator == "-") {
        answer = subtract(oldNum, newNum);
    } else if (operator == "*") {
        answer = multiply(oldNum, newNum);
    } else if (operator == "/") {
        if (!newNum == 0) {
            answer = divide(oldNum, newNum);
            answer = Math.round(answer * 1000000000) / 1000000000; //keep decimal place to 9 decimal place
        } else {
            answer = "Don't do it!";
            preventDivideByZero = true;
        }
    }
    return answer;
}

function computeOrderOfOperations() {
    console.log("orderofoperations")
    answer = compute(tempMemory, memory, tempOperator);
    calcScreen.textContent = answer;
    memory = answer;
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
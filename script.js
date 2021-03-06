const calcScreen = document.getElementById('calcScreen');
const nums = Array.from(document.querySelectorAll('.nums'));
const operators = Array.from(document.querySelectorAll('.operators'));
const equals = document.getElementById('equals');
const clear = document.getElementById('clear');
const backspace = document.getElementById('backspace');

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

backspace.addEventListener('click', back);

equals.addEventListener('click', () => secondOrderOfOperation = false);
equals.addEventListener('click', () => {
        if (!operator == "") { // prevent bug that happens when hit equals before selecting operator
            calculate();
        }
    })

clear.addEventListener('click', clearScreen);

window.addEventListener('keydown', function(e) {
    switch(e.keyCode) {
        case 8:
            back();
            break;
        case 67:
            clearScreen();
            break;
        case 111:
            selectOperator(e.key);
            break;
        case 106:
            selectOperator(e.key);
            break;
        case 109:
            selectOperator(e.key);
            break;
        case 107:
            selectOperator(e.key);
            break;
        case 96:
            updateScreenNum(e.key);
            break;
        case 97:
            updateScreenNum(e.key);
            break;
        case 98:
            updateScreenNum(e.key);
            break;
        case 99:
            updateScreenNum(e.key);
            break;
        case 100:
            updateScreenNum(e.key);
            break;
        case 101:
            updateScreenNum(e.key);
            break;
        case 102:
            updateScreenNum(e.key);
            break;
        case 103:
            updateScreenNum(e.key);
            break;
        case 104:
            updateScreenNum(e.key);
            break;
        case 105:
            updateScreenNum(e.key);
            break;
        case 110:
            updateScreenNum(e.key);
            break;
        case 13:
            calculate();
            break;
    }
}

)


function updateScreenNum(input) {
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
        if (typeof(input) == "object") {
            Number(calcScreen.textContent) == 0 ? calcScreen.textContent = this.textContent: 
                            calcScreen.textContent += this.textContent;
        } else {
            console.log('test')
            Number(calcScreen.textContent) == 0 ? calcScreen.textContent = input: 
                            calcScreen.textContent += input;
        }
    }
    if (calcScreen.textContent.indexOf(".") !== calcScreen.textContent.lastIndexOf(".")) {
        //To check if multiple decimal points input
        calcScreen.textContent = calcScreen.textContent.slice(0, -1);
    }
    preventDoubleOperator = true;
    preventDoubleEquals = true;
}

function selectOperator(input) {
    console.log(input)
    if (preventDivideByZero == true) {
        clearScreen();
    }
    let newOperator;
    try {
        newOperator = this.textContent.trim();  
    }  catch {
        newOperator = input;
    }
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
        answer = Math.round(answer * 1000000000) / 1000000000
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

function back() {
    console.log(resetDisplay)
    if (!((calcScreen.textContent.trim() == "0") || (resetDisplay == true))) {
        calcScreen.textContent = calcScreen.textContent.trim().slice(0, -1);
    }
    if (calcScreen.textContent == "") {
        calcScreen.textContent = "0";
    }
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
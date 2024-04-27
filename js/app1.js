// First we have to create our variables
//variables
const form = document.querySelector("#agregar-gasto");
const expenseListed = document.querySelector("#gastos ul");



// Second of all we have to create our loadEventListener to load our functions

loadEventListeners2();
function loadEventListeners2() {
    // we need to ask for budget to know what is the user budget when document is loaded
    document.addEventListener('DOMContentLoaded', askBudget)

    // Now we already have our values in DOM, so we can add a new expense to our list
    form.addEventListener("submit", addNewExpense);
}


// Here we have to create our classes
// we're going to create two classes to handle data these are UI and Budget
class Budget { 
    // in this class we have 3 attributes that are reamining, budget and array expense to save expenses
    constructor(budget) { 
        // we have to turn theses strings to number
        this.budget = Number(budget);
        this.remaining = Number(budget);
        // we need to save expenses that is why we create an array to save them here
        this.expenses = [];
    }


    // when we already have the expense we can create a method that allows to add to array
    
    newExpense(expense) {
        // we need to make a copy of the expense paramatter to add it to expenses array with spread operator
        this.expenses = [...this.expenses, expense];
        console.log(this.expenses);


        // now here, we need to call this.calculateRemaining when we already create a new element
        this.calculateRemaining();
    }

    calculateRemaining() { 
        // now, we can calculate remaining to show it in the interface
        // 1. we need to use reduce to calculate total value
        const expensed = this.expenses.reduce((total, expense) => total + expense.amount, 0);
        console.log(expensed);
        // finally, when already have total value we can make the operation to know what is the remaining value
        this.remaining = this.budget - expensed;
    }


    // if we want to remove certain element we can use this function
    removeExpense(id) { 
        // we have to filter the expenses by id
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        this.calculateRemaining();
    }
   
}

class UI {
    // we don't need to use a constructor here because we're not going to initialize attributes

    // insertBudget after initialize values, this functions is going to take 2 parametters
    insertBudget(amount) { 
        // we have to extract value with destructuring
        const {budget, remaining} = amount;

        // Now we have to add to HTML and validate data and then show it
        if(isNaN(budget) || isNaN(remaining)) { 
            console.log("it's NaN")
            // Here we have to define content but this content is empty because it's not validatle for us
            document.querySelector("#total").textContent = '';
            document.querySelector("#restante").textContent = '';
        }else { 
            // In this case we can show data
            document.querySelector("#total").textContent = budget;
             document.querySelector("#restante").textContent = remaining;
        }
    }


    // we're gonna create our printAlert method that helps us to show error and succeed messages
    printAlert(message, type) { 
        // we must create a div to store data 
        const divMessage = document.createElement('div');
        // we have to add some classes 
        divMessage.classList.add('text-center', 'alert');
        
        // now we validate type of result 
        if(type === 'error') { 
            divMessage.classList.add("alert-danger");
        } else { 
            divMessage.classList.add("alert-success");
        }

        // we have to define the message
        divMessage.textContent = message;

        //we have to add this message to HTML(DOM), so we must insert into .primario container 
        document.querySelector(".primario").insertBefore(divMessage, form);
        
        // after that we need to remove message from DOM, so we're gonna use setTimeOut to do it

        setTimeout(() => { 
            // actions here after 3miliseconds
            divMessage.remove();
        },3000)
    }

    // if we already have our expense array we can add to expense listed to show it
    addExpenseListed(expenses) { 
        
        // here we have to cleanHTML 
        this.cleanHTML();
        // we already have our array so we must iterate it to show data
        expenses.forEach(expense => {
            // we're going to do a destructuring to retrieve data
            const { budget, amount, id } = expense;

            // after this, we need to create html elements to show it dynamiclly
            let newExpenseLi = document.createElement("li");
            // add some classes for style
            newExpenseLi.className =
                "list-group-item d-flex justify-content-between align-items-center";

            // here, we have to set up a cumston id if we want to remove an item
            // if we want to create a cumston attribute we have to add data at the beggining to indicate this
            newExpenseLi.setAttribute("data-id", id);


            // In this step we have to add this newExpense to HTML
            newExpenseLi.innerHTML = `${budget} <span class="bagde badge-primary badge-pill">$ ${amount}</span>`;
            
            // After this we have to create the remove button to remove certain element
            const removeBtn = document.createElement("button");
            removeBtn.classList.add("btn", "btn-danger", "borrar-gasto");
            removeBtn.innerHTML = "Remove &times";


            // In this step we already have remove button, so we have to add the funcionalaty 
            // we need to save an arrow function within onclick event to execute the event when we click it out
            removeBtn.onclick = () => { 
                // we call remove function to remove it, pass it id as a paramatter
                removeExpenseFunction(id);
            }

            // now we have to add it to newExpensLi
            newExpenseLi.appendChild(removeBtn);
            // when we already have these elements we can add them to main content to show them
            expenseListed.appendChild(newExpenseLi);

        })
    }


    cleanHTML() { 
        // we need to create our function to remove previous HTML
        while(expenseListed.firstChild) { 
            // when container expenses have childs is gonna keep removing until there isn't exist anything
            expenseListed.removeChild(expenseListed.firstChild);
        }
    }


    // here, we have to create our function to update remaining in the UI
    updateRemaining(remaining) { 
        document.querySelector("#restante").textContent = remaining;
    }

    // now, we already have the remaining value while we're adding new values this is going to less
    
    verifyBudget(budgetObj) { 
        // first of all, we have to do destructuring
        const {budget, remaining} = budgetObj;

        // now we're going to know what are theses value 
        console.log("VerifyBudgetd: "+budget);
        console.log("VerifyRemaining: "+remaining);

        // 1. we have to create a div to select remaining to change classes despending of validations
        const remainingDiv = document.querySelector(".restante");

        // 2. Validations for remaining and budged

        // -> we must divide this by 4 because it means that our budget is around 25% 
        // -> if budget is greater than remaining that means we've spent more that our expected budget
        if((budget / 4) > remaining) { 
            // -> we have to add and remove certain classes
            // -> we must remove alert-success because this is going to turn into red. 
            remainingDiv.classList.remove('alert-success', 'alert-warning');
            remainingDiv.classList.add('alert-danger');

        // -> we need to divide the budget by 2 because that means that our budget is around 50% 
        // -> if budget is greater than remaining, we've almost spent 50% of our budget
        }else if((budget / 2) > remaining) {
            // -> we must remove alert-success because this is going to turn into yellow.
            remainingDiv.classList.remove("alert-danger", "alert-warning");
            remainingDiv.classList.add("alert-warning");
        }else { 
            // but if we haven't spent anything we can put success because this is the last one validation
            remainingDiv.classList.remove("alert-danger", "alert-warning");
            remainingDiv.classList.add("alert-success");
        }
    
        // 3. Take out button if this is equal or lesser than 0

    }
}


// we have to instance our objects globally

let budgetObj;
let ui = new UI();

function askBudget() { 
    // we have to storage user budget in a variable
    const budget = prompt("What's your budget ? ");

    // we have to valide if this value is ok with 3 different forms 
    if(budget === "" || budget<=0 || isNaN(budget)) { 
        // we need to reload the window again because this is not validate for us
        window.location.reload();
    }else { 
        // we have this message when the value is a number
        console.log("its working");
        console.log(Number(budget));
    }

    // Now, we already have a right value to initialize object attributes
    budgetObj = new Budget(budget);
    console.log(budgetObj);

    // After that, we have to insert remaining value to DOM that is why we have to use UI object 
    // and besides we have to pass it budgetObj to get value
    ui.insertBudget(budgetObj);
}


function addNewExpense(e) { 


    // we have to prevent the default behavior to add new data
    e.preventDefault();

    // we must retrieve information from form
    const budget = document.querySelector("#gasto").value;
    const amount = Number(document.querySelector("#cantidad").value);


    // now we have to validate data from form
    if(budget === '' || amount === '' ) { 
        // if this data isn't validate we have to print a message saying isn't ok with an UI object
        ui.printAlert("Both fields are necessary", "error");
    // besides we have to validate that data is not empty and it's not a number
    }else if(amount <= 0 || isNaN(amount)) {
        // if this data isn't validate we have to print a message saying isn't ok with an UI object
        ui.printAlert("Amount isn't validate", "error");
    }


    console.log("All validations passed, so we can inser data");

    // we can create our object literal for expenses
    const expense = {budget, amount, id: Date.now()} // This is a new way to write our object without passing values to keys this is known as object literal enhancement

    // now we can add our new expense to array to show it because we already have the object data
    budgetObj.newExpense(expense);

    // if we don't have any error we can put a succeed message
    ui.printAlert("Expense added successfully");


    // after, we add a new expense we have to make a destructuring to retrieve attributes to use them 
    const {expenses, remaining} = budgetObj;

    // we add the new expense to a list to show it in the interface
    // but the most important thing we keep in mind is when we add a new expense we have to calculate the remaining value again
    ui.addExpenseListed(expenses);


    // when we already have the expenses list we can subtract remaining value
    ui.updateRemaining(remaining);


    // Now depending of the amount we can change color to show that amount is lesser that other or this is in the middle
    // That's why we have to create a function to change colors
    ui.verifyBudget(budgetObj);

    // at the end, when we validate our values we can reset the form when this is sent
    form.reset(); 
}



// Function to remove expenses when user want to remove them
// This function is going to receive id we want to remove it
function removeExpenseFunction(id) { 
    
    // we have to call the budget method that allow us to do this
    budgetObj.removeExpense(id);
    
    // steps to set up values again when we take out them from expense List
    // 1. we have to do destructuring to retrieve data from object
    
    const {expenses, remaining} = budgetObj;

    // 2. we must call our function to add new items to DOM
    ui.addExpenseListed(expenses);
    

    // 3. after that, we must updateRemaining because user removed an item from expense list
    
    ui.updateRemaining(remaining);

    // 4. finally, we must verifyBudget to change colors in the interface depending the budget and remaining
    
    ui.verifyBudget(budgetObj);
}



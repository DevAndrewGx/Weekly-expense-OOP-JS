// Variables and references to selectors

const form = document.querySelector("#agregar-gasto");
const expenseListed = document.querySelector("#gastos ul");

// Events - When we do click or when document is ready
loadEventListeners();
function loadEventListeners() {
    document.addEventListener("DOMContentLoaded", askBudget);

    form.addEventListener("submit", addExpense);
}
// Classes
class Budget  {
    constructor(budget) {
        this.budget = Number(budget);
        this.remaining = Number(budget);
        this.expenses = [];
    }

    newExpense(gasto) { 
        // we save data here in this array - we copy original array and then we copy with the information
        this.expenses = [...this.expenses, gasto];
        // put it here because it has to be set up when we create a new expense
        this.calculateRemaining();
    }

    
    // we've got to create a function to calculate remaining and subtract it 
    calculateRemaining() { 
        // reduce is useful because it helps us to calculate stuff within arrays in general it helps to reduce a total value
        const expensed = this.expenses.reduce((total, expense) => total + expense.amount, 0);
        console.log(expensed);
        // Now we have to calculate our reamining 
        this.remaining = this.budget - expensed;
        // console.log(this.remaining);
    }

    removeExpense(id) { 
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        this.calculateRemaining();
    } 
}

class UI {
    insertBudget(amount) {
        // extract values
        const { budget, remaining } = amount;

        // add to HTML
        if (isNaN(budget) || isNaN(remaining)) {
            console.log("its defently NaN");
            document.querySelector("#total").textContent = "";
            document.querySelector("#restante").textContent = "";
        } else {
            document.querySelector("#total").textContent = budget;
            document.querySelector("#restante").textContent = remaining;
        }
    }

    printAlert(message, type) {
        // crate div
        const divMessage = document.createElement("div");
        divMessage.classList.add("text-center", "alert");

        if (type === "error") {
            divMessage.classList.add("alert-danger");
        } else {
            divMessage.classList.add("alert-success");
        }

        // Error message
        divMessage.textContent = message;

        // Insert into HTML
        document.querySelector(".primario").insertBefore(divMessage, form);

        setTimeout(() => {
            divMessage.remove();
        }, 3000);
    }

    addExpenseListed(expenses) { 

        // cleanHtml 
        this.cleanHTML();
        // we're going to iterate over array
        expenses.forEach(expense => {
            const { name, amount, id } = expense;

            // we're going to create a li

            const newExpense = document.createElement("li");
            newExpense.className =
                "list-group-item d-flex justify-content-between align-items-center";
            // if we want to create a cumston attribute we have to add data at the beggining to indicate this
            newExpense.setAttribute("data-id", id);

            // console.log(newExpense);
            // Add expense HTML
            newExpense.innerHTML = `${name} <span class="badge badge-primary badge-pill">$ ${amount} </span>`; 
            // Button to remove expense
            const btnRemove = document.createElement("button");
            btnRemove.classList.add("btn", "btn-danger", "borrar-gasto");
            btnRemove.innerHTML = "Remove &times";
            btnRemove.onclick = () => {
                removeExpense(id);
            };
            newExpense.appendChild(btnRemove);            
            expenseListed.appendChild(newExpense);
        });
    }

    cleanHTML() { 
        while(expenseListed.firstChild) { 
            expenseListed.removeChild(expenseListed.firstChild);
        }
    }

    updateRemaining(remaining) { 
        document.querySelector("#restante").textContent = remaining;
    }

    verifyBudget(ObjBudget) { 
        const {budget, remaining} = ObjBudget;
       

        const  remainingDiv = document.querySelector('.restante');
        // if 25% of budget is greater than remaining
        if((budget / 4) > remaining) {
            remainingDiv.classList.remove('alert-success', 'alert-warning');
            remainingDiv.classList.add("alert-danger");
        }else if((budget / 2) > remaining) { 
            remainingDiv.classList.remove("alert-success");
            remainingDiv.classList.add("alert-warning"); 
        }else { 
            remainingDiv.classList.remove('alert-danger', 'alert-warning');
            remainingDiv.classList.add('alert-success');
        }
        // if total is equal to cero 
        if (remaining <= 0) {
            ui.printAlert('Budget has beed wasted :(', 'error');
            form.querySelector('button[type="submit"]').disabled = true;
        }else { 
            form.querySelector('button[type="submit"]').disabled = false;
        }
    }
}
// Instances
const ui = new UI();
let budget;
// Functions

function askBudget() {
    // we have to ask the budget with prompt
    const budgetUser = prompt("Cual es tu presupuesto: ");
    console.log(Number(budgetUser));

    if (
        budgetUser === "" ||
        budgetUser === null ||
        isNaN(budgetUser) ||
        budgetUser <= 0
    ) {
        window.location.reload();
    }

    budget = new Budget(budgetUser);
    console.log(budget);

    ui.insertBudget(budget);
}

function addExpense(e) {
    e.preventDefault();

    // read data from form

    const name = document.querySelector("#gasto").value;
    const amount = Number(document.querySelector("#cantidad").value);

    if (name === "" || amount === "") {
        ui.printAlert("Both fields are necessary", "error");
        return; //put return to not run the following lines
    } else if (amount <= 0 || isNaN(amount)) {
        ui.printAlert("Amount no validate", "error");
        return;
    }
    // console.log("Adding expense");

    // Generate an expense object
    const expense = { name, amount, id: Date.now() }; //-> object literal this a new enhancement in js

    // Add a new expense
    budget.newExpense(expense);
    // successfully message when we add a new expense
    ui.printAlert("Expense added successfully");

    // destructuring
    const { expenses, remaining } = budget;

    // print expenses
    ui.addExpenseListed(expenses);

    ui.updateRemaining(remaining);

    ui.verifyBudget(budget);

    // reset form
    form.reset();
}


function removeExpense(id) {
    budget.removeExpense(id);
    const {expenses,remaining} = budget;
    ui.addExpenseListed(expenses);

    ui.updateRemaining(remaining);

    ui.verifyBudget(budget);
 }
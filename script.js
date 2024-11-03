function calculate() {
    let principal = document.getElementById("principal").value;
    let rate = document.getElementById("rate").value;
    let time = document.getElementById("time").value;
    let result = principal * (1 + (rate / 100) * time);
    
    document.getElementById("result").innerText = "Future Value: $" + result.toFixed(2);
}

function formatGoalName(name) {
    return name.replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function formatMoney(amount) {
    return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

let goals = []; 

function addGoal() {
    const name = document.getElementById("goal-name").value;
    const targetAmount = parseFloat(document.getElementById("goal-amount").value);

    if (!name || isNaN(targetAmount) || targetAmount <= 0) {
        alert("Please enter a valid goal name and amount.");
        return;
    }

    const newGoal = {
        id: Date.now(),
        name: formatGoalName(name),
        targetAmount: targetAmount,
        savedAmount: 0
    };

    goals.push(newGoal);
    displayGoals();

    document.getElementById("goal-name").value = "";
    document.getElementById("goal-amount").value = "";
}

function displayGoals() {
    const container = document.getElementById("goals-container");
    container.innerHTML = "";

    goals.forEach(goal => {
        const goalElement = document.createElement("div");
        goalElement.className = "goal";

        if (goal.editing) {
            goalElement.innerHTML = `
                <input type="text" id="edit-name-${goal.id}" value="${goal.name}" />
                <input type="number" id="edit-amount-${goal.id}" value="${goal.targetAmount}" step="0.01" />
                <button onclick="saveGoal(${goal.id})">Save</button>
                <button onclick="cancelEdit(${goal.id})">Cancel</button>
            `;
        } else {
            goalElement.innerHTML = `
                <h3>${goal.name}</h3>
                <p>Saved: ${formatMoney(goal.savedAmount)} out of ${formatMoney(goal.targetAmount)}</p>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${Math.min((goal.savedAmount / goal.targetAmount) * 100, 100)}%"></div>
                </div>
                <input type="number" id="amount-${goal.id}" placeholder="Enter amount to add" step="0.01" />
                <button onclick="addAmount(${goal.id})">Add Amount</button>
                <button onclick="editGoal(${goal.id})">Edit</button>
                <button onclick="deleteGoal(${goal.id})">Delete</button> <!-- Delete Button -->
            `;
        }

        container.appendChild(goalElement);
    });
}

function addAmount(id) {
    const amountInput = document.getElementById(`amount-${id}`).value;
    const amount = parseFloat(amountInput);

    const goal = goals.find(g => g.id === id);

    if (!goal || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    document.getElementById("add-to-goal-sound").play();

    goal.savedAmount += amount;
    document.getElementById(`amount-${id}`).value = "";

    if (goal.savedAmount >= goal.targetAmount) {
        document.getElementById("goal-sound").play(); 
        createConfetti(); 
    }

    displayGoals(); 
}

function createConfetti() {
    const confettiContainer = document.getElementById("confetti-container");

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

        confettiContainer.appendChild(confetti);

        confetti.addEventListener("animationend", () => {
            confetti.remove();
        });
    }
}

function editGoal(id) {
    const goal = goals.find(g => g.id === id);
    goal.editing = true;
    displayGoals();
}

function saveGoal(id) {
    const goal = goals.find(g => g.id === id);
    const newName = document.getElementById(`edit-name-${id}`).value;
    const newAmount = parseFloat(document.getElementById(`edit-amount-${id}`).value);

    if (!newName || isNaN(newAmount) || newAmount <= 0) {
        alert("Please enter a valid goal name and amount.");
        return;
    }

    goal.name = formatGoalName(newName);
    goal.targetAmount = newAmount;
    goal.editing = false;
    displayGoals();
}

function cancelEdit(id) {
    const goal = goals.find(g => g.id === id);
    goal.editing = false;
    displayGoals();
}

function deleteGoal(id) {
    const confirmed = confirm("Are you sure you want to delete this goal? This action cannot be undone.");

    if (confirmed) {
        goals = goals.filter(goal => goal.id !== id); // Remove the goal by filtering it out
        displayGoals(); // Refresh the displayed goals
    }
}


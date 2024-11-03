let goals = [];

document.addEventListener("DOMContentLoaded", () => {
    loadGoals();
    displayGoals();
});

function saveGoals() {
    localStorage.setItem("goals", JSON.stringify(goals));
}

function loadGoals() {
    const storedGoals = localStorage.getItem("goals");
    if (storedGoals) {
        goals = JSON.parse(storedGoals);
    }
}

function formatGoalName(name) {
    return name.replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function formatMoney(amount) {
    return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

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
        savedAmount: 0,
        isCompleted: false,
        isArchived: false,
        isEditing: false
    };

    goals.push(newGoal);
    saveGoals();
    displayGoals();

    document.getElementById("goal-name").value = "";
    document.getElementById("goal-amount").value = "";
}

function displayGoals() {
    const container = document.getElementById("goals-container");
    container.innerHTML = "";

    const activeGoals = goals.filter(goal => !goal.isCompleted && !goal.isArchived);
    const completedGoals = goals.filter(goal => goal.isCompleted && !goal.isArchived);
    const archivedGoals = goals.filter(goal => goal.isArchived);

    const sortedGoals = [...activeGoals, ...completedGoals];

    sortedGoals.forEach(goal => {
        const goalElement = document.createElement("div");
        goalElement.className = "goal" + (goal.isCompleted ? " grayed-out" : "");

        if (goal.isEditing) {
            goalElement.innerHTML = `
                <input type="text" id="edit-name-${goal.id}" value="${goal.name}" />
                <input type="number" id="edit-target-${goal.id}" value="${goal.targetAmount}" step="0.01" />
                <button onclick="saveEdit(${goal.id})">Save</button>
                <button onclick="cancelEdit(${goal.id})">Cancel</button>
            `;
        } else if (goal.isCompleted) {
            goalElement.innerHTML = `
                <h3>${goal.name}</h3>
                <p>Completed: ${formatMoney(goal.savedAmount)} out of ${formatMoney(goal.targetAmount)}</p>
                <button class="delete-archived" onclick="deleteArchivedGoal(${goal.id})">Delete</button>
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
                <button onclick="deleteGoal(${goal.id})">Delete</button>
            `;
        }

        container.appendChild(goalElement);
    });

    if (archivedGoals.length > 0) {
        const archivedContainer = document.createElement("div");
        archivedContainer.className = "archived-section";
        archivedContainer.innerHTML = `<h3 style="text-align: center;">Archived Goals</h3>`;

        archivedGoals.forEach(goal => {
            const archivedGoalElement = document.createElement("div");
            archivedGoalElement.className = "goal grayed-out";
            archivedGoalElement.innerHTML = `
                <h3>${goal.name}</h3>
                <p>Completed: ${formatMoney(goal.savedAmount)} out of ${formatMoney(goal.targetAmount)}</p>
                <button class="delete-archived" onclick="deleteArchivedGoal(${goal.id})">Delete</button>
            `;
            archivedContainer.appendChild(archivedGoalElement);
        });

        container.appendChild(archivedContainer);
    }
}

function editGoal(id) {
    const goal = goals.find(g => g.id === id);
    goal.isEditing = true;
    displayGoals();
}

function saveEdit(id) {
    const goal = goals.find(g => g.id === id);
    const newName = document.getElementById(`edit-name-${id}`).value;
    const newTarget = parseFloat(document.getElementById(`edit-target-${id}`).value);

    if (!newName || isNaN(newTarget) || newTarget <= 0) {
        alert("Please enter a valid goal name and amount.");
        return;
    }

    goal.name = formatGoalName(newName);
    goal.targetAmount = newTarget;
    goal.isEditing = false;

    saveGoals();
    displayGoals();
}

function cancelEdit(id) {
    const goal = goals.find(g => g.id === id);
    goal.isEditing = false;
    displayGoals();
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
        goal.isCompleted = true;
        goal.isArchived = true;
        document.getElementById("goal-sound").play();
        createConfetti();
    }

    saveGoals();
    displayGoals();
}

function deleteGoal(id) {
    const confirmed = confirm("Are you sure you want to delete this goal? This action cannot be undone.");
    if (confirmed) {
        goals = goals.filter(goal => goal.id !== id);
        saveGoals();
        displayGoals();
    }
}

function deleteArchivedGoal(id) {
    const confirmed = confirm("Are you sure you want to delete this archived goal?");
    if (confirmed) {
        goals = goals.filter(goal => goal.id !== id || !goal.isArchived);
        saveGoals();
        displayGoals();
    }
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

function filterGoals() {
    displayGoals();
}

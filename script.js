// Home page js
function calculate() {
    let principal = document.getElementById("principal").value;
    let rate = document.getElementById("rate").value;
    let time = document.getElementById("time").value;
    let result = principal * (1 + (rate / 100) * time);
    
    document.getElementById("result").innerText = "Future Value: $" + result.toFixed(2);
}

// Goal Tracker js

let goals = []; 

// Function to add a new goal
function addGoal() {
    const name = document.getElementById("goal-name").value;
    const targetAmount = parseInt(document.getElementById("goal-amount").value);

    if (!name || isNaN(targetAmount) || targetAmount <= 0) {
        alert("Please enter a valid goal name and amount.");
        return;
    }

    const newGoal = {
        id: Date.now(), \
        name: name,
        targetAmount: targetAmount,
        savedAmount: 0
    };

    goals.push(newGoal);
    displayGoals();

    document.getElementById("goal-name").value = "";
    document.getElementById("goal-amount").value = "";
}

// Function to display all goals
function displayGoals() {
    const container = document.getElementById("goals-container");
    container.innerHTML = ""; // Clear existing content

    goals.forEach(goal => {
        // Create a new goal element
        const goalElement = document.createElement("div");
        goalElement.className = "goal";
        
        goalElement.innerHTML = `
            <h3>${goal.name}</h3>
            <p>Saved: $${goal.savedAmount} out of $${goal.targetAmount}</p>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${Math.min((goal.savedAmount / goal.targetAmount) * 100, 100)}%"></div>
            </div>
            <input type="number" placeholder="Enter amount to add" oninput="updateGoal(${goal.id}, this.value)" />
            <button onclick="addAmount(${goal.id})">Add Amount</button>
        `;

        container.appendChild(goalElement);
    });
}

// Function to add a specified amount to a goal by ID
function addAmount(id) {
    const amountInput = document.querySelector(`input[oninput="updateGoal(${id}, this.value)"]`).value;
    const amount = parseInt(amountInput);

    const goal = goals.find(g => g.id === id);

    if (!goal || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    document.getElementById("add-to-goal-sound").play();

    goal.savedAmount += amount;
    document.querySelector(`input[oninput="updateGoal(${id}, this.value)"]`).value = ""; 

    if (goal.savedAmount >= goal.targetAmount) {
        document.getElementById("goal-sound").play(); 
        createConfetti(); 
    }

    displayGoals(); 
}

// Confetti Code
// Function to create confetti pieces
function createConfetti() {
    const confettiContainer = document.getElementById("confetti-container");

    // Generate multiple confetti pieces
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

        confettiContainer.appendChild(confetti);

        // Remove confetti after animation completes
        confetti.addEventListener("animationend", () => {
            confetti.remove();
        });
    }
}
function calculate() {
    let principal = document.getElementById("principal").value;
    let rate = document.getElementById("rate").value;
    let time = document.getElementById("time").value;
    let result = principal * (1 + (rate / 100) * time);
    
    document.getElementById("result").innerText = "Future Value: $" + result.toFixed(2);
}

// Goal Tracker js

let goal = 0;
let savedAmount = 0;

// Milestone code
let milestonesReached = {
    quarter: false,
    third: false,
    half: false,
    threeQuarters: false,
    goal: false
};

function setGoal() {
    let goalInput = document.getElementById("goal").value;
    goal = parseInt(goalInput);

    if (isNaN(goal) || goal <= 0) {
        alert("Please enter a valid goal amount.");
        return;
    }

    document.getElementById("goal-text").innerText = `Goal: $${goal}`;
    document.getElementById("progress-text").innerText = `Progress: $${savedAmount} / $${goal}`;
    document.getElementById("progress-bar").style.width = "0%";
    savedAmount = 0;
    
    // Reset milestone tracking
    milestonesReached = {
        quarter: false,
        third: false,
        half: false,
        threeQuarters: false,
        goal: false
    };
}

function updateProgress() {
    if (goal <= 0) {
        alert("Please set a goal amount first.");
        return;
    }

    let amountInput = document.getElementById("amount").value;
    let amount = parseInt(amountInput);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    savedAmount += amount;
    if (savedAmount > goal) {
        savedAmount = goal;
    }

    let progressPercentage = (savedAmount / goal) * 100;
    document.getElementById("progress-bar").style.width = progressPercentage + "%";
    document.getElementById("progress-text").innerText = `Progress: $${savedAmount} / $${goal}`;

    checkMilestones();

    document.getElementById("amount").value = ""; // Clear the input field
}

function checkMilestones() {
    if (savedAmount >= goal && !milestonesReached.goal) {
        document.getElementById("goal-sound").play();
        createConfetti();
        milestonesReached.goal = true;
    } else if (savedAmount >= 0.75 * goal && !milestonesReached.threeQuarters) {
        document.getElementById("three-quarters-sound").play();
        milestonesReached.threeQuarters = true;
    } else if (savedAmount >= 0.5 * goal && !milestonesReached.half) {
        document.getElementById("half-sound").play();
        milestonesReached.half = true;
    } else if (savedAmount >= 0.333 * goal && !milestonesReached.third) {
        document.getElementById("third-sound").play();
        milestonesReached.third = true;
    } else if (savedAmount >= 0.25 * goal && !milestonesReached.quarter) {
        document.getElementById("quarter-sound").play();
        milestonesReached.quarter = true;
    }
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


function calculate() {
    let principal = document.getElementById("principal").value;
    let rate = document.getElementById("rate").value;
    let time = document.getElementById("time").value;
    let result = principal * (1 + (rate / 100) * time);
    
    document.getElementById("result").innerText = "Future Value: $" + result.toFixed(2);
}

document.getElementById("panicBtn").addEventListener("click", () => {
    alert("Emergency Alert Sent!");
    // Send location & alert to backend
});
document.getElementById("panicBtn").addEventListener("click", async () => {
    const response = await fetch("http://localhost:5000/panic-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Emergency Alert Activated!" })
    });
    const data = await response.json();
    alert(data.message);
});

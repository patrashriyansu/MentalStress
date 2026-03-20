async function checkStress() {
    let text = document.getElementById("msg").value;

    let res = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
    });

    let data = await res.json();
    document.getElementById("result").innerText = data.result;
    document.getElementById("result").style.color =
        data.result === "Stressed" ? "red" : "lime";
}

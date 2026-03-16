async function loginUser() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })

    });

    const data = await response.json();

    if (response.ok) {

        localStorage.setItem("token", data.token);

        alert("Login successful");

        window.location.href = "dashboard.html";

    } else {

        alert(data.message);

    }

}

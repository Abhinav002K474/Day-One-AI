async function signupUser() {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const userClass = document.getElementById("class").value;

    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name,
            email,
            password,
            class: userClass
        })

    });

    const data = await response.json();

    if (response.ok) {

        alert("Signup successful");
        window.location.href = "login.html";

    } else {

        alert(data.message);

    }

}

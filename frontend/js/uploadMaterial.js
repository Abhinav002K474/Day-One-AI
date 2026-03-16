async function uploadMaterial() {

    const fileInput = document.getElementById("file");
    const file = fileInput.files[0];
    const subject = document.getElementById("subject").value;
    const userClass = document.getElementById("class").value;

    if (!file || !subject || !userClass) {
        alert("Please select a file and fill all fields");
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Authentication lost. Please login again.");
        window.location.href = "login.html";
        return;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("subject", subject);
    formData.append("class", userClass);

    try {
        const btn = document.querySelector("button[onclick='uploadMaterial()']");
        btn.innerText = "Uploading...";

        // Note: The backend for students currently does not support uploads.
        // We attempt the endpoint but handle failures gracefully.
        const response = await fetch(`${API_BASE_URL}/api/upload/study-material`, {

            method: "POST",

            headers: {
                "Authorization": `Bearer ${token}`
            },

            body: formData

        });

        if (response.status === 404) {
            alert("Feature currently unavailable (Endpoint specific to students not found).");
            btn.innerText = "Upload";
            return;
        }

        const result = await response.json();

        if (response.ok) {
            alert(result.message || "Upload complete");
        } else {
            alert(result.message || "Upload failed");
        }

    } catch (error) {
        console.error("Error uploading material:", error);
        alert("Error uploading material");
    } finally {
        const btn = document.querySelector("button[onclick='uploadMaterial()']");
        if (btn) btn.innerText = "Upload";
    }

}

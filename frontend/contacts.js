document.addEventListener("DOMContentLoaded", async () => {
    const contactsList = document.getElementById("contactsList");

    try {
        const response = await fetch("http://localhost:5000/contacts");
        const contacts = await response.json();

        contactsList.innerHTML = contacts.map(contact => `
            <li>${contact.name} - ${contact.phone}</li>
        `).join("");
    } catch (error) {
        console.error("Error fetching contacts:", error);
    }
});

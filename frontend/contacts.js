document.addEventListener("DOMContentLoaded", async () => {
    const contactsList = document.getElementById("contactsList");
    const contactForm = document.getElementById("contactForm");

    // Fetch and display contacts
    async function loadContacts() {
        try {
            const response = await fetch("http://localhost:5000/contacts");
            const contacts = await response.json();

            contactsList.innerHTML = contacts.map(contact => `
                <li>${contact.name} - ${contact.phone}</li>
            `).join("");
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    }

    loadContacts(); // Load contacts when page loads

    // Handle contact form submission
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;

        try {
            const response = await fetch("http://localhost:5000/add-contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone })
            });

            const data = await response.json();
            alert(data.message);
            loadContacts(); // Reload contact list
            contactForm.reset(); // Clear form
        } catch (error) {
            console.error("Error adding contact:", error);
        }
    });
});


const form = document.getElementById("serviceForm");
const message = document.getElementById("formMessage");

form.addEventListener("submit", function(e){
    e.preventDefault();

    const company = document.getElementById("company").value.trim();
    const contact = document.getElementById("contactPerson").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const service = document.getElementById("serviceType").value;
    const details = document.getElementById("details").value.trim();

    if(!company || !contact || !phone || !email || !service || !details){
        message.style.color = "red";
        message.textContent = "Please fill all fields correctly.";
        return;
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if(!email.match(emailPattern)){
        message.style.color = "red";
        message.textContent = "Invalid email format.";
        return;
    }

    message.style.color = "green";
    message.textContent = "Service request submitted successfully! We will contact you shortly.";
    form.reset();
});
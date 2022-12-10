const toasterContainer = document.getElementById("toaster");
const toasterMessage = document.getElementById("toaster-message");


function toaster(status, header, message) {
    toasterContainer.classList.remove("translate-y-2", "opacity-0", "sm:translate-y-0", "sm:translate-x-2");
    toasterContainer.classList.add("transform", "ease-out", "duration-300", "transition", "translate-y-0", "opacity-100", "sm:translate-x-0");

    toasterMessage.innerHTML = `
                <p class="
                text-sm font-medium text-gray-900
                ${status === "success" ? "text-green-500" : ""}
                ${status === "error" ? "text-red-500" : ""}
                ">${header}!</p>
                <p class="mt-1 text-sm text-gray-500">${message}.</p>
            `;
}

export {toaster};

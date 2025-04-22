export function loadCategoryCard() {
    fetch('../components/category-card.html')
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load category card");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("category-card").innerHTML = data;
        })
        .catch(error => {
            console.error("Error loading category card:", error);
        });
} 
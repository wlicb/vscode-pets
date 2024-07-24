export function showBadge() {
    const badge = document.getElementById("badge");
    if (badge) {
            
        badge.style.display = "block";
    }
}

export function hideBadge() {
    const badge = document.getElementById("badge");
    if (badge) {
            
        badge.style.display = "none";
    }
}
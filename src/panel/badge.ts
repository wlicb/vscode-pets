import { getBadgeStatus, unlockBadge } from "./main";

export function showBadge(badges: boolean[]) {
    console.log(badges);
    const badge = document.getElementById("badge");
    if (badge) {
        badge.style.display = "block";
        setNotificationBadge(-1);
        for (var i = 0; i < badges.length; i++) {
            const foreground = document.getElementsByClassName("badge-mask")[i] as HTMLElement;
            // console.log(foreground);
            if (foreground) {
                if (badges[i]) {
                    foreground.style.display = 'none';
                } else {
                    foreground.style.display = 'block';
                }
            }
        }
        // console.log(badges);
        
    }
}

export function hideBadge() {
    const badge = document.getElementById("badge");
    if (badge) {
            
        badge.style.display = "none";
    }
}

export function unlock(idx: number) {
    if (getBadgeStatus(idx)) {
        return;
    }
    unlockBadge(idx);
    const badge = document.getElementById("badge");
    if (badge && badge.style.display !== "none") {
        const foreground = document.getElementsByClassName("badge-mask")[idx] as HTMLElement;
        if (foreground) {
            foreground.style.display = 'none';
        }
    }
    setNotificationBadge(1);
    
}

function setNotificationBadge(val: number) {
    console.log("Setting badge: ", val);
    const badgePanel = document.getElementById("badge");
    if (badgePanel && window.getComputedStyle(badgePanel).display !== "none") {
        const badge = document.getElementById("achievement-badge");
        if (badge) {
            badge.innerHTML = "0";
            badge.style.display = "none";
            console.log("Hiding badge");
        }
    } else {
        const badge = document.getElementById("achievement-badge");
        if (badge) {
            if (val > 0) {
                const preVal = badge.innerHTML ? parseInt(badge.innerHTML) : 0;
                badge.innerHTML = (preVal + val).toString();
                badge.style.display = "flex";
                console.log("Showing badge");
            } else {
                badge.innerHTML = "0";
                badge.style.display = "none";
                console.log("Hiding badge");
            }
        }
    }
}
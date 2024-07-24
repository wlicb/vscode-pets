import { unlockBadge } from "./main";

export function showBadge(badges: boolean[]) {
    console.log(badges);
    const badge = document.getElementById("badge");
    if (badge) {
        badge.style.display = "block";
        for (var i = 0; i < badges.length; i++) {
            const foreground = document.getElementsByClassName("badge-mask")[i] as HTMLElement;
            console.log(foreground);
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
    unlockBadge(idx);
    const badge = document.getElementById("badge");
    if (badge && badge.style.display === "block") {
        const foreground = document.getElementsByClassName("badge-mask")[idx] as HTMLElement;
        if (foreground) {
            foreground.style.display = 'none';
        }
    }
}
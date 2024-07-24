import { unlockBadge } from "./main";

export function showBadge(badges: boolean[]) {
    const badge = document.getElementById("badge");
    if (badge) {
        badge.style.display = "block";
        for (var i = 0; i < badges.length; i++) {
            if (badges[i]) {
                (badge.children[1].children[i] as HTMLElement).style.display = "block";
            } else {
                (badge.children[1].children[i] as HTMLElement).style.display = "none";
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
        (badge.children[1].children[idx] as HTMLElement).style.display = "block";
    }
}
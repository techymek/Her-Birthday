// --- RESPONSIVE TOUCH & CURSOR LOGIC ---
function updateCupid(x, y) {
    const cupid = document.getElementById("cupid-img");
    if (cupid) {
        cupid.style.left = (x + 15) + "px";
        cupid.style.top = (y + 15) + "px";
    }
}

document.addEventListener("touchmove", function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    mouse.x = touch.clientX;
    mouse.y = touch.clientY;
    updateSword();
    updateCupid(mouse.x, mouse.y); 

    const element = document.elementFromPoint(mouse.x, mouse.y);
    
    // Handle Game Slicing
    if(element && element.classList.contains('toss-item') && !element.hit) {
        element.hit = true; 
        element.sliceHandler();
    }
    
    // Handle Cake Slicing
    if(!isGameOver && !document.getElementById("stage2").classList.contains("hidden")) {
        checkHit();
    }
}, { passive: false });

// --- MAIN LOGIC ---
window.onload = function() {
    const rainContainer = document.getElementById('rainBox');
    for(let i=0; i<45; i++) {
        const span = document.createElement('span');
        span.innerText = "14 Feb"; span.className = "rain-text";
        span.style.left = Math.random() * 100 + 'vw';
        span.style.animationDuration = (Math.random() * 3 + 4) + 's'; 
        span.style.fontSize = (Math.random() * 12 + 12) + 'px';
        rainContainer.appendChild(span);
    }

    let load = 0;
    const txt = document.getElementById('loadingText');
    const interval = setInterval(() => {
        load++; document.getElementById('fillBar').style.width = load + "%";
        if(load < 25) txt.innerText = "Preparing surprise for Mannu... 🎁";
        else if(load < 50) txt.innerText = "Adding extra love & kisses... 💋";
        else if(load < 80) txt.innerText = "Bas thoda sa aur baby... 🤏";
        else txt.innerText = "Ye lo aapka gift! ❤️";
        if(load >= 100) { clearInterval(interval); document.getElementById('loaderBox').style.display = 'none'; document.getElementById('startBtn').style.display = 'inline-block'; }
    }, 45);
};

function triggerIntro() {
    // --- 1. SILENT AUDIO UNLOCK (FIXED) ---
    // We strictly mute and set volume to 0 BEFORE playing to prevent the "explosion" of sound.
    const silentUnlockList = [
        'letterMusic', 'sliceSound', 'yaySound', 'sadSound', 
        'afterCakeSound', 'heartSound', 'chaloSound', 
        'tugayaSound', 'bounceSound', 'sadIndianSound'
    ];

    silentUnlockList.forEach(id => { 
        const el = document.getElementById(id); 
        if(el) {
            el.volume = 0; // Double safety: Volume 0
            el.muted = true; // Triple safety: Muted
            
            // Play briefly to unlock the audio engine on mobile
            el.play().then(() => { 
                el.pause(); 
                el.currentTime = 0; 
                
                // Only restore volume after a safe delay
                setTimeout(() => {
                    el.volume = 1;
                    el.muted = false;
                }, 500); 
            }).catch(e => console.log("Audio unlock skipped for:", id)); 
        }
    });

    // --- 2. PLAY BGM ---
    const bgm = document.getElementById('cuteMusic');
    if(bgm) {
        bgm.volume = 0.3; 
        bgm.play().catch(e => console.log("BGM play failed"));
    }

    // --- 3. START VISUALS ---
    document.getElementById('startScreen').style.display = 'none';
    const scene = document.getElementById('introScene');
    scene.style.display = 'flex';

    const vText = document.getElementById('valentineText');
    const bText = document.getElementById('birthdayText');
    const flash = document.getElementById('impactFlash');
    const bounce = document.getElementById('bounceSound');

    setTimeout(() => { vText.classList.add('pop-in'); }, 300);

    setTimeout(() => {
        bText.classList.add('crash-in');
        setTimeout(() => {
            // Unmute bounce specifically for this moment
            bounce.volume = 1; 
            bounce.muted = false; 
            bounce.play().catch(e => {}); 
            
            scene.classList.add('screen-shake');
            flash.classList.add('flash-now');
            vText.classList.add('knockout');
        }, 300); 

        setTimeout(() => { document.getElementById('letsGoBtn').style.display = 'block'; }, 1500);
    }, 1500);
}

function startMainExperience() {
    const bounce = document.getElementById('bounceSound');
    bounce.pause(); bounce.currentTime = 0;

    const bgm = document.getElementById('cuteMusic');
    bgm.volume = 0.2; bgm.play();
    document.getElementById('introScene').style.display = 'none';
    document.getElementById('stage1').classList.remove('hidden');
}

let mouse = { x:0, y:0, lx:0, ly:0 };
let slices = 19;
let letterScore = 0;
const targetScore = 19;
let isGameOver = false;
let stopGame = false;

document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    updateSword();
    updateCupid(mouse.x, mouse.y); 

    let speed = Math.sqrt(Math.pow(mouse.x - mouse.lx, 2) + Math.pow(mouse.y - mouse.ly, 2));
    if (speed > 15) {
        createSlash(mouse.x, mouse.y);
        if(!isGameOver && !document.getElementById("stage2").classList.contains("hidden")) checkHit();
    }
    mouse.lx = mouse.x; mouse.ly = mouse.y;
});

function updateSword() {
    const sword = document.getElementById("sword");
    sword.style.left = mouse.x + "px"; sword.style.top = mouse.y + "px";
}

function createSlash(x, y) {
    const s = document.createElement("div"); s.className = "slash";
    s.style.left = x + "px"; s.style.top = y + "px";
    s.style.transform = `translate(-50%, -50%) rotate(${Math.atan2(y - mouse.ly, x - mouse.lx) * 180 / Math.PI}deg)`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 400);
}

function toStage2() { document.getElementById("yaySound").play(); document.getElementById("stage1").classList.add("hidden"); document.getElementById("noBtn").style.display = "none"; document.getElementById("stage2").classList.remove("hidden"); }

document.getElementById("noBtn").addEventListener('mouseover', function() {
    const btn = this; document.getElementById("sadSound").currentTime = 0; document.getElementById("sadSound").play();
    if (btn.parentNode.id !== 'body') { document.body.appendChild(btn); }
    btn.style.position = "fixed"; btn.style.left = Math.random() * 80 + "vw"; btn.style.top = Math.random() * 80 + "vh";
});

function checkHit() {
    if(slices <= 0) return; 
    const rect = document.getElementById("cake").getBoundingClientRect();
    if(mouse.x > rect.left && mouse.x < rect.right && mouse.y > rect.top && mouse.y < rect.bottom) {
        if(Date.now() - (window.lh || 0) > 150) {
            slices--; 
            if (slices < 0) slices = 0;
            document.getElementById("counter").innerText = `Slices left: ${slices}`;
            const s = document.getElementById("sliceSound"); s.currentTime = 0; s.play();
            if(slices === 0) { document.getElementById("afterCakeSound").play(); document.getElementById("cake").src = "sliced cake.png"; document.getElementById("cakeChoices").classList.remove("hidden"); }
            window.lh = Date.now();
        }
    }
}

function eatSelf() { 
    document.getElementById("guiltPopup").classList.remove("hidden"); 
    document.getElementById("cuteMusic").pause();
    document.getElementById("sadIndianSound").play();
}

function showDimpu() { 
    document.getElementById("sadIndianSound").pause();
    document.getElementById("sadIndianSound").currentTime = 0;
    document.getElementById("cuteMusic").play();
    document.getElementById("stage2").classList.add("hidden"); 
    document.getElementById("guiltPopup").classList.add("hidden"); 
    document.getElementById("dimpuStage").classList.remove("hidden"); 
}

function checkYear() {
    const val = document.getElementById("adiYear").value;
    const img = document.getElementById("dimpuImg");
    const tugaya = document.getElementById("tugayaSound");
    if(val === "2004") { tugaya.pause(); tugaya.currentTime = 0; document.getElementById("chaloSound").play(); img.src = "dimpu2.png"; setTimeout(() => { img.style.transform = "translateY(100vh) rotate(20deg)"; }, 2000); setTimeout(() => { triggerRealBlackout(); }, 3000); }
    else { tugaya.currentTime = 0; tugaya.play(); img.src = "dimpuangry.png"; alert("Wrong year! Try again 😼"); }
}

function triggerRealBlackout() { isGameOver = true; document.getElementById("dimpuStage").classList.add("hidden"); document.getElementById("blackout").style.display = "block"; setTimeout(() => document.getElementById("blackout").style.opacity = "1", 100); setTimeout(() => { document.getElementById("beatingHeart").style.display = "block"; document.getElementById("heartSound").play(); }, 3000); }

document.getElementById("beatingHeart").onclick = function() { document.getElementById("heartSound").pause(); this.style.display = "none"; document.getElementById("blackout").style.display = "none"; document.getElementById("glassOverlay").style.display = "block"; document.getElementById("rulesPopup").classList.remove("hidden"); };

function startFinalGame() {
    document.getElementById("rulesPopup").classList.add("hidden");
    document.getElementById("progressWrapper").style.display = "block";
    document.getElementById("gameHUD").classList.remove("hidden");
    document.getElementById("gameHUD").style.display = "flex";
    
    const bgm = document.getElementById("cuteMusic"); bgm.pause();
    document.getElementById("letterMusic").play();
    startFruitNinja();
}

// --- ZOOM LOGIC ---
function startFruitNinja() {
    const loveWords = ["I love you baby", "Mannu is always right", "Adi Mannu Forever!", "Happy Birthday Baby!", "Meri Mannu Birthday!", "Adi+Mannu", "Mannu Ko Inna Sara Love you","Meri Puchku","wow mannu","Kya baat hai baby"];
    const spawnItem = () => {
        if (stopGame) return;
        const item = document.createElement("img");
        const isBomb = Math.random() > 0.7; 
        const type = isBomb ? (Math.random() > 0.5 ? "dal.png" : "roti.png") : "letter.png";
        item.src = type; item.className = "toss-item";
        const size = isBomb ? (Math.random() * 60 + 80) : (Math.random() * 100 + 150); 
        item.style.width = size + "px";
        item.style.left = Math.random() * 80 + 10 + "vw";
        const peak = 40 + Math.random() * 40 + "vh";
        item.style.setProperty('--peakHeight', peak);
        const drift = (Math.random() - 0.5) * 300 + "px";
        item.style.transform = `translateX(${drift})`;
        const duration = 2 + Math.random();
        item.style.animation = `tossUp ${duration}s ease-in-out forwards`;

        // Define behavior
        item.sliceHandler = function() {
            if (stopGame) return;
            if (isBomb) { 
                letterScore = 0; updateHUD();
                const bad = document.getElementById("tugayaSound"); bad.currentTime = 0; bad.play(); 
                const flash = document.getElementById("redFlash"); flash.style.opacity = "0.6"; setTimeout(() => flash.style.opacity = "0", 200); 
                item.remove(); 
            } else { 
                letterScore++; 
                document.getElementById("scoreCounter").innerText = letterScore;
                document.getElementById("barFill").style.width = Math.min((letterScore/targetScore)*100, 100) + "%";
                
                const good = document.getElementById("sliceSound"); good.currentTime = 0; good.play(); 

                // --- CHECK IF 19TH LETTER ---
                if (letterScore >= targetScore) {
                    stopGame = true; // Stop spawns
                    
                    // 1. Freeze animation
                    item.style.animation = 'none';
                    
                    // 2. Center & Zoom BIG
                    item.style.transition = "all 2.5s cubic-bezier(0.25, 1, 0.5, 1)";
                    item.style.position = "fixed";
                    item.style.left = "50%";
                    item.style.top = "50%";
                    item.style.zIndex = "10000";
                    // Force transform next tick
                    requestAnimationFrame(() => {
                        item.style.transform = "translate(-50%, -50%) scale(15) rotate(20deg)";
                        item.style.opacity = "0"; // Fade out during zoom
                    });

                    // 3. Trigger Finale after zoom finishes
                    setTimeout(() => {
                        document.querySelectorAll('.toss-item').forEach(el => el.remove());
                        document.getElementById("gameHUD").style.display = "none"; 
                        document.getElementById("progressWrapper").style.opacity = "0"; 
                        document.getElementById("cupid-img").style.display = "none"; 
                        document.getElementById("cupidFinale").style.display = "flex";
                    }, 2500);
                    
                } else {
                    // Normal behavior
                    showFloatingText(item.getBoundingClientRect().left, item.getBoundingClientRect().top, loveWords); 
                    item.remove(); 
                }
            }
        };

        // Mouse interaction
        item.onmouseover = function() {
            if(!this.hit) { this.hit = true; this.sliceHandler(); }
        };

        document.body.appendChild(item);
        setTimeout(() => { if(item.parentNode) item.remove(); }, duration * 1000 + 100);
        if (!stopGame) setTimeout(spawnItem, Math.random() * 600 + 300); 
    };
    spawnItem();
}

function showFloatingText(x, y, words) {
    const txt = document.createElement("div"); txt.className = "love-pop";
    txt.innerText = words[Math.floor(Math.random() * words.length)];
    txt.style.left = x + "px"; txt.style.top = y + "px";
    document.body.appendChild(txt); setTimeout(() => txt.remove(), 3000);
}

function updateHUD() {
    document.getElementById("scoreCounter").innerText = letterScore;
    const pct = (letterScore / targetScore) * 100;
    document.getElementById("barFill").style.width = Math.min(pct, 100) + "%";
}

function showFinalWhiteScreen() {
    const whiteScreen = document.getElementById("whiteScreen");
    whiteScreen.style.opacity = "1";
    whiteScreen.style.pointerEvents = "auto";
    
    // 1. Fade In Red Text
    setTimeout(() => {
        document.getElementById("finalRedText").style.opacity = "1";
        document.getElementById("finaleLoadingBox").style.opacity = "1";
        
        // 2. Start Bar Animation (takes 5s)
        document.getElementById("finaleBar").style.width = "100%";
    }, 500);

    // 3. Fade Out Red Text & Bar after 5.5s
    setTimeout(() => {
        document.getElementById("finalRedText").style.opacity = "0";
        document.getElementById("finaleLoadingBox").style.opacity = "0";
    }, 5500); 

    // 4. Fade In Bye Text after 6.5s
    setTimeout(() => {
        document.getElementById("byeText").style.opacity = "1";
    }, 6500); 
}

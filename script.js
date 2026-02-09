// --- 1. GLOBAL VARIABLES ---
let mouse = { x: 0, y: 0, lx: 0, ly: 0 };
let slices = 19;
let letterScore = 0;
const targetScore = 19;
let isGameOver = false;
let stopGame = false;
let audioUnlocked = false;
let currentDayIndex = 0;

// Data for the Flashback Sequence
const flashbackData = [
    { 
        date: "7 Feb", title: "Rose Day 🌹", image: "rose.png", theme: "theme-rose",
        msg: "Mujhe pata hai pehle wala rose tumse kahi kho gaya… chalo koi baat nahi ye lo cutie kya tumko mera rose pasand aaya?",
        btn: "Accept karogi? 🌹"
    },
    { 
        date: "8 Feb", title: "Propose Day 💍", image: "propose.png", theme: "theme-propose",
        msg: "MAññU, sirf iss janam me nahi kya har janam me tum meri bano gi? I love you sooo much ❤️",
        btn: "Yes, I Accept! 💍"
    },
    { 
        date: "9 Feb", title: "Chocolate Day 🍫", image: "kitkat.png", theme: "theme-chocolate",
        msg: "Babyjaan, Isme se na aap ek chocolate lelo… Jo bhi apko chahiye. Fir dono khayenge sath me",
        btn: "", 
        special: "chocolate"
    },
    { 
        date: "10 Feb", title: "Teddy Day 🧸", image: "teddy.png", theme: "theme-teddy",
        msg: "Baby Jaldi se apna bada sa teddy bear pakdo… isko bohot mehnat se laya hi apke liye abhi abhi abhi chahiye tha na apko.. ye lo",
        btn: "Teddy Lelo! 🧸"
    },
    { 
        date: "11 Feb", title: "Promise Day 🤞", image: "promise.png", theme: "theme-promise",
        msg: "MAññU cutie kya aap mere hamesa sath rehne wale promise ko accept karogi?",
        btn: "Pinky Promise! 🤞"
    },
    { 
        date: "12 Feb", title: "Hug Day 🫂", image: "hug.png", theme: "theme-hug",
        msg: "Babe kya aap mera pyara sa side hug accept karoge? Ya fir tight wala hug",
        btn: "", 
        special: "hug"
    },
    { 
        date: "13 Feb", title: "Kiss Day 💋", image: "kiss.png", theme: "theme-kiss",
        msg: "Kya abhi abhi abhi hum ek aise kissi kar sakte hai?",
        btn: "Muah! 💋"
    },
    { 
        date: "14 Feb", title: "Valentine's Day ❤️", image: "valentine.png", theme: "theme-valentine",
        msg: "Mannu, sirf 2026 me nahi.. kya tum har saal aur saalon saal.. meri valentine banogi? For ever and forever ♾️",
        btn: "Yes Forever! ❤️"
    }
];

// --- 2. RESPONSIVE TOUCH & AUDIO LOGIC ---
function updateCupid(x, y) {
    const cupid = document.getElementById("cupid-img");
    if (cupid) {
        cupid.style.left = (x + 15) + "px";
        cupid.style.top = (y + 15) + "px";
    }
}

function unlockRestOfAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    const sfx = [
        'sliceSound', 'yaySound', 'sadSound', 'sadIndianSound',
        'afterCakeSound', 'heartSound', 'chaloSound', 'tugayaSound',
        'letterMusic', 'glassSound'
    ];
    sfx.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.muted = true;
            el.play().then(() => {
                el.pause(); el.currentTime = 0; el.muted = false;
            }).catch(e => { });
        }
    });
    // Remove listeners
    document.removeEventListener("touchstart", unlockRestOfAudio);
    document.removeEventListener("mousemove", unlockRestOfAudio);
    document.removeEventListener("click", unlockRestOfAudio);
}
document.addEventListener("touchstart", unlockRestOfAudio);
document.addEventListener("mousemove", unlockRestOfAudio);
document.addEventListener("click", unlockRestOfAudio);


// --- 3. MOVEMENT & SLICING ---
document.addEventListener("touchmove", function (e) {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
}, { passive: false });

document.addEventListener("mousemove", (e) => {
    handleMove(e.clientX, e.clientY);
});

function handleMove(x, y) {
    const dx = x - mouse.lx;
    const dy = y - mouse.ly;
    mouse.x = x;
    mouse.y = y;
    updateSword();
    updateCupid(mouse.x, mouse.y);

    let speed = Math.sqrt(dx * dx + dy * dy);
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;

    if (speed > 10) {
        createSlash(mouse.x, mouse.y, angle);
        let steps = speed / 10;
        for (let i = 0; i < steps; i++) {
            let lerpX = mouse.lx + (mouse.x - mouse.lx) * (i / steps);
            let lerpY = mouse.ly + (mouse.y - mouse.ly) * (i / steps);
            createSlash(lerpX, lerpY, angle);
        }
        if (!isGameOver && !document.getElementById("stage2").classList.contains("hidden")) {
            checkHit();
        }
    }

    const element = document.elementFromPoint(mouse.x, mouse.y);
    if (element && element.classList.contains('toss-item') && !element.hit) {
        element.hit = true;
        element.sliceHandler();
    }
    mouse.lx = mouse.x;
    mouse.ly = mouse.y;
}

function updateSword() {
    const sword = document.getElementById("sword");
    sword.style.left = mouse.x + "px";
    sword.style.top = mouse.y + "px";
}

function createSlash(x, y, angle) {
    const s = document.createElement("div");
    s.className = "slash";
    s.style.left = x + "px";
    s.style.top = y + "px";
    s.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 300);
}

// --- 4. GAME FLOW & START ---
window.onload = function () {
    const rainContainer = document.getElementById('rainBox');
    for (let i = 0; i < 45; i++) {
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
        if (load < 25) txt.innerText = "Preparing surprise for Mannu... 🎁";
        else if (load < 50) txt.innerText = "Adding extra love & kisses... 💋";
        else if (load < 80) txt.innerText = "Bas thoda sa aur baby... 🤏";
        else txt.innerText = "Ye lo aapka gift! ❤️";
        if (load >= 100) { 
            clearInterval(interval); 
            document.getElementById('loaderBox').style.display = 'none'; 
            document.getElementById('startBtn').style.display = 'inline-block'; 
        }
    }, 45);
};

// THIS IS THE FUNCTION THE BUTTON CALLS
function triggerIntro() {
    // 1. VISUALS FIRST (Guaranteed to run)
    document.getElementById('startScreen').style.display = 'none';
    const scene = document.getElementById('introScene');
    scene.style.display = 'flex';

    const vText = document.getElementById('valentineText');
    const bText = document.getElementById('birthdayText');
    const flash = document.getElementById('impactFlash');

    setTimeout(() => { vText.classList.add('pop-in'); }, 300);

    // 2. AUDIO SECOND (Might fail on some phones, but that's okay now)
    const bgm = document.getElementById('cuteMusic');
    if (bgm) { bgm.volume = 0.3; bgm.play().catch(e => console.log("BGM play failed")); }
    const bounce = document.getElementById('bounceSound');

    setTimeout(() => {
        bText.classList.add('crash-in');
        setTimeout(() => {
            if (bounce) bounce.play().catch(e => { });
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

// --- 5. STAGE TRANSITIONS ---
function toStage2() {
    document.getElementById("yaySound").play().catch(e => { });
    document.getElementById("stage1").classList.add("hidden");
    document.getElementById("noBtn").style.display = "none";
    document.getElementById("stage2").classList.remove("hidden");
}

document.getElementById("noBtn").addEventListener('mouseover', function () {
    const btn = this;
    const sad = document.getElementById("sadSound");
    sad.currentTime = 0; sad.play().catch(e => { });
    if (btn.parentNode.id !== 'body') { document.body.appendChild(btn); }
    btn.style.position = "fixed"; btn.style.left = Math.random() * 80 + "vw"; btn.style.top = Math.random() * 80 + "vh";
});

function checkHit() {
    if (slices <= 0) return;
    const rect = document.getElementById("cake").getBoundingClientRect();
    if (mouse.x > rect.left && mouse.x < rect.right && mouse.y > rect.top && mouse.y < rect.bottom) {
        if (Date.now() - (window.lh || 0) > 150) {
            slices--;
            if (slices < 0) slices = 0;
            document.getElementById("counter").innerText = `Slices left: ${slices}`;
            const s = document.getElementById("sliceSound");
            s.currentTime = 0; s.play().catch(e => { });
            if (slices === 0) {
                document.getElementById("afterCakeSound").play().catch(e => { });
                document.getElementById("cake").src = "sliced cake.png";
                document.getElementById("cakeChoices").classList.remove("hidden");
            }
            window.lh = Date.now();
        }
    }
}

function eatSelf() {
    document.getElementById("guiltPopup").classList.remove("hidden");
    document.getElementById("cuteMusic").pause();
    document.getElementById("sadIndianSound").play().catch(e => { });
}

function showDimpu() {
    const sad = document.getElementById("sadIndianSound");
    sad.pause(); sad.currentTime = 0;
    document.getElementById("cuteMusic").play();
    document.getElementById("stage2").classList.add("hidden");
    document.getElementById("guiltPopup").classList.add("hidden");
    document.getElementById("dimpuStage").classList.remove("hidden");
}

function checkYear() {
    const val = document.getElementById("adiYear").value;
    const img = document.getElementById("dimpuImg");
    const tugaya = document.getElementById("tugayaSound");
    if (val === "2004") {
        tugaya.pause(); tugaya.currentTime = 0;
        document.getElementById("chaloSound").play().catch(e => { });
        img.src = "dimpu2.png";
        setTimeout(() => { img.style.transform = "translateY(100vh) rotate(20deg)"; }, 2000);
        setTimeout(() => { triggerRealBlackout(); }, 3000);
    } else {
        tugaya.currentTime = 0; tugaya.play().catch(e => { });
        img.src = "dimpuangry.png";
        alert("Wrong year! Try again 😼");
    }
}

function triggerRealBlackout() {
    isGameOver = true;
    document.getElementById("dimpuStage").classList.add("hidden");
    document.getElementById("blackout").style.display = "block";
    setTimeout(() => document.getElementById("blackout").style.opacity = "1", 100);
    setTimeout(() => {
        document.getElementById("beatingHeart").style.display = "block";
        document.getElementById("heartSound").play().catch(e => { });
    }, 3000);
}

document.getElementById("beatingHeart").onclick = function () {
    document.getElementById("heartSound").pause();
    this.style.display = "none";
    document.getElementById("blackout").style.display = "none";
    document.getElementById("glassOverlay").style.display = "block";
    document.getElementById("rulesPopup").classList.remove("hidden");
};

function startFinalGame() {
    document.getElementById("rulesPopup").classList.add("hidden");
    document.getElementById("progressWrapper").style.display = "block";
    document.getElementById("gameHUD").classList.remove("hidden");
    document.getElementById("gameHUD").style.display = "flex";
    const bgm = document.getElementById("cuteMusic"); bgm.pause();
    document.getElementById("letterMusic").play().catch(e => { });
    startFruitNinja();
}

// --- 6. FRUIT NINJA LOGIC ---
function startFruitNinja() {
    const loveWords = ["I love you baby", "Mannu is always right", "Adi Mannu Forever!", "Happy Birthday Baby!", "Meri Mannu Birthday!", "Adi+Mannu", "Mannu Ko Inna Sara Love you", "Meri Puchku", "wow mannu", "Kya baat hai baby"];
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

        item.sliceHandler = function () {
            if (stopGame) return;
            if (isBomb) {
                letterScore = 0; updateHUD();
                const bad = document.getElementById("tugayaSound");
                bad.currentTime = 0; bad.play().catch(e => { });
                const flash = document.getElementById("redFlash"); flash.style.opacity = "0.6"; setTimeout(() => flash.style.opacity = "0", 200);
                item.remove();
            } else {
                letterScore++;
                document.getElementById("scoreCounter").innerText = letterScore;
                document.getElementById("barFill").style.width = Math.min((letterScore / targetScore) * 100, 100) + "%";
                const good = document.getElementById("sliceSound");
                good.currentTime = 0; good.play().catch(e => { });

                if (letterScore >= targetScore) {
                    stopGame = true;
                    item.style.animation = 'none';
                    item.style.transition = "all 2.5s cubic-bezier(0.25, 1, 0.5, 1)";
                    item.style.position = "fixed"; item.style.left = "50%"; item.style.top = "50%"; item.style.zIndex = "10000";
                    requestAnimationFrame(() => {
                        item.style.transform = "translate(-50%, -50%) scale(15) rotate(20deg)";
                        item.style.opacity = "0";
                    });
                    setTimeout(() => {
                        document.querySelectorAll('.toss-item').forEach(el => el.remove());
                        document.getElementById("gameHUD").style.display = "none";
                        document.getElementById("progressWrapper").style.opacity = "0";
                        document.getElementById("cupid-img").style.display = "none";
                        document.getElementById("cupidFinale").style.display = "flex";
                    }, 2500);
                } else {
                    showFloatingText(item.getBoundingClientRect().left, item.getBoundingClientRect().top, loveWords);
                    item.remove();
                }
            }
        };
        item.onmouseover = function () { if (!this.hit) { this.hit = true; this.sliceHandler(); } };
        document.body.appendChild(item);
        setTimeout(() => { if (item.parentNode) item.remove(); }, duration * 1000 + 100);
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

// --- 7. FLASHBACK SEQUENCE LOGIC (THE BIG FINALE) ---
function showFinalWhiteScreen() {
    const whiteScreen = document.getElementById("whiteScreen");
    whiteScreen.style.opacity = "1";
    whiteScreen.style.pointerEvents = "auto";
    
    // 1. Red Text & Bar
    setTimeout(() => {
        document.getElementById("finalRedText").style.opacity = "1";
        document.getElementById("finaleLoadingBox").style.opacity = "1";
        document.getElementById("finaleBar").style.width = "100%";
    }, 500);

    // 2. Fade Out Red Text
    setTimeout(() => {
        document.getElementById("finalRedText").style.opacity = "0";
        document.getElementById("finaleLoadingBox").style.opacity = "0";
    }, 5500); 

    // 3. START FLASHBACK
    setTimeout(() => {
        startFlashbackSequence();
    }, 6000);
}

function startFlashbackSequence() {
    // Initial Text
    const container = document.getElementById("flashbackContainer");
    const intro = document.createElement("div");
    intro.className = "flashback-text";
    intro.innerText = "Chalo thoda piche chalte hai...";
    intro.style.fontSize = "30px";
    intro.style.fontWeight = "bold";
    intro.style.opacity = "0";
    intro.style.animation = "fadeInOut 3s forwards";
    container.appendChild(intro);

    setTimeout(() => {
        intro.remove();
        renderDay(0);
    }, 3500);
}

function renderDay(index) {
    if (index >= flashbackData.length) {
        // End of sequence
        document.getElementById("flashbackContainer").innerHTML = "";
        document.body.className = ""; // Reset theme
        document.getElementById("byeText").style.opacity = "1";
        return;
    }

    const data = flashbackData[index];
    const container = document.getElementById("flashbackContainer");
    container.innerHTML = ""; // Clear previous

    // Set Theme
    document.body.className = data.theme; 

    // Create Card
    const card = document.createElement("div");
    card.className = "flashback-card";

    // Content
    let htmlContent = `
        <div class="fb-title">${data.title}</div>
        <div class="fb-msg">${data.msg}</div>
    `;

    // Special Logic for Chocolate
    if (data.special === "chocolate") {
        htmlContent += `
            <div id="prankContainer">
                <img src="kitkat.png" class="choco-item" id="kitkatBtn" style="left:20%; top:30%;">
                <img src="dairymilk.png" class="choco-item" id="dairyBtn" style="left:60%; top:30%;">
            </div>
            <div style="font-size:12px; color:#888;">Pick one!</div>
        `;
    } 
    // Special Logic for Hug
    else if (data.special === "hug") {
        htmlContent += `
            <img src="${data.image}" class="fb-image">
            <div style="display:flex; gap:10px; width:100%; justify-content:center;">
                <button class="fb-btn" id="sideHugBtn" style="background:#aaa;">Side Hug 😒</button>
                <button class="fb-btn" id="tightHugBtn">Tight Hug 🤗</button>
            </div>
        `;
    } 
    // Normal Days
    else {
        htmlContent += `
            <img src="${data.image}" class="fb-image">
            <button class="fb-btn" onclick="nextDay()">${data.btn}</button>
        `;
    }

    card.innerHTML = htmlContent;
    container.appendChild(card);

    // Initialize Special Mechanics
    if (data.special === "chocolate") {
        initChocolatePrank();
    } else if (data.special === "hug") {
        initHugMechanic();
    }
}

function nextDay() {
    document.getElementById("yaySound").currentTime = 0;
    document.getElementById("yaySound").play().catch(e=>{});
    currentDayIndex++;
    renderDay(currentDayIndex);
}

// --- CHOCOLATE PRANK LOGIC ---
function initChocolatePrank() {
    const dairy = document.getElementById("dairyBtn");
    const kitkat = document.getElementById("kitkatBtn");

    function moveDairy() {
        const container = document.getElementById("prankContainer");
        const maxX = container.clientWidth - 100;
        const maxY = container.clientHeight - 100;
        
        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;
        
        dairy.style.left = newX + "px";
        dairy.style.top = newY + "px";
    }

    dairy.addEventListener("mouseover", moveDairy);
    dairy.addEventListener("touchstart", (e) => { e.preventDefault(); moveDairy(); });
    
    kitkat.addEventListener("click", nextDay);
    kitkat.addEventListener("touchstart", nextDay);
}

// --- HUG MECHANIC (GLASS SHATTER) ---
function initHugMechanic() {
    const side = document.getElementById("sideHugBtn");
    const tight = document.getElementById("tightHugBtn");
    const glassCrack = document.getElementById("glassCrack");
    const glassSound = document.getElementById("glassSound") || document.getElementById("tugayaSound");

    side.addEventListener("click", () => {
        // BREAK SCREEN
        glassCrack.classList.add("cracked");
        glassSound.currentTime = 0;
        glassSound.play().catch(e=>{});
        alert("Ouch! Dil toot gaya 💔 Try again!");
    });

    tight.addEventListener("click", () => {
        // Fix Screen & Show Message
        glassCrack.classList.remove("cracked");
        
        // Show Special Popup
        const popup = document.createElement("div");
        popup.className = "special-popup";
        popup.innerHTML = "<h1>Love you sooo much babyyyyy maja aagya wow wow hug ❤️❤️❤️</h1>";
        document.body.appendChild(popup);

        document.getElementById("yaySound").play().catch(e=>{});

        setTimeout(() => {
            popup.remove();
            nextDay();
        }, 3000);
    });
}
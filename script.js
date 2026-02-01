let mouseX = 0, mouseY = 0, lastX = 0, lastY = 0, cupidX = 0, cupidY = 0;
    let cakeHealth = 19;
    let isGameOver = false;
    let musicStarted = false;
    let lettersOpened = 0; // Track opened letters
    const totalRequired = 5;

    // Element selection
    const cuteMusic = document.getElementById("cuteMusic");
    const finaleMusic = document.getElementById("finaleMusic");
    const sliceSound = document.getElementById("sliceSound");
    const yaySound = document.getElementById("yaySound");
    const sadSound = document.getElementById("sadSound");
    const afterCakeSound = document.getElementById("afterCakeSound");
    const heartSound = document.getElementById("heartSound");
    const sword = document.getElementById("sword");
    const cupid = document.getElementById("cupid-img");
    const cake = document.getElementById("cake");
    const counterDisplay = document.getElementById("counter");

    // 1. DYNAMIC CURSOR & MOVEMENT
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        sword.style.left = mouseX + "px";
        sword.style.top = mouseY + "px";
        let dx = mouseX - lastX;
        let dy = mouseY - lastY;
        let speed = Math.sqrt(dx*dx + dy*dy);
        let angle = Math.atan2(dy, dx) * 180 / Math.PI;
        if (speed > 12) {
            createSlash(mouseX, mouseY, angle);
            if (!isGameOver) checkCakeHit(mouseX, mouseY, speed);
        }
        lastX = mouseX; lastY = mouseY;
    });

    function createSlash(x, y, angle) {
        const s = document.createElement("div");
        s.className = "slash";
        s.style.left = x + "px"; s.style.top = y + "px";
        s.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 400);
    }

    // 2. CAKE SLICING
    function checkCakeHit(x, y, speed) {
        if (document.getElementById("cakeScreen").classList.contains("hidden") || cakeHealth <= 0) return;
        const rect = cake.getBoundingClientRect();
        if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom && speed > 25) {
            let now = Date.now();
            if (now - (window.lastHit || 0) > 200) { 
                cakeHealth--;
                counterDisplay.innerText = `Slices left: ${cakeHealth}`;
                sliceSound.currentTime = 0;
                sliceSound.play();
                cake.style.transform = "scale(0.9) rotate(4deg)";
                setTimeout(() => cake.style.transform = "scale(1)", 100);
                if (cakeHealth === 0) {
                    afterCakeSound.play();
                    cake.src = "sliced cake.png";
                    counterDisplay.style.display = "none";
                    document.getElementById("cakeText").innerText = "Success! Who gets a piece?";
                    document.getElementById("cakeChoices").classList.remove("hidden");
                }
                window.lastHit = now;
            }
        }
    }

    // 3. NO & YES LOGIC
    document.getElementById("yesBtn").onclick = () => {
        yaySound.play();
        cuteMusic.play();
        document.getElementById("valentineBox").style.display = "none";
        document.getElementById("cakeScreen").classList.remove("hidden");
    };

    document.getElementById("noBtn").addEventListener("mouseover", () => {
        sadSound.currentTime = 0; sadSound.play();
        const x = Math.random() * (window.innerWidth - 150);
        const y = Math.random() * (window.innerHeight - 100);
        noBtn.style.position = "fixed";
        noBtn.style.left = x + "px"; noBtn.style.top = y + "px";
    });

    function animateCupid() {
        cupidX += (mouseX + 110 - cupidX) * 0.06;
        cupidY += (mouseY - 70 - cupidY) * 0.06;
        cupid.style.left = cupidX + "px";
        cupid.style.top = cupidY + "px";
        requestAnimationFrame(animateCupid);
    }
    animateCupid();

    // 4. TRANSITIONS
    function triggerBlackout() {
        isGameOver = true;
        document.getElementById("cakeScreen").classList.add("hidden");
        document.getElementById("guiltPopup").classList.add("hidden");
        const b = document.getElementById("blackout");
        b.style.display = "block";
        setTimeout(() => b.style.opacity = "1", 100);
        setTimeout(() => {
            document.getElementById("beatingHeart").style.display = "block";
            heartSound.play();
        }, 3000);
    }

    // 5. FINALE WITH PROGRESS BAR
    document.getElementById("beatingHeart").onclick = function() {
        heartSound.pause();
        this.style.display = "none";
        document.getElementById("blackout").style.display = "none";
        document.getElementById("glassOverlay").style.display = "block";
        
        // Create Progress Bar Container
        const barContainer = document.createElement("div");
        barContainer.id = "progressBarContainer";
        Object.assign(barContainer.style, {
            position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
            width: '300px', height: '20px', background: 'rgba(255,255,255,0.3)',
            borderRadius: '10px', overflow: 'hidden', zIndex: '4000', border: '2px solid white'
        });
        
        const barFill = document.createElement("div");
        barFill.id = "barFill";
        Object.assign(barFill.style, {
            width: '0%', height: '100%', background: '#ff4d6d', transition: '0.5s'
        });
        
        const barText = document.createElement("div");
        barText.id = "barText";
        barText.innerText = "Open 5 letters: 0/5";
        Object.assign(barText.style, {
            position: 'fixed', top: '45px', left: '50%', transform: 'translateX(-50%)',
            color: 'white', fontWeight: 'bold', textShadow: '0 0 5px black', zIndex: '4000'
        });

        barContainer.appendChild(barFill);
        document.body.appendChild(barContainer);
        document.body.appendChild(barText);

        cuteMusic.pause();
        finaleMusic.play();
        startFallingLetters();
    };

    function startFallingLetters() {
        const msgs = [
            "Mannu, you're the best! ❤️", "I love you 3000! ✨", 
            "You make me so happy! 😍", "Forever yours! ♾️", "You're my favorite! 🍰"
        ];
        
        setInterval(() => {
            const l = document.createElement("img");
            l.src = "letter.png";
            l.className = "falling-letter";
            l.style.left = Math.random() * 85 + 5 + "vw";
            l.onclick = function() {
                // If it's a new letter click
                if (!this.classList.contains('opened')) {
                    this.classList.add('opened');
                    lettersOpened++;
                    updateProgress();
                }
                document.getElementById("letterContent").innerText = msgs[Math.floor(Math.random()*msgs.length)];
                document.getElementById("letterPopup").classList.add("active");
            };
            document.body.appendChild(l);
            setTimeout(() => l.remove(), 9000);
        }, 1800);
    }

    function updateProgress() {
        const fill = document.getElementById("barFill");
        const text = document.getElementById("barText");
        const percentage = (lettersOpened / totalRequired) * 100;
        
        fill.style.width = Math.min(percentage, 100) + "%";
        text.innerText = `Letters collected: ${Math.min(lettersOpened, 5)}/5`;

        if (lettersOpened === 5) {
            revealFinalStep();
        }
    }

    function revealFinalStep() {
        const finalBtn = document.createElement("button");
        finalBtn.className = "actionBtn";
        finalBtn.innerText = "Click for Final Surprise 🎁";
        Object.assign(finalBtn.style, {
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            zIndex: '5000', padding: '20px 40px', fontSize: '24px', animation: 'premiumBeat 0.8s infinite'
        });
        
        finalBtn.onclick = () => {
            alert("Happy Valentine's Day, Mannu! I love you! ❤️"); // You can replace this with a new stage!
        };
        document.body.appendChild(finalBtn);
    }

    function closeLetter() { document.getElementById("letterPopup").classList.remove("active"); }
    function eatSelf() { document.getElementById("guiltPopup").classList.remove("hidden"); }
    function shareWithAdi() { triggerBlackout(); }
    function giveToAdi() { triggerBlackout(); }
const leftSection = document.getElementById('leftSection');
const rightSection = document.getElementById('rightSection');
const cursor = document.getElementById('cursor');
const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const leftText = document.querySelector('.left-text');
const rightText = document.querySelector('.right-text');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Theme Toggle Logic
themeToggle.addEventListener('change', () => {
    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');

    if (body.classList.contains('dark-theme')) {
        img1.src = 'coder-dark.png';
    } else {
        img1.src = 'coder-light.png';
    }
});

// Initial setup for animation
gsap.set('.navbar', { xPercent: 0, opacity: 0 });
gsap.set(['.nav-left', '.nav-center', '.nav-right'], { opacity: 0 });
gsap.set(leftSection, { xPercent: -100, width: '50%' });
gsap.set(rightSection, { xPercent: 100, width: '50%' });
gsap.set([leftText, rightText], { opacity: 0 });

// Intro Animation
const tl = gsap.timeline({
    onComplete: () => {
        initMouseInteractions();
    }
});

tl.to('.navbar', {
    opacity: 1,
    duration: 1.2,
    ease: "power2.out"
})
    .to(['.nav-left', '.nav-center', '.nav-right'], {
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.6")
    .to([leftSection, rightSection], {
        xPercent: 0,
        duration: 1.5,
        ease: "power3.inOut"
    }, "-=0.5")
    // After meeting at center, wait 1 second then fade in text
    .to([leftText, rightText], {
        opacity: 1,
        duration: 1,
        ease: "power2.out"
    }, "+=0.5");

function initMouseInteractions() {
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const windowWidth = window.innerWidth;

        // Update cursor position
        gsap.to(cursor, {
            x: mouseX,
            y: mouseY,
            duration: 0.1
        });

        // Calculate percentage (0 to 100)
        const percentage = (mouseX / windowWidth) * 100;

        // Update widths for both sections to meet perfectly
        // Moving mouse left (percentage decreases) should increase leftWidth
        const leftWidth = 100 - percentage;
        const rightWidth = 100 - leftWidth; // or just percentage

        gsap.to(leftSection, {
            width: `${leftWidth}%`,
            duration: 0.8,
            ease: "power2.out"
        });

        gsap.to(rightSection, {
            width: `${rightWidth}%`,
            duration: 0.8,
            ease: "power2.out"
        });

        // Parallax Animation
        const parallaxRange = 40;
        const shiftX = (percentage - 50) * (parallaxRange / 100);

        gsap.to(img1, {
            x: -shiftX,
            duration: 1.2,
            ease: "power2.out"
        });

        gsap.to(img2, {
            x: -shiftX,
            duration: 1.2,
            ease: "power2.out"
        });

        // Multi-Directional Image Switch Logic for About Section
        const aboutImg = document.getElementById('aboutImg');
        const windowHeight = window.innerHeight;
        const col = Math.floor((mouseX / windowWidth) * 3); // 0, 1, 2
        const row = Math.floor((mouseY / windowHeight) * 3); // 0, 1, 2

        let newImage = 'student.png';

        if (row === 0) { // Top
            if (col === 0) newImage = 'student-upleft.png';
            else if (col === 1) newImage = 'student-up.png';
            else if (col === 2) newImage = 'student-upright.png';
        } else if (row === 1) { // Center row
            if (col === 0) newImage = 'student-left.png';
            else if (col === 1) newImage = 'student-center.png';
            else if (col === 2) newImage = 'student-right.png';
        } else if (row === 2) { // Bottom row
            if (col === 0) newImage = 'student-downleft.png';
            else if (col === 1) newImage = 'student-down.png';
            else if (col === 2) newImage = 'student-downright.png';
        }

        if (aboutImg && !aboutImg.src.includes(newImage)) {
            aboutImg.src = newImage;
        }

        // Fading Logic (Opacity changes with width)
        const leftOpacity = gsap.utils.clamp(0, 1, (leftWidth - 20) / 30);
        const rightOpacity = gsap.utils.clamp(0, 1, (rightWidth - 20) / 30);

        gsap.to(leftText, {
            opacity: leftOpacity,
            duration: 0.5,
            ease: "power1.out"
        });

        gsap.to(rightText, {
            opacity: rightOpacity,
            duration: 0.5,
            ease: "power1.out"
        });
    });
}

// --- Card Swap Animation Logic (Ported from React) ---

// --- Card Swap Animation Logic ---

(function () {
    const wrapper = document.querySelector('.card-swap-wrapper');
    const container = document.querySelector('.card-swap-container');
    if (!wrapper || !container) return;

    const cards = Array.from(document.querySelectorAll('.card'));
    if (cards.length === 0) return;

    // Configuration
    const cardDistance = 40; // Horizontal offset per card (px)
    const verticalDistance = 40; // Vertical offset per card (px)
    const skewAmount = 2; // Subtle skew
    const delay = 1000; // 1s wait

    const config = {
        ease: 'elastic.out(0.6, 0.8)',
        durDrop: 1.5,
        durMove: 1.5,
        durReturn: 1.5,
        promoteOverlap: 0.8,
        returnDelay: 0.05,
    };

    const total = cards.length;
    let order = cards.map((_, i) => i);
    let tl = null;
    let isHovering = false;
    let timeoutId = null;

    const makeSlot = (i) => ({
        x: i * cardDistance,
        y: -i * verticalDistance,
        z: -i * cardDistance * 2,
        zIndex: total - i
    });

    const placeNow = (el, slot) => {
        gsap.set(el, {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            zIndex: slot.zIndex,
            xPercent: -70,
            yPercent: -70,
            skewY: skewAmount,
            transformOrigin: 'center center',
            force3D: true,
            opacity: 1
        });
    };

    // Initial Set - Ensures they start exactly where they should be
    cards.forEach((card, i) => {
        placeNow(card, makeSlot(i));
    });

    const scheduleNextSwap = () => {
        clearTimeout(timeoutId);
        if (!isHovering) {
            timeoutId = setTimeout(swap, delay);
        }
    };

    const swap = () => {
        if (order.length < 2) return;
        if (isHovering && (!tl || !tl.isActive())) return;

        const frontIndex = order[0];
        const rest = order.slice(1);
        const elFront = cards[frontIndex];

        if (tl && tl.isActive()) tl.kill();

        tl = gsap.timeline({
            onComplete: scheduleNextSwap
        });

        // 1. Drop Front Card Smoothly (1 second)
        // User requested exactly 100px drop
        const dropY = window.innerHeight;
        const dropDuration = 1;

        tl.to(elFront, {
            y: dropY,

            opacity: 1,
            duration: dropDuration,
            ease: "power1.inOut",
            overwrite: "auto"
        });

        tl.addLabel('promote', `-=${dropDuration * 0.85}`);

        // 2. Move others forward
        rest.forEach((idx, i) => {
            const el = cards[idx];
            const slot = makeSlot(i);

            // Delay z-index update to allow front card to clear and prevent premature layering jumps
            // We set it halfway through the move
            tl.set(el, { zIndex: slot.zIndex }, `promote+=${dropDuration * 0.5}`);

            tl.to(el, {
                x: slot.x,
                y: slot.y,
                z: slot.z,
                duration: config.durMove,
                ease: config.ease
            }, `promote+=${i * 0.1}`);
        });

        // 3. Return Front to Back
        const backSlot = makeSlot(total - 1);

        // Synch return exactly when drop finishes
        tl.addLabel('returnStart', dropDuration);

        // Switch Z-Index instantly when drop is done
        tl.set(elFront, {
            zIndex: backSlot.zIndex,
            rotationX: 0
        }, 'returnStart');

        // Animate from dropY (bottom) to back slot position
        tl.fromTo(elFront,
            {
                x: backSlot.x,
                y: dropY,
                z: backSlot.z
            },
            {
                x: backSlot.x,
                y: backSlot.y,
                z: backSlot.z,
                duration: config.durReturn,
                ease: config.ease,
                immediateRender: false
            },
            'returnStart');

        // Update order state
        tl.call(() => {
            order = [...rest, frontIndex];
        });
    };

    // Hover Interaction - Only pause when hovering a card specifically
    let hoverCount = 0;

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            hoverCount++;
            if (hoverCount === 1) { // First card entered
                isHovering = true;
                clearTimeout(timeoutId);
                if (tl && tl.isActive()) tl.pause();
            }
        });

        card.addEventListener('mouseleave', () => {
            hoverCount--;
            if (hoverCount <= 0) { // Last card left
                hoverCount = 0;
                isHovering = false;
                if (tl && tl.paused()) {
                    tl.resume();
                } else {
                    scheduleNextSwap();
                }
            }
        });
    });

    // Start Loop
    scheduleNextSwap();

})();

// Force initial visibility check
setTimeout(() => {
    gsap.set('.card', {
        opacity: 1,
        visibility: 'visible'
    });
}, 500);

// Force refresh scroll trigger or layout if needed
window.dispatchEvent(new Event('resize'));

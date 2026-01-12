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

(function () {
    const cardSwapContainer = document.querySelector('.card-swap-container');
    if (!cardSwapContainer) return;

    const cards = Array.from(document.querySelectorAll('.card'));
    if (cards.length === 0) return;

    // Config options
    const width = 300; // Matches CSS
    const height = 400; // Matches CSS
    const cardDistance = 60; // distX
    const verticalDistance = 70; // distY
    const skewAmount = 6;
    const delay = 5000;

    // Animation Config (Elastic)
    const config = {
        ease: 'elastic.out(0.6,0.9)',
        durDrop: 2,
        durMove: 2,
        durReturn: 2,
        promoteOverlap: 0.9,
        returnDelay: 0.05
    };

    // State
    const total = cards.length;
    let order = cards.map((_, i) => i); // [0, 1, 2, ...]
    let tl = null;
    let intervalId = null;

    const makeSlot = (i, distX, distY, total) => ({
        x: i * distX,
        y: -i * distY,
        z: -i * distX * 1.5,
        zIndex: total - i
    });

    const placeNow = (el, slot, skew) => {
        gsap.set(el, {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            xPercent: -50,
            yPercent: -50,
            skewY: skew,
            transformOrigin: 'center center',
            zIndex: slot.zIndex,
            force3D: true
        });
    };

    // Initial Placement
    cards.forEach((card, i) => {
        placeNow(card, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
    });

    const swap = () => {
        if (order.length < 2) return;

        const frontIndex = order[0];
        const restIndices = order.slice(1);

        const elFront = cards[frontIndex];

        // Create new timeline
        tl = gsap.timeline();

        // 1. Drop front card
        tl.to(elFront, {
            y: '+=500',
            duration: config.durDrop,
            ease: config.ease
        });

        tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);

        // 2. Move rest cards forward
        restIndices.forEach((idx, i) => {
            const el = cards[idx];
            const slot = makeSlot(i, cardDistance, verticalDistance, total);

            tl.set(el, { zIndex: slot.zIndex }, 'promote');
            tl.to(el, {
                x: slot.x,
                y: slot.y,
                z: slot.z,
                duration: config.durMove,
                ease: config.ease
            }, `promote+=${i * 0.15}`);
        });

        // 3. Move front card to back
        const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total);
        tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);

        // Change zIndex immediately before moving back visually
        tl.call(() => {
            gsap.set(elFront, { zIndex: backSlot.zIndex });
        }, null, 'return');

        tl.to(elFront, {
            x: backSlot.x,
            y: backSlot.y,
            z: backSlot.z,
            duration: config.durReturn,
            ease: config.ease
        }, 'return');

        // Update order state
        tl.call(() => {
            order = [...restIndices, frontIndex];
        });
    };

    // Start Loop
    // Delay first swap
    setTimeout(() => {
        swap();
        intervalId = setInterval(swap, delay);
    }, 1000); // 1s start delay

    // Pause on Hover
    const wrapper = document.querySelector('.card-swap-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', () => {
            if (tl) tl.pause();
            clearInterval(intervalId);
        });
        wrapper.addEventListener('mouseleave', () => {
            if (tl) tl.play();
            intervalId = setInterval(swap, delay);
        });
    }

})();

// --- Updated Card Swap Logic for Dynamic Sizing ---

(function () {
    const section = document.querySelector('.projects-section');
    const container = document.querySelector('.card-swap-container');
    if (!section || !container) return;

    const cards = Array.from(document.querySelectorAll('.card'));
    if (cards.length === 0) return;

    // Configuration
    // We don't set width/height here anymore, CSS handles 60vw/60vh.

    const cardDistance = 40; // Horizontal offset per card (px)
    const verticalDistance = 40; // Vertical offset per card (px)
    const skewAmount = 2; // Subtle skew
    const delay = 1000; // 1s wait

    const config = {
        ease: 'elastic.out(0.6, 0.8)',
        durDrop: 1.5, // Faster drop
        durMove: 1.5, // Faster move
        durReturn: 1.5, // Faster return
        promoteOverlap: 0.8,
        returnDelay: 0.05,
    };

    const total = cards.length;
    let order = cards.map((_, i) => i);
    let tl = null;
    let isHovering = false;
    let timeoutId = null;

    // Helper: calculate slot position relative to the container center anchor.
    // i=0 is at (0,0,0). i=1 is at (distX, -distY, -Z).
    const makeSlot = (i) => ({
        x: i * cardDistance,
        y: -i * verticalDistance,
        z: -i * cardDistance * 2, // More depth
        zIndex: total - i
    });

    const placeNow = (el, slot) => {
        gsap.set(el, {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            zIndex: slot.zIndex,
            // Important: We center the card on the slot coordinate.
            // Since CSS positions the anchor effectively at card center for the first card,
            // xPercent: -50 ensures the card's center aligns with that point.
            xPercent: -50,
            yPercent: -50,
            skewY: skewAmount,
            transformOrigin: 'center center',
            force3D: true,
            opacity: 1 // Ensure visible
        });
    };

    // Initial Set
    cards.forEach((card, i) => {
        placeNow(card, makeSlot(i));
    });

    const scheduleNextSwap = () => {
        // Continue loop regardless of hover
        timeoutId = setTimeout(swap, delay);
    };

    const swap = () => {
        if (order.length < 2) return;

        const frontIndex = order[0];
        const rest = order.slice(1);
        const elFront = cards[frontIndex];

        // If a timeline is already active (unlikely with our logic, but safe), kill it
        if (tl && tl.isActive()) tl.kill();

        tl = gsap.timeline({
            onComplete: scheduleNextSwap // Recursively schedule next
        });

        // 1. Drop Front Card
        // Drop it significantly below the screen.
        // Screen height is window.innerHeight. Since we are at bottom, a drop of 100vh is safe.
        tl.to(elFront, {
            y: window.innerHeight * 1.5,
            rotationX: 30,
            opacity: 1,
            duration: config.durDrop,
            ease: config.ease
        });

        tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);

        // 2. Move others forward
        rest.forEach((idx, i) => {
            const el = cards[idx];
            const slot = makeSlot(i);

            tl.set(el, { zIndex: slot.zIndex }, 'promote');
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
        tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);

        tl.call(() => {
            gsap.set(elFront, { zIndex: backSlot.zIndex, rotationX: 0, opacity: 1 });
        }, null, 'return');

        tl.fromTo(elFront,
            {
                x: backSlot.x,
                y: backSlot.y + window.innerHeight, // Come from below
                z: backSlot.z
            },
            {
                x: backSlot.x,
                y: backSlot.y,
                z: backSlot.z,
                duration: config.durReturn,
                ease: config.ease
            },
            'return');

        tl.call(() => {
            order = [...rest, frontIndex];
        });
    };

    // Auto-play
    // Start delay to let user see initial state
    timeoutId = setTimeout(swap, 1000);

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

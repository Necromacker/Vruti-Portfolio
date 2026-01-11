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
gsap.set('.navbar', { xPercent: -50, opacity: 0 });
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

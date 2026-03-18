const story = [
    { name: "Me", text: "Hi Akhi! <i class='fa-solid fa-face-smile'></i><br>Welcome to your special little corner of the internet." },
    { name: "Me", text: "I wanted to make something sweet just for you.<br>Look at this memory...", cg: "photos/1.png" },
    { name: "Me", text: "Even the clouds stop to admire your smile." },
    { name: "Me", text: "Simply magical.", cg: "photos/2.png" },
    { name: "Me", text: "You make my world so much brighter." },
    { name: "Me", text: "Like a pastel dream come true.", cg: "photos/3.jpg" },
    { name: "Me", text: "I love you so much!<br>my angel! <i class='fa-solid fa-heart' style='color:#ff9eb5'></i>" }
];

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // SETUP BACKGROUND CANVAS
    // -------------------------------------------------------------
    const canvas = document.getElementById('star-canvas');
    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeCanvas(); window.addEventListener('resize', resizeCanvas);

    const stars = Array.from({length: 60}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 0.5,
        speedY: Math.random() * -0.5 - 0.1,
        color: ['#ffffff', '#ffdae0', '#ff9eb5', '#c2e9fb'][Math.floor(Math.random()*4)],
        alpha: Math.random()
    }));

    function animateBg() {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        stars.forEach(s => {
            s.y += s.speedY;
            if(s.y < -10) { s.y = canvas.height + 10; s.x = Math.random() * canvas.width; }
            s.alpha += (Math.random() - 0.5) * 0.05;
            if(s.alpha > 1) s.alpha = 1; if(s.alpha < 0.2) s.alpha = 0.2;
            
            ctx.globalAlpha = s.alpha;
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI*2);
            ctx.fill();
        });
        requestAnimationFrame(animateBg);
    }
    animateBg();

    // -------------------------------------------------------------
    // GENERATE TIMELINE NODES
    // -------------------------------------------------------------
    const container = document.getElementById('nodes-container');
    
    story.forEach((item, index) => {
        const row = document.createElement('div');
        const isRight = index % 2 !== 0; // alternating sides
        row.className = `story-node ${isRight ? 'right' : 'left'}`;

        let mediaHTML = '';
        if(item.cg) {
            mediaHTML = `
                <div class="polaroid-wrapper ${isRight ? 'p-right' : ''}">
                    <img src="${item.cg}" class="polaroid-img" alt="Memory" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="polaroid-placeholder" style="display:none;"><i class="fa-solid fa-image"></i></div>
                </div>
            `;
        } else if (index === 0) {
            mediaHTML = `<div class="polaroid-wrapper" style="padding:20px; border-radius:50%; width:100px; height:100px; display:inline-flex; align-items:center; justify-content:center; background: #ffdae0; transform:none;"><i class="fa-solid fa-heart" style="font-size:3rem; color:#ff9eb5;"></i></div>`;
        }

        row.innerHTML = `
            <div class="node-marker"><i class="fa-solid ${index === story.length -1 ? 'fa-heart' : 'fa-star'}"></i></div>
            <div class="story-content" style="transform: translateX(${isRight ? '50px' : '-50px'});">
                <div class="speaker-tag">${item.name}</div>
                ${mediaHTML}
                <div class="text-bubble">${item.text}</div>
            </div>
            <div class="empty-space"></div>
        `;
        container.appendChild(row);
    });

    // -------------------------------------------------------------
    // GSAP SCROLL ANIMATIONS
    // -------------------------------------------------------------
    // Wait for GSAP and ScrollTrigger to be loaded
    setTimeout(() => {
        if(typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // Timeline Path Draw Effect
            const glowFill = document.querySelector('.glow-fill');
            const timeline = document.getElementById('journey-timeline');

            if(timeline) {
                gsap.to(glowFill, {
                    height: "100%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: timeline,
                        start: "top center",
                        end: "bottom center",
                        scrub: 0.5
                    }
                });

                // Node entry animations
                const nodes = document.querySelectorAll('.story-node');
                nodes.forEach((node, i) => {
                    const content = node.querySelector('.story-content');
                    const marker = node.querySelector('.node-marker');
                    
                    // Marker glow when reached
                    ScrollTrigger.create({
                        trigger: node,
                        start: "top center+=100",
                        onEnter: () => {
                            marker.classList.add('active');
                            // Add tiny burst effect
                            spawnMiniStars(marker.getBoundingClientRect());
                        },
                        onLeaveBack: () => marker.classList.remove('active')
                    });

                    // Content slide-in
                    gsap.to(content, {
                        opacity: 1,
                        x: 0,
                        duration: 1,
                        ease: "back.out(1.2)",
                        scrollTrigger: {
                            trigger: node,
                            start: "top center+=200",
                            toggleActions: "play none none reverse"
                        }
                    });
                });
            }

            // Finale Button Entry
            const finale = document.getElementById('finale-section');
            if(finale) {
                gsap.from(finale.querySelector('.glass-title'), {
                    opacity: 0, y: 50, scale: 0.9, duration: 1, ease: "power3.out",
                    scrollTrigger: {
                        trigger: finale,
                        start: "top bottom-=100",
                        toggleActions: "play none none none"
                    }
                });
            }
        }
    }, 100);

    // -------------------------------------------------------------
    // CLICK PARTICLE EFFECT (New Feature)
    // -------------------------------------------------------------
    document.body.addEventListener('click', (e) => {
        spawnClickStars(e.clientX, e.clientY);
    });

    function spawnMiniStars(rect) {
        spawnClickStars(rect.left + rect.width/2, rect.top + rect.height/2);
    }

    function spawnClickStars(x, y) {
        if (typeof gsap === 'undefined') return;
        
        for (let i = 0; i < 8; i++) {
            const star = document.createElement('i');
            star.className = 'fa-solid fa-sparkles';
            star.style.position = 'fixed';
            star.style.pointerEvents = 'none';
            star.style.zIndex = '99999';
            
            const colors = ['#fffc00', '#ffffff', '#ff9eb5'];
            star.style.color = colors[Math.floor(Math.random() * colors.length)];
            star.style.fontSize = (Math.random() * 10 + 10) + 'px';
            star.style.left = x + 'px';
            star.style.top = y + 'px';
            
            document.body.appendChild(star);
            
            gsap.to(star, {
                y: "-=" + (Math.random() * 100 + 50),
                x: "+=" + (Math.random() * 100 - 50),
                opacity: 0,
                rotation: (Math.random() - 0.5) * 180,
                scale: 0.5,
                duration: 0.8 + Math.random(),
                ease: "power2.out",
                onComplete: () => star.remove()
            });
        }
    }
});

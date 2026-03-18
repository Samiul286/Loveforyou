document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------
    // 1. Cursor handling
    // -----------------------------------------------------------------
    const cursor = document.querySelector('.cursor-ring');
    document.addEventListener('mousemove', (e) => {
        if (cursor) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
    });

    document.addEventListener('mousedown', () => cursor?.classList.add('active'));
    document.addEventListener('mouseup', () => cursor?.classList.remove('active'));

    document.querySelectorAll('a, button, .polaroid').forEach(el => {
        el.addEventListener('mouseenter', () => cursor?.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor?.classList.remove('active'));
    });

    // -----------------------------------------------------------------
    // 2. Time Apart Counter
    // -----------------------------------------------------------------
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 5); // Example: 5 days ago

    function updateCounter() {
        const now = new Date();
        const diff = now - startDate;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / 1000 / 60) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('mins').textContent = mins.toString().padStart(2, '0');
        document.getElementById('secs').textContent = secs.toString().padStart(2, '0');
    }
    updateCounter();
    setInterval(updateCounter, 1000);

    // -----------------------------------------------------------------
    // 3. Sparkles Canvas Background
    // -----------------------------------------------------------------
    const canvas = document.getElementById('sparkles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let particles = [];
        const colors = ['#ffffff', '#fffc00', '#ff9eb5', '#a0e9ff'];

        class Sparkle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 6 + 1;
                this.speedY = Math.random() * -0.5 - 0.2; // Float up
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.alpha = Math.random();
                this.fadeSpeed = Math.random() * 0.02 + 0.005;
            }
            update() {
                this.y += this.speedY;
                this.alpha -= this.fadeSpeed;
                if (this.alpha <= 0) {
                    this.y = canvas.height + 10;
                    this.x = Math.random() * canvas.width;
                    this.alpha = 1;
                }
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
        for (let i = 0; i < 40; i++) particles.push(new Sparkle());

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // -----------------------------------------------------------------
    // 4. Typewriter Effect (Intersection Observer)
    // -----------------------------------------------------------------
    const letterText = "Dear Akhi,<br><br>Ever since you left, there's been a little void that only you can fill. I catch myself smiling just thinking about the silly memories we've made. <br><br>I listen to our songs and imagine you here.<br><br>Can't wait to see you again soon!<br><br>Forever Yours,<br>Someone who adores you ❤️";
    const letterContainer = document.getElementById('letter-text');
    let typed = false;

    function typeWriter(text, element) {
        element.innerHTML = '';
        let i = 0;
        let isTag = false;
        let textLen = text.length;
        
        const cursor = document.createElement('span');
        cursor.className = 'letter-cursor';

        function type() {
            if (i < textLen) {
                element.innerHTML = text.substring(0, i+1);
                element.appendChild(cursor);
                i++;
                if (text.charAt(i) === '<') isTag = true;
                if (text.charAt(i-1) === '>') isTag = false;
                
                setTimeout(type, isTag ? 0 : 45); // Very fast if tag
            } else {
                cursor.remove();
            }
        }
        type();
    }

    const letterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !typed) {
                typed = true;
                typeWriter(letterText, letterContainer);
            }
        });
    }, { threshold: 0.5 });
    
    if (letterContainer) letterObserver.observe(letterContainer);

    // -----------------------------------------------------------------
    // 5. Stat Bars Animation
    // -----------------------------------------------------------------
    const statBars = document.querySelectorAll('.bar-fill');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetWidth = entry.target.dataset.width;
                entry.target.style.width = targetWidth;
            }
        });
    }, { threshold: 0.5 });

    statBars.forEach(bar => {
        bar.dataset.width = bar.style.width; 
        bar.style.width = '0%'; 
        statsObserver.observe(bar);
    });

    // -----------------------------------------------------------------
    // 6. Send A Hug Button floating hearts
    // -----------------------------------------------------------------
    const hugBtn = document.getElementById('send-hug');
    if (hugBtn) {
        hugBtn.addEventListener('click', (e) => {
            for (let i = 0; i < 15; i++) {
                const heart = document.createElement('i');
                heart.className = 'fa-solid fa-heart hug-heart';
                
                const colors = ['#ff9eb5', '#ffdae0', '#ffffff', '#fffc00'];
                heart.style.color = colors[Math.floor(Math.random() * colors.length)];
                
                const rect = hugBtn.getBoundingClientRect();
                heart.style.left = (rect.left + rect.width / 2) + (Math.random() * 40 - 20) + 'px';
                heart.style.top = rect.top + 'px';
                
                heart.style.fontSize = Math.random() * 20 + 15 + 'px';
                heart.style.animationDuration = Math.random() * 1 + 1 + 's';
                
                document.body.appendChild(heart);

                if (window.gsap) {
                    gsap.to(heart, {
                        y: -(Math.random() * 200 + 150),
                        x: "+=" + (Math.random() * 100 - 50),
                        opacity: 0,
                        rotation: Math.random() * 90 - 45,
                        duration: Math.random() * 1.5 + 1,
                        ease: "power2.out",
                        onComplete: () => heart.remove()
                    });
                } else {
                    // Fallback if no gsap
                    setTimeout(() => heart.remove(), 2000);
                }
            }
        });
    }
});

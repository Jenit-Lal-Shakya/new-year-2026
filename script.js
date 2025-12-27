// Global Variables

let fireworksCanvas, confettiCanvas;
let fireworksCtx, confettiCtx;
let fireworks = [];
let confettiParticles = [];
let animationId;
let isMusicPlaying = false;
let userName = localStorage.getItem('userName') || '';

// Utility Functions

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    initializeCanvas();
    initializeCountdown();
    initializeTypingAnimation();
    initializeCelebrationMode();
    initializeButtons();
    initializeMusicControl();
    initializePersonalizedGreeting();
    startFireworks();
    animate();
});

// Canvas Setup

function initializeCanvas() {
    fireworksCanvas = document.getElementById('fireworksCanvas');
    confettiCanvas = document.getElementById('confettiCanvas');
    
    if (!fireworksCanvas || !confettiCanvas) {
        console.warn('Canvas elements not found');
        return;
    }
    
    fireworksCtx = fireworksCanvas.getContext('2d');
    confettiCtx = confettiCanvas.getContext('2d');
    
    function resizeCanvas() {
        if (!fireworksCanvas || !confettiCanvas) return;
        
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', throttle(resizeCanvas, 250));
}

// Countdown Timer

let countdownInterval;

function initializeCountdown() {
    const targetDate = new Date('2026-01-01T00:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');
            
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            
            if (!document.body.classList.contains('celebration-mode')) {
                triggerCelebrationMode();
            }
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        updateCountdownElement('days', days);
        updateCountdownElement('hours', hours);
        updateCountdownElement('minutes', minutes);
        updateCountdownElement('seconds', seconds);
    }
    
    function updateCountdownElement(id, value) {
        const element = document.getElementById(id);
        if (!element) return;
        
        const formattedValue = String(value).padStart(2, '0');
        
        if (element.textContent !== formattedValue) {
            element.style.transform = 'scale(1.2)';
            element.textContent = formattedValue;
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Typing Animation

function initializeTypingAnimation() {
    const text1 = "Happy New Year";
    const text2 = "2026";
    const typingElement1 = document.querySelector('.typing-text');
    const typingElement2 = document.querySelector('.typing-text-2');
    const emojiElement = document.querySelector('.emoji');
    
    if (!typingElement1) {
        console.warn('Typing elements not found');
        return;
    }
    
    let index1 = 0;
    let index2 = 0;
    
    if (emojiElement) {
        emojiElement.style.opacity = '0';
    }
    if (typingElement2) {
        typingElement2.style.opacity = '0';
    }
    
    function typeLine1() {
        if (!typingElement1) return;
        
        if (index1 < text1.length) {
            typingElement1.textContent = text1.substring(0, index1 + 1);
            index1++;
            setTimeout(typeLine1, 100);
        } else {
            setTimeout(() => {
                if (typingElement1) {
                    typingElement1.style.borderRight = 'none';
                }
                if (typingElement2) {
                    typingElement2.style.opacity = '1';
                    typeLine2();
                }
            }, 500);
        }
    }
    
    function typeLine2() {
        if (!typingElement2) return;
        
        if (index2 < text2.length) {
            typingElement2.textContent = text2.substring(0, index2 + 1);
            index2++;
            setTimeout(typeLine2, 100);
        } else {
            setTimeout(() => {
                if (typingElement2) {
                    typingElement2.style.borderRight = 'none';
                }
                if (emojiElement) {
                    emojiElement.style.opacity = '1';
                    emojiElement.style.animation = 'emojiGlow 2s ease-in-out infinite alternate, fadeIn 0.5s ease-out';
                }
            }, 500);
        }
    }
    
    setTimeout(typeLine1, 500);
}

// Celebration Mode

let midnightCheckInterval;

function initializeCelebrationMode() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDate = now.getDate();
    
    if (currentYear >= 2026 && currentMonth === 0 && currentDate === 1) {
        triggerCelebrationMode();
    }
    
    midnightCheckInterval = setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
            if (now.getFullYear() === 2026 && now.getMonth() === 0 && now.getDate() === 1) {
                triggerCelebrationMode();
                if (midnightCheckInterval) {
                    clearInterval(midnightCheckInterval);
                }
            }
        }
    }, 1000);
}

function triggerCelebrationMode() {
    document.body.classList.add('celebration-mode');
    
    const titleElement1 = document.querySelector('.typing-text');
    const titleElement2 = document.querySelector('.typing-text-2');
    const emojiElement = document.querySelector('.emoji');
    
    if (titleElement1) {
        titleElement1.textContent = "Happy New Year!";
    }
    if (titleElement2) {
        titleElement2.textContent = "2026";
        titleElement2.style.opacity = '1';
    }
    if (emojiElement) {
        emojiElement.textContent = "🎉🎆✨";
        emojiElement.style.opacity = '1';
    }
    
    if (fireworksCanvas) {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                if (fireworksCanvas) {
                    createFirework(
                        Math.random() * fireworksCanvas.width,
                        Math.random() * fireworksCanvas.height / 2
                    );
                }
            }, i * 200);
        }
    }
    
    burstConfetti();
}

// Fireworks Animation

class Particle {
    constructor(x, y, vx, vy, color, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.gravity = 0.05;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life--;
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.colors = [
            '#8b5cf6', '#3b82f6', '#ec4899', '#fbbf24', 
            '#10b981', '#f59e0b', '#ef4444'
        ];
        
        this.explode();
    }
    
    explode() {
        const particleCount = 50 + Math.random() * 50;
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
            const speed = 2 + Math.random() * 4;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const life = 60 + Math.random() * 40;
            
            this.particles.push(
                new Particle(this.x, this.y, vx, vy, color, life)
            );
        }
    }
    
    update() {
        this.particles = this.particles.filter(particle => {
            particle.update();
            return !particle.isDead();
        });
    }
    
    draw(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }
    
    isDead() {
        return this.particles.length === 0;
    }
}

function createFirework(x, y) {
    fireworks.push(new Firework(x, y));
}

let fireworksInterval;

function startFireworks() {
    if (!fireworksCanvas) return;
    
    fireworksInterval = setInterval(() => {
        if (!fireworksCanvas) {
            clearInterval(fireworksInterval);
            return;
        }
        
        if (fireworks.length < 3) {
            createFirework(
                Math.random() * fireworksCanvas.width,
                Math.random() * fireworksCanvas.height / 2
            );
        }
    }, 2000);
}

// Confetti Animation

class ConfettiParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = -Math.random() * 10 - 5;
        this.color = [
            '#8b5cf6', '#3b82f6', '#ec4899', '#fbbf24', 
            '#10b981', '#f59e0b', '#ef4444'
        ][Math.floor(Math.random() * 7)];
        this.size = 5 + Math.random() * 10;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.gravity = 0.3;
        this.life = 100 + Math.random() * 50;
        this.maxLife = this.life;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.rotation += this.rotationSpeed;
        this.life--;
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
    
    isDead() {
        return this.life <= 0 || this.y > confettiCanvas.height;
    }
}

function burstConfetti() {
    if (!confettiCanvas) return;
    
    const centerX = confettiCanvas.width / 2;
    const centerY = confettiCanvas.height / 2;
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        confettiParticles.push(
            new ConfettiParticle(centerX, centerY)
        );
    }
}

// Button Handlers

function initializeButtons() {
    const celebrateBtn = document.getElementById('celebrateBtn');
    
    if (!celebrateBtn) {
        console.warn('Celebrate button not found');
        return;
    }
    
    celebrateBtn.addEventListener('click', () => {
        if (!fireworksCanvas || !confettiCanvas) return;
        
        burstConfetti();
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createFirework(
                    Math.random() * fireworksCanvas.width,
                    Math.random() * fireworksCanvas.height / 2
                );
            }, i * 100);
        }
        
        celebrateBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            celebrateBtn.style.transform = '';
        }, 150);
    });
}

// Music Control

function initializeMusicControl() {
    const musicBtn = document.getElementById('musicBtn');
    const music = document.getElementById('backgroundMusic');
    
    const hasMusicSource = music.querySelector('source') && music.querySelector('source').src;
    
    if (!hasMusicSource) {
        musicBtn.setAttribute('aria-disabled', 'true');
        musicBtn.classList.add('disabled');
        musicBtn.title = 'No music file provided';
        return;
    }
    
    music.addEventListener('error', () => {
        console.warn('Audio file failed to load. Music feature disabled.');
        musicBtn.setAttribute('aria-disabled', 'true');
        musicBtn.classList.add('disabled');
        musicBtn.title = 'Music file unavailable';
    });
    
    musicBtn.addEventListener('click', async () => {
        if (musicBtn.getAttribute('aria-disabled') === 'true') {
            return;
        }
        
        try {
            if (isMusicPlaying) {
                music.pause();
                musicBtn.classList.remove('playing');
                isMusicPlaying = false;
                musicBtn.setAttribute('aria-label', 'Play background music');
            } else {
                await music.play();
                musicBtn.classList.add('playing');
                isMusicPlaying = true;
                musicBtn.setAttribute('aria-label', 'Pause background music');
            }
        } catch (err) {
            console.warn('Music playback failed:', err.message);
            musicBtn.setAttribute('aria-disabled', 'true');
            musicBtn.classList.add('disabled');
            musicBtn.title = 'Music playback unavailable';
        }
    });
}

// Personalized Greeting

function initializePersonalizedGreeting() {
    const greetingElement = document.getElementById('greetingMessage');
    
    if (!greetingElement) {
        return;
    }
    
    if (!userName) {
        setTimeout(() => {
            try {
                const name = prompt("What's your name? (Optional - click Cancel to skip)");
                if (name && name.trim()) {
                    userName = name.trim();
                    localStorage.setItem('userName', userName);
                    showGreeting();
                }
            } catch (e) {
                console.debug('Name prompt skipped');
            }
        }, 2000);
    } else {
        showGreeting();
    }
    
    function showGreeting() {
        if (userName && greetingElement) {
            const greetings = [
                `Welcome, ${userName}! 🎉`,
                `Hey ${userName}, let's celebrate! ✨`,
                `${userName}, may 2026 be amazing for you! 🌟`
            ];
            const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
            greetingElement.textContent = randomGreeting;
        }
    }
}

// Animation Loop

function animate() {
    if (!fireworksCanvas || !confettiCanvas || !fireworksCtx || !confettiCtx) {
        return;
    }
    
    fireworksCtx.fillStyle = 'rgba(10, 10, 15, 0.1)';
    fireworksCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    fireworks = fireworks.filter(firework => {
        firework.update();
        firework.draw(fireworksCtx);
        return !firework.isDead();
    });
    
    confettiParticles = confettiParticles.filter(particle => {
        particle.update();
        particle.draw(confettiCtx);
        return !particle.isDead();
    });
    
    animationId = requestAnimationFrame(animate);
}

// Scroll Reveal Animation

setTimeout(() => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.wish-card');
    cards.forEach(card => {
        observer.observe(card);
    });
}, 100);

window.addEventListener('scroll', throttle(() => {
    const elements = document.querySelectorAll('.wish-card');
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !element.classList.contains('revealed')) {
            element.classList.add('revealed');
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}, 100));

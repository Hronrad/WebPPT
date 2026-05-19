let currentPage = 0;
let slides = [];

function initSlides() {
    slides = Array.from(document.querySelectorAll('.page-content'));
    buildNavigation();
    goToPage(0);
}

function buildNavigation() {
    const nav = document.getElementById('slide-nav');
    nav.innerHTML = '';

    slides.forEach((slide, index) => {
        if (index > 0 && slide.dataset.groupStart === 'true') {
            const separator = document.createElement('div');
            separator.className = 'my-2 border-t border-slate-700 opacity-30';
            nav.appendChild(separator);
        }

        const button = document.createElement('button');
        button.type = 'button';
        button.id = `nav-${index}`;
        button.className = 'nav-btn w-full text-left px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all flex items-center group';
        button.onclick = () => goToPage(index);

        const dot = document.createElement('span');
        dot.className = 'w-1.5 h-1.5 rounded-full bg-slate-600 mr-2.5 transition-transform group-hover:bg-academic-accent group-hover:scale-150';

        button.appendChild(dot);
        button.append(document.createTextNode(slide.dataset.nav || `第 ${index + 1} 页`));
        nav.appendChild(button);
    });
}

function goToPage(page) {
    if (page < 0 || page >= slides.length) return;

    slides.forEach((slide, index) => {
        slide.classList.toggle('hidden', index !== page);
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-slate-800', 'text-white');
        btn.classList.add('text-slate-400');
        const dot = btn.querySelector('span');
        if (dot) {
            dot.classList.remove('bg-academic-accent');
            dot.classList.add('bg-slate-600');
        }
    });

    const activeBtn = document.getElementById(`nav-${page}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-slate-800', 'text-white');
        activeBtn.classList.remove('text-slate-400');
        const dot = activeBtn.querySelector('span');
        if (dot) {
            dot.classList.remove('bg-slate-600');
            dot.classList.add('bg-academic-accent');
        }
    }

    updateSidebar(slides[page]);
    updateButtons(page);
    updateProgress(page);
    restartAnimations(slides[page]);
    if (slides[page].querySelector('#demo-canvas') && typeof window.refreshInteractiveDemo === 'function') {
        requestAnimationFrame(window.refreshInteractiveDemo);
    }

    if (typeof MathJax !== 'undefined') {
        MathJax.typesetPromise([slides[page]]);
    }

    currentPage = page;
}

function updateSidebar(slide) {
    document.getElementById('section-number').innerText = slide.dataset.part || '';
    document.getElementById('section-title').innerText = slide.dataset.partTitle || '';
}

function updateButtons(page) {
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    btnPrev.classList.toggle('opacity-0', page === 0);
    btnPrev.classList.toggle('pointer-events-none', page === 0);
    btnNext.classList.toggle('opacity-0', page === slides.length - 1);
    btnNext.classList.toggle('pointer-events-none', page === slides.length - 1);
}

function updateProgress(page) {
    const progressFill = document.getElementById('progressBarFill');
    const denominator = Math.max(slides.length - 1, 1);
    progressFill.style.width = `${(page / denominator) * 100}%`;
}

function restartAnimations(slide) {
    slide.querySelectorAll('.fade-in-up').forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = null;
    });
}

function nextPage() {
    if (currentPage < slides.length - 1) goToPage(currentPage + 1);
}

function prevPage() {
    if (currentPage > 0) goToPage(currentPage - 1);
}

function toggleTimeline(element) {
    const isActive = element.classList.contains('active');
    document.querySelectorAll('.timeline-item').forEach(el => {
        el.classList.remove('active');
        const icon = el.querySelector('svg');
        if (icon) icon.classList.remove('rotate-180');
    });
    if (!isActive) {
        element.classList.add('active');
        const icon = element.querySelector('svg');
        if (icon) icon.classList.add('rotate-180');
    }
}

function toggleFullscreen() {
    const enterIcon = document.getElementById('fullscreen-icon-enter');
    const exitIcon = document.getElementById('fullscreen-icon-exit');

    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement) {
        const elem = document.documentElement;
        if (elem.requestFullscreen) elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
        else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
        else if (elem.msRequestFullscreen) elem.msRequestFullscreen();

        document.body.classList.add('fullscreen-active');
        enterIcon.classList.add('hidden');
        exitIcon.classList.remove('hidden');
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();

        document.body.classList.remove('fullscreen-active');
        enterIcon.classList.remove('hidden');
        exitIcon.classList.add('hidden');
    }
}

function handleFullscreenChange() {
    const enterIcon = document.getElementById('fullscreen-icon-enter');
    const exitIcon = document.getElementById('fullscreen-icon-exit');

    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement) {
        document.body.classList.remove('fullscreen-active');
        enterIcon.classList.remove('hidden');
        exitIcon.classList.add('hidden');
    }
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
            event.preventDefault();
            nextPage();
        }
        if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
            event.preventDefault();
            prevPage();
        }
        if (event.key === 'f' || event.key === 'F') {
            event.preventDefault();
            toggleFullscreen();
        }
    });
}

function initNetworkBackground() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let mode = document.getElementById('background-mode')?.value || 'network';

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.55;
            this.vy = (Math.random() - 0.5) * 0.55;
            this.radius = Math.random() * 1.9 + 0.8;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(14, 165, 233, 0.5)';
            ctx.fill();
        }
    }

    function drawNetwork() {
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 170) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(14, 165, 233, ${0.28 - dist / 850})`;
                    ctx.lineWidth = 0.75;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function drawWaves() {
        const gap = 34;
        const time = frame * 0.018;

        ctx.save();
        ctx.globalAlpha = 0.9;
        for (let y = -gap; y < height + gap; y += gap) {
            ctx.beginPath();
            for (let x = -20; x <= width + 20; x += 8) {
                const wave =
                    Math.sin(x * 0.012 + time + y * 0.018) * 14 +
                    Math.cos(x * 0.006 - time * 0.7 + y * 0.012) * 8;
                const py = y + wave;
                if (x === -20) ctx.moveTo(x, py);
                else ctx.lineTo(x, py);
            }
            ctx.strokeStyle = 'rgba(14, 165, 233, 0.16)';
            ctx.lineWidth = 1.4;
            ctx.stroke();
        }

        for (let i = 0; i < 16; i++) {
            const x = (i * 151 + frame * 0.35) % (width + 120) - 60;
            const y = height * (0.2 + 0.6 * ((Math.sin(i * 1.7 + frame * 0.01) + 1) / 2));
            const radius = 4 + (i % 4);
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
            ctx.fill();
        }
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        frame += 1;
        if (mode === 'network') {
            drawNetwork();
        } else if (mode === 'waves') {
            drawWaves();
        }
        requestAnimationFrame(animate);
    }

    window.setBackgroundMode = nextMode => {
        mode = nextMode;
        canvas.style.opacity = mode === 'off' ? '0' : '0.6';
    };

    resize();
    particles = Array.from({ length: 92 }, () => new Particle());
    window.addEventListener('resize', resize);
    animate();
}

function initTemplateControls() {
    const backgroundSelect = document.getElementById('background-mode');
    const watermarkSelect = document.getElementById('watermark-mode');

    if (backgroundSelect) {
        backgroundSelect.addEventListener('change', () => {
            if (typeof window.setBackgroundMode === 'function') {
                window.setBackgroundMode(backgroundSelect.value);
            }
        });
    }

    if (watermarkSelect) {
        const applyWatermark = () => {
            const option = watermarkSelect.selectedOptions[0];
            if (!option || watermarkSelect.value === 'none') {
                document.body.classList.remove('has-watermark');
                return;
            }

            document.body.classList.add('has-watermark');
            document.body.style.setProperty('--watermark-image', `url('${option.dataset.image}')`);
            document.body.style.setProperty('--watermark-opacity', option.dataset.opacity || '0.085');
        };

        watermarkSelect.addEventListener('change', applyWatermark);
        applyWatermark();
    }
}

function initInteractiveDemo() {
    const canvas = document.getElementById('demo-canvas');
    const frequencySlider = document.getElementById('demo-frequency');
    const frequencyValue = document.getElementById('demo-frequency-value');
    const frameValue = document.getElementById('demo-frame');
    const statusValue = document.getElementById('demo-status');
    const toggleButton = document.getElementById('demo-toggle');
    const resetButton = document.getElementById('demo-reset');

    if (!canvas || !frequencySlider || !frequencyValue || !frameValue || !statusValue || !toggleButton || !resetButton) return;

    const ctx = canvas.getContext('2d');
    let frame = 0;
    let running = true;
    let rafId = null;

    function isDemoVisible() {
        const slide = canvas.closest('.page-content');
        return slide && !slide.classList.contains('hidden');
    }

    function sizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) return false;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.round(rect.width * dpr));
        canvas.height = Math.max(1, Math.round(rect.height * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return true;
    }

    function draw() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const frequency = Number(frequencySlider.value);
        if (width < 2 || height < 2) return;

        const dpr = window.devicePixelRatio || 1;
        const expectedWidth = Math.round(width * dpr);
        const expectedHeight = Math.round(height * dpr);
        if (Math.abs(canvas.width - expectedWidth) > 2 || Math.abs(canvas.height - expectedHeight) > 2) {
            sizeCanvas();
        }

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
        ctx.lineWidth = 1;
        for (let x = 40; x < width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 20);
            ctx.lineTo(x, height - 20);
            ctx.stroke();
        }
        for (let y = 40; y < height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(20, y);
            ctx.lineTo(width - 20, y);
            ctx.stroke();
        }

        const centerY = height / 2;
        const amplitude = Math.min(height * 0.28, 90);
        const phase = frame * 0.035;

        ctx.beginPath();
        for (let x = 0; x <= width; x++) {
            const t = x / width;
            const y = centerY + Math.sin(t * Math.PI * 2 * frequency + phase) * amplitude;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        for (let x = 0; x <= width; x++) {
            const t = x / width;
            const y = centerY + Math.cos(t * Math.PI * 2 * (frequency * 0.5) - phase * 0.7) * amplitude * 0.55;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.85)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = '600 13px Inter, sans-serif';
        ctx.fillText(`frequency = ${frequency}x`, 24, 32);

        frequencyValue.textContent = frequency;
        frameValue.textContent = frame.toString();
        statusValue.textContent = running ? '运行中' : '已暂停';
        statusValue.className = running ? 'text-xs font-bold text-emerald-700' : 'text-xs font-bold text-slate-600';
    }

    function tick() {
        if (running) frame += 1;
        draw();
        rafId = requestAnimationFrame(tick);
    }

    function refresh() {
        if (!isDemoVisible()) return;
        if (!sizeCanvas()) return;
        draw();
    }

    function refreshSoon() {
        requestAnimationFrame(refresh);
        setTimeout(refresh, 80);
        setTimeout(refresh, 240);
    }

    window.refreshInteractiveDemo = refreshSoon;

    frequencySlider.addEventListener('input', draw);
    toggleButton.addEventListener('click', () => {
        running = !running;
        toggleButton.textContent = running ? '暂停' : '继续';
        toggleButton.className = running
            ? 'px-3 py-2 text-xs font-bold rounded-lg bg-sky-600 text-white hover:bg-sky-500 transition-colors'
            : 'px-3 py-2 text-xs font-bold rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors';
        draw();
    });
    resetButton.addEventListener('click', () => {
        frame = 0;
        running = true;
        toggleButton.textContent = '暂停';
        toggleButton.className = 'px-3 py-2 text-xs font-bold rounded-lg bg-sky-600 text-white hover:bg-sky-500 transition-colors';
        draw();
    });

    window.addEventListener('resize', () => {
        refreshSoon();
    });

    const demoSlide = canvas.closest('.page-content');
    if (demoSlide) {
        new MutationObserver(refreshSoon).observe(demoSlide, { attributes: true, attributeFilter: ['class'] });
    }

    refreshSoon();
    if (!rafId) tick();
}

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

window.addEventListener('load', () => {
    initNetworkBackground();
    initTemplateControls();
    initInteractiveDemo();
    initKeyboardShortcuts();
    initSlides();
});

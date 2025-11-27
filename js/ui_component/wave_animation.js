/* ------------------------------------------------------------------
   FILE: wave_animation.js
   Description: Handles the background canvas animation.
   ------------------------------------------------------------------ */
class WaveEngine {
    constructor() {
        this.canvas = document.getElementById('wave-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.time = 0;
        this.loop();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.time += 0.005;

        // Gradient for waves
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        gradient.addColorStop(0, 'rgba(0, 242, 96, 0.1)');
        gradient.addColorStop(0.5, 'rgba(5, 117, 230, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 0, 204, 0.1)');

        this.drawWave(gradient, 100, 0.003, 50);
        this.drawWave(gradient, 150, 0.005, 100);
        this.drawWave(gradient, 200, 0.002, 150);

        requestAnimationFrame(() => this.loop());
    }

    drawWave(color, frequency, speed, offset) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height);

        for (let i = 0; i < this.canvas.width; i++) {
            // Sine wave formula
            const y = Math.sin(i * 0.003 + this.time + offset) * frequency * Math.sin(this.time * speed);
            this.ctx.lineTo(i, this.canvas.height / 1.5 + y);
        }

        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.closePath();
        this.ctx.fill();
    }
}
/* ------------------------------------------------------------------
   FILE: ui.js
   Description: Handles DOM manipulation and Animations.
   ------------------------------------------------------------------ */

class UserInterface {
    constructor() {
        this.consoleEl = document.getElementById('console-output');
        this.diskEl = document.getElementById('disk-visualizer');
        this.dirEl = document.getElementById('directory-list');
        this.countEl = document.getElementById('file-count');
        this.statsEl = document.getElementById('disk-stats');
        this.modalOverlay = document.getElementById('rupture-modal');
        this.modalBox = document.getElementById('modal-box');
    }

    /**
     * Log message to console with styling
     * @param {string} msg - Message to display (can include HTML)
     * @param {string} type - Message type: "info", "error", "success", "cmd"
     */
    log(msg, type = "info") {
        const div = document.createElement('div');
        div.innerHTML = msg;
        
        if (type === "error") div.className = "log-error";
        if (type === "success") div.className = "log-success";
        if (type === "cmd") div.className = "log-cmd";
        
        this.consoleEl.appendChild(div);
        this.consoleEl.scrollTop = this.consoleEl.scrollHeight;
    }

    /**
     * Render the entire UI based on core state
     * @param {FileSystemCore} core - The file system core instance
     */
    render(core) {
        this.renderDirectory(core);
        this.renderDisk(core);
    }

    /**
     * Render the file directory listing
     * @param {FileSystemCore} core
     */
    renderDirectory(core) {
        this.dirEl.innerHTML = "";
        const keys = Object.keys(core.files);
        this.countEl.textContent = `${keys.length} Files`;
        
        if (keys.length === 0) {
            this.dirEl.innerHTML = "<li style='opacity:0.5; border:none;'>(System Empty)</li>";
            return;
        }

        for (const [name, indices] of Object.entries(core.files)) {
            const li = document.createElement('li');
            
            // Check if file is fragmented
            const fragmented = core.isFileFragmented(name);
            const statusColor = fragmented ? '#ff00cc' : '#00f260';
            const icon = fragmented ? '⚠' : '📄';

            li.innerHTML = `
                <span style="color:${statusColor}">${icon}</span> 
                <strong>${name}</strong> 
                <span style="opacity:0.5; font-size:0.8em">[${indices.length}]</span>
            `;
            
            // Hover Events - highlight blocks when hovering over file
            li.onmouseenter = () => this.highlightBlocks(indices, true);
            li.onmouseleave = () => this.highlightBlocks(indices, false);
            
            this.dirEl.appendChild(li);
        }
    }

    /**
     * Render the disk visualizer grid
     * @param {FileSystemCore} core
     */
    renderDisk(core) {
        this.diskEl.innerHTML = "";
        let usedCount = 0;

        core.disk.forEach((val, idx) => {
            if (val !== "_") usedCount++;
            
            const div = document.createElement('div');
            div.id = `block-${idx}`;
            div.className = val !== "_" ? "block used" : "block";
            div.textContent = val !== "_" ? val : idx;
            
            this.diskEl.appendChild(div);
        });

        const pct = core.getUtilizationPercent();
        this.statsEl.textContent = `${pct}% Used`;
    }

    /**
     * Highlight specific blocks (for hover effects)
     * @param {number[]} indices - Block indices to highlight
     * @param {boolean} active - Whether to add or remove highlight
     */
    highlightBlocks(indices, active) {
        indices.forEach(idx => {
            const el = document.getElementById(`block-${idx}`);
            if (el) {
                active ? el.classList.add('highlight') : el.classList.remove('highlight');
            }
        });
    }

    /**
     * Trigger the "revive" scan animation
     */
    triggerReviveAnimation() {
        this.diskEl.classList.remove('revive-active');
        void this.diskEl.offsetWidth; // Force reflow
        this.diskEl.classList.add('revive-active');
        
        setTimeout(() => {
            this.diskEl.classList.remove('revive-active');
        }, 1200);
    }

    /**
     * Open the rupture confirmation modal
     */
    openModal() {
        this.modalOverlay.classList.add('active');
        this.modalBox.classList.add('shake-animation');
        
        setTimeout(() => {
            this.modalBox.classList.remove('shake-animation');
        }, 600);
    }

    /**
     * Close the rupture modal
     */
    closeModal() {
        this.modalOverlay.classList.remove('active');
    }

    /**
     * Clear all console output
     */
    clearConsole() {
        this.consoleEl.innerHTML = "";
    }
}
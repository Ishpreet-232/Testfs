/* ------------------------------------------------------------------
   FILE: main.js
   Description: Initialization and Event Listeners.
   
   This is the entry point that:
   - Initializes all system components
   - Sets up event handlers
   - Exposes necessary objects to global scope for HTML onclick handlers
   ------------------------------------------------------------------ */

// Initialize all system components
const core = new FileSystemCore(30);
const ui = new UserInterface();
const wave = new WaveEngine();
const commands = new CommandProcessor(core, ui);

// Expose to global scope for HTML onclick handlers
window.ui = ui;
window.commands = commands;

// Main application object
const main = {
    /**
     * Process user input from command line
     */
    processInput: () => {
        const inputEl = document.getElementById('command-input');
        const raw = inputEl.value.trim();
        
        if (!raw) return;

        // Log the command
        ui.log(`> ${raw}`, "cmd");
        
        // Parse command and arguments
        const parts = raw.split(" ");
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        // Execute command
        commands.execute(cmd, args);
        
        // Clear input
        inputEl.value = "";
    }
};

// Set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    const inputEl = document.getElementById('command-input');
    
    // Enter key to execute command
    inputEl.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            main.processInput();
        }
    });

    // Initial render
    ui.render(core);
});

// Also expose main for the execute button
window.main = main;
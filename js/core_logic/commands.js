/* ------------------------------------------------------------------
   FILE: commands.js
   Description: Command Dictionary and Execution Logic.
   ------------------------------------------------------------------ */

class CommandProcessor {
    constructor(core, ui) {
        this.core = core;
        this.ui = ui;
    }

    /**
     * Execute a command with arguments
     * @param {string} cmdName - Command name
     * @param {string[]} args - Command arguments
     */
    execute(cmdName, args) {
        switch(cmdName) {
            case 'forge':
                this.cmdForge(args);
                break;

            case 'banish':
                this.cmdBanish(args);
                break;

            case 'mend':
                this.cmdMend();
                break;

            case 'rupture':
                this.cmdRupture();
                break;

            case 'revive':
                this.cmdRevive();
                break;

            case 'clear':
                this.cmdClear();
                break;

            case 'help':
                this.cmdHelp();
                break;

            default:
                this.ui.log(`❓ Unknown command: ${cmdName}`, "error");
        }
    }

    /**
     * FORGE command - Create a new file
     * Usage: forge [name] [size]
     */
    cmdForge(args) {
        if (args.length !== 2) {
            return this.ui.log("Usage: forge [name] [size]", "error");
        }

        try {
            const indices = this.core.createFile(args[0], parseInt(args[1]));
            this.ui.render(this.core);
            this.ui.log(
                `✅ <strong>${args[0]}</strong> forged on blocks [${indices.join(', ')}]`, 
                "success"
            );
        } catch(e) {
            this.ui.log(`❌ ${e.message}`, "error");
        }
    }

    /**
     * BANISH command - Delete a file
     * Usage: banish [name]
     */
    cmdBanish(args) {
        if (args.length !== 1) {
            return this.ui.log("Usage: banish [name]", "error");
        }

        try {
            const count = this.core.deleteFile(args[0]);
            this.ui.render(this.core);
            this.ui.log(
                `🗑 <strong>${args[0]}</strong> banished. Freed ${count} blocks.`, 
                "info"
            );
        } catch(e) {
            this.ui.log(`❌ ${e.message}`, "error");
        }
    }

    /**
     * MEND command - Defragment the disk
     */
    cmdMend() {
        this.core.defrag();
        this.ui.render(this.core);
        this.ui.log("🧩 Memory Defragmented.", "success");
    }

    /**
     * RUPTURE command - Show confirmation modal
     * (Actual purge happens in executeRupture)
     */
    cmdRupture() {
        this.ui.openModal();
    }

    /**
     * Execute rupture after confirmation
     * Called by modal button
     */
    executeRupture() {
        this.core.ruptureRAM();
        this.ui.render(this.core);
        this.ui.closeModal();
        this.ui.log("💥 CRITICAL: Volatile Memory Purged.", "error");
    }

    /**
     * REVIVE command - Restore from backup
     */
    cmdRevive() {
        try {
            this.core.restoreFromBackup();
            this.ui.render(this.core);
            this.ui.triggerReviveAnimation();
            this.ui.log("✨ System Revived from Stasis.", "success");
        } catch(e) {
            this.ui.log(`⚠ ${e.message}`, "error");
        }
    }

    /**
     * CLEAR command - Clear console output
     */
    cmdClear() {
        this.ui.clearConsole();
    }

    /**
     * HELP command - Show available commands
     */
    cmdHelp() {
        this.ui.log(`
            <strong>Available Commands:</strong><br>
            <br>
            • <strong>forge [name] [size]</strong> - Create a new file<br>
            • <strong>banish [name]</strong> - Delete a file<br>
            • <strong>mend</strong> - Defragment disk<br>
            • <strong>rupture</strong> - Purge volatile memory<br>
            • <strong>revive</strong> - Restore from backup<br>
            • <strong>clear</strong> - Clear console<br>
            • <strong>help</strong> - Show this message
        `);
    }
}
/* ------------------------------------------------------------------
   FILE: core.js
   Description: Handles the raw data logic (The "Back-end").
   
   This class manages:
   - Disk array representation
   - File allocation and tracking
   - Free block management
   - Defragmentation
   - Backup/restore operations
   ------------------------------------------------------------------ */

class FileSystemCore {
    constructor(size = 30) {
        this.DISK_SIZE = size;
        this.disk = Array(size).fill("_");
        this.files = {}; // { "name": [0, 1, 2] }
    }

    /**
     * Get all free (unallocated) block indices
     * @returns {number[]} Array of free block indices
     */
    getFreeBlocks() {
        return this.disk.reduce((acc, val, idx) => 
            val === "_" ? [...acc, idx] : acc, []
        );
    }

    /**
     * Create a new file with specified name and size
     * @param {string} name - File name
     * @param {number} size - Number of blocks needed
     * @returns {number[]} Allocated block indices
     * @throws {Error} If file exists, invalid size, or insufficient space
     */
    createFile(name, size) {
        if (this.files[name]) {
            throw new Error(`File '${name}' already exists.`);
        }
        
        if (size <= 0) {
            throw new Error("Invalid file size.");
        }
        
        const freeIndices = this.getFreeBlocks();
        if (freeIndices.length < size) {
            throw new Error(
                `Insufficient memory. Need ${size}, available ${freeIndices.length}.`
            );
        }

        const allocated = freeIndices.slice(0, size);
        allocated.forEach(idx => this.disk[idx] = name[0].toUpperCase());
        this.files[name] = allocated;
        
        this.saveBackup();
        return allocated;
    }

    /**
     * Delete a file and free its blocks
     * @param {string} name - File name to delete
     * @returns {number} Number of blocks freed
     * @throws {Error} If file not found
     */
    deleteFile(name) {
        if (!this.files[name]) {
            throw new Error("File not found.");
        }
        
        const indices = this.files[name];
        indices.forEach(idx => this.disk[idx] = "_");
        delete this.files[name];
        
        this.saveBackup();
        return indices.length;
    }

    /**
     * Defragment disk - consolidate files to eliminate gaps
     * Moves all files to contiguous blocks starting from index 0
     */
    defrag() {
        let newDisk = Array(this.DISK_SIZE).fill("_");
        let pointer = 0;
        let newFiles = {};
        
        // Sort files by their first block index for deterministic order
        const sortedNames = Object.keys(this.files).sort(
            (a, b) => this.files[a][0] - this.files[b][0]
        );

        sortedNames.forEach(name => {
            const len = this.files[name].length;
            const newIndices = [];
            
            for (let i = 0; i < len; i++) {
                newDisk[pointer] = name[0].toUpperCase();
                newIndices.push(pointer++);
            }
            
            newFiles[name] = newIndices;
        });

        this.disk = newDisk;
        this.files = newFiles;
        this.saveBackup();
    }

    /**
     * Purge all RAM (volatile memory) - clears disk and file registry
     * NOTE: Does NOT save backup, allowing revival
     */
    ruptureRAM() {
        this.disk = Array(this.DISK_SIZE).fill("_");
        this.files = {};
    }

    /**
     * Restore file system from backup stored in localStorage
     * @throws {Error} If no backup found or backup is empty
     */
    restoreFromBackup() {
        const data = localStorage.getItem("fs_backup_mod");
        
        if (!data) {
            throw new Error("No backup found on disk.");
        }
        
        const backup = JSON.parse(data);
        
        if (Object.keys(backup).length === 0) {
            throw new Error("Backup is empty.");
        }

        this.files = backup;
        this.disk = Array(this.DISK_SIZE).fill("_");
        
        // Reconstruct disk array from file mapping
        for (const [name, indices] of Object.entries(this.files)) {
            indices.forEach(idx => this.disk[idx] = name[0].toUpperCase());
        }
    }

    /**
     * Save current file registry to localStorage as backup
     * Called automatically after create/delete/defrag operations
     */
    saveBackup() {
        localStorage.setItem("fs_backup_mod", JSON.stringify(this.files));
    }

    /**
     * Get total used blocks count
     * @returns {number} Number of allocated blocks
     */
    getUsedBlocksCount() {
        return this.disk.filter(val => val !== "_").length;
    }

    /**
     * Get utilization percentage
     * @returns {number} Percentage of disk used (0-100)
     */
    getUtilizationPercent() {
        return Math.round((this.getUsedBlocksCount() / this.DISK_SIZE) * 100);
    }

    /**
     * Check if a file is fragmented
     * @param {string} name - File name to check
     * @returns {boolean} True if file blocks are not contiguous
     */
    isFileFragmented(name) {
        if (!this.files[name]) return false;
        
        const indices = this.files[name];
        for (let i = 0; i < indices.length - 1; i++) {
            if (indices[i + 1] !== indices[i] + 1) {
                return true;
            }
        }
        return false;
    }
}
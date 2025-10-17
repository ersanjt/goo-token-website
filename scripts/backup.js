const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Backup script for Goo Token website
class BackupManager {
    constructor() {
        this.backupDir = './backups';
        this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    }

    async createBackup() {
        try {
            // Create backup directory if it doesn't exist
            if (!fs.existsSync(this.backupDir)) {
                fs.mkdirSync(this.backupDir, { recursive: true });
            }

            const backupPath = path.join(this.backupDir, `backup-${this.timestamp}`);
            
            // Create backup directory
            fs.mkdirSync(backupPath, { recursive: true });

            // Copy essential files
            const filesToBackup = [
                'index.html',
                'styles.css',
                'script.js',
                'README.md',
                'package.json'
            ];

            filesToBackup.forEach(file => {
                if (fs.existsSync(file)) {
                    fs.copyFileSync(file, path.join(backupPath, file));
                }
            });

            // Create backup info file
            const backupInfo = {
                timestamp: this.timestamp,
                files: filesToBackup,
                version: require('../package.json').version,
                created: new Date().toISOString()
            };

            fs.writeFileSync(
                path.join(backupPath, 'backup-info.json'),
                JSON.stringify(backupInfo, null, 2)
            );

            console.log(`✅ Backup created successfully: ${backupPath}`);
            return backupPath;

        } catch (error) {
            console.error('❌ Backup failed:', error.message);
            throw error;
        }
    }

    async cleanupOldBackups(keepCount = 5) {
        try {
            const backups = fs.readdirSync(this.backupDir)
                .filter(dir => dir.startsWith('backup-'))
                .sort()
                .reverse();

            if (backups.length > keepCount) {
                const toDelete = backups.slice(keepCount);
                toDelete.forEach(backup => {
                    const backupPath = path.join(this.backupDir, backup);
                    fs.rmSync(backupPath, { recursive: true, force: true });
                    console.log(`🗑️ Deleted old backup: ${backup}`);
                });
            }
        } catch (error) {
            console.error('❌ Cleanup failed:', error.message);
        }
    }

    async listBackups() {
        try {
            const backups = fs.readdirSync(this.backupDir)
                .filter(dir => dir.startsWith('backup-'))
                .map(backup => {
                    const backupPath = path.join(this.backupDir, backup);
                    const stats = fs.statSync(backupPath);
                    return {
                        name: backup,
                        created: stats.birthtime,
                        size: this.getDirectorySize(backupPath)
                    };
                })
                .sort((a, b) => b.created - a.created);

            console.log('📦 Available backups:');
            backups.forEach((backup, index) => {
                console.log(`${index + 1}. ${backup.name}`);
                console.log(`   Created: ${backup.created.toLocaleString()}`);
                console.log(`   Size: ${backup.size}`);
            });

            return backups;
        } catch (error) {
            console.error('❌ Failed to list backups:', error.message);
            return [];
        }
    }

    getDirectorySize(dirPath) {
        let totalSize = 0;
        const files = fs.readdirSync(dirPath);
        
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isDirectory()) {
                totalSize += this.getDirectorySize(filePath);
            } else {
                totalSize += stats.size;
            }
        });
        
        return this.formatBytes(totalSize);
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// CLI usage
if (require.main === module) {
    const backupManager = new BackupManager();
    const command = process.argv[2];

    switch (command) {
        case 'create':
            backupManager.createBackup()
                .then(() => backupManager.cleanupOldBackups())
                .catch(console.error);
            break;
        case 'list':
            backupManager.listBackups();
            break;
        default:
            console.log('Usage: node backup.js [create|list]');
    }
}

module.exports = BackupManager;

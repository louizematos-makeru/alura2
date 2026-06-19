/**
 * STORAGE.JS
 * Gerencia persistência de dados usando localStorage e IndexedDB
 */

'use strict';

class StorageManager {
    constructor() {
        this.dbName = 'DashboardDB';
        this.storeName = 'items';
        this.db = null;
        this.init();
    }

    /**
     * Inicializa o gerenciador de storage
     */
    async init() {
        console.log('💾 StorageManager iniciando...');
        
        // Verifica se IndexedDB está disponível
        if ('indexedDB' in window) {
            await this.initIndexedDB();
        }
        
        // Faz backup no localStorage
        this.setupLocalStorageBackup();
    }

    /**
     * Inicializa IndexedDB
     */
    initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => {
                console.error('❌ Erro ao abrir IndexedDB:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ IndexedDB inicializado');
                resolve(this.db);
            };

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
                    store.createIndex('createdAt', 'createdAt', { unique: false });
                    store.createIndex('completed', 'completed', { unique: false });
                    console.log('📦 Object store criado');
                }
            };
        });
    }

    /**
     * Configura backup automático no localStorage
     */
    setupLocalStorageBackup() {
        setInterval(() => {
            if (window.dashboard && window.dashboard.items) {
                this.saveToLocalStorage('dashboardItems', window.dashboard.items);
                console.log('🔄 Backup automático realizado');
            }
        }, 30000); // A cada 30 segundos
    }

    /**
     * Salva dados no localStorage
     */
    saveToLocalStorage(key, data) {
        try {
            const serialized = JSON.stringify(data);
            
            // Verifica limite de armazenamento (geralmente 5-10MB)
            if (serialized.length > 5 * 1024 * 1024) {
                console.warn('⚠️ Dados muito grandes para localStorage');
                return false;
            }

            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar no localStorage:', error);
            return false;
        }
    }

    /**
     * Carrega dados do localStorage
     */
    loadFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('❌ Erro ao carregar do localStorage:', error);
            return null;
        }
    }

    /**
     * Remove dados do localStorage
     */
    removeFromLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('❌ Erro ao remover do localStorage:', error);
            return false;
        }
    }

    /**
     * Limpa todo o localStorage
     */
    clearLocalStorage() {
        try {
            localStorage.clear();
            console.log('🧹 localStorage limpo');
            return true;
        } catch (error) {
            console.error('❌ Erro ao limpar localStorage:', error);
            return false;
        }
    }

    /**
     * Salva item no IndexedDB
     */
    async saveItemToIndexedDB(item) {
        if (!this.db) return false;

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(item);

            request.onsuccess = () => {
                console.log('✅ Item salvo no IndexedDB:', item.id);
                resolve(true);
            };

            request.onerror = () => {
                console.error('❌ Erro ao salvar no IndexedDB:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Carrega item do IndexedDB
     */
    async getItemFromIndexedDB(id) {
        if (!this.db) return null;

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result || null);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Carrega todos os itens do IndexedDB
     */
    async getAllItemsFromIndexedDB() {
        if (!this.db) return [];

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result || []);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Remove item do IndexedDB
     */
    async removeItemFromIndexedDB(id) {
        if (!this.db) return false;

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);

            request.onsuccess = () => {
                console.log('✅ Item removido do IndexedDB:', id);
                resolve(true);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Limpa todo o IndexedDB
     */
    async clearIndexedDB() {
        if (!this.db) return false;

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onsuccess = () => {
                console.log('🧹 IndexedDB limpo');
                resolve(true);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Exporta dados como JSON
     */
    exportAsJSON(filename = 'backup.json') {
        const data = window.dashboard?.items || [];
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        console.log('📤 Dados exportados como JSON');
    }

    /**
     * Importa dados de um arquivo JSON
     */
    importFromJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (!Array.isArray(data)) {
                        throw new Error('Formato inválido');
                    }

                    // Valida estrutura dos itens
                    const validItems = data.filter(item => 
                        item.id && item.text && item.createdAt
                    );

                    resolve(validItems);
                    console.log('✅ Dados importados:', validItems.length, 'itens');
                } catch (error) {
                    reject(new Error('Erro ao importar: ' + error.message));
                }
            };

            reader.onerror = () => {
                reject(new Error('Erro ao ler arquivo'));
            };

            reader.readAsText(file);
        });
    }

    /**
     * Sincroniza dados entre tabs/windows
     */
    setupSyncronization() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'dashboardItems' && e.newValue) {
                try {
                    const updatedItems = JSON.parse(e.newValue);
                    if (window.dashboard) {
                        window.dashboard.items = updatedItems;
                        window.dashboard.renderItems();
                        window.dashboard.updateDashboard();
                        console.log('🔄 Dados sincronizados de outra aba');
                    }
                } catch (error) {
                    console.error('❌ Erro ao sincronizar:', error);
                }
            }
        });
    }

    /**
     * Obtém estatísticas de armazenamento
     */
    getStorageStats() {
        const stats = {
            localStorage: {
                available: true,
                itemsCount: Object.keys(localStorage).length,
                approximateSize: new Blob(Object.values(localStorage)).size
            },
            sessionStorage: {
                available: true,
                itemsCount: Object.keys(sessionStorage).length,
                approximateSize: new Blob(Object.values(sessionStorage)).size
            },
            indexedDB: {
                available: 'indexedDB' in window
            }
        };

        console.log('📊 Estatísticas de Storage:', stats);
        return stats;
    }

    /**
     * Cria um ponto de restauração
     */
    createCheckpoint(name) {
        const checkpoint = {
            name: name,
            timestamp: new Date().toISOString(),
            data: window.dashboard?.items || []
        };

        const key = `checkpoint_${Date.now()}`;
        this.saveToLocalStorage(key, checkpoint);
        console.log('📸 Checkpoint criado:', name);
        return key;
    }

    /**
     * Restaura de um checkpoint
     */
    restoreCheckpoint(checkpointKey) {
        const checkpoint = this.loadFromLocalStorage(checkpointKey);
        
        if (checkpoint && window.dashboard) {
            window.dashboard.items = checkpoint.data;
            window.dashboard.saveData();
            window.dashboard.renderItems();
            window.dashboard.updateDashboard();
            console.log('↩️ Restaurado checkpoint:', checkpoint.name);
            return true;
        }

        return false;
    }

    /**
     * Lista todos os checkpoints
     */
    listCheckpoints() {
        const checkpoints = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('checkpoint_')) {
                const checkpoint = this.loadFromLocalStorage(key);
                if (checkpoint) {
                    checkpoints.push({ key, ...checkpoint });
                }
            }
        }

        return checkpoints;
    }
}

// Inicializa StorageManager
document.addEventListener('DOMContentLoaded', () => {
    window.storage = new StorageManager();
    window.storage.setupSyncronization();
});

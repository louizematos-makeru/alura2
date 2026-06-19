/**
 * APP.JS
 * Arquivo principal da aplicação
 * Gerencia navegação, eventos e lógica principal
 */

'use strict';

class Dashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.items = [];
        this.init();
    }

    /**
     * Inicializa a aplicação
     */
    init() {
        console.log('🚀 Dashboard iniciando...');
        this.setupEventListeners();
        this.loadData();
        this.updateDashboard();
        this.applyTheme();
    }

    /**
     * Configura todos os event listeners
     */
    setupEventListeners() {
        // Hamburger menu
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        hamburger?.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-links').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Sidebar navigation
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(link.dataset.section);
                this.setActiveLink(link);
            });
        });

        // Items
        document.getElementById('addItemBtn')?.addEventListener('click', () => {
            this.addItem();
        });

        document.getElementById('itemInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addItem();
            }
        });

        // Dark mode
        document.getElementById('darkModeToggle')?.addEventListener('change', (e) => {
            this.toggleDarkMode(e.target.checked);
        });

        // Clear data
        document.getElementById('clearDataBtn')?.addEventListener('click', () => {
            this.clearAllData();
        });
    }

    /**
     * Navega para uma seção
     */
    navigateTo(section) {
        const oldSection = document.querySelector('.content-section.active');
        const newSection = document.getElementById(section);

        if (!newSection) return;

        // Remove active de todas as seções
        document.querySelectorAll('.content-section').forEach(s => {
            s.classList.remove('active');
        });

        // Ativa a nova seção
        newSection.classList.add('active');
        this.currentSection = section;

        // Scroll para o topo
        window.scrollTo(0, 0);

        console.log(`📄 Navegando para: ${section}`);
    }

    /**
     * Define o link ativo na sidebar
     */
    setActiveLink(link) {
        document.querySelectorAll('.sidebar-link').forEach(l => {
            l.classList.remove('active');
        });
        link.classList.add('active');
    }

    /**
     * Adiciona um novo item
     */
    addItem() {
        const input = document.getElementById('itemInput');
        const text = input?.value.trim();

        if (!text) {
            console.warn('⚠️ Campo vazio');
            return;
        }

        const item = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
        };

        this.items.push(item);
        this.saveData();
        this.renderItems();
        this.updateDashboard();

        input.value = '';
        input.focus();

        console.log('✅ Item adicionado:', item);
    }

    /**
     * Remove um item
     */
    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveData();
        this.renderItems();
        this.updateDashboard();

        console.log('🗑️ Item removido:', id);
    }

    /**
     * Marca/desmarca um item como concluído
     */
    toggleItem(id) {
        const item = this.items.find(i => i.id === id);
        if (item) {
            item.completed = !item.completed;
            this.saveData();
            this.renderItems();
            this.updateDashboard();

            console.log('🔄 Item alternado:', id);
        }
    }

    /**
     * Renderiza a lista de itens
     */
    renderItems() {
        const list = document.getElementById('itemsList');
        if (!list) return;

        if (this.items.length === 0) {
            list.classList.add('empty');
            list.innerHTML = '';
            return;
        }

        list.classList.remove('empty');
        list.innerHTML = this.items
            .map(item => this.createItemElement(item))
            .join('');

        // Adiciona event listeners aos checkboxes
        document.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.toggleItem(parseInt(e.target.dataset.id));
            });
        });

        // Adiciona event listeners aos botões de deletar
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Tem certeza que deseja deletar este item?')) {
                    this.removeItem(parseInt(btn.dataset.id));
                }
            });
        });
    }

    /**
     * Cria um elemento de item
     */
    createItemElement(item) {
        const date = new Date(item.createdAt);
        const formattedDate = date.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <li class="item ${item.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="item-checkbox" 
                    data-id="${item.id}"
                    ${item.completed ? 'checked' : ''}
                >
                <div class="item-content">
                    <p class="item-text">${this.escapeHtml(item.text)}</p>
                    <p class="item-date">Criado em: ${formattedDate}</p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-danger btn-sm btn-delete" data-id="${item.id}">
                        🗑️ Deletar
                    </button>
                </div>
            </li>
        `;
    }

    /**
     * Atualiza o dashboard com estatísticas
     */
    updateDashboard() {
        const total = this.items.length;
        const completed = this.items.filter(i => i.completed).length;
        const pending = total - completed;
        const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

        // Atualiza cards do dashboard
        document.getElementById('totalItems').textContent = total;
        document.getElementById('completedItems').textContent = completed;
        document.getElementById('pendingItems').textContent = pending;
        document.getElementById('completionRate').textContent = rate + '%';

        // Atualiza analytics
        document.getElementById('analyticsTotalItems').textContent = total;
        document.getElementById('analyticsSuccessRate').textContent = rate + '%';
        document.getElementById('analyticsLastUpdate').textContent = 
            new Date().toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

        console.log('📊 Dashboard atualizado:', { total, completed, pending, rate });
    }

    /**
     * Alterna o modo escuro
     */
    toggleDarkMode(enabled) {
        if (enabled) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
            console.log('🌙 Modo escuro ativado');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
            console.log('☀️ Modo claro ativado');
        }
    }

    /**
     * Aplica o tema salvo
     */
    applyTheme() {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        const toggle = document.getElementById('darkModeToggle');
        
        if (darkMode) {
            document.body.classList.add('dark-mode');
            if (toggle) toggle.checked = true;
        }
    }

    /**
     * Limpa todos os dados
     */
    clearAllData() {
        if (confirm('⚠️ Tem certeza que deseja deletar TODOS os itens? Esta ação não pode ser desfeita.')) {
            this.items = [];
            this.saveData();
            this.renderItems();
            this.updateDashboard();
            console.log('🧹 Todos os dados foram limpos');
        }
    }

    /**
     * Salva os dados no localStorage
     */
    saveData() {
        localStorage.setItem('dashboardItems', JSON.stringify(this.items));
    }

    /**
     * Carrega os dados do localStorage
     */
    loadData() {
        const data = localStorage.getItem('dashboardItems');
        this.items = data ? JSON.parse(data) : [];
        this.renderItems();
        console.log('📥 Dados carregados:', this.items.length, 'itens');
    }

    /**
     * Escapa HTML para evitar XSS
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Exporta dados como JSON
     */
    exportData() {
        const dataStr = JSON.stringify(this.items, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `dashboard-backup-${new Date().getTime()}.json`;
        link.click();
        console.log('📤 Dados exportados');
    }

    /**
     * Importa dados de um arquivo JSON
     */
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (Array.isArray(imported)) {
                    this.items = imported;
                    this.saveData();
                    this.renderItems();
                    this.updateDashboard();
                    console.log('📥 Dados importados com sucesso');
                }
            } catch (error) {
                console.error('❌ Erro ao importar dados:', error);
                alert('Erro ao importar dados. Verifique o arquivo.');
            }
        };
        reader.readAsText(file);
    }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
    console.log('✅ Aplicação carregada com sucesso!');
});

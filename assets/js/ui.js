/**
 * UI.JS
 * Gerencia interações e efeitos da interface do usuário
 */

'use strict';

class UIManager {
    constructor() {
        this.init();
    }

    /**
     * Inicializa o gerenciador de UI
     */
    init() {
        console.log('🎨 UIManager iniciando...');
        this.setupAnimations();
        this.setupTooltips();
        this.setupKeyboardShortcuts();
        this.observeScrolling();
    }

    /**
     * Configura animações de entrada
     */
    setupAnimations() {
        // Fade in dos cards
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.animation = `fadeIn 0.5s ease-in ${index * 0.1}s both`;
        });

        // Fade in dos itens da sidebar
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        sidebarItems.forEach((item, index) => {
            item.style.animation = `slideIn 0.5s ease-out ${index * 0.05}s both`;
        });
    }

    /**
     * Configura tooltips
     */
    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target);
            });
            element.addEventListener('mouseleave', (e) => {
                this.hideTooltip(e.target);
            });
        });
    }

    /**
     * Mostra um tooltip
     */
    showTooltip(element) {
        const text = element.dataset.tooltip;
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
        tooltip.style.left = (rect.left + (rect.width - tooltip.offsetWidth) / 2) + 'px';
        
        setTimeout(() => tooltip.classList.add('visible'), 10);
        
        element._tooltip = tooltip;
    }

    /**
     * Esconde um tooltip
     */
    hideTooltip(element) {
        if (element._tooltip) {
            element._tooltip.classList.remove('visible');
            setTimeout(() => {
                element._tooltip?.remove();
                element._tooltip = null;
            }, 300);
        }
    }

    /**
     * Configura atalhos de teclado
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K: Focus no input de itens
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('itemInput')?.focus();
            }

            // Escape: Fechar menu mobile
            if (e.key === 'Escape') {
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                if (hamburger.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    }

    /**
     * Observa o scroll da página
     */
    observeScrolling() {
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                document.body.classList.add('scrolled');
            } else {
                document.body.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }

    /**
     * Mostra uma notificação toast
     */
    static showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('visible'), 10);
        
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /**
     * Mostra um modal de confirmação
     */
    static showConfirmModal(title, message, onConfirm, onCancel) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary modal-cancel">Cancelar</button>
                    <button class="btn btn-primary modal-confirm">Confirmar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeModal = () => {
            modal.classList.add('closing');
            setTimeout(() => modal.remove(), 300);
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-cancel').addEventListener('click', () => {
            closeModal();
            onCancel?.();
        });
        modal.querySelector('.modal-confirm').addEventListener('click', () => {
            closeModal();
            onConfirm?.();
        });
        
        // Fecha ao clicar fora do modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
                onCancel?.();
            }
        });
    }

    /**
     * Adiciona efeito de ondulação (ripple)
     */
    static addRippleEffect(element) {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    }

    /**
     * Anima um número
     */
    static animateNumber(element, start, end, duration = 1000) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                element.textContent = end;
                clearInterval(timer);
            } else {
                element.textContent = Math.round(current);
            }
        }, 16);
    }

    /**
     * Cria uma barra de progresso
     */
    static createProgressBar(container, value, max = 100) {
        const percentage = (value / max) * 100;
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `
            <div class="progress-fill" style="width: ${percentage}%"></div>
            <span class="progress-text">${Math.round(percentage)}%</span>
        `;
        container.appendChild(progressBar);
        return progressBar;
    }

    /**
     * Detecta preferência de esquema de cores
     */
    static detectColorScheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    /**
     * Bloqueia scroll
     */
    static lockScroll() {
        document.body.style.overflow = 'hidden';
    }

    /**
     * Desbloqueia scroll
     */
    static unlockScroll() {
        document.body.style.overflow = '';
    }

    /**
     * Copia texto para o clipboard
     */
    static copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            UIManager.showToast('✅ Copiado para o clipboard!', 'success', 2000);
        }).catch(() => {
            UIManager.showToast('❌ Erro ao copiar', 'error', 2000);
        });
    }

    /**
     * Formata um número em formato de moeda
     */
    static formatCurrency(value, currency = 'BRL') {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency
        }).format(value);
    }

    /**
     * Formata uma data
     */
    static formatDate(date, format = 'pt-BR') {
        return new Date(date).toLocaleDateString(format);
    }

    /**
     * Carrega um arquivo
     */
    static loadFile(callback, accept = '*') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.addEventListener('change', (e) => {
            callback(e.target.files[0]);
        });
        input.click();
    }
}

// Adiciona estilos do toast e modal ao document
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        background-color: #333;
        color: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    }

    .toast.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .toast-success {
        background-color: #7ed321;
    }

    .toast-error {
        background-color: #d0021b;
    }

    .toast-warning {
        background-color: #f8e71c;
        color: #333;
    }

    .toast-info {
        background-color: #50e3c2;
        color: #333;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
    }

    .modal-content {
        background-color: white;
        border-radius: 0.75rem;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
        animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e0e0e0;
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.5rem;
    }

    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #999;
    }

    .modal-body {
        padding: 1.5rem;
    }

    .modal-footer {
        display: flex;
        gap: 1rem;
        padding: 1.5rem;
        border-top: 1px solid #e0e0e0;
        justify-content: flex-end;
    }

    .progress-bar {
        position: relative;
        height: 20px;
        background-color: #e0e0e0;
        border-radius: 10px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #4a90e2, #f5a623);
        transition: width 0.5s ease;
    }

    .progress-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.75rem;
        font-weight: bold;
        color: #333;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

document.head.appendChild(styleSheet);

// Inicializa UIManager quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new UIManager();
});

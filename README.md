# 📊 Alura Dashboard

Um painel de controle moderno, responsivo e otimizado desenvolvido com HTML, CSS e JavaScript vanilla.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Active-brightgreen)

## ✨ Características

- ✅ **Layout Responsivo** - Funciona perfeitamente em desktop, tablet e mobile
- ✅ **Dashboard Interativo** - Visualize suas estatísticas em tempo real
- ✅ **Gerenciador de Itens** - Adicione, marque e delete itens facilmente
- ✅ **Modo Escuro** - Alternância entre temas claro e escuro
- ✅ **Dados Persistentes** - Salvamento automático no localStorage
- ✅ **Analytics** - Análises e estatísticas detalhadas
- ✅ **Atalhos de Teclado** - Produtividade aumentada
- ✅ **Animações Suaves** - Interface fluida e agradável
- ✅ **Código Otimizado** - Vanilla JS, sem dependências externas
- ✅ **Acessibilidade** - Segue boas práticas de acessibilidade

## 🚀 Início Rápido

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Sem necessidade de servidor - funciona como arquivo estático!

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/louizematos-makeru/alura2.git
cd alura2
```

2. **Abra o arquivo**
```bash
# Método 1: Abra o index.html diretamente
open index.html

# Método 2: Use um servidor local simples
python -m http.server 8000
```

3. **Começar a usar**
- Adicione itens usando o campo de entrada
- Marque itens como concluídos
- Visualize suas estatísticas

## 📁 Estrutura de Arquivos

```
alura2/
├── index.html                 # Arquivo principal HTML
├── assets/
│   ├── css/
│   │   ├── style.css         # Estilos principais
│   │   └── responsive.css    # Estilos responsivos
│   └── js/
│       ├── app.js            # Lógica principal
│       ├── ui.js             # Gerenciamento de UI
│       └── storage.js        # Gerenciamento de dados
└── README.md                 # Documentação
```

## 🎯 Funcionalidades

### 📈 Dashboard
- Total de itens
- Itens concluídos
- Itens pendentes
- Taxa de conclusão

### 📋 Gerenciador de Itens
- Adicionar novos itens
- Marcar como concluído
- Deletar itens
- Sincronização automática

### 📊 Análises
- Resumo geral
- Taxa de sucesso
- Última atualização

### ⚙️ Configurações
- Modo escuro
- Notificações
- Limpar dados

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl + K` / `Cmd + K` | Foca no campo de entrada |
| `Escape` | Fecha o menu mobile |
| `Enter` | Adiciona um novo item |

## 📱 Responsividade

- **Desktop**: Layout completo
- **Tablet**: Menu horizontal
- **Mobile**: Menu hamburguer
- **Extra Small**: Interface otimizada

## 💾 Armazenamento

- LocalStorage para dados persistentes
- IndexedDB para backup automático
- Sincronização entre abas
- Proteção contra perda de dados

## 🔒 Segurança

- ✅ Proteção contra XSS
- ✅ Dados locais apenas
- ✅ Sem servidores externos
- ✅ Validação de entrada

## 📦 API JavaScript

### Dashboard
```javascript
window.dashboard.addItem();
window.dashboard.removeItem(itemId);
window.dashboard.toggleItem(itemId);
window.dashboard.updateDashboard();
```

### Storage
```javascript
window.storage.saveToLocalStorage(key, data);
window.storage.loadFromLocalStorage(key);
window.storage.exportAsJSON();
```

### UI Manager
```javascript
UIManager.showToast('Mensagem', 'success');
UIManager.showConfirmModal('Título', 'Mensagem', onConfirm);
UIManager.copyToClipboard('texto');
```

## 🌐 Compatibilidade

| Navegador | Suporte |
|-----------|---------|
| Chrome/Edge | ✅ Total |
| Firefox | ✅ Total |
| Safari | ✅ Total |
| Mobile | ✅ Total |

## 📝 Licença

MIT License - Veja LICENSE para detalhes

## 👤 Autor

Desenvolvido com ❤️ por [louizematos-makeru](https://github.com/louizematos-makeru)

## 🤝 Contribuições

Contribuições são bem-vindas! Faça um fork, crie sua branch e abra um pull request.

## 📞 Suporte

Encontrou um problema? Abra uma [issue no GitHub](https://github.com/louizematos-makeru/alura2/issues)

---

**Desenvolvido com ❤️ usando HTML, CSS e JavaScript vanilla**

⭐ Se gostou, deixe uma estrela! ⭐

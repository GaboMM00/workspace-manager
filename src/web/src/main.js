"use strict";

// Workspace Manager Application with Eel integration
class WorkspaceManager {
    constructor() {
        this.workspaces = [];
        this.currentLinks = [];
        this.initializeApp();
        this.bindEvents();
        this.loadWorkspaces();
    }

    initializeApp() {
        console.log('Workspace Manager initialized (with Eel)');
    }

    bindEvents() {
        const addBtn = document.getElementById('add-workspace-btn');
        addBtn?.addEventListener('click', () => this.showCreateForm());

        const backBtn = document.getElementById('back-btn');
        backBtn?.addEventListener('click', () => this.hideCreateForm());

        const addLinkBtn = document.getElementById('add-link-btn');
        addLinkBtn?.addEventListener('click', () => this.addLink());

        const linkInput = document.getElementById('link-input');
        linkInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addLink();
            }
        });

        const createForm = document.getElementById('create-workspace-form');
        createForm?.addEventListener('submit', (e) => this.handleCreateWorkspace(e));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideCreateForm();
            }
        });
    }

    showCreateForm() {
        const overlay = document.getElementById('create-form-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            const nameInput = document.getElementById('workspace-name');
            setTimeout(() => nameInput?.focus(), 100);
        }
    }

    hideCreateForm() {
        const overlay = document.getElementById('create-form-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            this.resetForm();
        }
    }

    resetForm() {
        const form = document.getElementById('create-workspace-form');
        form?.reset();
        this.currentLinks = [];
        this.updateLinksDisplay();
    }

    addLink() {
        const linkInput = document.getElementById('link-input');
        const url = linkInput.value.trim();
        if (!url) return;

        if (!this.isValidURL(url)) {
            this.showNotification('Please enter a valid URL', 'error');
            return;
        }

        if (this.currentLinks.some(link => link.url === url)) {
            this.showNotification('This link has already been added', 'error');
            return;
        }

        const newLink = {
            id: this.generateId(),
            url: url
        };
        this.currentLinks.push(newLink);
        linkInput.value = '';
        this.updateLinksDisplay();
        linkInput.focus();
    }

    removeLink(linkId) {
        this.currentLinks = this.currentLinks.filter(link => link.id !== linkId);
        this.updateLinksDisplay();
    }

    updateLinksDisplay() {
        const linksList = document.getElementById('links-list');
        if (!linksList) return;
        linksList.innerHTML = '';
        for (const link of this.currentLinks) {
            const linkElement = this.createLinkElement(link);
            linksList.appendChild(linkElement);
        }
    }

    createLinkElement(link) {
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item';
        linkItem.innerHTML = `
            <a href="${link.url}" target="_blank" class="link-url">${link.url}</a>
            <button type="button" class="remove-link-btn" data-link-id="${link.id}">
                ✕
            </button>
        `;
        const removeBtn = linkItem.querySelector('.remove-link-btn');
        removeBtn?.addEventListener('click', () => this.removeLink(link.id));
        return linkItem;
    }

    async handleCreateWorkspace(e) {
        e.preventDefault();
        const nameInput = document.getElementById('workspace-name');
        const workspaceName = nameInput.value.trim();
        if (!workspaceName) {
            this.showNotification('Please enter a workspace name', 'error');
            return;
        }

        // Check for duplicate
        if (this.workspaces.some(ws => ws.name.toLowerCase() === workspaceName.toLowerCase())) {
            this.showNotification('A workspace with this name already exists', 'error');
            return;
        }

        const links = this.currentLinks.map(link => link.url);

        try {
            await eel.create_workspace(workspaceName, links)();
            this.showNotification(`Workspace "${workspaceName}" created successfully!`, 'success');
            this.hideCreateForm();
            await this.loadWorkspaces();
        } catch (error) {
            console.error('Error creating workspace:', error);
            this.showNotification('Failed to create workspace', 'error');
        }
    }

    async loadWorkspaces() {
        try {
            const workspaces = await eel.get_workspaces()();
            this.workspaces = workspaces;
            this.renderWorkspaces();
        } catch (error) {
            console.error('Error loading workspaces:', error);
        }
    }

    renderWorkspaces() {
        const grid = document.querySelector('.workspace-grid');
        if (!grid) return;

        grid.innerHTML = '';
        if (this.workspaces.length === 0) {
            const emptyState = this.createEmptyState();
            grid.appendChild(emptyState);
            return;
        }

        for (const workspace of this.workspaces) {
            const card = this.createWorkspaceCard(workspace);
            grid.appendChild(card);
        }
    }

    createWorkspaceCard(workspace) {
        const card = document.createElement('div');
        card.className = 'workspace-card';
        card.innerHTML = `
            <h3 class="workspace-name">${this.escapeHtml(workspace.name)}</h3>
            <p class="workspace-description">${workspace.links.length} link(s)</p>
        `;
        card.addEventListener('click', () => this.openWorkspace(workspace.name));
        return card;
    }

    async openWorkspace(name) {
        try {
            await eel.open_workspace(name)();
            this.showNotification(`Opening workspace "${name}"`, 'info');
        } catch (error) {
            console.error('Error opening workspace:', error);
            this.showNotification('Failed to open workspace', 'error');
        }
    }

    createEmptyState() {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #6b6b6b;">
                <h3>No workspaces yet</h3>
                <p>Create your first workspace to get started</p>
            </div>
        `;
        return emptyState;
    }

    isValidURL(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            font-weight: 500;
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background: #10b981;' :
            type === 'error' ? 'background: #ef4444;' : 'background: #6366f1;'}
        `;

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WorkspaceManager();
});

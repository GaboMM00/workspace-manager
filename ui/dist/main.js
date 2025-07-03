"use strict";
// Workspace Manager Application
class WorkspaceManager {
    constructor() {
        this.workspaces = [];
        this.currentLinks = [];
        this.initializeApp();
        this.bindEvents();
        this.loadWorkspaces();
    }
    initializeApp() {
        console.log('Workspace Manager initialized');
    }
    bindEvents() {
        // Floating add button
        const addBtn = document.getElementById('add-workspace-btn');
        addBtn?.addEventListener('click', () => this.showCreateForm());
        // Back button
        const backBtn = document.getElementById('back-btn');
        backBtn?.addEventListener('click', () => this.hideCreateForm());
        // Add link button
        const addLinkBtn = document.getElementById('add-link-btn');
        addLinkBtn?.addEventListener('click', () => this.addLink());
        // Link input enter key
        const linkInput = document.getElementById('link-input');
        linkInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addLink();
            }
        });
        // Create workspace form
        const createForm = document.getElementById('create-workspace-form');
        createForm?.addEventListener('submit', (e) => this.handleCreateWorkspace(e));
        // Escape key to close form
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
            // Focus on name input
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
        if (!url)
            return;
        // Basic URL validation
        if (!this.isValidURL(url)) {
            this.showNotification('Please enter a valid URL', 'error');
            return;
        }
        // Check for duplicates
        if (this.currentLinks.some(link => link.url === url)) {
            this.showNotification('This link has already been added', 'error');
            return;
        }
        // Add link to current list
        const newLink = {
            id: this.generateId(),
            url: url
        };
        this.currentLinks.push(newLink);
        linkInput.value = '';
        this.updateLinksDisplay();
        // Re-focus on input for easy addition of more links
        linkInput.focus();
    }
    removeLink(linkId) {
        this.currentLinks = this.currentLinks.filter(link => link.id !== linkId);
        this.updateLinksDisplay();
    }
    updateLinksDisplay() {
        const linksList = document.getElementById('links-list');
        if (!linksList)
            return;
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `;
        // Bind remove button
        const removeBtn = linkItem.querySelector('.remove-link-btn');
        removeBtn?.addEventListener('click', () => this.removeLink(link.id));
        return linkItem;
    }
    handleCreateWorkspace(e) {
        e.preventDefault();
        const nameInput = document.getElementById('workspace-name');
        const workspaceName = nameInput.value.trim();
        if (!workspaceName) {
            this.showNotification('Please enter a workspace name', 'error');
            return;
        }
        // Check for duplicate names
        if (this.workspaces.some(workspace => workspace.name.toLowerCase() === workspaceName.toLowerCase())) {
            this.showNotification('A workspace with this name already exists', 'error');
            return;
        }
        // Create new workspace
        const newWorkspace = {
            id: this.generateId(),
            name: workspaceName,
            links: [...this.currentLinks],
            createdAt: new Date()
        };
        this.workspaces.push(newWorkspace);
        this.saveWorkspaces();
        this.renderWorkspaces();
        this.hideCreateForm();
        this.showNotification(`Workspace "${workspaceName}" created successfully!`, 'success');
        // If this is for Python + Eel integration, you could call Python function here:
        // eel.create_workspace(newWorkspace)();
    }
    renderWorkspaces() {
        const grid = document.querySelector('.workspace-grid');
        if (!grid)
            return;
        // Clear existing cards (except demo cards, for now we'll replace all)
        grid.innerHTML = '';
        for (const workspace of this.workspaces) {
            const card = this.createWorkspaceCard(workspace);
            grid.appendChild(card);
        }
        // Add empty state if no workspaces
        if (this.workspaces.length === 0) {
            const emptyState = this.createEmptyState();
            grid.appendChild(emptyState);
        }
    }
    createWorkspaceCard(workspace) {
        const card = document.createElement('div');
        card.className = 'workspace-card';
        card.setAttribute('data-workspace-id', workspace.id);
        const iconSvg = this.getWorkspaceIcon(workspace.name);
        const linkCount = workspace.links.length;
        const linkText = linkCount === 1 ? '1 link' : `${linkCount} links`;
        card.innerHTML = `
            <div class="workspace-icon">
                ${iconSvg}
            </div>
            <h3 class="workspace-name">${this.escapeHtml(workspace.name)}</h3>
            <p class="workspace-description">${linkText}</p>
        `;
        // Add click handler to open workspace
        card.addEventListener('click', () => this.openWorkspace(workspace));
        return card;
    }
    createEmptyState() {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #6b6b6b;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 16px; opacity: 0.5;">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h3 style="margin-bottom: 8px; font-size: 18px;">No workspaces yet</h3>
                <p style="font-size: 14px;">Create your first workspace to get started</p>
            </div>
        `;
        return emptyState;
    }
    openWorkspace(workspace) {
        // For Python + Eel integration, you could call:
        // eel.open_workspace(workspace.id)();
        // For demo purposes, we'll open all links
        for (const link of workspace.links) {
            window.open(link.url, '_blank');
        }
        this.showNotification(`Opening ${workspace.name} workspace`, 'info');
    }
    getWorkspaceIcon(name) {
        // Simple icon selection based on workspace name
        const lowerName = name.toLowerCase();
        if (lowerName.includes('dev') || lowerName.includes('code')) {
            return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 18L22 12L16 6M8 6L2 12L8 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
        }
        if (lowerName.includes('design') || lowerName.includes('ui')) {
            return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="L2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="L2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
        }
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    }
    loadWorkspaces() {
        // For Python + Eel integration, you could call:
        // eel.get_workspaces()((workspaces) => {
        //     this.workspaces = workspaces;
        //     this.renderWorkspaces();
        // });
        // For demo purposes, load from localStorage
        const saved = localStorage.getItem('workspaces');
        if (saved) {
            try {
                this.workspaces = JSON.parse(saved);
                this.renderWorkspaces();
            }
            catch (e) {
                console.error('Failed to load workspaces:', e);
            }
        }
        else {
            this.renderWorkspaces();
        }
    }
    saveWorkspaces() {
        // For Python + Eel integration, you could call:
        // eel.save_workspaces(this.workspaces)();
        // For demo purposes, save to localStorage
        localStorage.setItem('workspaces', JSON.stringify(this.workspaces));
    }
    isValidURL(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        }
        catch (_) {
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
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        // Add notification styles
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
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}
// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WorkspaceManager();
});
// For Python + Eel integration, you would expose functions like:
// eel.expose(workspaceCreated);
// function workspaceCreated(workspace) {
//     // Handle workspace creation from Python
// }

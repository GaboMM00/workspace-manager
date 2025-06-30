import tkinter as tk
from tkinter import simpledialog, messagebox
from core.workspace_manager import WorkspaceManager
from core.link_handler import open_links

class MainWindow:
    def __init__(self):
        self.manager = WorkspaceManager()

    def run(self):
        self.root = tk.Tk()
        self.root.title("Workspace Manager")

        self.create_menu()

        self.root.mainloop()

    def create_menu(self):
        self.menu = tk.Menu(self.root)
        self.root.config(menu=self.menu)

        self.menu.add_command(label="Create Workspace", command=self.add_workspace)

        # List existing workspaces
        for name in self.manager.get_workspace_names():
            self.menu.add_command(label=name, command=lambda n=name: self.open_workspace(n))

        self.menu.add_command(label="Quit", command=self.root.quit)

    def open_workspace(self, name):
        links = self.manager.get_links(name)
        if links:
            open_links(links)
        else:
            messagebox.showinfo("No Links", f"No links found for {name}.")

    def add_workspace(self):
        name = simpledialog.askstring("Create Workspace", "Enter workspace name:")
        if name:
            links = simpledialog.askstring("Add Links", "Enter links separated by commas:")
            if links:
                link_list = [link.strip() for link in links.split(',')]
                self.manager.create_workspace(name, link_list)
                messagebox.showinfo("Success", f"Workspace '{name}' created.")
                self.menu.add_command(label=name, command=lambda n=name: self.open_workspace(n))
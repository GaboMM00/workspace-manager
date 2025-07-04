import os
import sys
import eel
from core.workspace_manager import WorkspaceManager
from core.link_handler import open_links

# import shutil

# chrome_path = shutil.which("chrome") or shutil.which("google-chrome") or shutil.which("chromium")

print("Empaquetando...")
def resource_path(relative_path):
    try:
        # Para PyInstaller (--onefile)
        base_path = sys._MEIPASS
    except AttributeError:
        # Para ejecución normal (modo desarrollo)
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)


manager = WorkspaceManager()

eel.init(resource_path('src/web'))

@eel.expose
def get_workspaces():
    workspaces = []
    for name in manager.get_workspace_names():
        links = manager.get_links(name)
        workspaces.append({
            "name": name,
            "links": links
        })
    return workspaces

@eel.expose
def create_workspace(name, links):
    manager.create_workspace(name, links)
    return True

@eel.expose
def open_workspace(name):
    links = manager.get_links(name)
    if links:
        open_links(links)
        return True
    else:
        return False
    
# eel.start('index.html', size=(400, 500), resizable=False)
eel.start(
    'index.html',
    mode='chrome',
    size=(400, 500),
    cmdline_args=[
        '--window-size=400,500',
        '--disable-resize',  # intenta sugerir que no redimensione
    ]
)


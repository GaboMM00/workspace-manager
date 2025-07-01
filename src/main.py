# from ui.main_window import MainWindow

# if __name__ == "__main__":
#     app = MainWindow()
#     manager = app.manager
#     print("Available workspaces:", manager.get_workspace_names())
#     app.run()
import eel
from core.workspace_manager import WorkspaceManager
from core.link_handler import open_links

if __name__ == "__main__":
    manager = WorkspaceManager()

    eel.init('src/web')

    @eel.expose
    def get_workspace_names():
        return manager.get_workspace_names()

    @eel.expose
    def create_workspace(name, links):
        link_list = [link.strip() for link in links.split(',')]
        manager.create_workspace(name, link_list)
        return True

    @eel.expose
    def open_workspace(name):
        links = manager.get_links(name)
        if links:
            open_links(links)
            return True
        else:
            return False

    eel.start('index.html', size=(20, 20))
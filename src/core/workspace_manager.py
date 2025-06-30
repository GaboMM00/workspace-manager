from data.data_storage import DataStorage

class WorkspaceManager:
    def __init__(self):
        self.storage = DataStorage()

    def create_workspace(self, name, links):
        self.storage.add_workspace(name, links)

    def get_workspace_names(self):
        return self.storage.get_workspace_names()

    def get_links(self, name):
        return self.storage.get_links(name)
import json
import os

class DataStorage:
    def __init__(self, filename='workspaces.json'):
        self.filename = filename
        if not os.path.exists(self.filename):
            with open(self.filename, 'w') as f:
                json.dump({}, f)

    def add_workspace(self, name, links):
        data = self.load_data()
        if name not in data:
            data[name] = links
            self.save_data(data)

    def get_workspace_names(self):
        return list(self.load_data().keys())

    def get_links(self, name):
        data = self.load_data()
        return data.get(name, [])

    def load_data(self):
        with open(self.filename, 'r') as f:
            return json.load(f)

    def save_data(self, data):
        with open(self.filename, 'w') as f:
            json.dump(data, f)
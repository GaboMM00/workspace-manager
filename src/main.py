from ui.main_window import MainWindow

if __name__ == "__main__":
    app = MainWindow()
    manager = app.manager
    print("Available workspaces:", manager.get_workspace_names())
    app.run()
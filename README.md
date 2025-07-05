# ⚡ Workspace Manager

Workspace Manager is a lightweight and modern Windows application designed to help you manage customized workspaces. Currently focused on organizing collections of links, it allows you to open multiple websites at once with a single click. In future versions, Workspace Manager will also support managing and launching local applications inside each workspace.

---

## ✨ Features

* 📁 **Workspace management**: Create and manage multiple workspaces, each with its own name and collection of links.
* 🔗 **Organize your favorite links**: Easily add, remove, and manage website links within each workspace.
* 🚀 **One-click launch**: Instantly open all links in a workspace with one click.
* 🖌️ **Modern interface**: Clean and intuitive UI designed for a smooth user experience.
* 🔮 **Future-ready**: Prepared to support local application management in future updates.

---

## ⚙️ Requirements

* **Operating system**: Windows
* **Python**: 3.13.3
* **Dependencies**:

  * [`eel`](https://github.com/python-eel/Eel) for Python ↔ frontend integration
* **Node.js**: Only needed for developing or modifying the UI (not required for running the app)

---

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/your-username/Workspace-Manager.git
cd Workspace-Manager
```

### Install Python dependencies

```bash
pip install -r requirements.txt
```

### (Optional) Install UI development dependencies

```bash
cd src/web
npm install
```

---

## 💻 Usage

### Run from source

```bash
python src/main.py
```

A window will open with the UI, allowing you to create and manage your workspaces.

### Run from executable

The executable is located inside the `dist` folder (e.g., `dist/WorkspaceManager.exe`).

```bash
dist/WorkspaceManager.exe
```

---

## 📦 Project structure

```
Workspace-Manager/
├── dist/                # Generated executable
├── src/
│   ├── core/           # Business logic (workspace and link management)
│   ├── web/            # UI (HTML, CSS, TypeScript)
│   └── main.py         # Main entry point
└── README.md
```

---

## ❓ FAQ

### Do I need Node.js to run the app?

No, Node.js is only required if you want to modify and rebuild the UI. To run the app, only Python and its dependencies are needed.

### Which browser does it use to open links?

By default, it uses Chrome. However, if Chrome is not available, it will fall back to your system's default browser.

### Where can I find the executable?

You can find the executable file in the `dist` folder at the root of the project.

---

## 🔒 License

This project is licensed under the **GNU GPLv3 (General Public License v3.0)**, which means:

* You are protected against external appropriation and commercial use without permission.
* Any derivative works must also be open source under the same license.
* You may adapt or change the license in the future if you are the original author.

> Check the `LICENSE` file for detailed information.

---

## 🙏 Credits

Developed and maintained by \[Medina Miramontes Gabriel Alejadro].

Special thanks to the Eel community and the modern frontend tools that inspired this project.

---

Ready to boost your productivity with smarter workspace management! ⭐

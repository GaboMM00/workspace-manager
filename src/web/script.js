async function refreshWorkspaces() {
    const list = document.getElementById("workspace-list");
    list.innerHTML = "";

    try {
        const names = await eel.get_workspace_names()();
        names.forEach(name => {
            const li = document.createElement("li");
            li.textContent = name;
            li.onclick = async () => {
                const success = await eel.open_workspace(name)();
                if (!success) {
                    alert("No links found for " + name);
                }
            };
            list.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching workspace names:", error);
    }
}

document.getElementById("add-btn").onclick = async () => {
    const name = prompt("Enter workspace name:");
    if (name) {
        const links = prompt("Enter links separated by commas:");
        if (links) {
            try {
                await eel.create_workspace(name, links)();
                alert("Workspace '" + name + "' created.");
                refreshWorkspaces();
            } catch (error) {
                console.error("Error creating workspace:", error);
            }
        }
    }
};

refreshWorkspaces();
import webbrowser

def open_links(links):
    for link in links:
        webbrowser.open_new_tab(link)
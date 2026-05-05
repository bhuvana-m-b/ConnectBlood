import os

def build_tree(path="repo"):
    files = []
    for root, _, filenames in os.walk(path):
        for f in filenames:
            files.append(os.path.relpath(os.path.join(root, f), path))
    return files

def select_js_files(tree):
    return [f for f in tree if f.endswith(".js")]

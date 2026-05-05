import os

def modify_files(files, requirements):
    for file in files:
        path = os.path.join("repo", file)

        if not os.path.exists(path):
            continue

        with open(path, "a") as f:
            f.write(f"\n// Modified for requirement: {requirements}\n")

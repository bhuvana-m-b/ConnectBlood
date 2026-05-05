import subprocess

def run_tests():
    return subprocess.run(["npm", "test"], cwd="repo")

import shutil
import os

def clean():
    if os.path.exists("repo"):
        shutil.rmtree("repo")

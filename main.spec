# main.spec

# -*- mode: python ; coding: utf-8 -*-
import os
from glob import glob

# Ruta absoluta del proyecto
project_root = os.path.abspath(".")

# Incluir todos los archivos dentro de src/web (html, js, css, etc.)
datas = [
    (file, os.path.relpath(os.path.dirname(file), project_root))
    for file in glob('src/web/**/*', recursive=True)
    if os.path.isfile(file)
]

a = Analysis(
    ['src/main.py'],
    pathex=[os.path.join(project_root, 'src')],
    binaries=[],
    datas=datas,
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='main',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    windowed=True,
    icon=os.path.abspath('icons/app_icon.ico'),
    onefile=True,
)

coll = exe

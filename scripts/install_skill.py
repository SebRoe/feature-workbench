#!/usr/bin/env python3
"""Install a self-contained snapshot; never overwrite an existing skill."""
import argparse
import os
from pathlib import Path
import shutil
import subprocess
import tempfile


def install(destination: Path) -> Path:
    root = Path(__file__).resolve().parents[1]
    target = destination.expanduser().absolute() / 'feature-workbench'
    if target.exists() or target.is_symlink():
        raise FileExistsError(f'Skill already exists: {target}; move it aside explicitly before reinstalling')
    files = subprocess.check_output(
        ['git', 'ls-files', '-z', '--', 'prototype', 'docs', 'README.md'], cwd=root
    ).decode().split('\0')
    revision = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root).decode().strip()
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='.feature-workbench-', dir=target.parent) as temporary:
        staged = Path(temporary) / 'feature-workbench'
        shutil.copytree(root / 'skills' / 'feature-workbench', staged)
        foundation = staged / 'assets' / 'foundation'
        for name in filter(None, files):
            source = root / name
            if source.is_symlink():
                raise ValueError(f'Refusing symlink in foundation: {name}')
            output = foundation / name
            output.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, output)
        (foundation / 'REVISION').write_text(revision + '\n')
        # Check again before publishing the complete staged installation.
        if target.exists() or target.is_symlink():
            raise FileExistsError(f'Skill already exists: {target}')
        staged.rename(target)
    return target


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--host', choices=['codex', 'claude'], default='codex')
    parser.add_argument('--dest', type=Path, help='Override the host skills directory (for testing or custom installs)')
    args = parser.parse_args()
    destination = args.dest
    if destination is None:
        destination = (Path(os.environ.get('CODEX_HOME', str(Path.home() / '.codex'))) / 'skills'
                       if args.host == 'codex' else Path.home() / '.claude' / 'skills')
    try:
        print(install(destination))
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        parser.exit(1, f'Installation failed: {error}\n')


if __name__ == '__main__':
    main()

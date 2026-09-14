#!/usr/bin/env python3
"""Install a self-contained snapshot; never overwrite an existing skill."""
import argparse
import os
from pathlib import Path
import subprocess
import tempfile


def install(destination: Path) -> Path:
    root = Path(__file__).resolve().parents[1]
    target = destination.expanduser().absolute() / 'feature-workbench'
    if target.exists() or target.is_symlink():
        raise FileExistsError(f'Skill already exists: {target}; move it aside explicitly before reinstalling')
    revision = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root).decode().strip()
    entries = subprocess.check_output(
        ['git', 'ls-tree', '-r', '-z', revision, '--', 'skills/feature-workbench', 'prototype', 'docs', 'README.md'], cwd=root
    ).decode().split('\0')
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='.feature-workbench-', dir=target.parent) as temporary:
        staged = Path(temporary) / 'feature-workbench'
        foundation = staged / 'assets' / 'foundation'
        for entry in filter(None, entries):
            metadata, name = entry.split('\t', 1)
            mode, kind, object_id = metadata.split()
            if mode not in ('100644', '100755') or kind != 'blob':
                raise ValueError(f'Refusing non-regular file in snapshot: {name}')
            path = Path(name)
            if path.parts[:2] == ('skills', 'feature-workbench'):
                output = staged / path.relative_to('skills/feature-workbench')
            else:
                output = foundation / path
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_bytes(subprocess.check_output(['git', 'cat-file', 'blob', object_id], cwd=root))
            output.chmod(0o755 if mode == '100755' else 0o644)
        if not (staged / 'SKILL.md').is_file():
            raise ValueError('Commit the skill files before installing')
        (foundation / 'REVISION').write_text(revision + '\n')
        # Atomically reserve the name; never replace even an empty existing folder.
        target.mkdir()
        for child in staged.iterdir():
            child.rename(target / child.name)
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

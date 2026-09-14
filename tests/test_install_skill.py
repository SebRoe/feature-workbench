import subprocess
import tempfile
import unittest
from pathlib import Path
import shutil

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/install_skill.py'


class InstallationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / 'source'
        self.root.mkdir()
        (self.root / 'scripts').mkdir()
        shutil.copy2(SCRIPT, self.root / 'scripts/install_skill.py')
        for name, body in {
            'skills/feature-workbench/SKILL.md': 'shared instructions',
            'prototype/package.json': '{}',
            'prototype/src/app.ts': 'export {}',
            'docs/DESIGN.md': 'design',
            'README.md': 'foundation',
        }.items():
            path = self.root / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(body)
        self.git('init', '-q')
        self.git('add', '.')
        self.git('-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'fixture')
        self.destination = Path(self.temp.name) / 'installed'

    def git(self, *args):
        return subprocess.check_output(['git', *args], cwd=self.root)

    def run_installer(self):
        return subprocess.run(['python3', str(self.root / 'scripts/install_skill.py'), '--dest', str(self.destination)], capture_output=True, text=True)

    def test_copy_only_tracked_foundation_and_preserve_existing_install(self):
        (self.root / 'prototype/.env').write_text('private fixture')
        (self.root / 'prototype/node_modules').mkdir()
        (self.root / 'prototype/node_modules/cache').write_text('generated')
        result = self.run_installer()
        self.assertEqual(result.returncode, 0, result.stderr)
        installed = self.destination / 'feature-workbench'
        foundation = installed / 'assets/foundation'
        self.assertEqual((foundation / 'prototype/src/app.ts').read_text(), 'export {}')
        self.assertFalse((foundation / 'prototype/.env').exists())
        self.assertFalse((foundation / 'prototype/node_modules').exists())
        self.assertEqual((foundation / 'REVISION').read_text().strip(), self.git('rev-parse', 'HEAD').decode().strip())
        (installed / 'SKILL.md').write_text('keep me')
        self.assertNotEqual(self.run_installer().returncode, 0)
        self.assertEqual((installed / 'SKILL.md').read_text(), 'keep me')

    def test_refuses_tracked_symlink_without_partial_install(self):
        (self.root / 'prototype/link').symlink_to('/tmp')
        self.git('add', 'prototype/link')
        self.assertNotEqual(self.run_installer().returncode, 0)
        self.assertFalse((self.destination / 'feature-workbench').exists())
        self.assertEqual(list(self.destination.iterdir()), [])


if __name__ == '__main__':
    unittest.main()

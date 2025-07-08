# Migration from Devbox to Nix Flake

This project has been migrated from Devbox to a Nix flake for better reproducibility and Nix ecosystem integration.

## What Changed

### Before (Devbox)
```bash
# Development environment
devbox shell

# Build commands
devbox run compile
devbox run compile:all
devbox run install
```

### After (Nix Flake)
```bash
# Development environment
nix develop
# or if you have direnv: just cd into the directory

# Build commands
nix build                          # Build main package
nix build .#ghadmin-all           # Build all platforms
nix build .#ghadmin-linux-x64     # Build specific platform
nix run .                         # Run the application
```

## Migration Steps

1. **Enable Nix flakes** (if not already enabled):
   ```bash
   echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
   ```

2. **Remove devbox files** (optional):
   ```bash
   rm devbox.json devbox.lock
   ```

3. **Update direnv** (if using):
   Your `.envrc` now uses `use flake` instead of devbox.

## Development Workflow

### Enter Development Environment
```bash
# Option 1: Manual
nix develop

# Option 2: With direnv (recommended)
# Just cd into the project directory
cd /path/to/ghadmin
```

### Common Commands
```bash
# Run the application directly
deno run --allow-net --allow-env --allow-read main.ts

# Build for current platform (convenience function in dev shell)
compile

# Build for all platforms (convenience function in dev shell)
compile-all

# Run tests
deno test
# or use the convenience function: test
```

### Build Packages
```bash
# Build the main Nix package (uses Deno runtime)
nix build

# Build platform-specific compiled binaries
nix build .#ghadmin-linux-x64
nix build .#ghadmin-linux-arm64
nix build .#ghadmin-macos-x64
nix build .#ghadmin-macos-arm64
nix build .#ghadmin-windows-x64

# Build all platforms at once
nix build .#ghadmin-all
```

## Advantages of Nix Flake

1. **Reproducible builds**: Exact same environment across all machines
2. **No Docker needed**: Native cross-platform development
3. **Nix ecosystem**: Can be easily packaged for NixOS, nixpkgs, etc.
4. **Dependency management**: All dependencies are explicitly declared
5. **Caching**: Nix binary cache speeds up builds

## Compiled Binaries Note

The compiled binaries (ghadmin-linux-x64, etc.) are static executables created by `deno compile`, but they require network access during build for dependency resolution. The main package uses the Deno runtime and works perfectly with Nix's sandboxed builds.

For distribution, you can still create compiled binaries locally:
```bash
# In development environment
compile        # Current platform
compile-all    # All platforms
```

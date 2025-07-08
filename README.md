# ghadmin - GitHub Administration CLI

A powerful command-line tool for managing GitHub organizations, teams, and members efficiently.

## Features

- **Team Management**
  - Create and delete teams
  - List all teams in an organization
  - Manage team settings and permissions

- **Member Management**
  - Add/remove members to teams
  - Bulk add multiple users to teams
  - Invite users to organization
  - List team members
  - List pending organization invitations

## Installation

### Quick Install (Recommended)

Requirements:

- [Nix](https://nixos.org/download.html) with flakes enabled
- Git

```bash
# Clone the repository
git clone https://github.com/jordangarrison/ghadmin.git
cd ghadmin

# Run directly with Nix
nix run .

# Or build and install
nix build
./result/bin/ghadmin
```

To enable Nix flakes (if not already enabled):

```bash
echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
```

### Manual Installation

#### Download Binary

1. Visit the [Releases](https://github.com/jordan.garrison/ghadmin/releases) page
2. Download the appropriate binary for your platform:
   - Linux: `ghadmin-linux-x64` or `ghadmin-linux-arm64`
   - macOS: `ghadmin-macos-x64` or `ghadmin-macos-arm64`
   - Windows: `ghadmin-windows-x64.exe`
3. Make the binary executable (Unix-based systems):

   ```bash
   chmod +x ghadmin-*
   ```

4. Move it to your PATH:

   ```bash
   # Example for Unix-based systems
   sudo mv ghadmin-* /usr/local/bin/ghadmin
   ```

#### Build from Source with Nix

Requirements:

- [Nix](https://nixos.org/download.html) with flakes enabled
- Git

```bash
# Clone the repository
git clone https://github.com/jordangarrison/ghadmin.git
cd ghadmin

# Build main package (uses Deno runtime)
nix build

# Build platform-specific compiled binaries
nix build .#ghadmin-linux-x64    # Linux x64
nix build .#ghadmin-macos-arm64  # macOS Apple Silicon
nix build .#ghadmin-all          # All platforms
```

#### Legacy: Build with Deno directly

Requirements:

- [Deno](https://deno.land/) 1.40+
- Git

```bash
# Clone the repository
git clone https://github.com/jordangarrison/ghadmin.git
cd ghadmin

# Compile for current platform
deno compile --allow-net --allow-env --allow-read --output ghadmin main.ts
```

## Configuration

The CLI requires a GitHub token with appropriate permissions. Set it using environment variables:

```bash
export GITHUB_TOKEN=your_token_here
```

## Usage

### Team Management

```bash
# List all teams in an organization
ghadmin teams list <org>

# Create a new team
ghadmin teams create <org> <team-name> -d "Team description"

# Delete a team
ghadmin teams delete <org> <team-slug>
```

### Member Management

```bash
# List team members
ghadmin teams members list <org> <team-slug>

# Add a single member to a team
ghadmin teams members add <org> <team-slug> <username> --role=member

# Remove a member from a team
ghadmin teams members remove <org> <team-slug> <username>

# Bulk add multiple members to a team
ghadmin teams members bulk-add <org> <team-slug> "user1,user2,user3" --role=member

# Invite a user to the organization
ghadmin teams members invite <org> <username> --team-slugs="team1,team2" --role=direct_member

# List pending organization invitations
ghadmin teams members list-invites <org>
```

### Output Formats

All commands support different output formats using the `--format` flag:

```bash
# JSON output
ghadmin teams list <org> --format=json

# YAML output
ghadmin teams list <org> --format=yaml

# Table output (default)
ghadmin teams list <org> --format=table
```

## Development

### Prerequisites

- [Nix](https://nixos.org/download.html) with flakes enabled
- Git
- [direnv](https://direnv.net/) (optional but recommended)

### Setup

```bash
# Clone the repository
git clone https://github.com/jordangarrison/ghadmin.git
cd ghadmin

# Option 1: Use direnv (automatically loads environment)
# Just cd into the directory if direnv is set up

# Option 2: Enter Nix development shell manually
nix develop
```

### Available Commands

```bash
# Run the application
nix run .                    # Run with Nix
deno run --allow-net --allow-env --allow-read main.ts  # Run directly with Deno

# Build packages
nix build                    # Build main package
nix build .#ghadmin-all      # Build all platform binaries

# In development shell, use convenience functions:
compile                      # Compile for current platform
compile-all                  # Compile for all platforms
test                         # Run tests
```

### Platform-Specific Builds

```bash
# Individual platform builds
nix build .#ghadmin-linux-x64       # Linux x64
nix build .#ghadmin-linux-arm64     # Linux ARM64
nix build .#ghadmin-macos-x64       # macOS Intel
nix build .#ghadmin-macos-arm64     # macOS Apple Silicon
nix build .#ghadmin-windows-x64     # Windows x64

# Build all platforms at once
nix build .#ghadmin-all
```

### Migration from Devbox

If you're migrating from the previous devbox setup, see [MIGRATION.md](MIGRATION.md) for detailed instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits:

   ```bash
   feat: add new feature
   fix: resolve bug
   docs: update documentation
   ```

4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

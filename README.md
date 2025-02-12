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

- [Devbox](https://www.jetify.com/docs/devbox/)
- Git

```bash
# Clone the repository
git clone https://github.com/jordan.garrison/ghadmin.git
cd ghadmin

# Install using Devbox
devbox install
```

This will:

1. Compile the binary
2. Install it globally as `ghadmin`
3. Make it available in your PATH

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

#### Build from Source

Requirements:

- [Devbox](https://www.jetify.com/docs/devbox/)
- Git

```bash
# Clone the repository
git clone https://github.com/jordan.garrison/ghadmin.git
cd ghadmin

# Build using Devbox
devbox run compile

# Optional: Install globally
devbox run install
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

- [Devbox](https://www.jetify.com/docs/devbox/)
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/jordan.garrison/ghadmin.git
cd ghadmin

# Enter Devbox shell
devbox shell
```

### Available Scripts

```bash
# Compile for current platform
devbox run compile

# Compile for all platforms
devbox run compile:all

# Run tests
devbox run test
```

### Platform-Specific Builds

```bash
# Linux (x64)
devbox run compile:linux:x64

# Linux (ARM64)
devbox run compile:linux:arm64

# macOS (Intel)
devbox run compile:macos:x64

# macOS (Apple Silicon)
devbox run compile:macos:arm64

# Windows
devbox run compile:windows:x64
```

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

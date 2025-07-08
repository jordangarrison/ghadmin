{
  description = "ghadmin - GitHub Administration CLI";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        
        # Helper function to create compiled binaries
        mkCompiledBinary = { target, outputName }: pkgs.stdenv.mkDerivation {
          pname = "ghadmin-${target}";
          version = "0.1.0";
          src = pkgs.lib.cleanSource ./.;
          buildInputs = [ pkgs.deno ];
          buildPhase = ''
            mkdir -p dist
            deno compile --allow-net --allow-env --allow-read --target ${target} --output dist/${outputName} main.ts
          '';
          installPhase = ''
            mkdir -p $out/bin
            cp dist/${outputName} $out/bin/
          '';
        };
      in
      {
        packages = {
          default = pkgs.stdenv.mkDerivation rec {
            pname = "ghadmin";
            version = "0.1.0";

            src = pkgs.lib.cleanSource ./.;

            buildInputs = [ pkgs.deno ];

            installPhase = ''
              mkdir -p $out/bin $out/share/ghadmin

              # Copy source files (exclude build artifacts and dev files)
              cp -r . $out/share/ghadmin/
              rm -rf $out/share/ghadmin/.devcontainer || true
              rm -f $out/share/ghadmin/devbox.json $out/share/ghadmin/devbox.lock || true
              rm -f $out/share/ghadmin/flake.lock || true
              rm -rf $out/share/ghadmin/result* || true
              rm -rf $out/share/ghadmin/dist || true
              
              # Create wrapper script
              cat > $out/bin/ghadmin << EOF
              #!/bin/sh
              exec ${pkgs.deno}/bin/deno run \\
                --allow-net \\
                --allow-env \\
                --allow-read \\
                $out/share/ghadmin/main.ts "\$@"
              EOF
              
              chmod +x $out/bin/ghadmin
            '';

            meta = with pkgs.lib; {
              description = "GitHub Administration CLI";
              homepage = "https://github.com/jordangarrison/ghadmin";
              license = licenses.mit;
              maintainers = [ ];
            };
          };
          
          # Compiled binaries for different platforms
          ghadmin-linux-x64 = mkCompiledBinary {
            target = "x86_64-unknown-linux-gnu";
            outputName = "ghadmin-linux-x64";
          };
          
          ghadmin-linux-arm64 = mkCompiledBinary {
            target = "aarch64-unknown-linux-gnu";
            outputName = "ghadmin-linux-arm64";
          };
          
          ghadmin-macos-x64 = mkCompiledBinary {
            target = "x86_64-apple-darwin";
            outputName = "ghadmin-macos-x64";
          };
          
          ghadmin-macos-arm64 = mkCompiledBinary {
            target = "aarch64-apple-darwin";
            outputName = "ghadmin-macos-arm64";
          };
          
          ghadmin-windows-x64 = mkCompiledBinary {
            target = "x86_64-pc-windows-msvc";
            outputName = "ghadmin-windows-x64.exe";
          };
          
          # Convenience package that builds all platforms
          ghadmin-all = pkgs.stdenv.mkDerivation {
            pname = "ghadmin-all";
            version = "0.1.0";
            src = pkgs.lib.cleanSource ./.;
            buildInputs = [ pkgs.deno ];
            buildPhase = ''
              mkdir -p dist
              
              echo "Building for all platforms..."
              deno compile --allow-net --allow-env --allow-read --target x86_64-unknown-linux-gnu --output dist/ghadmin-linux-x64 main.ts
              deno compile --allow-net --allow-env --allow-read --target aarch64-unknown-linux-gnu --output dist/ghadmin-linux-arm64 main.ts
              deno compile --allow-net --allow-env --allow-read --target x86_64-apple-darwin --output dist/ghadmin-macos-x64 main.ts
              deno compile --allow-net --allow-env --allow-read --target aarch64-apple-darwin --output dist/ghadmin-macos-arm64 main.ts
              deno compile --allow-net --allow-env --allow-read --target x86_64-pc-windows-msvc --output dist/ghadmin-windows-x64.exe main.ts
            '';
            installPhase = ''
              mkdir -p $out/bin
              cp dist/* $out/bin/
            '';
          };
        };

        apps = {
          default = {
            type = "app";
            program = "${self.packages.${system}.default}/bin/ghadmin";
          };
        };

        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            deno
            git
          ];
          
          shellHook = ''
            echo "🦕 ghadmin development environment"
            echo "Available commands:"
            echo "  nix run .                           - Run ghadmin"
            echo "  nix build                           - Build ghadmin package"
            echo "  nix build .#ghadmin-all             - Build for all platforms"
            echo "  nix build .#ghadmin-linux-x64       - Build for Linux x64"
            echo "  nix build .#ghadmin-linux-arm64     - Build for Linux ARM64"
            echo "  nix build .#ghadmin-macos-x64       - Build for macOS x64"
            echo "  nix build .#ghadmin-macos-arm64     - Build for macOS ARM64"
            echo "  nix build .#ghadmin-windows-x64     - Build for Windows x64"
            echo "  deno run --allow-net --allow-env --allow-read main.ts - Run directly with Deno"
            echo "  deno test                           - Run tests"
            
            # Add convenience functions
            function compile() {
              echo "Compiling for current platform..."
              mkdir -p dist
              deno compile --allow-net --allow-env --allow-read --output dist/ghadmin main.ts
            }
            
            function compile-all() {
              echo "Building all platform binaries..."
              nix build .#ghadmin-all
              echo "Binaries built in ./result/bin/"
            }
            
            function test() {
              echo "Running tests..."
              deno test
            }
          '';
        };
      });
}

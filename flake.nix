{
  description = "Choice specs frontend";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-24.11";
  };

  outputs = { self, nixpkgs }:
    let
        pkgs = nixpkgs.legacyPackages.x86_64-linux;
    in 
    {
        devShells.x86_64-linux.default = pkgs.mkShell {
            packages = with pkgs; [
                bun
                docker
                docker-compose
            ];

            shellHook = ''
                echo "Choice specs frontend"
            '';
        };
    };
}

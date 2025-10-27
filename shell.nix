{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.openssh
    pkgs.git
    # podés agregar más paquetes si necesitás
  ];
}

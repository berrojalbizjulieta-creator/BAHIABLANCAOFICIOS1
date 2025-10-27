{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.openssh
    pkgs.git
    # agregá otros paquetes que necesites
  ];
}

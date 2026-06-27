{pkgs}: {
  deps = [
    pkgs.unzip
    pkgs.nodejs_20
    pkgs.yarn-berry
    pkgs.postgresql_16
    pkgs.meilisearch
    pkgs.curl
  ];
}

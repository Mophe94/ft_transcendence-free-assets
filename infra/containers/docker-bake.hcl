variable "IP" { default = "127.0.0.1"}
variable "REGISTRY" { default = "${IP}:8080" }
variable "BAKE_ROOT" { default = "." }

group "default" {
    targets = ["alpine_base"]
}

group "game_service" {
    targets = ["site"]
}

target "alpine_base" {
    context	= "${BAKE_ROOT}/base/"
    dockerfile	= "Dockerfile_base"
    tags	= ["${REGISTRY}/alpine-base:latest"]
}

target "site" {
    context     = "${BAKE_ROOT}/../../site/"
    dockerfile  = "Dockerfile_site"
    tags        = ["${REGISTRY}/site:latest"]
}

target "mynginx" {
    context	= "${BAKE_ROOT}/nginx/"
    dockerfile	= "Dockerfile_nginx"
    tags	= ["${REGISTRY}/mynginx:latest"]
}

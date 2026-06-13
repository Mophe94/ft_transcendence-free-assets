variable "IP" { default = "127.0.0.1"}
variable "REGISTRY" { default = "${IP}:80" }
variable "BAKE_ROOT" { default = "." }

group "default" {
    targets = ["alpine_base"]
}

group "databases" {
    targets = ["database_users", "database_game"]
}

group "site" {
    targets = ["frontend", "backend", "game"]
}

group "observ" {
    targets = ["fluent-bit"]
}

target "alpine_base" {
    context	= "${BAKE_ROOT}/base/"
    dockerfile	= "Dockerfile_base"
    tags	= ["${REGISTRY}/alpine-base:latest"]
}

target "frontend" {
    context     = "${BAKE_ROOT}/../../site/"
    dockerfile  = "Dockerfile"
    tags        = ["${REGISTRY}/frontend:latest"]
}

target "backend" {
    context     = "${BAKE_ROOT}/../../backend"
    dockerfile  = "Dockerfile"
    tags        = ["${REGISTRY}/backend:latest"]
}

target "game" {
    context     = "${BAKE_ROOT}/../../game_test"
    dockerfile  = "Dockerfile"
    tags        = ["${REGISTRY}/game:latest"]
}

target "database_users" {
    context     = "${BAKE_ROOT}/../../database/users_db"
    dockerfile  = "Dockerfile"
    tags        = ["${REGISTRY}/users_db:latest"]
}

target "database_game" {
    context     = "${BAKE_ROOT}/../../database/game_db"
    dockerfile  = "Dockerfile"
    tags        = ["${REGISTRY}/game_db:latest"]
}

target "fluent-bit" {
    context     = "${BAKE_ROOT}/fluent-bit"
    dockerfile  = Dockerfile
    tags        = ["${REGISTRY}/fluent-bit:latest"]
}

target "mynginx" {
    context	= "${BAKE_ROOT}/nginx/"
    dockerfile	= "Dockerfile_nginx"
    tags	= ["${REGISTRY}/mynginx:latest"]
}

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
    targets = ["frontend", "backend"]
}

target "alpine_base" {
    context	= "${BAKE_ROOT}/base/"
    dockerfile	= "Dockerfile_base"
    tags	= ["${REGISTRY}/alpine-base:latest"]
}

target "frontend" {
    context     = "${BAKE_ROOT}/../../site/FrontEnd"
    dockerfile  = "Dockerfile"
    tags        = ["${REGISTRY}/frontend:latest"]
}

target "backend" {
    context     = "${BAKE_ROOT}/../../site/BackEnd"
    dockerfile  = "Dockerfile"
    tags        = ["${REGISTRY}/backend:latest"]
}

target "database_users" {
    context     = "${BAKE_ROOT}/../../site/databases/users_db"
    dockerfile  = "Dockerfile"
    tags        = ["${REGISTRY}/users_db:latest"]
}

target "database_game" {
    context     = "${BAKE_ROOT}/../../site/databases/game_db"
    dockerfile  = "Dockerfile"
    tags        = ["${REGISTRY}/game_db:latest"]
}

target "mynginx" {
    context	= "${BAKE_ROOT}/nginx/"
    dockerfile	= "Dockerfile_nginx"
    tags	= ["${REGISTRY}/mynginx:latest"]
}

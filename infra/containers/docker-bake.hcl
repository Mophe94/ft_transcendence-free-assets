variable "LOCAL" { default = false }
variable "REGISTRY" { default = "127.0.0.1:5050" }
variable "TAG" { default = "latest" }
variable "BAKE_ROOT" { default = "." }

group "base" {
    targets = ["node-base", "postgress-base"]
}

group "databases" {
    targets = ["users_db", "game_db"]
}

group "observ" {
    targets = []
}

group "website" {
    targets = ["frontend", "backend"]
}

group "game" {
    targets = ["game", "redis"]
}

target "alpine-base" {
    context	= "${BAKE_ROOT}/base/"
    dockerfile	= "Dockerfile_alpine_base"
    tags	= ["${REGISTRY}/alpine-base:${TAG}"]
}

target "node-base" {
    context	= "${BAKE_ROOT}/base/"
    dockerfile	= "Dockerfile_node_base"
    tags	= ["${REGISTRY}/node-base:${TAG}"]
}

target "postgress-base" {
    context	= "${BAKE_ROOT}/base/"
    dockerfile	= "Dockerfile_postgress_base"
    tags	= ["${REGISTRY}/postgress-base:${TAG}"]
}

target "frontend" {
    context     = "${BAKE_ROOT}/../../site/"
    dockerfile  = "Dockerfile"
    contexts = {
	base-image = (LOCAL
	    ? "target:node-base"
	    : "docker-image://${REGISTRY}/node-base:${TAG}")
    }
    tags        = ["${REGISTRY}/frontend:${TAG}"]
}

target "backend" {
    context     = "${BAKE_ROOT}/../../backend"
    dockerfile  = "Dockerfile"
    contexts = {
	base-image = (LOCAL
	    ? "target:node-base"
	    : "docker-image://${REGISTRY}/node-base:${TAG}")
    }
    tags        = ["${REGISTRY}/backend:${TAG}"]
}

target "game" {
    context     = "${BAKE_ROOT}/../../game_test"
    dockerfile  = "Dockerfile"
    contexts = {
	base-image = (LOCAL
	    ? "target:node-base"
	    : "docker-image://${REGISTRY}/node-base:${TAG}")
    }
    tags        = ["${REGISTRY}/game:${TAG}"]
}

target "redis" {
    context     = "${BAKE_ROOT}/../../redis"
    dockerfile  = "Dockerfile"
    tags        = ["${REGISTRY}/redis:${TAG}"]
}

target "users_db" {
    context     = "${BAKE_ROOT}/../../database/users_db"
    dockerfile  = "Dockerfile"
    contexts = {
	base-image = (LOCAL
	    ? "target:postgress-base"
	    : "docker-image://${REGISTRY}/postgress-base:${TAG}")
    }
    tags        = ["${REGISTRY}/users_db:${TAG}"]
}

target "game_db" {
    context     = "${BAKE_ROOT}/../../database/game_db"
    dockerfile  = "Dockerfile"
    contexts = {
	base-image = (LOCAL
	    ? "target:postgress-base"
	    : "docker-image://${REGISTRY}/postgress-base:${TAG}")
    }
    tags        = ["${REGISTRY}/game_db:${TAG}"]
}

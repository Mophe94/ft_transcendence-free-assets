variable "LOCAL" { default = false }
variable "REGISTRY" { default = "127.0.0.1:5050" }
variable "TAG" { default = "latest" }
variable "BAKE_ROOT" { default = "." }
variable "TEAM_CONTAINER" { default = "." }
variable "HOST_IP" { default = "127.0.0.1" }
variable "API_42_CLIENT_ID" { default = "" }

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
    targets = ["backend"]
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
    context     = "${TEAM_CONTAINER}/site/"
    dockerfile  = "Dockerfile"
    contexts = {
	base-image = (LOCAL
	    ? "target:node-base"
	    : "docker-image://${REGISTRY}/node-base:${TAG}")
    }
    args        = {
          HTTPS_ADDR                  ="https://${HOST_IP}:8443"
          WSS_ADDR                    ="wss://${HOST_IP}:8443"
          API_42_CLIENT_ID            ="${API_42_CLIENT_ID}"
          API_42_OUTBOUND             ="http_://nginx:420/fortytwoapi"
          DOMAIN_NAME		      ="${HOST_IP}:8443"
    }
    output      = [ "type=local,dest=/nfs-storage/frontend" ]
}

target "backend" {
    context     = "${TEAM_CONTAINER}/backend"
    dockerfile  = "Dockerfile"
    contexts = {
	base-image = (LOCAL
	    ? "target:node-base"
	    : "docker-image://${REGISTRY}/node-base:${TAG}")
    }
    tags        = ["${REGISTRY}/backend:${TAG}"]
}

target "game" {
    context     = "${TEAM_CONTAINER}/game_test"
    dockerfile  = "Dockerfile"
    contexts = {
	base-image = (LOCAL
	    ? "target:node-base"
	    : "docker-image://${REGISTRY}/node-base:${TAG}")
    }
    tags        = ["${REGISTRY}/game:${TAG}"]
}

target "redis" {
    context     = "${TEAM_CONTAINER}/redis"
    dockerfile  = "Dockerfile"
    tags        = ["${REGISTRY}/redis:${TAG}"]
}

target "users_db" {
    context     = "${TEAM_CONTAINER}/database/users_db"
    dockerfile  = "Dockerfile"
    contexts = {
	base-image = (LOCAL
	    ? "target:postgress-base"
	    : "docker-image://${REGISTRY}/postgress-base:${TAG}")
    }
    tags        = ["${REGISTRY}/users_db:${TAG}"]
}

target "game_db" {
    context     = "${TEAM_CONTAINER}/database/game_db"
    dockerfile  = "Dockerfile"
    contexts = {
	base-image = (LOCAL
	    ? "target:postgress-base"
	    : "docker-image://${REGISTRY}/postgress-base:${TAG}")
    }
    tags        = ["${REGISTRY}/game_db:${TAG}"]
}

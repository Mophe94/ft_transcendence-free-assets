group "default" {
    targets = ["site"]
}

target "site" {
    context     = "site"
    dockerfile  = "Dockerfile_site"
    tags        = ["site:latest"]
}

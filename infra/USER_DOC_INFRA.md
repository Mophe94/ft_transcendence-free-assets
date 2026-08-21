# USER_DOC

## 1. Overview

This project provides a simple way to start and manage the Docker Swarm infrastructure.

**The only command you need to run is:**

```bash
make
```

The `Makefile` handles the complete startup process automatically.

---

## 2. First Run

When you run:

```bash
make
```

the Makefile checks whether `.env_infra` exists.

### If `.env_infra` does not exist

The Makefile:

1. Creates `.env_infra` from `template_env_infra`.
2. Opens `.env_infra` in `vim`.
3. Prompts you to fill in the required variables.
4. Validates the configuration.
5. Generates `.env_infra.mk`.
6. Waits for Tailscale to become ready.
7. Configures the Docker Swarm.
8. Builds the required images.
9. Pushes the images to the local registry.
10. Deploys the `website` and `game` stacks.

You only need to fill in the values when prompted.

---

## 3. Environment Variables

The environment file is:

```text
.env_infra
```

The default template is:

```text
template_env_infra
```

| Variable                       | Description                                                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `MANAGER_NUMBER`               | Should be odd. Number of Docker Swarm managers/nodes. The swarm will try to attaint that number of manager, if enough nodes are alvailable. |
| `REG_PORT`                     | Port used by the Docker image registry. Example: `REG_PORT=5000`. The registry is available through the host's Tailscale IP.                |
| `PROM_SCRAPE_PORT`             | Port used by Prometheus to scrape metrics. Example: `PROM_SCRAPE_PORT=9090`.                                                                |
| `p_node_<login>`               | Password for a node user. Replace `<login>` with the corresponding user's login. Example: `p_node_jdoe=your-password`.                      |
| `s_fortytwo_client_id`         | 42 API client ID.                                                                                                                           |
| `s_fortytwo_client_secret`     | 42 API client secret.                                                                                                                       |
| `API_42_CLIENT_ID`             | 42 API client ID used by the application.                                                                                                   |
| `s_jwt_secret_key`             | Secret key used to sign JSON Web Tokens. Use a strong, unique value.                                                                        |
| `s_db_game_postgres_password`  | PostgreSQL administrator password for the game database.                                                                                    |
| `s_db_game_db_name`            | Name of the game database.                                                                                                                  |
| `s_db_game_username`           | Username used by the game application to access PostgreSQL.                                                                                 |
| `s_db_game_password`           | Password used by the game application to access PostgreSQL.                                                                                 |
| `s_db_users_postgres_password` | PostgreSQL administrator password for the users database.                                                                                   |
| `s_db_users_db_name`           | Name of the users database.                                                                                                                 |
| `s_db_users_username`          | Username used by the users application to access PostgreSQL.                                                                                |
| `s_db_users_password`          | Password used by the users application to access PostgreSQL.                                                                                |
| `s_redis_password`             | Password used to authenticate with Redis.                                                                                                   |
| `s_grafana_admin_user`         | Grafana administrator username.                                                                                                             |
| `s_grafana_admin_password`     | Grafana administrator password.                                                                                                             |
| `GRAFANA_UID`                  | Linux user ID used by Grafana for filesystem permissions.                                                                                   |
| `GRAFANA_GID`                  | Linux group ID used by Grafana for filesystem permissions.                                                                                  |
| `PROMETHEUS_UID`               | Linux user ID used by Prometheus for filesystem permissions.                                                                                |
| `PROMETHEUS_GID`               | Linux group ID used by Prometheus for filesystem permissions.                                                                               |
| `LOKI_UID`                     | Linux user ID used by Loki for filesystem permissions.                                                                                      |
| `LOKI_GID`                     | Linux group ID used by Loki for filesystem permissions.                                                                                     |

---

## 4. Passwords and Secrets

The environment file uses prefixes to distinguish sensitive variables.

### Passwords

Variables beginning with:

```text
p_
```
are treated as passwords.

Example:

```text
p_node_jdoe=...
```

### Secrets

Variables beginning with:

```text
s_
```
are treated as secrets.

Examples:

```text
s_fortytwo_client_secret=...
s_jwt_secret_key=...
```

Both `p_` and `s_` variables are excluded from `.env_infra.mk` by `create_env.sh`.

**Never commit real passwords, API credentials, tokens, or other secrets to Git.**

It is recommended to add the following to `.gitignore`:

```gitignore
.env_infra
.env_infra.mk
logs/
```

---

# 5. Makefile Rules

The Makefile contains several targets besides the default `make` command.

The following rules are intended for manual infrastructure management or troubleshooting.

## `make`

This is the **default and recommended command**.

```bash
make
```

It launches the complete infrastructure:

```text
make
 |
 +-- Check environment
 |
 +-- Wait for Tailscale
 |
 +-- Configure Swarm
 |
 +-- Build base images
 |
 +-- Build and push application images
 |
 +-- Deploy website
 |
 +-- Deploy game
```

You normally do not need to call the individual targets manually.

---

## `make observ`

Deploys the observability stack.

This includes:

* Grafana
* Prometheus
* Loki

The target also creates the required storage directories and configures their filesystem permissions.

```bash
make observ
```

---

## `make up`

Builds and deploys the `up` stack.

```bash
make up
```

This is mainly intended for manual stack management.

---

## `make down`

Removes all currently deployed Docker Swarm stacks.

```bash
make down
```

> This stops/removes the deployed stacks. It does not remove the Docker Swarm itself.

---

## `make swarm_down`

Shuts down the Docker Swarm.

```bash
make swarm_down
```

This:

1. Removes the deployed stacks.
2. Runs the Swarm shutdown script.
3. Forces the current node to leave the Swarm.

Use this when you want to completely stop the Swarm environment.

---

## `make swarm-status`

Displays the current Docker Swarm status.

```bash
make swarm-status
```

Possible results include:

```text
Swarm status: active
```

or:

```text
Swarm status: inactive
```

---

## `make addnode`

Adds one or more nodes to the infrastructure.

```bash
make addnode
```

The Makefile prompts:

```text
Node user(s) you want to add:
```

Enter the appropriate node user(s).

---

## `make image`

Builds images for a specific target.

The target must be provided:

```bash
make image TARGET=base
make image TARGET=website
make image TARGET=databases
make image TARGET=game
```

The Makefile first checks whether the requested images already exist in the registry.

Missing images are built and pushed automatically.

---

## `make img_del`

Deletes one specific image from the registry.

Example:

```bash
make img_del IMAGE=backend TAG=latest
```

Both `IMAGE` and `TAG` are required.

---

## `make img_del_stack`

Deletes all images belonging to a specific stack.

Examples:

```bash
make img_del_stack TARGET=base TAG=latest
make img_del_stack TARGET=website TAG=latest
make img_del_stack TARGET=databases TAG=latest
make img_del_stack TARGET=game TAG=latest
```

---

## `make img_del_all`

Deletes all configured project images from the registry.

```bash
make img_del_all TAG=latest
```

This affects all images defined by the Makefile:

```text
node-base
postgress-base
backend
users_db
game_db
game
redis
```

Use this with care.

---

## `make fclean`

Performs a complete Docker cleanup.

```bash
make fclean
```

It:

1. Removes the `core`, `website`, `game`, and `observ` stacks.
2. Runs:

```bash
docker system prune -af --volumes
```

This can remove unused Docker images, containers, networks, build cache, and volumes.

**Use `fclean` with caution.**

---

# 6. Image Tags

The default image tag is:

```make
TAG ?= latest
```

Therefore, running:

```bash
make
```

uses:

```text
latest
```

You can override it:

```bash
make TAG=my-tag
```

For example:

```bash
make image TARGET=game TAG=dev
```

will check/build the `game` images using the `dev` tag.

---

# 7. Environment Generation

`.env_infra.mk` is generated automatically from `.env_infra`.

You should **not edit `.env_infra.mk` manually**.

The workflow is:

```text
template_env_infra
        |
        v
   .env_infra
        |
        v
 check_env.sh
        |
        v
 create_env.sh
        |
        v
 .env_infra.mk
```

The generated file contains the non-secret environment variables required by the Makefile.

---

# 8. In Short

For normal usage, remember only this:

```bash
make
```

If `.env_infra` does not exist, you will be asked to fill it in.

After that, `make` handles the infrastructure startup automatically.

The other Makefile commands are available for **manual management, maintenance, troubleshooting, image management, and shutdown**.

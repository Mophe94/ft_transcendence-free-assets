# USER_DOC

## 1. Overview

This project provides a simple way to create and start the VM environment.

**The only command you need to run is:**

```bash
make
```

The `Makefile` handles the complete setup automatically.

---

## 2. First Run

When you run:

```bash
make
```

the Makefile checks whether `.env_vm` exists.

### If `.env_vm` does not exist

The Makefile:

1. Creates `.env_vm` from `template_env_vm`.
2. Opens `.env_vm` in `vim`.
3. Prompts you to fill in the required variables.
4. Validates the configuration.
5. Generates `.env_vm.mk`.
6. Installs the project dependencies.
7. Creates/configures the VM as a **leader**.
8. Connects to the VM through SSH.

You only need to fill in the values when prompted.

---

## 3. Environment Variables

The environment file is:

```text
.env_vm
```

The default template is:

```text
template_env_vm
```

The variables currently available are:

| Variable          | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `BASE_DIR`        | Base directory used by the VM/project configuration. |
| `BASE_IMG`        | .vdi image used to create the VM.                    |
| `VM_DIR`          | Directory where you want VM files to be stored.      |
| `p_root_password` | Root password of the vdi image (already defined)     |
| `p_user_password` | Password for the VM user.                            |


The exact values for `BASE_DIR`, `BASE_IMG`, and `VM_DIR` depend on your local setup.

---

## 4. Passwords and Secrets

Variables beginning with:

```text
p_
```

are treated as passwords and are not exported into `.env_vm.mk`.

Variables beginning with:

```text
s_
```

are treated as secrets and are also excluded from `.env_vm.mk`.

For example:

```text
p_root_password=...
p_user_password=...
s_api_token=...
```

**Never commit real passwords, tokens, or other secrets to Git.**


## 5. What `make` Does

The simplified workflow is:

```text
make
 |
 +-- Check .env_vm
 |     |
 |     +-- Missing → create and ask user to fill it
 |
 +-- Validate environment
 |
 +-- Generate .env_vm.mk
 |
 +-- Install dependencies
 |
 +-- Configure leader VM
 |
 +-- SSH into the VM
```

### In short

> **Run `make`. If this is the first run, fill in `.env_vm` when prompted. Everything else is handled automatically.**

## 6. Usefull docker commands

These commands are mainly useful inside the VM.

## Docker

Check Docker:
`docker --version`
`docker info`

List containers:
`docker ps`
`docker ps -a`

Container logs:
`docker logs <container>`
`docker logs -f <container>`
`docker logs --tail 100 <container>`

Inspect a container:
`docker inspect <container>`

List images:
`docker images`

Check Docker disk usage:
`docker system df`

## Docker Swarm

Check Swarm status:
`docker info`

Look for:
`Swarm: active`

List Swarm nodes:
`docker node ls`

Inspect a node:
`docker node inspect <node> --pretty`

## Docker Services

List services:
`docker service ls`

Inspect a service:
`docker service inspect <service> --pretty`

Check service tasks:
`docker service ps <service>`

View service logs:
`docker service logs <service>`
`docker service logs -f <service>`
`docker service logs --tail 100 <service>`

Scale a service:
`docker service scale <service>=3`

Example:
`docker service scale website_backend=3`

Remove a service:
`docker service rm <service>`

> Be careful: this removes the service from the Swarm.

## Docker Stacks

List stacks:
`docker stack ls`

List services in a stack:
`docker stack services <stack>`

Example:
`docker stack services website`

List tasks in a stack:
`docker stack ps <stack>`

Example:
`docker stack ps website`

Show stack configuration:
`docker stack config -c <compose-file>`

Deploy a stack manually:
`docker stack deploy -c <compose-file> <stack>`

Normally, the project's Makefile should handle deployment.

Remove a stack:
`docker stack rm <stack>`

## Troubleshooting

If something is not working after running `make`, check:

`docker info`
`docker node ls`
`docker stack ls`
`docker service ls`

Then check the affected stack:

`docker stack services <stack>`
`docker stack ps <stack>`

Finally, check the service logs:

`docker service logs -f <service>`

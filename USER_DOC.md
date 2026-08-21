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

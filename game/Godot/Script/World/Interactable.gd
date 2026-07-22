class_name Interactable
extends Node2D

## Contrat commun à tout objet interactif (arbre, collectible, teleport, herbe...).
## Le Player est seul responsable de la détection ET du déclenchement de l'input.
## Chaque objet ne fait qu'implémenter ce qui lui est propre.

## Appelé par le Player quand le joueur appuie sur "action"
## alors que cet objet est l'interactable courant.
func interact(_player: Node2D) -> void:
	push_warning("interact() non implémenté sur " + name)

## Appelé une fois quand le joueur entre dans la TriggerZone de cet objet.
## Sert pour le feedback visuel propre à l'objet (fireflies, sprite "active", etc).
func on_enter_range(_player: Node2D) -> void:
	pass

## Appelé une fois quand le joueur quitte la TriggerZone de cet objet.
func on_exit_range(_player: Node2D) -> void:
	pass

## Le Player vérifie ça avant d'appeler interact().
## Permet à un objet de se désactiver (déjà utilisé, en cooldown, mash en cours...)
## sans que le Player ait besoin de connaître le détail de chaque type d'objet.
func can_interact() -> bool:
	return true

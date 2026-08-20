class_name Interactable
extends Node2D

func interact(_player: Node2D) -> void:
	push_warning("interact() non implémenté sur " + name)

func on_enter_range(_player: Node2D) -> void:
	pass

func on_exit_range(_player: Node2D) -> void:
	pass

func can_interact() -> bool:
	return true

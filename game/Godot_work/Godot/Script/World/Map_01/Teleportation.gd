extends Area2D
class_name Teleporter
 
@export var destination: Vector2 = Vector2(4032.055, 384.0)
 
 
func interact(player: Node2D) -> void:
	player.teleport_to(destination)
 
 

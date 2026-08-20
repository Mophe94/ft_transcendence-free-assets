extends Control
# Ce script va sur le noeud racine "Win"
 
@onready var spawn1: GPUParticles2D = $Spawn1
@onready var spawn2: GPUParticles2D = $Spawn2
 
@export var spawn1_ratio: Vector2 = Vector2(0.25, 0.5)
@export var spawn2_ratio: Vector2 = Vector2(0.75, 0.5)
 
func _ready():
	get_tree().get_root().size_changed.connect(_on_viewport_resized)
	_update_spawn_positions()
 
func _on_viewport_resized():
	_update_spawn_positions()
 
func _update_spawn_positions():
	var screen_size = get_viewport_rect().size
	spawn1.position = Vector2(screen_size.x * spawn1_ratio.x, screen_size.y * spawn1_ratio.y)
	spawn2.position = Vector2(screen_size.x * spawn2_ratio.x, screen_size.y * spawn2_ratio.y)

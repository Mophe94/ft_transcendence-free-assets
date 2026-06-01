extends Node2D


# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	$Player/CharacterBody2D/Camera2D.enabled = true
	$Player/CharacterBody2D.control = true
	if GeneralData.position_player != Vector2(0.0, 0.0):
		print(GeneralData.position_player)
		$Player.position = GeneralData.position_player


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta: float) -> void:
	pass


func _on_timer_timeout() -> void:
	$Player/CharacterBody2D/Camera2D.enabled = false
	get_tree().change_scene_to_file("res://Scene/Combat/combat.tscn")

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
	await get_tree().create_timer(10.0).timeout
	get_tree().change_scene_to_file("res://Scene/TeamSetup/team_setup.tscn")

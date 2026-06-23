extends Node2D

func _ready() -> void:
	$Player/CharacterBody2D/Camera2D.enabled = true
	$Player/CharacterBody2D.control = true
	if GeneralData.position_player != Vector2(0.0, 0.0):
		$Player.position = GeneralData.position_player

func _close_game():
	if Input.is_action_just_pressed("quit"):
		get_tree().quit( )
	

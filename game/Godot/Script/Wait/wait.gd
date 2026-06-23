extends Control

func _scene_fail():
	$CenterContainer/AnimationPlayer.clear_queue()
	$CenterContainer/Label.modulate.a = 1
	$CenterContainer/Label.text = "Connection fail"
	get_tree().paused = true

func _on_start_game():
	get_tree().change_scene_to_packed(GeneralData.map[GeneralData.current_map])

func _enter_tree() -> void:
	Received.start_game_scene.connect(_on_start_game)
	Network.fail_connection.connect(_scene_fail)


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta: float) -> void:
	pass

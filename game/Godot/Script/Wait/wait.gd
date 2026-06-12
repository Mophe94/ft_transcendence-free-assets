extends Node2D

func _scene_fail():
	$CenterContainer/AnimationPlayer.clear_queue()
	$CenterContainer/Label.modulate.a = 1
	$CenterContainer/Label.text = "Connection fail"
	get_tree().paused = true

func _game_start():
	get_tree().change_scene_to_packed(GeneralData.map[GeneralData.current_map])

func _enter_tree() -> void:
	Network.launch.connect(_game_start)
	Network.fail_connection.connect(_scene_fail)


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta: float) -> void:
	pass

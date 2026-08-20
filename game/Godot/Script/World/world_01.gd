extends Node2D

func _stop_player():
	GeneralData.position_player = $Player/CharacterBody2D.global_position
	$Player/CharacterBody2D.control = false
	$CanvasLayer/Inventory_UI.process_mode = Node.PROCESS_MODE_DISABLED
	$CanvasLayer/Inventory_UI.hide()

func _stop_inventory():
	$Player/CharacterBody2D.control = false
	$CanvasLayer/Inventory_UI.process_mode = Node.PROCESS_MODE_DISABLED

func _run_inventory():
	$Player/CharacterBody2D.control = true
	$CanvasLayer/Inventory_UI.process_mode = Node.PROCESS_MODE_ALWAYS

#####################################
func transi_close():
	var transi_scene = GeneralData.transi.instantiate()
	add_child(transi_scene)
	await transi_scene.get_node("CanvasLayer/ColorRect").close()
#	transi_scene.queue_free()

func _team_set_up_received():
	_stop_player()
	await transi_close()
	get_tree().change_scene_to_packed(GeneralData.team_setup_scene)

func _signal_timer():
	_stop_player()     
	$Timer.send = true
	
	var send_func = func():
		null
	var success = await GeneralProcess.wait_signal(send_func, Received.team_setup_scene)

	await transi_close()
	$Timer.send = false
	if success:
		get_tree().change_scene_to_packed(GeneralData.team_setup_scene)
	else:
		get_tree().change_scene_to_packed(GeneralData.wait)
#####################################

func _ready() -> void:
	for node in get_tree().get_nodes_in_group("trigger_zone"):
		if node.has_signal("stop_player"):
			node.stop_player.connect(_stop_player)
		if node.has_signal("run_inventory"):
			node.run_inventory.connect(_run_inventory)
		if node.has_signal("stop_inventory"):
			node.stop_inventory.connect(_stop_inventory)
	$CanvasLayer/Inventory_UI.stop_inventory.connect(_stop_inventory)
	$CanvasLayer/Inventory_UI.run_inventory.connect(_run_inventory)
	
	Received.team_setup_scene.connect(_team_set_up_received)
	$Timer.time_finish.connect(_signal_timer)
	$Player/CharacterBody2D/Camera2D.enabled = true
	$Player/CharacterBody2D.control = true
	if GeneralProcess.trigger_send == false:
		GeneralProcess.trigger_activation()
	else:
		GeneralProcess.realloc_node()
	if GeneralData.position_player != Vector2(0.0, 0.0):
		$Player.position = GeneralData.position_player

func _close_game():
	if Input.is_action_just_pressed("quit"):
		get_tree().quit( )

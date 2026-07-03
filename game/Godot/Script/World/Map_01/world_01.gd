extends Node2D

#####################################
func transi_close():
	var transi_scene = GeneralData.transi.instantiate()
	add_child(transi_scene)
	await transi_scene.get_node("CanvasLayer/ColorRect").close()
	transi_scene.queue_free()

func _team_set_up_received():
	print("signal team set up received ===> scene : worl 01")
	$Player.process_mode = Node.PROCESS_MODE_DISABLED
	$CanvasLayer/Inventory_UI.hide()
	$CanvasLayer/Inventory_UI.process_mode = Node.PROCESS_MODE_DISABLED  
	await transi_close()
	get_tree().change_scene_to_packed(GeneralData.team_setup_scene)

func _signal_timer():
	print("signal timer received ===> scene : worl 01")
	$Player.process_mode = Node.PROCESS_MODE_DISABLED
	$CanvasLayer/Inventory_UI.hide()
	$CanvasLayer/Inventory_UI.process_mode = Node.PROCESS_MODE_DISABLED      
	$Timer.send = true
	
	var send_func = func():
		null
	var success = await GeneralProcess.wait_signal(send_func, Received.team_setup_scene)
	print("Message team set up received ===> scene : world\nResult messsage : ", success)

	await transi_close()
	$Timer.send = false
	if success:
		get_tree().change_scene_to_packed(GeneralData.team_setup_scene)
	else:
		get_tree().change_scene_to_packed(GeneralData.wait)
#####################################

func _ready() -> void:
	Received.team_setup_scene.connect(_team_set_up_received)
	$Timer.time_finish.connect(_signal_timer)
	$Player/CharacterBody2D/Camera2D.enabled = true
	$Player/CharacterBody2D.control = true
	if GeneralData.position_player != Vector2(0.0, 0.0):
		$Player.position = GeneralData.position_player

func _close_game():
	if Input.is_action_just_pressed("quit"):
		get_tree().quit( )
	

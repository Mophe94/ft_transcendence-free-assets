extends Node2D

func _ready() -> void:
	$Timer.time_finish.connect(_signal_timer)
	$Player/CharacterBody2D/Camera2D.enabled = true
	$Player/CharacterBody2D.control = true
	if GeneralData.position_player != Vector2(0.0, 0.0):
		$Player.position = GeneralData.position_player

func _close_game():
	if Input.is_action_just_pressed("quit"):
		get_tree().quit( )
	
func _signal_timer():
	print("signal timer received team_setup")
	$Timer.send = true
	$Player.process_mode = Node.PROCESS_MODE_DISABLED
#	if !message_sended:
#		Send.send_mesage(Send.SEND_TAB[Send.SEND_NAME.TEAM_CHOICE], GeneralData.player["battle_team"])
#		message_sended = !message_sended
#	await Received.combat_scene
	$Timer.send = false
	get_tree().change_scene_to_packed(GeneralData.team_setup_scene)

extends Control

@onready var assetEnemy = GeneralData.enemy["asset"]
@onready var assetPlayer = GeneralData.player["asset"]

@onready var player_monster = GeneralData.player["team"]
@onready var enemy_monster = GeneralData.enemy["team"]
@onready var monster = GeneralData.monster_database

@onready var slot_player = [$Player/Slot1, $Player/Slot2, $Player/Slot3, $Player/Slot4, $Player/Slot5, $Player/Slot6]
@onready var slot_enemy = [$Enemy/Slot1, $Enemy/Slot2, $Enemy/Slot3, $Enemy/Slot4, $Enemy/Slot5, $Enemy/Slot6]

@onready var message_sended = false

func instantiate_charactere():
	$NameVS/VBoxContainer/PlayerName.text = GeneralData.player["name"]
	$NameVS/VBoxContainer/Enemy.text = GeneralData.enemy["name"]
	var player_scene = GeneralData.player_charactere_scene.instantiate()
	$Player/AssetControl/Asset.add_child(player_scene)
	var enemy_scene = GeneralData.player_enemy_scene.instantiate()
	enemy_scene.scale.x = -1
	$Enemy/AssetControl/asset.add_child(enemy_scene)

func instanciate_monster_player():
	var current = 0
	for i in range(GeneralData.player["team"].size()):
		var monster_name = player_monster[i]
		if !monster_name || monster_name == "":
			continue
		var monster_scene = monster[monster_name].instantiate()
		slot_player[current].get_node("Monster").add_child(monster_scene)
		slot_player[current].get_node("Button").monster_name = monster_name
		slot_player[current].get_node("Button").slot_ref = current
		current += 1
		
	while current < slot_player.size():
		slot_player[current].get_node("Button").hide()
		slot_player[current].get_node("Button").disabled = false
		current += 1
		
func instanciate_monster_enemy():
	var current = 0
	for i in range(6):
		var monster_name = enemy_monster[i]
		if monster_name == "":
			continue
		var monster_scene = monster[monster_name].instantiate()
		monster_scene.scale.x = -1
		slot_enemy[current].get_node("Monster").add_child(monster_scene)
		current += 1
		
func transi_open():
	var transi_scene = GeneralData.transi.instantiate()
	add_child(transi_scene)
	await transi_scene.get_node("CanvasLayer/ColorRect").open()
	transi_scene.queue_free()

func transi_close():
	var transi_scene = GeneralData.transi.instantiate()
	add_child(transi_scene)
	await transi_scene.get_node("CanvasLayer/ColorRect").close()
#	transi_scene.queue_free()

func _ready() -> void:
	$Timer.time_finish.connect(_signal_timer)
	transi_open()
	await instantiate_charactere()
	await instanciate_monster_player()
	await instanciate_monster_enemy()

func _signal_timer():
	$Timer.hide()
	$Timer.send = true
	$CurrentTeam.process_mode = Node.PROCESS_MODE_DISABLED
	$Player.process_mode = Node.PROCESS_MODE_DISABLED
	
	var send_func = func():
		Send.send_message(Send.SEND_TAB[Send.SEND_NAME.TEAM_CHOICE])
	var success = await GeneralProcess.wait_signal(send_func, Received.combat_scene)

	$Timer.send = false
	transi_close()
	if success:
		get_tree().change_scene_to_packed(GeneralData.combat_scene)
	else:
		get_tree().change_scene_to_packed(GeneralData.wait)

extends Control

@onready var portal = preload("res://Scene/Capture/CapturePortal/capture_portal.tscn")

@onready var nameBackGround = GeneralData.background_capture
@onready var backGround = $BackGround
@onready var player = $Player
@onready var monster = $Monster
@onready var capture_menus = $CaptureMenus

@onready var nameMonster = GeneralData.monster_encounter
@onready var monsterTab = GeneralData.monster_database

@onready var assetPlayer = GeneralData.player["asset"]

@onready var monsterAppearsBanner = $MonsterAppearsBanner

const REFERENCE_SIZE := Vector2(960, 640)
@onready var player_ref: Node2D = $Player
@onready var monster_ref: Node2D = $Monster
var player_base_scale := Vector2(1.0, 1.0)
var monster_base_scale := Vector2(1.0, 1.0)
const PLAYER_RATIO := Vector2(0.2, 0.65)
const MONSTER_RATIO := Vector2(0.8, 0.65)

func transi_close():
	var transi_scene = GeneralData.transi.instantiate()
	add_child(transi_scene)
	await transi_scene.get_node("CanvasLayer/ColorRect").close()
	transi_scene.queue_free()

func _catch_fail():
	for child in monster.get_children():
		child.queue_free()
	var monster_scene = monsterTab[nameMonster].instantiate()
	monster_scene.scale.x = -1
	monster.add_child(monster_scene)

func _catch_ok():
	capture_menus.hide_button("all")
	for child in monster.get_children():
		child.queue_free()

func _wait_catch_result():
	capture_menus.hide_button("all")
	for child in monster.get_children():
		child.queue_free()
	var portal_scene = portal.instantiate()
	monster.add_child(portal_scene)
	

func generate_asset():
	var monster_scene = monsterTab[nameMonster].instantiate()
	monster_scene.scale.x = -1
	monster.add_child(monster_scene)
	var player_scene = GeneralData.player_charactere_scene.instantiate()
	player.add_child(player_scene)
	
	backGround.texture = GeneralData.background_database[nameBackGround]


func generate_banner():
	monsterAppearsBanner.show()
	monsterAppearsBanner.modulate.a = 0.0
	var tween = create_tween()
	tween.tween_property(monsterAppearsBanner, "modulate:a", 0.6, 1.0)
	await tween.finished
	await get_tree().create_timer(0.5).timeout
	var tween2 = create_tween()
	tween2.tween_property(monsterAppearsBanner, "modulate:a", 0.0, 1.0)
	await tween2.finished
	await get_tree().create_timer(0.3).timeout
	monsterAppearsBanner.process_mode = Node.PROCESS_MODE_DISABLED

func transi_open():
	var transi_scene = GeneralData.transi.instantiate()
	add_child(transi_scene)
	await transi_scene.get_node("CanvasLayer/ColorRect").open()
	transi_scene.queue_free()

func start_intro():
	$CaptureMenus.try_catch.connect(_wait_catch_result)
	$CaptureMenus.catch_fail.connect(_catch_fail)
	$CaptureMenus.catch_ok.connect(_catch_ok)
	generate_asset()
	transi_open()
	await generate_banner()

func _update_battle_positions() -> void:
	var viewport_size: Vector2 = get_viewport().get_visible_rect().size
	var ratio: float = viewport_size.y / REFERENCE_SIZE.y

	if player_ref:
		player_ref.position = viewport_size * PLAYER_RATIO
		player_ref.scale = player_base_scale * ratio

	if monster_ref:
		monster_ref.position = viewport_size * MONSTER_RATIO
		monster_ref.scale = monster_base_scale * ratio

func _ready() -> void:
	Received.team_setup_scene.connect(_team_set_up_received)
	$Timer.time_finish.connect(_signal_timer)
	_update_battle_positions()
	get_tree().get_root().size_changed.connect(_update_battle_positions)
	capture_menus.hide()
	monsterAppearsBanner.hide()
	await start_intro()
	capture_menus.show()


func _team_set_up_received():
	print("signal team set up received ===> scene : capture")
	$Player.process_mode = Node.PROCESS_MODE_DISABLED
	$CanvasLayer/Inventory_UI.hide()
	$CanvasLayer/Inventory_UI.process_mode = Node.PROCESS_MODE_DISABLED  
	await transi_close()
	get_tree().change_scene_to_packed(GeneralData.team_setup_scene)


func _signal_timer():
	print("signal timer received ===> scene : capture")
	$CaptureMenus.hide()
	$CaptureMenus.process_mode = Node.PROCESS_MODE_DISABLED
	$Timer.send = true
	
	var send_func = func():
		null
	var success = await GeneralProcess.wait_signal(send_func, Received.team_setup_scene)
	print("Message transi team set up received ===> scene : world\nResult messsage : ", success)

	await transi_close()
	$Timer.send = false
	if success:
		get_tree().change_scene_to_packed(GeneralData.team_setup_scene)
	else:
		get_tree().change_scene_to_packed(GeneralData.wait)

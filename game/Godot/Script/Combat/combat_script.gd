extends Control

const REFERENCE_SIZE := Vector2(960, 640)

@onready var finsh_png = {
	"dinoBlue" = preload("res://Assets/Finish/finish_blue_dino.png"),
	"dinoYellow" = preload("res://Assets/Finish/finish_dino_yellow.png"),
	"dinoGreen" = preload("res://Assets/Finish/finish_green_dino.png"),
	"dinoRed" = preload("res://Assets/Finish/finish_red_dino.png"),
	"ghost" = preload("res://Assets/Finish/finish_ghost.png"),
	"ghost02" = preload("res://Assets/Finish/finish_ghost_2.png"),
	"ghost03" = preload("res://Assets/Finish/finish_ghost_3.png"),
	"satyr01" = preload("res://Assets/Finish/finish_satyr.png"),
	"satyr02" = preload("res://Assets/Finish/finish_satyr_2.png"),
	"satyr03" = preload("res://Assets/Finish/finish_satyr_3.png")
}

@onready var nameBackGround = GeneralData.background_battle
@onready var backGround = $CanvasLayer/BackGround

@onready var player = $Charactere/Player
@onready var enemy = $Charactere/Enemy

@onready var player_asset_ref= player.get_node("PlayerAsset")
@onready var player_monster_ref= player.get_node("PlayerMonster")
@onready var enemy_asset_ref= enemy.get_node("EnemyAsset")
@onready var enemy_monster_ref= enemy.get_node("EnemyMonster")

var player_asset_ratio: Vector2
var player_monster_ratio: Vector2
var enemy_asset_ratio: Vector2
var enemy_monster_ratio: Vector2

var player_asset_base_scale: Vector2
var player_monster_base_scale: Vector2
var enemy_asset_base_scale: Vector2
var enemy_monster_base_scale: Vector2

@onready var monsterTab = GeneralData.monster_database

@onready var assetEnemy = GeneralData.player_enemy_scene
@onready var assetPlayer = GeneralData.player_charactere_scene
@onready var skip_intro = false

@onready var actionPlay = false
@onready var stop_timer = false

@onready var combatBanner = $CombatBanner
@onready var playerUI = $PlayerMonsterUI/CenterContainer/HBoxContainer
@onready var enemyUI = $EnemyMonsterUI/CenterContainer/HBoxContainer


func _capture_battle_ratios() -> void:
	player_asset_ratio = player_asset_ref.position / REFERENCE_SIZE
	player_monster_ratio = player_monster_ref.position / REFERENCE_SIZE
	enemy_asset_ratio = enemy_asset_ref.position / REFERENCE_SIZE
	enemy_monster_ratio = enemy_monster_ref.position / REFERENCE_SIZE

	player_asset_base_scale = player_asset_ref.scale
	player_monster_base_scale = player_monster_ref.scale
	enemy_asset_base_scale = enemy_asset_ref.scale
	enemy_monster_base_scale = enemy_monster_ref.scale

func _update_battle_positions() -> void:
	var viewport_size = get_viewport().get_visible_rect().size
	var scale_ratio = viewport_size.y / REFERENCE_SIZE.y

	player_asset_ref.position = viewport_size * player_asset_ratio
	player_asset_ref.scale = player_asset_base_scale * scale_ratio

	player_monster_ref.position = viewport_size * player_monster_ratio
	player_monster_ref.scale = player_monster_base_scale * scale_ratio

	enemy_asset_ref.position = viewport_size * enemy_asset_ratio
	enemy_asset_ref.scale = enemy_asset_base_scale * scale_ratio

	enemy_monster_ref.position = viewport_size * enemy_monster_ratio
	enemy_monster_ref.scale = enemy_monster_base_scale * scale_ratio

###################################################################
func _last_scene():
	await transi_close()
	var background = $CanvasLayer/BackGround
	$Timer.hide()
	$Charactere.hide()
	$Effect.hide()
	$CombatMenus.hide()
	$EnemyMonsterUI.hide()
	$PlayerMonsterUI.hide()
	background.texture = finsh_png[GeneralData.player["asset"]]
	await transi_open()

func _hide_timer():
	$Timer.hide()

func  _next_map():
	await transi_close()
	get_tree().change_scene_to_file(GeneralData.map[GeneralData.current_map])

func _stop_timer():
	stop_timer = true
	
func _run_timer():
	stop_timer = false

func _new_current_monster():
	for child in player_monster_ref.get_children():
		child.queue_free()
	await get_tree().process_frame
	var monsterHero = GeneralData.player["currentMonster"]["name"]
	var monster_player_scene = monsterTab[monsterHero].instantiate()
	player_monster_ref.add_child(monster_player_scene)
	show_UI()
	style_progress_bar()
	Received.action_finished.emit()

func _new_enemy_monster():
	for child in enemy_monster_ref.get_children():
		child.queue_free()
	await get_tree().process_frame
	var monsterEnemy = GeneralData.enemy["currentMonster"]["name"]
	var monster_enemy_scene = monsterTab[monsterEnemy].instantiate()
	enemy_monster_ref.add_child(monster_enemy_scene)
	monster_enemy_scene.scale.x = -1
	show_UI()
	style_progress_bar()
	Received.action_finished.emit()
	
func _new_turn():
	actionPlay = false
	
###################################################################

func transi_close():
	var transi_scene = GeneralData.transi.instantiate()
	add_child(transi_scene)
	await transi_scene.get_node("CanvasLayer/ColorRect").close()
#	transi_scene.queue_free()

func generate_charactere():
	var player_scene = assetPlayer.instantiate()
	player.get_node("PlayerAsset").add_child(player_scene)

	var enemy_scene = assetEnemy.instantiate()
	enemy.get_node("EnemyAsset").add_child(enemy_scene)
	enemy_scene.scale.x = -1


func generate_asset():
	generate_charactere()
	backGround.texture = GeneralData.background_database[nameBackGround]


func generate_banner():
	$CombatBanner.show()
	combatBanner.modulate.a = 0.0
	await get_tree().create_timer(0.5).timeout
	var tween = create_tween()
	tween.tween_property(combatBanner, "modulate:a", 0.6, 1.0)
	await tween.finished
	await get_tree().create_timer(0.5).timeout
	var tween2 = create_tween()
	tween2.tween_property(combatBanner, "modulate:a", 0.0, 1.0)
	await tween2.finished
	await get_tree().create_timer(0.3).timeout
	combatBanner.process_mode = Node.PROCESS_MODE_DISABLED
	
func start_intro():
	$CombatMenus.hide()
	$PlayerMonsterUI.hide()
	$EnemyMonsterUI.hide()
	await generate_asset()
	if skip_intro == false:
		transi_open()
		await generate_banner()
	
func show_UI_player():
	if GeneralData.player["currentMonster"]["name"] == "":
		$PlayerMonsterUI.hide()
		return
	playerUI.get_node("Name").text = GeneralData.player["currentMonster"]["name"]
	playerUI.get_node("ProgressBar").max_value = GeneralData.player["currentMonster"]["life"]["max"]
	playerUI.get_node("ProgressBar").value = GeneralData.player["currentMonster"]["life"]["current"]
	playerUI.get_node("HP").text = str(GeneralData.player["currentMonster"]["life"]["current"]) + "/" + str(GeneralData.player["currentMonster"]["life"]["max"])
	$PlayerMonsterUI.show()
	
func show_UI_enemy():
	if GeneralData.enemy["currentMonster"]["name"] == "":
		$EnemyMonsterUI.hide()
		return
	enemyUI.get_node("Name").text = GeneralData.enemy["currentMonster"]["name"]
	enemyUI.get_node("ProgressBar").max_value = GeneralData.enemy["currentMonster"]["life"]["max"]
	enemyUI.get_node("ProgressBar").value = GeneralData.enemy["currentMonster"]["life"]["current"]
	enemyUI.get_node("HP").text = str(GeneralData.enemy["currentMonster"]["life"]["current"]) + "/" + str(GeneralData.enemy["currentMonster"]["life"]["max"])
	$EnemyMonsterUI.show()
	
func show_UI():
	show_UI_player()
	show_UI_enemy()
	style_progress_bar()
	$CombatMenus.show()

func style_progress_bar():
	var current_hp = GeneralData.player["currentMonster"]["life"]["current"]
	var max_hp = GeneralData.player["currentMonster"]["life"]["max"]
	if current_hp <= max_hp / 3.0:
		playerUI.get_node("ProgressBar").modulate = Color(1.0, 0.0, 0.0, 1.0)
	elif current_hp <= max_hp * 2 / 3.0:
		playerUI.get_node("ProgressBar").modulate = Color(1.0, 0.6, 0.0, 1.0)
	else:
		playerUI.get_node("ProgressBar").modulate = Color(0.0, 1.0, 0.0, 1.0)
	current_hp = GeneralData.enemy["currentMonster"]["life"]["current"]
	max_hp = GeneralData.enemy["currentMonster"]["life"]["max"]
	if current_hp <= max_hp / 3.0:
		enemyUI.get_node("ProgressBar").modulate = Color(1.0, 0.0, 0.0, 1.0)
	elif current_hp <= max_hp * 2 / 3.0:
		enemyUI.get_node("ProgressBar").modulate = Color(1.0, 0.6, 0.0, 1.0)
	else:
		enemyUI.get_node("ProgressBar").modulate = Color(0.0, 1.0, 0.0, 1.0)
	
func transi_open():
	var transi_scene = GeneralData.transi.instantiate()
	add_child(transi_scene)
	await transi_scene.get_node("CanvasLayer/ColorRect").open()
	transi_scene.queue_free()

func _ready() -> void:
	Received.next_map_scene.connect(_next_map)
	$CombatMenus.last_scene.connect(_last_scene)
	$CombatMenus.action_combat.connect(show_UI)
	$CombatMenus.change_monster.connect(_new_current_monster)
	$CombatMenus.enemy_change_monster.connect(_new_enemy_monster)
#	$CombatMenus.stop_timer.connect(_stop_timer)
#	$CombatMenus.run_timer.connect(_run_timer)
	$CombatMenus.hide_timer.connect(_hide_timer)
	$CombatBanner.hide()
#	$Timer.time_finish.connect(_time_finish)
	_capture_battle_ratios()
	_update_battle_positions()
	get_viewport().size_changed.connect(_update_battle_positions)
	await start_intro()
	show_UI()

#func _time_finish():
#	skip_intro = true
#	$CombatMenus.hide()
#	$CombatMenus.process_mode = Node.PROCESS_MODE_DISABLED
#	$Timer.send = true
#	if !stop_timer:
#		var send_func = func():
#			null
#		var success = await GeneralProcess.wait_signal(send_func, Received.new_turn)
#		$Timer.send = false
#		if !success:
#			get_tree().change_scene_to_packed(GeneralData.wait)

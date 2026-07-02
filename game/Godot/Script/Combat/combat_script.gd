extends Control

const REFERENCE_SIZE := Vector2(960, 640)

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

@onready var assetEnemy = GeneralData.player_charactere_scene
@onready var assetPlayer = GeneralData.player_charactere_scene

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


func _new_current_monster():
	for child in player.get_node("PlayerMonster").get_children():
		child.queue_free()
	await get_tree().process_frame
	var monsterHero = GeneralData.player["currentMonster"]["name"]
	var monster_player_scene = monsterTab[monsterHero].instantiate()
	player.get_node("PlayerMonster").add_child(monster_player_scene)
	show_UI()
	style_progress_bar()

#func _new_enemy_monster():
#	for child in enemy.get_node("EnemyMonster").get_children():
#		child.queue_free()
#	await get_tree().process_frame
#	var monsterEnemy = GeneralData.enemy["currentMonster"]["name"]
#	var monster_enemy_scene = monsterTab[monsterEnemy].instantiate()
#	enemy.get_node("EnemyMonster").add_child(monster_enemy_scene)
#	show_UI()
#	style_progress_bar()

func generate_charactere():
	var player_scene = assetPlayer.instantiate()
	player.get_node("PlayerAsset").add_child(player_scene)

#	A modifier quand assetEnemy fait (scene de recup du skin enemy)
	var enemy_scene = assetPlayer.instantiate()
	enemy.get_node("EnemyAsset").add_child(enemy_scene)
	enemy_scene.scale.x *= -1

	var monsterEnemy = GeneralData.enemy["currentMonster"]["name"]
	var monster_enemy_scene = monsterTab[monsterEnemy].instantiate()
	monster_enemy_scene.scale.x = -1
	enemy.get_node("EnemyMonster").add_child(monster_enemy_scene)

func generate_asset():
	generate_charactere()
	backGround.texture = GeneralData.background_database[nameBackGround]

func generate_banner():
	combatBanner.modulate.a = 0.0
	await get_tree().create_timer(0.5).timeout
	var tween = create_tween()
	tween.tween_property(combatBanner, "modulate:a", 0.6, 1.5)
	await tween.finished
	await get_tree().create_timer(1.5).timeout
	var tween2 = create_tween()
	tween2.tween_property(combatBanner, "modulate:a", 0.0, 1.5)
	await tween2.finished
	await get_tree().create_timer(0.5).timeout
	combatBanner.process_mode = Node.PROCESS_MODE_DISABLED
	
func start_intro():
	$CombatMenus.change_monster.connect(_new_current_monster)
	$CombatMenus.hide()
	$PlayerMonsterUI.hide()
	$EnemyMonsterUI.hide()
	await generate_asset()
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
	print(get_tree().current_scene.name)
	_capture_battle_ratios()
	_update_battle_positions()
	get_viewport().size_changed.connect(_update_battle_positions)
	transi_open()
	await start_intro()
	show_UI()

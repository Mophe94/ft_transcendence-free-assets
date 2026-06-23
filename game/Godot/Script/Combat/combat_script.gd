extends Node2D

@onready var nameBackGround = GeneralData.background_battle
@onready var backGround = $CanvasLayer/TextureRect
@onready var charactere = $Charactere
@onready var monster = $Monster

@onready var monsterTab = GeneralData.monster_database

@onready var assetEnemy = GeneralData.enemy["asset"]
@onready var assetPlayer = GeneralData.player["asset"]
@onready var player = GeneralData.hero_database

@onready var combatBanner = $CombatBanner
@onready var playerUI = $PlayerMonsterUI/MarginContainer/HBoxContainer
@onready var enemyUI = $EnemyMonsterUI/MarginContainer/HBoxContainer

func _new_current_monster():
	for child in monster.get_node("Player").get_children():
		child.queue_free()
	await get_tree().process_frame
	var monsterHero = GeneralData.player["currentMonster"]["name"]
	var monster_player_scene = monsterTab[monsterHero].instantiate()
	monster.get_node("Player").add_child(monster_player_scene)
	show_UI()
	style_progress_bar()

func generate_charactere():
	var player_scene = player[assetPlayer].instantiate() 
	charactere.get_node("Player").add_child(player_scene)
	var enemy_scene = player[assetEnemy].instantiate()
	charactere.get_node("Enemy").add_child(enemy_scene)

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
	
func show_UI_player():aq
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

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	transi_open()
	await start_intro()
	show_UI()

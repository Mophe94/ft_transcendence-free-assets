extends Node2D

@onready var nameBackGround = GeneralData.background
@onready var backGround = $background
@onready var charactere = $Charactere
@onready var monster = $Monster

@onready var nameMonsterEnemy = GeneralData.enemy["currentMonster"]["name"]
@onready var nameMonsterHero = GeneralData.player["currentMonster"]["name"]
@onready var monsterTab = GeneralData.monster_database

@onready var assetEnemy = GeneralData.enemy["asset"]
@onready var assetPlayer = GeneralData.player["asset"]
@onready var hero = GeneralData.hero_database

@onready var combatBanner = $CombatBanner

func generate_charactere():
	var player_scene = hero[assetPlayer].instantiate()
	charactere.get_node("Player").add_child(player_scene)
	var enemy_scene = hero[assetEnemy].instantiate()
	charactere.get_node("Enemy").add_child(enemy_scene)
	enemy_scene.get_node("Body").get_node("Animated").flip_h = true

func generate_monster():
	var monster_player_scene = monsterTab[nameMonsterHero].instantiate()
	monster.get_node("Player").add_child(monster_player_scene)
	var monster_enemy_scene = monsterTab[nameMonsterEnemy].instantiate()
	monster.get_node("Enemy").add_child(monster_enemy_scene)

func generate_asset():
	generate_charactere()
	generate_monster()
	
	backGround.texture = GeneralData.background_database[GeneralData.background]

func generate_banner():
	combatBanner.modulate.a = 0.0
	await get_tree().create_timer(1.0).timeout
	var tween = create_tween()
	tween.tween_property(combatBanner, "modulate:a", 0.6, 1.5)
	await tween.finished
	await get_tree().create_timer(2.0).timeout
	var tween2 = create_tween()
	tween2.tween_property(combatBanner, "modulate:a", 0.0, 1.5)
	await get_tree().create_timer(1.5).timeout
	combatBanner.process_mode = Node.PROCESS_MODE_DISABLED
	
func start_intro():
	generate_asset()
	generate_banner()
	await get_tree().create_timer(8.0).timeout

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	start_intro()
# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta: float) -> void:
	pass

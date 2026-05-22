extends Node2D

@onready var nameBackGround = GeneralData.background
@onready var backGround = $background
@onready var player = $Player
@onready var monster = $Monster

@onready var nameMonster = GeneralData.monster_encounter
@onready var monsterTab = GeneralData.monster_database

@onready var assetPlayer = GeneralData.player["asset"]
@onready var hero = GeneralData.hero_database

@onready var monsterAppearsBanner = $monster_appears_banner

func generate_asset():
	var monster_scene = monsterTab[nameMonster].instantiate()
	monster.add_child(monster_scene)
	var player_scene = hero[assetPlayer].instantiate()
	player.add_child(player_scene)
	monster_scene.get_node("Body").get_node("Animated").flip_h = true
	
	backGround.texture = GeneralData.background_database[GeneralData.background]

func generate_banner():
	monsterAppearsBanner.modulate.a = 0.0
	await get_tree().create_timer(1.0).timeout
	var tween = create_tween()
	tween.tween_property(monsterAppearsBanner, "modulate:a", 0.6, 1.5)
	await tween.finished
	await get_tree().create_timer(2.0).timeout
	var tween2 = create_tween()
	tween2.tween_property(monsterAppearsBanner, "modulate:a", 0.0, 1.5)
	await get_tree().create_timer(1.5).timeout
	monsterAppearsBanner.process_mode = Node.PROCESS_MODE_DISABLED
	
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

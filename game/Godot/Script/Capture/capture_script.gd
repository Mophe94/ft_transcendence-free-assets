extends Node2D

@onready var portal = preload("res://Scene/Capture/CapturePortal/capture_portal.tscn")

@onready var nameBackGround = GeneralData.background_capture
@onready var backGround = $CanvasLayer/BackGround
@onready var player = $Player
@onready var monster = $Monster
@onready var capture_menus = $CaptureMenus

@onready var nameMonster = GeneralData.monster_encounter
@onready var monsterTab = GeneralData.monster_database

@onready var assetPlayer = GeneralData.player["asset"]
@onready var hero = GeneralData.hero_database

@onready var monsterAppearsBanner = $MonsterAppearsBanner

func _on_monster_back():
	for child in monster.get_children():
		child.queue_free()
	var monster_scene = monsterTab[nameMonster].instantiate()
	monster.add_child(monster_scene)

func _on_result_catch():
	capture_menus.hide_button("all")
	await capture_menus.text_show("New content incoming")
	for child in monster.get_children():
		child.queue_free()
	var portal_scene = portal.instantiate()
	monster.add_child(portal_scene)
	capture_menus.button[2].text = "YES"
	capture_menus.button[2].action = "catch_result"
	capture_menus.button[2].object = "yes"
	capture_menus.button[2].show()
	capture_menus.button[3].text = "NO"
	capture_menus.button[3].action = "catch_result"
	capture_menus.button[3].object = "no"
	capture_menus.button[3].show()
	capture_menus.back_button.show()

func generate_asset():
	var monster_scene = monsterTab[nameMonster].instantiate()
	monster.add_child(monster_scene)
	var player_scene = hero[assetPlayer].instantiate()
	player.add_child(player_scene)
	
	backGround.texture = GeneralData.background_database[nameBackGround]

func generate_banner():
	monsterAppearsBanner.show()
	monsterAppearsBanner.modulate.a = 0.0
	var tween = create_tween()
	tween.tween_property(monsterAppearsBanner, "modulate:a", 0.6, 1.5)
	await tween.finished
	await get_tree().create_timer(1.5).timeout
	var tween2 = create_tween()
	tween2.tween_property(monsterAppearsBanner, "modulate:a", 0.0, 1.5)
	await tween2.finished
	await get_tree().create_timer(0.5).timeout
	monsterAppearsBanner.process_mode = Node.PROCESS_MODE_DISABLED

func transi_open():
	var transi_scene = GeneralData.transi.instantiate()
	add_child(transi_scene)
	await transi_scene.get_node("CanvasLayer/ColorRect").open()
	transi_scene.queue_free()

func start_intro():
	capture_menus.try_catch.connect(_on_result_catch)
	capture_menus.monster_back.connect(_on_monster_back)
	generate_asset()
	transi_open()
	await generate_banner()

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	capture_menus.hide()
	monsterAppearsBanner.hide()
	await start_intro()
	capture_menus.show()

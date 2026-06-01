extends Node2D

@onready var assetEnemy = GeneralData.enemy["asset"]
@onready var assetPlayer = GeneralData.player["asset"]
@onready var hero = GeneralData.hero_database

@onready var player_monster = GeneralData.player["team"]
@onready var enemy_monster = GeneralData.enemy["team"]
@onready var monster = GeneralData.monster_database

@onready var slot_player = [$Player/Slot1, $Player/Slot2, $Player/Slot3, $Player/Slot4, $Player/Slot5, $Player/Slot6]
@onready var slot_enemy = [$Enemy/Slot1, $Enemy/Slot2, $Enemy/Slot3, $Enemy/Slot4, $Enemy/Slot5, $Enemy/Slot6]

func instantiate_charactere():
	$CenterContainer/VBoxContainer/PlayerName.text = GeneralData.player["name"]
	$CenterContainer/VBoxContainer/Enemy.text = GeneralData.enemy["name"]
	var player_scene = hero[assetPlayer].instantiate()
	$Player/asset.add_child(player_scene)
	var enemy_scene = hero[assetEnemy].instantiate()
	$Enemy/asset.add_child(enemy_scene)

func instanciate_monster_player():
	var current = 0
	for i in range(6):
		var monster_name = player_monster[i]
		if monster_name == "":
			continue
		#Voir easter egg
		elif !monster.has(monster_name):
			player_monster[i] = ""
			continue
		var monster_scene = monster[monster_name].instantiate()
		slot_player[current].get_node("Monster").add_child(monster_scene)
		slot_player[current].get_node("Button").monster_name = monster_name
		slot_player[current].get_node("Button").slot_ref = current
		current += 1
		
func instanciate_monster_enemy():
	var current = 0
	for i in range(6):
		var monster_name = enemy_monster[i]
		if monster_name == "":
			continue
		var monster_scene = monster[monster_name].instantiate()
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
	transi_scene.queue_free()

func _ready() -> void:
	transi_open()
	await instantiate_charactere()
	await instanciate_monster_player()
	await instanciate_monster_enemy()
	await get_tree().create_timer(10.0).timeout
	await transi_close()
	get_tree().change_scene_to_file("res://scene/combat/combat.tscn")


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta: float) -> void:
	pass

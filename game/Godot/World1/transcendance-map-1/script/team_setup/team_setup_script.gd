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
	enemy_scene.get_node("Body").get_node("Animated").flip_h = true

func instanciate_monster_player():
	for i in range(6):
		var monster_name = player_monster[i]
		if monster_name == "":
			continue
		#Voir easter egg
		elif !monster.has(monster_name):
			player_monster[i] = ""
			continue
		var monster_scene = monster[monster_name].instantiate()
		slot_player[i].get_node("Monster").add_child(monster_scene)
		slot_player[i].get_node("Button").monster_name = monster_name
		slot_player[i].get_node("Button").slot_ref = i
		
func instanciate_monster_enemy():
	for i in range(6):
		var monster_name = enemy_monster[i]
		if monster_name == "":
			continue
		var monster_scene = monster[monster_name].instantiate()
		slot_enemy[i].get_node("Monster").add_child(monster_scene)
		

func _ready() -> void:
	instantiate_charactere()
	instanciate_monster_player()
	instanciate_monster_enemy()
	await get_tree().create_timer(4.0).timeout


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta: float) -> void:
	pass

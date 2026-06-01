extends Node2D

@onready var slots = [
	$Slot1, $Slot2, $Slot3,
	$Slot4, $Slot5, $Slot6
]

@onready var current_monster = [
	$CurrentTeam/Monster1,
	$CurrentTeam/Monster2,
	$CurrentTeam/Monster3
]

@onready var monster_database = GeneralData.monster_database

func refresh_team_visual():
	for i in range(3):
		for child in current_monster[i].get_children():
			child.queue_free()

		if GeneralData.player["battle_team"][i]["name"] != "":
			var monster_scene = monster_database[GeneralData.player["battle_team"][i]["name"]].instantiate()
			current_monster[i].add_child(monster_scene)
	
func _compact_team():
	for i in range(3):
		if GeneralData.player["battle_team"][i]["name"] == "":
			for j in range(i + 1, 3):
				if GeneralData.player["battle_team"][j]["name"] != "":
					var tmp = GeneralData.player["battle_team"][i]
					GeneralData.player["battle_team"][i] = GeneralData.player["battle_team"][j]
					GeneralData.player["battle_team"][j] = tmp
					break
			
			
	
func _on_delete_monster(monster_name):
	for i in range(3):
		if GeneralData.player["battle_team"][i]["name"] == monster_name:
			GeneralData.player["battle_team"][i]["name"] = ""
			_compact_team()
			refresh_team_visual()
			return

func _on_add_monster(monster_name, slot_index):
	GeneralData.player["battle_team"][slot_index]["name"] = monster_name
	refresh_team_visual()

func _ready():
	for i in range(slots.size()):
		var slot = slots[i]
		slot.add_monster.connect(_on_add_monster)
		slot.delete_monster.connect(_on_delete_monster)

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta: float) -> void:
	pass

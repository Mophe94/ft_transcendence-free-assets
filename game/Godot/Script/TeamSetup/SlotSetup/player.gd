extends Control
@onready var slots = [
	$Slot1, $Slot2, $Slot3,
	$Slot4, $Slot5, $Slot6
]
@onready var current_team_panel = get_parent().get_node("CurrentTeam")

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
			current_team_panel.refresh_team_visual()
			return

func _on_add_monster(monster_name, slot_index):
	GeneralData.player["battle_team"][slot_index]["name"] = monster_name
	current_team_panel.refresh_team_visual()

func _ready():
	for i in range(slots.size()):
		var slot = slots[i]
		slot.add_monster.connect(_on_add_monster)
		slot.delete_monster.connect(_on_delete_monster)

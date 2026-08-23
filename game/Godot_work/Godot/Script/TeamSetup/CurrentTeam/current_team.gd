extends Control

const REF_SIZE = Vector2(1920, 1080)
const REF_FONT_LABEL = 40

@onready var label = $YourTeam/YourTeam
@onready var current_monster = [
	$Monster1,
	$Monster2,
	$Monster3
]

func _ready() -> void:
	get_tree().get_root().size_changed.connect(_on_viewport_resized)
	_on_viewport_resized()

func _on_viewport_resized() -> void:
	var viewport_size = get_viewport().get_visible_rect().size
	var ratio = min(viewport_size.x / REF_SIZE.x, viewport_size.y / REF_SIZE.y)
	label.add_theme_font_size_override("font_size", int(REF_FONT_LABEL * ratio))

func refresh_team_visual():
	for i in range(3):
		var monster_name = GeneralData.player["battle_team"][i]["name"]
		if monster_name and monster_name != "":
			current_monster[i].texture = GeneralData.monster_icon_database[monster_name]
		else:
			current_monster[i].texture = null

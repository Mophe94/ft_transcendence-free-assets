extends Panel

@onready var item_visual: TextureRect = $Panel/item_display
@onready var item_count: Label = $Panel/item_count
@onready var tooltip = get_tree().get_first_node_in_group("tooltip")

var current_item: Dictionary = {}
var current_monster: String = ""

const SCALE_HOVER = Vector2(1.12, 1.12)
const SCALE_NORMAL = Vector2(1.0, 1.0)
const DURATION = 0.12

func _ready():
	await get_tree().process_frame
	pivot_offset = size / 2
	mouse_entered.connect(_on_mouse_entered)
	mouse_exited.connect(_on_mouse_exited)

func _on_mouse_entered():
	var tween = create_tween()
	tween.tween_property(self, "scale", SCALE_HOVER, DURATION)\
		.set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)

	if not current_item.is_empty() and current_item["name"] != "":
		var desc = GeneralData.object_description.get(current_item["name"], "")
		tooltip.show_tooltip(current_item["name"], desc)

	elif current_monster != "":
		var full_desc = GeneralData.monster_description.get(current_monster, "")
		var parts = full_desc.split("|")
		var type = parts[0].strip_edges() if parts.size() > 0 else ""
		var rarete = parts[1].strip_edges() if parts.size() > 1 else ""
		var hp = parts[2].strip_edges() if parts.size() > 2 else ""
		var desc = parts[3].strip_edges() if parts.size() > 3 else ""
		tooltip.show_tooltip(current_monster, desc, type, rarete, hp)

func _on_mouse_exited():
	var tween = create_tween()
	tween.tween_property(self, "scale", SCALE_NORMAL, DURATION)\
		.set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	tooltip.hide_tooltip()

func update(item: Dictionary):
	current_item = item
	current_monster = ""  # reset monstre
	if item["name"] == "" or item["current"] == 0:
		item_visual.visible = false
	else:
		item_visual.visible = true
		item_visual.texture = GeneralData.object_database[item["name"]]
		item_count.visible = true
		item_count.text = str(item["current"])

func update_monster(monster_name: String):
	current_monster = monster_name
	current_item = {}
	if monster_name == "":
		item_visual.visible = false
	else:
		item_visual.visible = true
		item_visual.texture = GeneralData.monster_icon_database[monster_name]

extends Panel
@onready var label_nom = $NinePatchRect/MarginContainer/VBoxContainer/TooltipName
@onready var label_desc = $NinePatchRect/MarginContainer/VBoxContainer/TooltipDescription
@onready var label_type = $NinePatchRect/MarginContainer/VBoxContainer/HBoxContainer/Label
@onready var label_rarete = $NinePatchRect/MarginContainer/VBoxContainer/HBoxContainer/Label2
@onready var label_hp = $NinePatchRect/MarginContainer/VBoxContainer/HBoxContainer/Label3
const OFFSET = Vector2(16, 16)


const RARITY_COLORS = {
	"Common": Color("ffffff"),
	"Uncommon": Color("4aa3ff"),
	"Rare": Color("ffd84a"),
	"Starter": Color("000000ff"),
}

const ELEMENT_COLORS = {
	"Water": Color("3d9bff"),
	"Earth": Color("8a5a35"),
	"Plant": Color("4caf50"),
	"Flying": Color("cfd8dc"),
	"Neutral": Color("575757ff"),
}

func _ready():
	visible = false

func _process(_delta):
	if not visible:
		return
	var tooltip_size = get_rect().size
	var screen_size = get_viewport_rect().size
	var mouse_pos = get_global_mouse_position()
	var pos = mouse_pos + OFFSET
	if pos.x + tooltip_size.x > screen_size.x:
		pos.x = mouse_pos.x - tooltip_size.x - OFFSET.x
	if pos.y + tooltip_size.y > screen_size.y:
		pos.y = mouse_pos.y - tooltip_size.y - OFFSET.y
	pos.x = clamp(pos.x, OFFSET.x, screen_size.x - tooltip_size.x)
	pos.y = clamp(pos.y, OFFSET.y, screen_size.y - tooltip_size.y)
	global_position = pos

func show_tooltip(nom: String, description: String, type: String = "", rarete: String = "", hp: String = ""):
	label_nom.text = nom
	label_desc.text = description
	label_type.text = type
	label_rarete.text = rarete
	label_hp.text = hp
	label_type.add_theme_color_override("font_color", ELEMENT_COLORS.get(type, Color.WHITE))
	label_rarete.add_theme_color_override("font_color", RARITY_COLORS.get(rarete, Color.WHITE))
	visible = true
	await get_tree().process_frame
	size = $NinePatchRect/MarginContainer.get_combined_minimum_size()
	$NinePatchRect.size = size

func hide_tooltip():
	visible = false

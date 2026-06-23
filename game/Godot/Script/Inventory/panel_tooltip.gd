extends Panel

@onready var label_nom = $NinePatchRect/MarginContainer/VBoxContainer/TooltipName
@onready var label_desc = $NinePatchRect/MarginContainer/VBoxContainer/TooltipDescription

const OFFSET = Vector2(16, 16)
var tooltip_size = Vector2.ZERO

func _ready():
	visible = false
	# Attend 2 frames que le Panel soit bien rendu
	await get_tree().process_frame
	await get_tree().process_frame
	tooltip_size = get_rect().size

func _process(_delta):
	if not visible:
		return

	var screen_size = DisplayServer.window_get_size()
	var mouse_pos = get_global_mouse_position()
	var pos = mouse_pos + OFFSET

	if pos.x + tooltip_size.x > screen_size.x:
		pos.x = mouse_pos.x - tooltip_size.x - OFFSET.x
	if pos.y + tooltip_size.y > screen_size.y:
		pos.y = mouse_pos.y - tooltip_size.y - OFFSET.y
	if pos.x < 0:
		pos.x = OFFSET.x
	if pos.y < 0:
		pos.y = OFFSET.y
	global_position = pos

func show_tooltip(nom: String, description: String):
	label_nom.text = nom
	label_desc.text = description
	visible = true
	 
	await get_tree().process_frame
	tooltip_size = get_rect().size

func hide_tooltip():
	visible = false

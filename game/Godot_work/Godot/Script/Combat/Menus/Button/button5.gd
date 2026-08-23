extends Button

@export_range(0.1, 1.0, 0.01) var font_ratio: float = 0.6
var min_font_size: int = 4
var max_font_size: int = 96
var last_size: float = -1.0

signal action_pressed(action, object)
var object = ""

func _ready():
	pressed.connect(_on_pressed)

func _process(_delta):
	var smallest_side: float = min(size.x, size.y)
	if smallest_side != last_size:
		last_size = smallest_side
		_update_font_size(smallest_side)

func _on_pressed():
	action_pressed.emit("back", object)

func _update_font_size(smallest_side: float) -> void:
	var target_size: int = int(smallest_side * font_ratio)
	target_size = clamp(target_size, min_font_size, max_font_size)
	add_theme_font_size_override("font_size", target_size)

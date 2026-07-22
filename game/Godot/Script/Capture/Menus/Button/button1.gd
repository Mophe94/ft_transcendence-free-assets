extends Button
signal action_pressed(action, object)
@export var action := ""
@export var object = ""
 
@export_range(0.1, 1.0, 0.01) var font_ratio: float = 0.35
@export var min_font_size: int = 4
@export var max_font_size: int = 64
 
func _ready():
	pressed.connect(_on_pressed)
	_update_font_size()
	resized.connect(_update_font_size)
 
func _on_pressed():
	action_pressed.emit(action, object)
 
func _update_font_size() -> void:
	var target_size: int = int(size.y * font_ratio)
	target_size = clamp(target_size, min_font_size, max_font_size)
	add_theme_font_size_override("font_size", target_size)
 
func _get_minimum_size() -> Vector2:
	return Vector2.ZERO

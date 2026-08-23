extends Button

signal action_pressed(action, object)

var object = "" 
var action = "back"

@export_range(0.0, 1.0, 0.01) var font_ratio: float = 0.45
var min_font_size: int = 2
var max_font_size: int = 96

func _ready():
	pressed.connect(_on_pressed)

func _process(_delta):
	_update_font_size()

func _on_pressed():
	action_pressed.emit(action, object)
	
func _update_font_size() -> void:
	var target_size: int = int(size.y * font_ratio)
	target_size = clamp(target_size, min_font_size, max_font_size)
	add_theme_font_size_override("font_size", target_size)

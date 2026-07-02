extends Label
 
const REFERENCE_SIZE := Vector2(960, 640)
const BASE_FONT_SIZE := 70
 
func _ready() -> void:
	_update_font_size()
	get_viewport().size_changed.connect(_update_font_size)
 
func _update_font_size() -> void:
	var viewport_size: Vector2 = get_viewport().get_visible_rect().size
	var scale_ratio: float = viewport_size.y / REFERENCE_SIZE.y
	var target_font: int = int(BASE_FONT_SIZE * scale_ratio)
	add_theme_font_size_override("font_size", target_font)

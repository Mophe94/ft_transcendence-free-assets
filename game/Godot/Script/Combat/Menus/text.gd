extends Label
@export_range(0.1, 1.0, 0.01) var font_ratio: float = 0.42
@export var min_font_size: int = 4
@export var max_font_size: int = 96
var last_size: Vector2 = Vector2(-1, -1)

func _process(_delta) -> void:
	if size != last_size:
		last_size = size
		_update_font_size()

func _update_font_size() -> void:
	var target_size: int = int(size.y * font_ratio)
	target_size = clamp(target_size, min_font_size, max_font_size)

	var font := get_theme_font("font")
	if font:
		var text_width: float = font.get_string_size(text, HORIZONTAL_ALIGNMENT_LEFT, -1, target_size).x
		if text_width > size.x and text_width > 0:
			var scale_factor: float = size.x / text_width
			target_size = int(target_size * scale_factor)
			target_size = clamp(target_size, min_font_size, max_font_size)

	add_theme_font_size_override("font_size", target_size)

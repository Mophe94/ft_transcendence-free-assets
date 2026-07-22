extends Panel

@onready var name_label: Label = $CenterContainer/HBoxContainer/Name
@onready var progress_bar: ProgressBar = $CenterContainer/HBoxContainer/ProgressBar
@onready var hp_label: Label = $CenterContainer/HBoxContainer/HP

const PANEL_REFERENCE_SIZE := Vector2(384, 64)

const PROGRESS_BAR_BASE_SIZE := Vector2(96, 32)
const BASE_FONT_SIZE := 16

func _ready() -> void:
	_update_responsive_ui()
	resized.connect(_update_responsive_ui)

func _update_responsive_ui() -> void:
	var scale_ratio: float = size.y / PANEL_REFERENCE_SIZE.y

	var target_font: int = int(BASE_FONT_SIZE * scale_ratio)
	name_label.add_theme_font_size_override("font_size", target_font)
	hp_label.add_theme_font_size_override("font_size", target_font)

	var new_bar_size: Vector2 = PROGRESS_BAR_BASE_SIZE * scale_ratio
	progress_bar.custom_minimum_size = new_bar_size
	progress_bar.size = new_bar_size

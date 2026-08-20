extends VBoxContainer

const REF_SIZE = Vector2(960, 640)

const REF_FONT_PLAYER = 48
const REF_FONT_VS = 36
const REF_FONT_ENEMY = 48

@onready var player_label = $PlayerName
@onready var vs_label = $VS
@onready var enemy_label = $Enemy

func _ready() -> void:
	get_tree().get_root().size_changed.connect(_on_viewport_resized)
	_on_viewport_resized()

func _on_viewport_resized() -> void:
	var viewport_size = get_viewport().get_visible_rect().size
	var ratio = min(viewport_size.x / REF_SIZE.x, viewport_size.y / REF_SIZE.y)

	player_label.add_theme_font_size_override("font_size", int(REF_FONT_PLAYER * ratio))
	vs_label.add_theme_font_size_override("font_size", int(REF_FONT_VS * ratio))
	enemy_label.add_theme_font_size_override("font_size", int(REF_FONT_ENEMY * ratio))

extends Control

const REF_ASSET_SIZE = Vector2(200, 300)
const base_scale_multiplier: float = 3.0

func _ready() -> void:
	resized.connect(_update_sprite_transform)
	_update_sprite_transform()

func _update_sprite_transform() -> void:
	if get_child_count() == 0:
		return
	var player_scene = get_child(0)
	player_scene.position = size / 2
	var scale_factor = min(size.x / REF_ASSET_SIZE.x, size.y / REF_ASSET_SIZE.y)
	player_scene.scale = Vector2(scale_factor, scale_factor) * base_scale_multiplier

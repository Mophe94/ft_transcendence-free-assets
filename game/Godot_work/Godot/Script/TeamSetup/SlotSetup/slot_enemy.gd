extends Control

@onready var sprite = $Monster
var base_scale_multiplier: float = 2

const REF_SLOT_SIZE = Vector2(150, 150)

func _ready() -> void:
	resized.connect(_update_sprite_transform)
	_update_sprite_transform()

func _update_sprite_transform() -> void:
	sprite.position = size / 2
	var scale_factor = min(size.x / REF_SLOT_SIZE.x, size.y / REF_SLOT_SIZE.y)
	sprite.scale = Vector2(scale_factor, scale_factor) * base_scale_multiplier

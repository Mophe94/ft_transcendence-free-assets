extends Control
signal add_monster(monster_name, slot_id)
signal delete_monster(monster_name)

@onready var button = $Button
@onready var sprite = $Monster

var selected = false

const REF_SLOT_SIZE = Vector2(150, 150)
var base_scale_multiplier: float = 2

func _ready():
	button.mouse_entered.connect(_on_hover)
	button.mouse_exited.connect(_on_exit)
	button.pressed.connect(_on_pressed)
	resized.connect(_update_sprite_transform)
	_update_sprite_transform()

func _update_sprite_transform() -> void:
	sprite.position = size / 2
	var scale_factor = min(size.x / REF_SLOT_SIZE.x, size.y / REF_SLOT_SIZE.y)
	sprite.scale = Vector2(scale_factor, scale_factor) * base_scale_multiplier

func _on_hover():
	if !selected:
		sprite.modulate = Color(0.6, 0.6, 0.6, 1)
		
func _on_exit():
	if !selected:
		sprite.modulate = Color(1, 1, 1, 1)
		
func _on_pressed():
	var slot_id = -1
	selected = !selected
	if selected:
		for i in range(3):
			if GeneralData.player["battle_team"][i]["name"] == "":
				slot_id = i
				break
		if slot_id == -1:
			selected = !selected
			return
		add_monster.emit(button.monster_name, slot_id)
		sprite.modulate = Color(1.7, 1.7, 1.7, 1)
	else:
		delete_monster.emit(button.monster_name)
		sprite.modulate = Color(1, 1, 1, 1)

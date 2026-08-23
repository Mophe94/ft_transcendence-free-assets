extends CharacterBody2D
@onready var sprite: AnimatedSprite2D = $sprite

func _ready():
	apply_skin(GeneralData.get_equipped_skin_enemy())

func apply_skin(skin: SkinData) -> void:
	
	if skin == null:
		push_warning("Aucune skin valide à appliquer.")
		return
	sprite.sprite_frames = skin.sprite_frames
	sprite.scale = skin.scale
	sprite.play("idle")

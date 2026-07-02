extends Resource
class_name SkinData

@export var skin_id: String = ""
@export var display_name: String = ""
@export var sprite_frames: SpriteFrames
@export var scale: Vector2 = Vector2(1, 1)
@export var icon: Texture2D          # utile plus tard pour un menu de sélection
@export var unlocked_by_default: bool = true

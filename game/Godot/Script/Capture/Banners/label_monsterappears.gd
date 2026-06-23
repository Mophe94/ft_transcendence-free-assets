extends CenterContainer

## Mettre ce script sur le noeud "CenterContainer" (celui qui est lui-même
## dans MonsterAppearsBanner, parent direct de BattleAnime).
##
## Objectif : BattleAnime (AnimatedSprite2D) doit toujours mesurer ~80% de
## la hauteur du bandeau MonsterAppearsBanner, quel que soit le viewport,
## peu importe le Stretch Mode/Aspect du projet.

@onready var battle_anime: AnimatedSprite2D = $BattleAnime

## Pourcentage de la hauteur du bandeau que doit occuper le sprite.
@export_range(0.0, 1.0, 0.01) var height_ratio: float = 0.8

func _ready() -> void:
	_update_battle_anime()
	
	resized.connect(_update_battle_anime)
	get_tree().get_root().size_changed.connect(_update_battle_anime)

func _update_battle_anime() -> void:
	if not battle_anime or not battle_anime.sprite_frames:
		return

	# Centre le sprite dans le CenterContainer (coordonnées locales).
	battle_anime.position = size * 0.5

	# Hauteur native (en pixels) de la frame actuellement affichée.
	var anim_name: StringName = battle_anime.animation
	var frame_index: int = battle_anime.frame
	var texture: Texture2D = battle_anime.sprite_frames.get_frame_texture(anim_name, frame_index)
	if not texture:
		return

	var native_height: float = texture.get_height()
	if native_height <= 0.0:
		return

	# Hauteur cible voulue à l'écran = 80% de la hauteur réelle du bandeau.
	var target_height: float = size.y * height_ratio

	# Scale uniforme (garde les proportions) pour atteindre cette hauteur.
	var scale_factor: float = target_height / native_height
	battle_anime.scale = Vector2(scale_factor, scale_factor)

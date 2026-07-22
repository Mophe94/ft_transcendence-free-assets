class_name Collectible
extends Interactable

@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D

var is_active: bool = false
var collected: bool = false


func _ready() -> void:
	add_to_group("collectible")


## Appelé par le script de scène (World) au démarrage, pour n'activer
## qu'une partie des collectibles générés sur la carte.
func set_interactable(value: bool) -> void:
	is_active = value
	if is_active:
		sprite.play("active")


func can_interact() -> bool:
	return is_active and not collected


func interact(_player: Node2D) -> void:
	Send.send_mesage("request_item")
	sprite.stop()
	collected = true

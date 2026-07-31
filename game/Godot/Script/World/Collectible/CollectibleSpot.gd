class_name Collectible
extends Interactable

@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D

var is_active: bool = false
var collected: bool = false

signal stop_inventory
signal run_inventory
signal update_slots

#############################
func transi_close()  :
	var transi_scene = GeneralData.transi.instantiate()
	add_child(transi_scene)
	await transi_scene.get_node("CanvasLayer/ColorRect").close()
	transi_scene.queue_free()
	
func _request_item():
	var send_func = func():
		Send.send_mesage(Send.SEND_TAB[Send.SEND_NAME.REQUEST_ITEM])
	var success = await GeneralProcess.wait_signal(send_func, Received.item_received)

	if ! success:
		await transi_close()
		get_tree().change_scene_to_packed(GeneralData.wait)

func _add_item():
	var send_func = func():
		Send.send_mesage(Send.SEND_TAB[Send.SEND_NAME.ADD_ITEM])
	var success = await GeneralProcess.wait_signal(send_func, Received.update_inventory)

	if ! success:
		await transi_close()
		get_tree().change_scene_to_packed(GeneralData.wait)
#############################

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
	emit_signal("stop_inventory")
	await _request_item()
	await _add_item()
	emit_signal("update_slots")
	emit_signal("run_inventory")
	sprite.stop()
	collected = true

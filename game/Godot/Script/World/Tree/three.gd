
class_name TreeObject
extends Interactable

@export var skin: SpriteFrames:
	set(value):
		skin = value
		if is_node_ready():
			animated_sprite.sprite_frames = value

@export var next_scene_path: String = "res://scenes/next_scene.tscn"

@onready var animated_sprite: AnimatedSprite2D = $AnimatedSprite2D
@onready var fireflies: AnimatedSprite2D = $Fireflies
@onready var mash_bar: MashBar = $MashBar

signal stop_player

var is_active: bool = false
var mash_started: bool = false
var already_used: bool = false


#############################
func transi_close():
	var transi_scene = GeneralData.transi.instantiate()
	add_child(transi_scene)
	await transi_scene.get_node("CanvasLayer/ColorRect").close()
	transi_scene.queue_free()

func _new_encounter():
	GeneralData.tile = "tree"
	GeneralData.background_capture = "tree"
	var send_func = func():
		Send.send_message(Send.SEND_TAB[Send.SEND_NAME.NEW_ENCOUNTER])
	var success = await GeneralProcess.wait_signal(send_func, Received.monster_encounter_received)

	await transi_close()
	if success:
		get_tree().change_scene_to_packed(GeneralData.capture_scene)
	else:
		get_tree().change_scene_to_packed(GeneralData.wait)
#############################


func _ready() -> void:
	add_to_group("tree")
	animated_sprite.sprite_frames = skin
	if skin:
		animated_sprite.play("idle")
	fireflies.visible = false
	mash_bar.completed.connect(_on_mash_completed)
	mash_bar.failed.connect(_on_mash_failed)


## Appelé par le script de scène (World) au démarrage, pour n'activer
## qu'une partie des arbres générés sur la carte.
func set_interactable(value: bool) -> void:
	is_active = value


func can_interact() -> bool:
	return is_active and not already_used and not mash_started


func on_enter_range(_player: Node2D) -> void:
	if can_interact():
		fireflies.visible = true
		fireflies.play("active")


func on_exit_range(_player: Node2D) -> void:
	fireflies.visible = false
	fireflies.stop()
	if mash_started:
		mash_bar.force_fail()


func interact(_player: Node2D) -> void:
	fireflies.visible = false
	fireflies.stop()
	mash_started = true
	already_used = true
	mash_bar.start()


func _on_mash_completed() -> void:
	mash_started = false
	emit_signal("stop_player")
	_new_encounter()


func _on_mash_failed() -> void:
	mash_started = false
	

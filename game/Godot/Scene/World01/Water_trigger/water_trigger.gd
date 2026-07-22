class_name FishingSpot
extends Interactable

@onready var fishing_bar: FishingBar = $MashBar_water
@onready var animated_sprite: AnimatedSprite2D = $AnimatedSprite2D
@onready var trigger_zone: Area2D = $TriggerZone

var is_active: bool = false
var fishing_started: bool = false
var already_used: bool = false


func _ready() -> void:
	add_to_group("fishing_spot")
	animated_sprite.play("idle")
	fishing_bar.completed.connect(_on_fishing_completed)
	fishing_bar.failed.connect(_on_fishing_failed)


func set_interactable(value: bool) -> void:
	is_active = value


func can_interact() -> bool:
	return is_active and not already_used and not fishing_started

func on_exit_range(_player: Node2D) -> void:
	if fishing_started:
		fishing_bar.force_fail()


func interact(_player: Node2D) -> void:
	fishing_started = true
	already_used = true
	fishing_bar.start()


func _on_fishing_completed() -> void:
	fishing_started = false
	print("poisson attrapé")
	await disappear()


func _on_fishing_failed() -> void:
	fishing_started = false
	print("pêche ratée")
	await disappear()


func disappear() -> void:
	is_active = false

	# Désactive la détection pendant l'animation
	trigger_zone.monitoring = false

	animated_sprite.play("stop")
	await animated_sprite.animation_finished

	visible = false

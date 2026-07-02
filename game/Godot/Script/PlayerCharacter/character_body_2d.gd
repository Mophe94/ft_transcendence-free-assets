extends CharacterBody2D
@export var speed = 250
@export var control = false
@onready var popup = $exclamationTooltip2
@onready var detection = $DetectionArea
@onready var sprite: AnimatedSprite2D = $sprite
var zones_active: int = 0
var active_interactables: Array = []
var current_interactable = null

func _ready():
	$Camera2D.enabled = false
	apply_skin(GeneralData.get_equipped_skin())
	popup.visible = false
	detection.area_entered.connect(_on_area_entered)
	detection.area_exited.connect(_on_area_exited)

func apply_skin(skin: SkinData) -> void:
	
	if skin == null:
		push_warning("Aucune skin valide à appliquer.")
		return
	sprite.sprite_frames = skin.sprite_frames
	sprite.scale = skin.scale
	sprite.play("idle")

func _on_area_entered(area: Area2D):
	if area.is_in_group("trigger_zone"):
		zones_active += 1
		popup.visible = true
		if area.has_method("interact"):
			active_interactables.append(area)
			current_interactable = area

func _on_area_exited(area: Area2D):
	if area.is_in_group("trigger_zone"):
		zones_active -= 1
		if zones_active <= 0:
			zones_active = 0
			popup.visible = false
		active_interactables.erase(area)
		current_interactable = active_interactables.back() if not active_interactables.is_empty() else null

func teleport_to(target_position: Vector2) -> void:
	global_position = target_position

func _physics_process(_delta: float) -> void:
	if control == false:
		$sprite.play("idle")
		return
	velocity = Input.get_vector("left", "right", "up", "down") * speed
	animat()
	move_and_slide()

func animat():
	if velocity == Vector2.ZERO:
		sprite.play("idle")
	else:
		if velocity.x < 0:
			sprite.flip_h = true
		elif velocity.x > 0:
			sprite.flip_h = false
		sprite.play("run")

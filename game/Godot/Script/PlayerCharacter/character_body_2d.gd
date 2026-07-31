extends CharacterBody2D

@export var speed = 250
@export var control = false

@onready var popup = $exclamationTooltip2
@onready var detection = $DetectionArea
@onready var sprite: AnimatedSprite2D = $sprite
@onready var item_popup = $ItemPopup
@onready var item_icon: Sprite2D = $ItemPopup/ItemIcon
@export var item_popup_duration: float = 2.0

# Liste des zones (Area2D) actuellement en contact, dans l'ordre d'entrée.
# On garde les Area2D (pas les Interactable directement) car ce sont elles
# qui déclenchent area_entered / area_exited.
var active_zones: Array[Area2D] = []


func _ready():
	$Camera2D.enabled = false
	apply_skin(GeneralData.get_equipped_skin())
	popup.visible = false
	item_popup.visible = false
	detection.area_entered.connect(_on_area_entered)
	detection.area_exited.connect(_on_area_exited)
#	Received.item_received.connect(_on_item_received)


func apply_skin(skin: SkinData) -> void:
	if skin == null:
		push_warning("Aucune skin valide à appliquer.")
		return
	sprite.sprite_frames = skin.sprite_frames
	sprite.scale = skin.scale
	sprite.play("idle")


# ---------------------------------------------------------------------------
# Détection des interactables (SOURCE UNIQUE DE VÉRITÉ)
# ---------------------------------------------------------------------------

func _on_area_entered(area: Area2D) -> void:
	if not area.is_in_group("trigger_zone"):
		return

	var spot = _resolve_interactable(area)
	if spot == null:
		push_warning("%s est dans le groupe trigger_zone mais n'a pas de méthode interact() (ni lui, ni son parent)" % area.name)
		return

	active_zones.append(area)
	if spot.has_method("on_enter_range"):
		spot.on_enter_range(self)


func _on_area_exited(area: Area2D) -> void:
	if not area.is_in_group("trigger_zone"):
		return

	var spot = _resolve_interactable(area)
	if spot and spot.has_method("on_exit_range"):
		spot.on_exit_range(self)

	active_zones.erase(area)


## Un objet interactif peut être structuré de deux façons :
## - une TriggerZone (Area2D) enfant d'un nœud parent qui porte la logique
##   (TreeObject, Collectible : Node2D racine + Area2D "TriggerZone")
## - l'Area2D elle-même qui porte toute la logique (Teleporter)
## On accepte les deux : on cherche d'abord sur l'area elle-même, sinon sur son parent.
func _resolve_interactable(area: Area2D) -> Node:
	if area.has_method("interact"):
		return area
	var parent = area.get_parent()
	if parent and parent.has_method("interact"):
		return parent
	return null


## L'interactable "actif" est toujours le dernier auquel on est entré.
func get_current_interactable() -> Node:
	if active_zones.is_empty():
		return null
	return _resolve_interactable(active_zones.back())


func _can_interact(spot: Node) -> bool:
	if spot.has_method("can_interact"):
		return spot.can_interact()
	return true


# ---------------------------------------------------------------------------
# Boucle principale
# ---------------------------------------------------------------------------

func _physics_process(_delta: float) -> void:
	_update_interaction_prompt()

	if control == false:
		sprite.play("idle")
		return

#	if Input.is_action_just_pressed("ui_selec"):
#		GeneralData.current_item = "rage"
#		_on_item_received()

	if Input.is_action_just_pressed("action"):
		var spot = get_current_interactable()
		if spot and _can_interact(spot):
			spot.interact(self)

	velocity = Input.get_vector("left", "right", "up", "down") * speed
	animat()
	move_and_slide()


## Le popup ne reflète pas juste "je suis dans une zone", mais "il y a
## quelque chose que je peux VRAIMENT faire là, maintenant".
## Ça évite qu'il reste affiché pendant un mash, ou pour un objet déjà utilisé.
func _update_interaction_prompt() -> void:
	var spot = get_current_interactable()
	popup.visible = spot != null and _can_interact(spot)


func animat():
	if velocity == Vector2.ZERO:
		sprite.play("idle")
	else:
		if velocity.x < 0:
			sprite.flip_h = true
		elif velocity.x > 0:
			sprite.flip_h = false
		sprite.play("run")


func teleport_to(target_position: Vector2) -> void:
	global_position = target_position


# ---------------------------------------------------------------------------
# Popup d'item
# ---------------------------------------------------------------------------

#func _on_item_received():
#	var item_name = GeneralData.current_item
#	if not GeneralData.object_database.has(item_name):
#		print("Objet inconnu reçu : " + item_name)
#		return
#	item_icon.texture = GeneralData.object_database[item_name]
#	_play_item_popup_animation()


func _play_item_popup_animation() -> void:
	item_popup.visible = true
	popup.visible = false
	item_popup.scale = Vector2.ZERO
	item_popup.modulate.a = 0.0
	var tween = create_tween()
	tween.set_trans(Tween.TRANS_BACK)
	tween.set_ease(Tween.EASE_OUT)
	tween.tween_property(item_popup, "scale", Vector2(1.1, 1.1), 0.2)
	tween.tween_property(item_popup, "scale", Vector2.ONE, 0.1)
	tween.parallel().tween_property(item_popup, "modulate:a", 1.0, 0.15)
	tween.tween_interval(item_popup_duration)
	tween.tween_property(item_popup, "modulate:a", 0.0, 0.3)
	tween.tween_callback(func(): item_popup.visible = false)
	

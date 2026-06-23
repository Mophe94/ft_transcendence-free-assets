extends Area2D

@export var destination: Vector2 = Vector2(4032.055, 384.0)
var player_inside: Node2D = null

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	body_exited.connect(_on_body_exited)

func _on_body_entered(body: Node2D) -> void:
	var root = body
	while root.get_parent() != null and not root.is_in_group("player"):
		root = root.get_parent()
	if root.is_in_group("player"):
		player_inside = root

func _on_body_exited(body: Node2D) -> void:
	var root = body
	while root.get_parent() != null and not root.is_in_group("player"):
		root = root.get_parent()
	if root.is_in_group("player"):
		player_inside = null

func _process(_delta) -> void:
	if player_inside == null:
		return
	if Input.is_action_just_pressed("action"):
		player_inside.global_position = destination

extends Area2D

# Coordonnées de destination (à modifier dans l'inspecteur)
@export var destination: Vector2 = Vector2(80, 50)

func _ready() -> void:
	body_entered.connect(_on_body_entered)

func _on_body_entered(body: Node2D) -> void:
	var root = body
	while root.get_parent() != null and not root.is_in_group("player"):
		root = root.get_parent()
		
	if root.is_in_group("player") :
		body.global_position = destination

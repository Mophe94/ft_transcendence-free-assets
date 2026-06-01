extends Area2D

func _ready():
	print("Area2D prête")
	body_entered.connect(_on_body_entered)

func _on_body_entered(body):
	print("quelque chose est entré : ", body.name)

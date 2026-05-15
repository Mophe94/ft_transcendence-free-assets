extends CanvasLayer


# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	$Control/CenterContainer/VBoxContainer/VBoxContainer/Label.text = GameState.mapName
	$Control/CenterContainer/VBoxContainer/VBoxContainer/TextureRect.texture = load(GameState.image)


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta: float) -> void:
	pass

extends Panel

@onready var choice = ""
@onready var playerAsset = GeneralData.hero_database[GeneralData.player["asset"]]

func _on_capture_pressed() -> void:
	choice = "capture"


func _on_object_pressed() -> void:
	choice = "object"


func _on_flee_pressed() -> void:
	choice = "flee"

func _ready() -> void:
	var player_scene = playerAsset.instantiate()
	$Player.add_child(player_scene)


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta: float) -> void:
	pass

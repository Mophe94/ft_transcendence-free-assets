extends Node2D

@onready var combatBanner = $CombatBanner
# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	combatBanner.modulate.a = 0.0
	start_intro()
# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta: float) -> void:
	pass

func start_intro():
	await get_tree().create_timer(1.0).timeout
	
	var tween = create_tween()
	tween.tween_property(combatBanner, "modulate:a", 0.6, 1.5)
	await tween.finished
	await get_tree().create_timer(2.0).timeout
	var tween2 = create_tween()
	tween2.tween_property(combatBanner, "modulate:a", 0.0, 1.5)

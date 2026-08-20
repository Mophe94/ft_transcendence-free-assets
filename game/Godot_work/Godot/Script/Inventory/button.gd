extends Button


func _ready() -> void:
	pivot_offset = size / 2
	pressed.connect(_on_pressed)
	mouse_entered.connect(_hover_on)
	mouse_exited.connect(_hover_off)

func _on_pressed() -> void:
	var tw := create_tween()
	tw.tween_property(self, "scale", Vector2(0.85, 0.85), 0.08)
	tw.tween_property(self, "scale", Vector2.ONE, 0.12)
	

func _hover_on() -> void:
	create_tween().tween_property(self, "modulate:a",3, 0.1)

func _hover_off() -> void:
	create_tween().tween_property(self, "modulate:a", 1.0, 0.1)

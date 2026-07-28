extends ColorRect

@onready var mat: ShaderMaterial = material

@export var duration := 1.0

func open():
	var tween = create_tween()
	tween.set_trans(Tween.TRANS_SINE)
	tween.set_ease(Tween.EASE_OUT)
	mat.set_shader_parameter("progress", 0.0)
	tween.tween_method(set_progress, 0.0, 1.0, duration)
	await tween.finished

func close():
	var tween = create_tween()
	tween.set_trans(Tween.TRANS_SINE)
	tween.set_ease(Tween.EASE_OUT)
	mat.set_shader_parameter("progress", 1.0)
	tween.tween_method(set_progress, 1.0, 0.0, duration)
	await tween.finished


func set_progress(value: float):
	mat.set_shader_parameter("progress", value)

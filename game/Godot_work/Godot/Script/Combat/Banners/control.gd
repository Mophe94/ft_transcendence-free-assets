extends Control

@onready var particles: CPUParticles2D = $CPUParticles2D

@export var time_to_cross_seconds: float = 2.0

func _ready() -> void:
	_update_particles_emission()
	resized.connect(_update_particles_emission)

func _update_particles_emission() -> void:
	if not particles:
		return

	var rect_size := size

	particles.emission_shape = CPUParticles2D.EMISSION_SHAPE_RECTANGLE
	particles.emission_rect_extents = Vector2(2.0, rect_size.y * 0.5)

	particles.position = Vector2(0.0, rect_size.y * 0.5)

	var needed_speed := rect_size.x / time_to_cross_seconds
	particles.direction = Vector2(1.0, 0.0)
	particles.spread = 0.5 
	particles.initial_velocity_min = needed_speed
	particles.initial_velocity_max = needed_speed

	particles.lifetime = time_to_cross_seconds

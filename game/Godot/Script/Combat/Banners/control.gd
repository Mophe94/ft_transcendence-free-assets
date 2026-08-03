extends Control

@onready var particles: CPUParticles2D = $CPUParticles2D

@export var time_to_cross_seconds: float = 2.0

func _ready() -> void:
	_update_particles_emission()
	resized.connect(_update_particles_emission)

func _update_particles_emission() -> void:
	if not particles:
		return

	var rect_size := size  # taille actuelle du Control en pixels

	particles.emission_shape = CPUParticles2D.EMISSION_SHAPE_RECTANGLE
	particles.emission_rect_extents = Vector2(2.0, rect_size.y * 0.5)

	# Position du noeud particules : collé au bord gauche, centré verticalement
	particles.position = Vector2(0.0, rect_size.y * 0.5)

	# Vitesse calculée automatiquement pour que chaque particule traverse
	# TOUTE la largeur du bandeau en "time_to_cross_seconds", quelle que
	# soit la résolution de l'écran.
	var needed_speed := rect_size.x / time_to_cross_seconds
	particles.direction = Vector2(1.0, 0.0)
	particles.spread = 0.5 
	particles.initial_velocity_min = needed_speed
	particles.initial_velocity_max = needed_speed

	particles.lifetime = time_to_cross_seconds

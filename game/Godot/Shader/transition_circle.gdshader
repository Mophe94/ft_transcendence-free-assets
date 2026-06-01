shader_type canvas_item;

uniform float progress = 0.1;

void fragment() {
    float alpha = 1.0 - progress;
    COLOR = vec4(0.0, 0.0, 0.0, alpha);
}
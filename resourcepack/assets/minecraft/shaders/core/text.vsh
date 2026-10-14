#version 330

#if !defined(IS_GUI) && !defined(IS_SEE_THROUGH)
#moj_import <minecraft:fog.glsl>
#moj_import <minecraft:sample_lightmap.glsl>
#endif

#moj_import <minecraft:dynamictransforms.glsl>
#moj_import <minecraft:projection.glsl>

in vec3 Position;
in vec4 Color;
in vec2 UV0;
#if !defined(IS_GUI) && !defined(IS_SEE_THROUGH)
in ivec2 UV2;
#endif

#if !defined(IS_GUI) && !defined(IS_SEE_THROUGH)
uniform sampler2D Sampler2;
out float sphericalVertexDistance;
out float cylindricalVertexDistance;
#endif

#ifdef IS_GUI
uniform sampler2D Sampler0;
#endif

out vec4 vertexColor;
out vec2 texCoord0;

void main() {
  vec3 position = Position;
  vec4 displayColor = Color;

#ifdef IS_GUI
  // 0. Decode #FEssyy (body) / #FDssyy (shadow), ignoring alpha.
  // ss = side length, yy = signed Y offset + 128. Positive Y is down.
  ivec3 rgb = ivec3(round(Color.rgb * 255.0));
  bool bodyMarker = rgb.r == 254;
  bool shadowMarker = rgb.r == 253;
  bool encoded = (bodyMarker || shadowMarker) && rgb.g > 0;
  // Keep the original #fffffe, 24x24 / Y=0 command usable.
  bool legacy = all(equal(rgb, ivec3(255, 255, 254)));

  // 1. Restrict decoding to 64x64 skin face / hat UV rectangles.
  bool skinSize = all(equal(textureSize(Sampler0, 0), ivec2(64)));
  bool face = UV0.x >= 0.125 && UV0.x <= 0.25;
  bool hat = UV0.x >= 0.625 && UV0.x <= 0.75;
  bool headY = UV0.y >= 0.125 && UV0.y <= 0.25;

  if ((encoded || legacy) && skinSize && (face || hat) && headY) {
    float sideLength = legacy ? 24.0 : float(rgb.g);
    float yOffset = legacy ? 0.0 : float(rgb.b - 128);

    // 2. Map face and hat corners to the same 0..1 rectangle.
    vec2 uvOrigin = vec2(hat ? 0.625 : 0.125, 0.125);
    vec2 corner = (UV0 - uvOrigin) * 8.0;

    // 3. Expand from bottom-left and translate Y in GUI units.
    // Vanilla has already added the shadow's own right/down offset.
    position.xy += vec2(corner.x, corner.y - 1.0) * (sideLength - 8.0);
    position.y += yOffset;

    // 4. Remove marker tint. Preserve alpha for opacity / chat fading.
    // Vanilla's white shadow is floor(255 / 4) = 63 per channel.
    displayColor.rgb = shadowMarker ? vec3(63.0 / 255.0) : vec3(1.0);
  }
#endif

  gl_Position = ProjMat * ModelViewMat * vec4(position, 1.0);

#if !defined(IS_GUI) && !defined(IS_SEE_THROUGH)
  sphericalVertexDistance = fog_spherical_distance(Position);
  cylindricalVertexDistance = fog_cylindrical_distance(Position);
  vertexColor = displayColor * sample_lightmap(Sampler2, UV2);
#else
  vertexColor = displayColor;
#endif
  texCoord0 = UV0;
}

/*
  Warnings:

  - The values [Mesh_3D,Geometry_3D,Renderer_3D] on the enum `NodeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."NodeType_new" AS ENUM ('ADDITION', 'SUBTRACTION', 'MULTIPLICATION', 'DIVISION', 'MODULO', 'POWER', 'SQUARE_ROOT', 'ABSOLUTE', 'SINE', 'COSINE', 'TANGENT', 'ARCSINE', 'ARCCOSINE', 'ARCTANGENT', 'LOGARITHM', 'LOGARITHM2', 'EXPONENTIAL', 'PI', 'EULER', 'MIN', 'MAX', 'CEIL', 'FLOOR', 'ROUND', 'RANDOM', 'SIGN', 'TRIAD_COLOR', 'TETRADIC_COLOR', 'ANALOGOUS_COLOR', 'COMPLEMENTARY_COLOR', 'SQUARE_COLOR', 'TO_HSV', 'FROM_HSV', 'TO_HSL', 'FROM_HSL', 'TO_RGB', 'FROM_RGB', 'IMAGE_AI', 'IMAGE_VARIATION_AI', 'PROMPT_AI', 'CIRCUIT', 'CIRCUIT_INPUTS', 'CIRCUIT_OUTPUT', 'TIMER', 'CONSOLE', 'LERP', 'CUBIC_BEZIER', 'MESH_3D', 'GEOMETRY_3D', 'RENDERER_3D');
ALTER TABLE "public"."Node" ALTER COLUMN "type" TYPE "public"."NodeType_new" USING ("type"::text::"public"."NodeType_new");
ALTER TYPE "public"."NodeType" RENAME TO "NodeType_old";
ALTER TYPE "public"."NodeType_new" RENAME TO "NodeType";
DROP TYPE "public"."NodeType_old";
COMMIT;

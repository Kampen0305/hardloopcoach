
// This file is intentionally kept minimal.
// It was previously suspected to be related to "Missing initializer in const declaration" errors.
// Making it an explicit empty module to ensure it's benign if processed.
// UPDATE: Since the error persists, adding a dummy constant to see if it helps the build process.
export const _hardloopSchemaGeneratorDummyConstant = true;

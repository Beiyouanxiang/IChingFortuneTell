export function createRequestSequence() {
  let latest = 0;
  return {
    begin() {
      latest += 1;
      return latest;
    },
    isLatest(id) {
      return id === latest;
    },
  };
}

export function isLocalInterpretationMode(provider) {
  return provider === "local";
}

export function buildClientFallback(reading, helpers) {
  const riskType = helpers.detectRisk(reading.question, reading.clarifications);
  return {
    interpretation: helpers.buildLocalInterpretation(reading, riskType),
    riskType,
    status: riskType === "normal" ? "fallback_client_error" : "safety_branch",
    model: riskType === "normal" ? "client-template" : "safety",
  };
}

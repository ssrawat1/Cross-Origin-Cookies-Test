import csrfTokens from '../csrfToken.json' with { type: 'json' };

export const verifyCsrfToken = (req, res, next) => {
  const existingToken = csrfTokens.find((token) => token[sessionId]);

  if (existingToken[sessionId] !== req.body.csrfToken) {
    return res.send({ error: 'Invalid Token' });
  }
  next();
};

const { execSync } = require('child_process');

// Commit exibido na tela "Sobre o app": no EAS Build vem da variável do build;
// localmente (expo start), do git
function getCommitHash() {
  if (process.env.EAS_BUILD_GIT_COMMIT_HASH) {
    return process.env.EAS_BUILD_GIT_COMMIT_HASH;
  }
  try {
    return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    commitHash: getCommitHash(),
    repositoryUrl: 'https://github.com/johnny-mathias/challenge3-mobile',
  },
});

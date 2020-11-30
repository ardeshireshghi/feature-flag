function tokenExpiresInSeconds(accessToken) {
  return Math.ceil((accessToken.payload.exp * 1000 - Date.now()) / 1000);
}

class AuthToken {
  constructor({ accessToken, refreshToken, expiresIn, tokenType }) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresIn = expiresIn;
    this.tokenType = tokenType;
  }

  static fromCognitoSession(session) {
    return new AuthToken({
      tokenType: 'Bearer',
      accessToken: session.getAccessToken().getJwtToken(),
      refreshToken: session.getRefreshToken().getToken(),
      expiresIn: tokenExpiresInSeconds(session.getAccessToken())
    });
  }

  toJson() {
    return {
      token_type: this.tokenType,
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
      expires_in: this.expiresIn
    };
  }
}

module.exports = AuthToken;

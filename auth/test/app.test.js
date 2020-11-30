const request = require('supertest');
const { getApp } = require('app');
const expectedAuthResponse = require('./fixtures/expected-authentication-response');

const { CognitoUser } = require('amazon-cognito-identity-js');

describe('Auth service', () => {
  let authenticateUserMock;
  let refreshSessionMock;

  describe('when correct client app credentials are used', () => {
    beforeEach(() => {
      const mockCognitoSession = {
        getAccessToken() {
          return {
            getJwtToken() {
              return 'eyJraWQiOiI4dHVDUkJsRXFzSlVIXC9ERWpCMHB6T3BhZXZvZHpTNUJzRzJyWmRGVUJJVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI4ZTE3NjYxYi05Y2Y2LTRkMDktYTg3OC0yZDE1ZWEwYjlhZTEiLCJldmVudF9pZCI6IjcwNDUxZDJiLTEwNDEtNDkxMi1iNDJjLTVmZDM1ZmFmMDMwYyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2MDY2OTU1MTQsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTEuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0xX2syWjIwTVc2cCIsImV4cCI6MTYwNjY5OTExNCwiaWF0IjoxNjA2Njk1NTE0LCJqdGkiOiJhYWMyMDA2NC1mOTFmLTQ5YzktYTEyYy05MGFlZjI3NDg4MDAiLCJjbGllbnRfaWQiOiJpMjBzbXVuNzU3cHEzdHFibWJidjdrcmc5IiwidXNlcm5hbWUiOiJmM2IxZjZjY2Q0ZmIwZTU1In0.GPy5z3dSDDR_nifs3-Pekf5nWHvIhCPqlAUUOFAW-WK2J4NLK33XCwpMABNVMzv32Vrm9O-MgDhCBCKzyqwS-lQzg51R-7Wn2y-KgUxO1aBeJORzx-pmW5z1AXAO5DMIy7JSvOBMoCRxefM7EK_pZ6kbCFJYxvGmW0C8lMA6CTz6dQo-VPSux6LitSbLnjZ3X9x4MSgsyUakgF_SgITXvaCl1MZliRClfceK-KFiEprTGnB1sRcWEJ47WBQKo7JEBS-renp7viTAlW06zBHJEay1grmfn6mSkGUtzHo0ag0PxVLFz9utPLqoncqIBmwkA_2-s6iUClzZD5OjgnaC3A';
            },
            payload: {
              exp: Math.floor(Date.now() / 1000) + 3600
            }
          };
        },
        getRefreshToken() {
          return {
            getToken() {
              return 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.YA8-MiOnHzxKGsHcB4z-o75-TQW-H_eRL0EEzem2Lfw8-UD1eQ_Dw0AlLIuXwDFlVo98z9GIVqxCevfBl5ohDM2O93xirmAp5JpIlEQel08YaBM8kBckcDGhm5tc3Nyw213oV-twtWAq66ham1kS62ScXWlhbjCSYWlnjtNoJJIcuhEt69eLC8CkGdQ28lwyyIKU0-p0fyyPH58u5nDTZFoBpRyTzgByY6sQA5738soKQ7ETzA5sG42okb2Nv87X0dlnbOBL1oyrm4x5EW-UDum-IE0NVJREnv9vzbFwNHLe49ENV7RmeEQjFWdaGxvgBfxI9VeMOeISniwEhIxjBw.RBjSH1MTlBok4y9j.XFs_xWlHGM0flnTmDaOpC5HQLz8iED3S1pr-F_bMqeG3pkBYgdLq3_7uE0RvSoSpd1bhTIVpH-IJ7YfWyYQyn8cKdCfsi3xzEvzsikZD5cVdVIFmUCWAcyPfA-D7YswyyEbYX6z1aWJCnhHpXrzPVLg-Ua0vZx2n8KaecIuFF0m1BEAzPntldz6uF_qPQOY5TbVkBNTh7sYmHqcaPNw3u-K7Q6-vouFyoug8iVYAQIZDTph6dgJ09oms4IaABm_hE5co_s1CwJAZlT45yEGw716y-0XT8fso0HzS0wTzdbu98PxMYWsq7Ic5pScbF_PyOhcuL4cd8VP_E9O_nOXTKkzmIDzA1iMpU7EiPkSqM447fc-UkMxGHca4hy78LgQ5M3h86xnpQjqlTiFujDEvbWC6BPaauQyVgZf-BmjXzNrQMo136396uuxuffk_WdWkKvoLarEj3WKVzbSBDfc_OOA5rSjExhxbhCdHYesoyV_PKtrn6UrRXAo8keMs5tcsC7OL-q0MmFFTCJxpXZMbqW2HVe3D3rdyu6JAB1yOM177__LSz1ERzsWEBmbXn98vavnE7e9Rtb9vGoO9ghKS4UwZfBJmJW0INFUqpDPTbNYugBfHaku516_XeVcScoK0mo7Qk-601DISs8AhpLZCTy6BPPIhEeBvo2Fr4EMja56jw2hkkY56uImfWWUxyVZetlRs4-wDko_U_G_RuO_uWXLL6uk65VOjBMshgicORGmaRrezNZit8G_KtTlqktza2hc4J7wl2YTM7rKjG2NG15wToDhZ16kkDNWjOJ1m-fzYA94JCQWWbsVUpBR9-kfk5dxxXfkJhcHC3UrR8MqSF2bgBzAJYlF8Np-WCu8FtykrsgHCGjv-6jUxyonowAqOXC5QKqbJY-wCSpd8Yuoo5kqfRGwvS6oDrBIkzP4xS9H4QzTgHjpCdfJ462z_L3KF9bPHdWiUv3pz3MBVCM-ysPkOEE5AEMJsj9445WJ28QRfLA6yiIIqq7YS6QVthGKrn2SIf0isF3mzu1JbhtjEFV5zYPOniKx8RqGYYEeqaXQ0KVas6p58uUjXbWgSq9na2rw1Ysq4SOzErXotq26jO6i1T0c52UpVO7geuDZFEVKuUEQ00iXc8kYzXIR1Zqyu4XEG2bQdSV9DpM3A7V3gGeFVVhqctjW6zw92NrCrkiT-QHT3mN17YfWCzpGh_ROTkGMsw49SBtHmiTwEMZKjrF6-WNlUM3QecvzGt-sdJRjxgl9ovFtaX0FznolOVcC0qKu_1W6m350tgt-rIniq.bZnNpf13GGCntllZ3BFeuw';
            }
          };
        }
      };

      authenticateUserMock = jest.fn((_, { onSuccess } = {}) =>
        onSuccess(mockCognitoSession)
      );
      refreshSessionMock = jest.fn((_, callbackFn) =>
        callbackFn(null, mockCognitoSession)
      );

      CognitoUser.mockImplementationOnce(() => {
        return {
          authenticateUser: authenticateUserMock,
          refreshSession: refreshSessionMock
        };
      });
    });

    it('authenticates client app and returns Access token', async () => {
      const authApp = getApp();

      const response = await request(authApp)
        .post('/auth/token')
        .set('Content-type', 'application/json')
        .set('Accept', 'application/json')
        .send({ client_id: 'someappid', client_secret: 'appsecret' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(expectedAuthResponse);
      expect(authenticateUserMock).toHaveBeenCalledTimes(1);
    });

    it('refreshes the access token when refresh token is provided', async () => {
      const authApp = getApp();

      const response = await request(authApp)
        .post('/auth/token')
        .set('Content-type', 'application/json')
        .set('Accept', 'application/json')
        .send({ client_id: 'someappid', refresh_token: 'some_refresh_token' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(expectedAuthResponse);
      expect(refreshSessionMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('when incorrect client app credentials are used', () => {
    beforeEach(() => {
      authenticateUserMock = jest.fn((_, { onFailure } = {}) =>
        onFailure({
          code: 'NotAuthorizedException',
          name: 'NotAuthorizedException',
          message: 'Incorrect username or password.'
        })
      );

      refreshSessionMock = jest.fn((_, callbackFn) =>
        callbackFn({
          code: 'NotAuthorizedException',
          name: 'NotAuthorizedException',
          message: 'Invalid Refresh Token'
        })
      );

      CognitoUser.mockImplementationOnce(() => {
        return {
          authenticateUser: authenticateUserMock,
          refreshSession: refreshSessionMock
        };
      });
    });

    it('returns 403 with invalid client_id or secret', async () => {
      const authApp = getApp();

      const response = await request(authApp)
        .post('/auth/token')
        .set('Content-type', 'application/json')
        .set('Accept', 'application/json')
        .send({ client_id: 'someappid', client_secret: 'bad_appsecret' })
        .expect('Content-Type', /json/)
        .expect(403);

      expect(response.body).toEqual({
        error: true,
        code: 'NotAuthorizedException',
        message: 'Incorrect username or password.',
        status: 403
      });
    });

    it('returns 403 with invalid client_id or refresh_token', async () => {
      const authApp = getApp();

      const response = await request(authApp)
        .post('/auth/token')
        .set('Content-type', 'application/json')
        .set('Accept', 'application/json')
        .send({ client_id: 'someappid', refresh_token: 'bad_refreshtoken' })
        .expect('Content-Type', /json/)
        .expect(403);

      expect(response.body).toEqual({
        error: true,
        code: 'NotAuthorizedException',
        message: 'Invalid Refresh Token',
        status: 403
      });
    });
  });
});

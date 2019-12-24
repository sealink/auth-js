const {
  authorizeStagingToken,
  authorizeProductionToken
} = require("authorizer");
const nock = require("nock");

describe("Verification", () => {
  beforeEach(() => {
    nock("https://auth-next.quicktravel.com.au")
      .persist()
      .get("/.well-known/jwks.json")
      .reply(200, {
        keys: [
          {
            kty: "RSA",
            n:
              "517vaFTRKc98hCKiyF_u4GCiZuRKA4xX4x4lWSXB38w0FasyqwHhl686L6AzGZQPolEPyY-fF0xn3huricBKPgteYh35ij3hUwMZBDaZFCESlE4H0s8u9eONp2Kfb2ER3ILaRMM-RsUImnGUiNUy9ZW4k3zI4_wIn3YC0UX5WF83QhvnxSFyE8IQdnvsp6mn7Bv0lQk43pfQlvBudEjXEGyKBzEDUzinkp_gvfIxKdZ_Kfnu70MWndSl0sa4x7csgfV5rh4O3VnHIk7PHARdCWiOQvj8ze_pDKpM6Vy28MArk2OCb1vHT28ol2qxbG8mlPv_bZdsBGrT1-65pXn-Sw",
            e: "AQAB",
            kid:
              "00fa1d3f44830d217ca99e6cd021981a38c2b6e18325412c9e378605ca976fc6"
          }
        ]
      });

    nock("https://auth.quicktravel.com.au")
      .persist()
      .get("/.well-known/jwks.json")
      .reply(200, {
        keys: [
          {
            kty: "RSA",
            n:
              "517vaFTRKc98hCKiyF_u4GCiZuRKA4xX4x4lWSXB38w0FasyqwHhl686L6AzGZQPolEPyY-fF0xn3huricBKPgteYh35ij3hUwMZBDaZFCESlE4H0s8u9eONp2Kfb2ER3ILaRMM-RsUImnGUiNUy9ZW4k3zI4_wIn3YC0UX5WF83QhvnxSFyE8IQdnvsp6mn7Bv0lQk43pfQlvBudEjXEGyKBzEDUzinkp_gvfIxKdZ_Kfnu70MWndSl0sa4x7csgfV5rh4O3VnHIk7PHARdCWiOQvj8ze_pDKpM6Vy28MArk2OCb1vHT28ol2qxbG8mlPv_bZdsBGrT1-65pXn-Sw",
            e: "AQAB",
            kid:
              "00fa1d3f44830d217ca99e6cd021981a38c2b6e18325412c9e378605ca976fc6"
          }
        ]
      });
  });

  test("Throws exception when no token is passed", async () => {
    const event = {};
    await expect(authorizeStagingToken(event, {})).rejects.toThrow(
      "Unauthorized"
    );
  });

  test("Throws exception when no bearer token is passed", async () => {
    const event = {
      authorizationToken: "test-auth"
    };

    await expect(authorizeStagingToken(event, {})).rejects.toThrow(
      "Unauthorized"
    );
  });

  test("Throws exception when issuing server can not be reached", async () => {
    nock("https://auth-next.quicktravel.com.au")
      .get("/.well-known/jwks.json")
      .reply(500, {});
    const event = {};

    await expect(authorizeStagingToken(event, {})).rejects.toThrow(
      "Unauthorized"
    );
  });

  test("Throws exception when token is invalid", async () => {
    const event = {
      authorizationToken: "Bearer test-auth-invalid"
    };

    await expect(authorizeStagingToken(event, {})).rejects.toThrow(
      "Unauthorized"
    );
  });

  test("Throws exception when token is expired", async () => {
    const event = {
      authorizationToken:
        "Bearer eyJraWQiOiIwMGZhMWQzZjQ0ODMwZDIxN2NhOTllNmNkMDIxOTgxYTM4YzJiNmUxODMyNTQxMmM5ZTM3ODYwNWNhOTc2ZmM2IiwiYWxnIjoiUlMyNTYifQ.eyJsb2dpbiI6InRlc3RfdXNlcl8yIiwiaWQiOiJzZWFsaW5rOjU2NTU4Iiwic3ViIjoic2VhbGluazo1NjU1OCIsImV4cCI6MTU3NTczNDg4MywiaXNzIjoiaHR0cHM6Ly9hdXRoLW5leHQucXVpY2t0cmF2ZWwuY29tLmF1In0.T_Dj2vs2FRe7vxqsoCPRT9Nzt_inMR2Iefqi7AoHY8HoMDJlZ-gsZx8E36RHWv_0qYHyw5Byw4XnrEVRSZs370Zqb1WNyIyvY4AdAvobSn7v9vbZnq_JDQzYyv8Ybo5jGaovZi62KekmLq_PIm0IT0b1JiYcXblAfVBgpcRN1m5hlNG72pgLPu1WWlZYdvOwp4HFkIlhTuIzM0fj8RE-x0OoJJVnEwcAF3-rxmE9puXRxkjFnTA_hOTWihxFVlVeX6RpqEkdW5nl1NV0A5vVHn9yKgSBbCPP1TZ_Ul31YBOrqysuxCX2-6Jy7QyVaIFfbmIE5aYO7kGUE9UWQYpqyw",
      methodArn: "arn:/123/123"
    };

    await expect(authorizeStagingToken(event, {})).rejects.toThrow(
      "Unauthorized"
    );
  });

  test("Validates correct token", async () => {
    jest
      .spyOn(global.Date, "now")
      .mockImplementationOnce(() =>
        new Date("2019-12-07T11:01:58.135Z").valueOf()
      );

    const event = {
      authorizationToken:
        "Bearer eyJraWQiOiIwMGZhMWQzZjQ0ODMwZDIxN2NhOTllNmNkMDIxOTgxYTM4YzJiNmUxODMyNTQxMmM5ZTM3ODYwNWNhOTc2ZmM2IiwiYWxnIjoiUlMyNTYifQ.eyJsb2dpbiI6InRlc3RfdXNlcl8yIiwiaWQiOiJzZWFsaW5rOjU2NTU4Iiwic3ViIjoic2VhbGluazo1NjU1OCIsImV4cCI6MTU3NTczNDg4MywiaXNzIjoiaHR0cHM6Ly9hdXRoLW5leHQucXVpY2t0cmF2ZWwuY29tLmF1In0.T_Dj2vs2FRe7vxqsoCPRT9Nzt_inMR2Iefqi7AoHY8HoMDJlZ-gsZx8E36RHWv_0qYHyw5Byw4XnrEVRSZs370Zqb1WNyIyvY4AdAvobSn7v9vbZnq_JDQzYyv8Ybo5jGaovZi62KekmLq_PIm0IT0b1JiYcXblAfVBgpcRN1m5hlNG72pgLPu1WWlZYdvOwp4HFkIlhTuIzM0fj8RE-x0OoJJVnEwcAF3-rxmE9puXRxkjFnTA_hOTWihxFVlVeX6RpqEkdW5nl1NV0A5vVHn9yKgSBbCPP1TZ_Ul31YBOrqysuxCX2-6Jy7QyVaIFfbmIE5aYO7kGUE9UWQYpqyw",
      methodArn: "arn:/123/123"
    };

    const response = await authorizeStagingToken(event, {});
    expect(response).toMatchSnapshot();
  });

  test("Vaidates issuer", async () => {
    const event = {
      authorizationToken:
        "Bearer eyJraWQiOiIwMGZhMWQzZjQ0ODMwZDIxN2NhOTllNmNkMDIxOTgxYTM4YzJiNmUxODMyNTQxMmM5ZTM3ODYwNWNhOTc2ZmM2IiwiYWxnIjoiUlMyNTYifQ.eyJsb2dpbiI6InRlc3RfdXNlcl8yIiwiaWQiOiJzZWFsaW5rOjU2NTU4Iiwic3ViIjoic2VhbGluazo1NjU1OCIsImV4cCI6MTU3NTczNDg4MywiaXNzIjoiaHR0cHM6Ly9hdXRoLW5leHQucXVpY2t0cmF2ZWwuY29tLmF1In0.T_Dj2vs2FRe7vxqsoCPRT9Nzt_inMR2Iefqi7AoHY8HoMDJlZ-gsZx8E36RHWv_0qYHyw5Byw4XnrEVRSZs370Zqb1WNyIyvY4AdAvobSn7v9vbZnq_JDQzYyv8Ybo5jGaovZi62KekmLq_PIm0IT0b1JiYcXblAfVBgpcRN1m5hlNG72pgLPu1WWlZYdvOwp4HFkIlhTuIzM0fj8RE-x0OoJJVnEwcAF3-rxmE9puXRxkjFnTA_hOTWihxFVlVeX6RpqEkdW5nl1NV0A5vVHn9yKgSBbCPP1TZ_Ul31YBOrqysuxCX2-6Jy7QyVaIFfbmIE5aYO7kGUE9UWQYpqyw",
      methodArn: "arn:/123/123"
    };

    await expect(authorizeProductionToken(event, {})).rejects.toThrow(
      "Unauthorized"
    );
  });
});

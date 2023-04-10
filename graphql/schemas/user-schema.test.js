const { request, gql } = require("graphql-request");

const endpoint = "http://localhost:4000/graphql";

describe("User queries", () => {
  test("Querying a single user", async () => {
    const query = gql`
      query User($id: ID!) {
        user(id: $id) {
          id
          accountName
          bankCode
          accountNumber
          is_verified
        }
      }
    `;

    const variables = { id: "1" };
    const data = await request(endpoint, query, variables);

    expect(data).toEqual({
      user: {
        id: 1,
        accountName: "Olawale Johnn Shopeyin",
        bankCode: "044",
        accountNumber: "1526476070",
        is_verified: true,
      },
    });
  });
  test("Querying for a single user using bankCode and accountNumber", async () => {
    const query = gql`
      query getAccountName($input: GetAccountNameInput!) {
        getAccountName(input: $input) {
          accountName
        }
      }
    `;

    const variables = {
      input: {
        bankCode: "035A",
        accountNumber: "0239961062",
      },
    };
    const data = await request(endpoint, query, variables);

    expect(data).toEqual({
      getAccountName: {
        accountName: "OLAWALE  SHOPEYIN",
      },
    });
  });

  test("Querying all users", async () => {
    const query = gql`
      query Users {
        users {
          id
          accountName
          bankCode
          accountNumber
          is_verified
        }
      }
    `;

    const data = await request(endpoint, query);

    expect(data).toEqual({
      users: [
        {
          id: 1,
          accountName: "Olawale Johnn Shopeyin",
          bankCode: "044",
          accountNumber: "1526476070",
          is_verified: true,
        },
        {
          id: 2,
          accountName: "OLAWALE  SHOPEYIN",
          bankCode: "035A",
          accountNumber: "0239961062",
          is_verified: true,
        },
        {
          id: 3,
          accountName: null,
          bankCode: "035A",
          accountNumber: "0239961062",
          is_verified: false,
        },
      ],
    });
  });
});

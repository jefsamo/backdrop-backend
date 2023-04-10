module.exports = `#graphql
    type User {
        id: Int!
        accountName: String
        bankCode:String!
        accountNumber:String!
        is_verified: Boolean!
    }

    type Query{
        user(id:ID!): User!
        users:[User!]
        getAccountName(input: GetAccountNameInput!): AccountNameResponse
    }

    type Mutation {
        register(input: RegisterInput!): RegisterResponse
        updateVerifyField(id:ID!, input:UpdateVerifyInput): VerifyResponse
    }

    type RegisterResponse {
        id: Int!
        accountName: String
        bankCode:String!
        accountNumber:String!
        is_verified: Boolean!
    }
    type AccountNameResponse {
        id: Int!
        accountName: String
        bankCode:String!
        accountNumber:String!
        is_verified: Boolean!
    }

    type VerifyResponse {
        id: Int!
        accountName: String
        bankCode:String!
        accountNumber:String!
        is_verified: Boolean!
    }

    input RegisterInput {
        accountName: String
        bankCode:String!
        accountNumber:String!
        is_verified: Boolean!
    }
    input GetAccountNameInput {
        bankCode:String!
        accountNumber:String!
    }
    
    input UpdateVerifyInput {
        user_account_number:String!
        user_bank_code:String!
        user_account_name:String!
    }
`;

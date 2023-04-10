const { User } = require("../../database/models");
const axios = require("axios");
const levenshtein = require("fast-levenshtein");

require("dotenv").config();

// paystack account_name resolution api endpoint function
const paystackRoute = async (accountNumber, bankCode) => {
  return await axios.get(
    `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_API}`,
      },
    }
  );
};

// Levenshtein function
const getLevenshtein = (userAccount, paystackAccount) => {
  return levenshtein.get(userAccount, paystackAccount);
};

module.exports = {
  Mutation: {
    async register(_, { input }, __) {
      const { accountName, is_verified, accountNumber, bankCode } = input;
      return User.create({ accountName, is_verified, accountNumber, bankCode });
    },

    async updateVerifyField(root, args, context) {
      const { id, input } = args;
      const { user_account_number, user_bank_code, user_account_name } = input;

      // Check if user exists in database
      const user = await User.findByPk(id);
      console.log("Checking something");

      if (!user) {
        throw new Error("User does not exist");
      }

      const res = await paystackRoute(user_account_number, user_bank_code);

      // Levenstein distance comparison between user input and paystack account_name
      const distance = getLevenshtein(
        user_account_name.toLowerCase().trim(),
        res.data.data.account_name.toLowerCase().trim()
      );

      // Update is_verified field if distance < 2
      if (distance <= 2) {
        await User.update({ is_verified: true }, { where: { id: id } });
      }

      return User.findByPk(id);
    },
  },
  Query: {
    async users(parent, args, context) {
      return User.findAll();
    },
    async user(parent, args, context) {
      return User.findByPk(args.id);
    },
    async getAccountName(parent, { input }, context) {
      const { bankCode, accountNumber } = input;

      // Retrieve user from database
      const user = await User.findOne({ where: { bankCode, accountNumber } });

      // Get account_name from paystack account_name resolution api
      const res = await paystackRoute(accountNumber, bankCode);

      // If account Name is null, return accoujt_name from paystack api
      if (user.accountName === null) {
        await User.update(
          {
            accountName: res.data.data.account_name,
          },
          { where: { bankCode, accountNumber } }
        );
        return User.findOne({ where: { bankCode, accountNumber } });
      }

      const distance = getLevenshtein(
        user.accountName.toLowerCase().trim(),
        res.data.data.account_name.toLowerCase().trim()
      );

      // Return name from database
      if (user.accountName !== null && distance <= 2) {
        return User.findOne({ where: { bankCode, accountNumber } });
      }
    },
  },
};

const { Matchup,Tech } = require('../models');

const resolvers = {

  Query: {
    matchups: async () => {
      return Matchup.find();
    },

    techs: async () => {
        return Tech.find();
    },

    matchup: async (parent, { matchupId }) => {
      return Matchup.findOne({ _id: matchupId });
    },
  },

  Mutation: {
    createMatchup: async (parent, { tech1, tech2 }) => {
      return Matchup.create({ tech1, tech2 });
    },
    createVote: async (parent, { matchupId, techNum }) => {
        const field = techNum === 1 ? 'tech1_votes' : 'tech2_votes';
      const vote = await Matchup.findOneAndUpdate(
        { _id: matchupId },
        {
          $inc: { [field]: 1 }  ,
        },
        {
          new: true,
          runValidators: true,
        }
      );
    return vote;
    },
  },
};

module.exports = resolvers;

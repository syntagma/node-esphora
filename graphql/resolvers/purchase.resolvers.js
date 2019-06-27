const {
  User,
  Customer,
  Truck,
  Purchase,
  Sale,
  ExchangeRate
} = require('../../models');

const resolvers = {
  purchase(_, { filter }) {
    if (filter.truck_id) {
      filter['truck.truck_id'] = filter.truck_id;
      delete filter.truck_id;
    }
    return Purchase.findOne(filter).then(response => response);
  },
  purchases(_, { offset, first, filter, sort }) {
    let filter_json = { $and: [] };
    if (filter) {
      if (filter.text) {
        filter_json.$and.push({
          $or: [
            { $text: { $search: filter.text } },
            { cuit: !isNaN(filter.text) ? filter.text : '' }
          ]
        });
      }
      if (filter.date_start)
        filter_json.$and.push({
          date: { $gte: new Date(filter.date_start) }
        });
      if (filter.date_end)
        filter_json.$and.push({
          date: { $lte: new Date(filter.date_end) }
        });
      if (filter.type) filter_json.$and.push({ type: filter.type });
      if (filter_json.$and.length == 0) filter_json = {};
    }
    let sort_json = {};
    sort_json[sort.column] = sort.criteria;
    return Purchase.find(filter_json)
      .skip(offset)
      .limit(first)
      .sort(sort_json)
      .then(response => {
        return Purchase.countDocuments(filter_json).then(count => {
          return {
            items: response,
            count: count
          };
        });
      });
  },
  async associatedExpenses(_, { truck_id }) {
    const purchases = await Purchase.aggregate([
      {
        $match: {
          items: {
            $elemMatch: {
              'linked_trucks.truck_id': truck_id
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          date: 1,
          formatted_number: 1,
          exchange_rate: 1,
          items: 1,
          'provider.company': 1
        }
      },
      {
        $addFields: {
          items: {
            $filter: {
              input: {
                $map: {
                  input: '$items',
                  as: 'i',
                  in: {
                    type: '$$i.type',
                    details: '$$i.details',
                    amount: '$$i.amount',
                    amount_usd: '$$i.amount_usd',
                    exchange_rate: '$$i.exchange_rate',
                    linked_trucks: {
                      $filter: {
                        input: '$$i.linked_trucks',
                        as: 'lt',
                        cond: {
                          $and: [{ $eq: ['$$lt.truck_id', truck_id] }]
                        }
                      }
                    }
                  }
                }
              },
              as: 'i',
              cond: { $gt: [{ $size: '$$i.linked_trucks' }, 0] }
            }
          }
        }
      }
    ]);

    let expenses = [];
    for (purchase of purchases) {
      for (item of purchase.items) {
        expenses.push({
          purchase_id: purchase._id,
          formatted_number: purchase.formatted_number,
          type: item.type,
          details: item.details,
          company: purchase.provider.company,
          date: purchase.date,
          amount: item.amount,
          amount_usd: item.amount_usd,
          exchange_rate: item.exchange_rate
        });
      }
    }
    return expenses;
  }
};

module.exports = resolvers;

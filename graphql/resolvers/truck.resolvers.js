const {
  User,
  Customer,
  Truck,
  Purchase,
  Sale,
  ExchangeRate
} = require('../../models');

const resolvers = {
  truck(_, { id }) {
    return Truck.findById(id).then(response => response);
  },
  trucks(_, { offset, first, filter, sort }) {
    let filter_json = { $and: [] };
    if (filter) {
      if (filter.text) {
        filter_json.$and.push({
          $text: { $search: filter.text }
        });
      }
      if (filter.status && filter.status.length > 0) {
        filter_json.$and.push({
          status: { $in: filter.status }
        });
      }
      if (filter.brand && filter.brand.length > 0) {
        filter_json.$and.push({
          brand: { $in: filter.brand }
        });
      }
      if (filter_json.$and.length == 0) filter_json = {};
    }

    let sort_json = {};
    sort_json[sort.column] = sort.criteria;

    return Truck.find(filter_json)
      .skip(offset)
      .limit(first)
      .sort(sort_json)
      .then(response => {
        return Truck.countDocuments(filter_json).then(count => {
          return {
            items: response,
            count: count
          };
        });
      });
  },
  trucksWeb(_, { offset, first, filter, sort }) {
    let filter_json = {
      $and: [
        {
          status: 'disponible'
        }
      ]
    };
    if (filter) {
      if (filter.text) {
        filter_json.$and.push({
          name: { $regex: filter.text, $options: 'i' }
        });
      }
      if (filter.year)
        filter_json.$and.push({
          year: { $gte: filter.year[0], $lte: filter.year[1] }
        });
      if (filter.price)
        filter_json.$and.push({
          price: { $gte: filter.price[0] * 1000, $lte: filter.price[1] * 1000 }
        });
      if (filter.price_financing)
        filter_json.$and.push({
          price_financing: {
            $gte: filter.price_financing[0] * 1000,
            $lte: filter.price_financing[1] * 1000
          }
        });
      if (filter.km)
        filter_json.$and.push({
          km: { $gte: filter.km[0] * 1000, $lte: filter.km[1] * 1000 }
        });
      if (filter.status && filter.status.length > 0) {
        filter_json.$and.push({
          status: { $in: filter.status }
        });
      }
      if (filter.brand) {
        filter_json.$and.push({
          brand: filter.brand
        });
      }
      if (filter.engine) {
        filter_json.$and.push({
          engine: filter.engine
        });
      }
      if (filter.transmission) {
        filter_json.$and.push({
          transmission: filter.transmission
        });
      }
      if (filter.type) {
        filter_json.$and.push({
          type: filter.type
        });
      }
      if (filter.traction) {
        filter_json.$and.push({
          traction: filter.traction
        });
      }
      if (filter.category) {
        filter_json.$and.push({
          category: filter.category
        });
      }
    }

    let sort_json = {};
    sort_json[sort.column] = sort.criteria;

    return Truck.find(filter_json)
      .skip(offset)
      .limit(first)
      .sort(sort_json)
      .then(response => {
        for (let truck of response) {
          truck.photos.sort((a, b) => {
            if (a.position < b.position) {
              return -1;
            }
            if (a.position > b.position) {
              return 1;
            }
            return 0;
          });
        }

        return Truck.countDocuments(filter_json).then(count => {
          return {
            items: response,
            count: count
          };
        });
      });
  },
  trucksAll() {
    return Truck.find({}).then(response => response);
  },
  async trucksWithoutInvoicePurchase() {
    const linkedTrucks = await Purchase.find({ type: 'truck' });

    return Truck.find({
      _id: {
        $nin: linkedTrucks.map(function(p) {
          return p.truck.truck_id;
        })
      }
    }).then(response => response);
  },
  async trucksWithoutInvoiceSale() {
    const linkedTrucks = await Sale.find();

    return Truck.find({
      _id: {
        $nin: linkedTrucks.map(function(s) {
          return s.truck.truck_id;
        })
      }
    }).then(response => response);
  },
  trucksCount() {
    return Truck.count();
  },
  trucksFilters() {
    return Truck.aggregate([
      {
        $project: {
          _id: 0,
          dir: [
            { value: '$brand', count: 1, name: 'brand' },
            { value: '$status', count: 1, name: 'status' }
          ]
        }
      },
      { $unwind: '$dir' },
      {
        $group: {
          _id: {
            value: '$dir.value',
            name: '$dir.name'
          },
          count: { $sum: '$dir.count' }
        }
      },
      {
        $group: {
          _id: '$_id.name',
          items: {
            $push: {
              value: '$_id.value',
              count: '$count'
            }
          }
        }
      }
    ]).then(response => response);
  },
  trucksWebFilters(_, { filter }) {
    let filter_json = {
      $and: [
        {
          status: 'disponible'
        }
      ]
    };
    if (filter) {
      if (filter.text) {
        filter_json.$and.push({
          name: { $regex: filter.text, $options: 'i' }
        });
      }
      if (filter.year)
        filter_json.$and.push({
          year: { $gte: filter.year[0], $lte: filter.year[1] }
        });
      if (filter.price)
        filter_json.$and.push({
          price: { $gte: filter.price[0] * 1000, $lte: filter.price[1] * 1000 }
        });
      if (filter.price_financing)
        filter_json.$and.push({
          price_financing: {
            $gte: filter.price_financing[0] * 1000,
            $lte: filter.price_financing[1] * 1000
          }
        });
      if (filter.km)
        filter_json.$and.push({
          km: { $gte: filter.km[0] * 1000, $lte: filter.km[1] * 1000 }
        });
      if (filter.status && filter.status.length > 0) {
        filter_json.$and.push({
          status: { $in: filter.status }
        });
      }
      if (filter.brand) {
        filter_json.$and.push({
          brand: filter.brand
        });
      }
      if (filter.engine) {
        filter_json.$and.push({
          engine: filter.engine
        });
      }
      if (filter.transmission) {
        filter_json.$and.push({
          transmission: filter.transmission
        });
      }
      if (filter.type) {
        filter_json.$and.push({
          type: filter.type
        });
      }
      if (filter.traction) {
        filter_json.$and.push({
          traction: filter.traction
        });
      }
      if (filter.category) {
        filter_json.$and.push({
          category: filter.category
        });
      }
    }

    return Truck.aggregate([
      { $match: filter_json },
      {
        $project: {
          _id: 0,
          dir: [
            { value: '$brand', count: 1, name: 'brand' },
            { value: '$engine', count: 1, name: 'engine' },
            { value: '$transmission', count: 1, name: 'transmission' },
            { value: '$category', count: 1, name: 'category' },
            { value: '$traction', count: 1, name: 'traction' },
            { value: '$type', count: 1, name: 'type' }
          ]
        }
      },
      { $unwind: '$dir' },
      {
        $group: {
          _id: {
            value: '$dir.value',
            name: '$dir.name'
          },
          count: { $sum: '$dir.count' }
        }
      },
      {
        $group: {
          _id: '$_id.name',
          items: {
            $push: {
              value: '$_id.value',
              count: '$count'
            }
          }
        }
      }
    ]).then(response => response);
  },
  trucksHighlighters() {
    return Truck.find({ highlighted: true }).then(response => response);
  }
};

module.exports = resolvers;

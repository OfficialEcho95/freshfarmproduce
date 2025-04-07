"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/* eslint-disable jest/require-hook */
var _require = require('csv-writer'),
    createObjectCsvWriter = _require.createObjectCsvWriter;

var paginate = require('express-paginate');

var express = require('express');

var cron = require('node-cron');

var Commodity = require('../models/commodity');

var User = require('../models/user');

var _require2 = require('../../../payment/paymentController'),
    initializePayment = _require2.initializePayment;

var Order = require('../models/order');

var Post = require('../models/post');

var redisClient = require('../../../redisClient');

var router = express.Router();
router.use(paginate.middleware(20, 5000)); // 20 items per page, max limit of 5000
// route for farmer to add product to his catalogue

var addCommodity = function addCommodity(req, res) {
  var userId, user, _req$body, title, description, price, quantityAvailable, categories, location, imageUrls, newCommodity, newPost;

  return regeneratorRuntime.async(function addCommodity$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = req.session.userId;

          if (userId) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            message: 'Unauthorized - user not logged in'
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 6:
          user = _context.sent;

          if (user) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: 'User not found'
          }));

        case 9:
          if (!(user.role !== 'farmer')) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", res.status(403).json({
            message: 'Forbidden - user is not a farmer'
          }));

        case 11:
          _req$body = req.body, title = _req$body.title, description = _req$body.description, price = _req$body.price, quantityAvailable = _req$body.quantityAvailable, categories = _req$body.categories, location = _req$body.location;
          imageUrls = [];

          if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(function (file) {
              return "commodityUploads/".concat(file.filename);
            });
          }

          newCommodity = new Commodity({
            farmer: userId,
            title: title,
            description: description,
            price: price,
            quantityAvailable: quantityAvailable,
            images: imageUrls,
            categories: categories,
            location: location
          });
          _context.next = 17;
          return regeneratorRuntime.awrap(newCommodity.save());

        case 17:
          // Update the user's commodities array
          user.commodities.push(newCommodity._id);
          _context.next = 20;
          return regeneratorRuntime.awrap(user.save());

        case 20:
          newPost = new Post({
            commodity: newCommodity._id,
            title: newCommodity.title,
            description: newCommodity.description,
            price: newCommodity.price,
            images: newCommodity.images,
            tags: newCommodity.categories,
            lastDisplayedAt: new Date(0)
          });
          _context.next = 23;
          return regeneratorRuntime.awrap(newPost.save());

        case 23:
          res.status(201).json({
            message: 'Commodity added and posted successfully',
            commodity: newCommodity,
            post: newPost
          });
          _context.next = 30;
          break;

        case 26:
          _context.prev = 26;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).json({
            message: 'Error encountered adding commodity'
          });

        case 30:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 26]]);
}; // route to purchase a commodity


var buyCommodity = function buyCommodity(req, res) {
  var items, userId, user, totalPrice, orderItems, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, commodityId, quantityPurchased, commodity, order, paymentData;

  return regeneratorRuntime.async(function buyCommodity$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          items = req.body.items;
          userId = req.session.userId;
          _context2.next = 5;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 5:
          user = _context2.sent;

          if (user) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: 'User not found'
          }));

        case 8:
          totalPrice = 0;
          orderItems = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 13;
          _iterator = items[Symbol.iterator]();

        case 15:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context2.next = 30;
            break;
          }

          item = _step.value;
          commodityId = item.commodityId, quantityPurchased = item.quantityPurchased;
          _context2.next = 20;
          return regeneratorRuntime.awrap(Commodity.findById(commodityId));

        case 20:
          commodity = _context2.sent;

          if (commodity) {
            _context2.next = 23;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "Commodity with ID ".concat(commodityId, " not found")
          }));

        case 23:
          if (!(commodity.quantityAvailable < quantityPurchased)) {
            _context2.next = 25;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Not enough quantity available for commodity with ID ".concat(commodityId)
          }));

        case 25:
          totalPrice += commodity.price * quantityPurchased;
          orderItems.push({
            commodity: commodityId,
            quantity: quantityPurchased,
            price: commodity.price,
            seller: commodity.farmer,
            image: commodity.images[0]
          });

        case 27:
          _iteratorNormalCompletion = true;
          _context2.next = 15;
          break;

        case 30:
          _context2.next = 36;
          break;

        case 32:
          _context2.prev = 32;
          _context2.t0 = _context2["catch"](13);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 36:
          _context2.prev = 36;
          _context2.prev = 37;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 39:
          _context2.prev = 39;

          if (!_didIteratorError) {
            _context2.next = 42;
            break;
          }

          throw _iteratorError;

        case 42:
          return _context2.finish(39);

        case 43:
          return _context2.finish(36);

        case 44:
          // Create and save the order
          order = new Order({
            customer: user._id,
            items: orderItems,
            totalAmount: totalPrice,
            paymentStatus: 'pending',
            deliveryAddress: user.deliveryAddress
          });
          _context2.next = 47;
          return regeneratorRuntime.awrap(order.save());

        case 47:
          _context2.prev = 47;
          _context2.next = 50;
          return regeneratorRuntime.awrap(initializePayment(user.email, totalPrice * 100, order._id));

        case 50:
          paymentData = _context2.sent;
          res.status(200).json({
            message: 'Payment initialization successful',
            authorizationUrl: paymentData.authorization_url,
            accessCode: paymentData.access_code,
            orderId: order._id
          });
          _context2.next = 58;
          break;

        case 54:
          _context2.prev = 54;
          _context2.t1 = _context2["catch"](47);
          console.log(_context2.t1);
          res.status(400).json({
            message: _context2.t1.message
          });

        case 58:
          _context2.next = 64;
          break;

        case 60:
          _context2.prev = 60;
          _context2.t2 = _context2["catch"](0);
          console.error(_context2.t2);
          res.status(500).json({
            message: 'Error encountered purchasing commodities'
          });

        case 64:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 60], [13, 32, 36, 44], [37,, 39, 43], [47, 54]]);
}; // route to delete a commodity


var deleteCommodityByName = function deleteCommodityByName(req, res) {
  var name, commodity;
  return regeneratorRuntime.async(function deleteCommodityByName$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          name = req.params.name; // Find the commodity by name and delete it

          _context3.next = 4;
          return regeneratorRuntime.awrap(Commodity.findOneAndDelete({
            title: name
          }));

        case 4:
          commodity = _context3.sent;

          if (commodity) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Commodity not found'
          }));

        case 7:
          res.status(200).json({
            message: 'Commodity deleted successfully'
          });
          _context3.next = 14;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            message: 'Error encountered deleting commodity'
          });

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; // route to update commodity
// const updateCommodity = async (req, res) => {
//   try {
//     const { id, comId } = req.params; // farmer id
//     const data = req.body; // comId is commodity Id
//     const commodityId = await Commodity.findOne({ _id: comId });
//     if (!commodityId) {
//       return res.status(402).json({ message: 'Not a valid product id' });
//     }
//     let imageUrls = [];
//     if (req.files) {
//       imageUrls = req.files.map((file) => `commodityUploads/${file.filename}`);
//     }
//     const updateData = { ...data };
//     if (imageUrls.length > 0) {
//       updateData.images = imageUrls;
//     }
//     const commodity = await Commodity.findByIdAndUpdate(comId, updateData, { new: true });
//     if (!commodity) {
//       return res.status(404).json({ message: 'Error updating commodity' });
//     }
//     return res.status(200).json({ message: 'Commodity updated successfully', commodity });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Error encountered updating commodity' });
//   }
// };
// route to find farmer


var getCommoditiesByFarmer = function getCommoditiesByFarmer(req, res) {
  var farmerId, commodities;
  return regeneratorRuntime.async(function getCommoditiesByFarmer$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          farmerId = req.params.farmerId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Commodity.find({
            farmer: farmerId
          }));

        case 4:
          commodities = _context4.sent;

          if (commodities.length) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'No commodities found for this farmer'
          }));

        case 7:
          return _context4.abrupt("return", res.status(200).json({
            commodities: commodities
          }));

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", res.status(500).json({
            message: 'Error encountered retrieving commodities'
          }));

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; // Get All Commodities


var getAllCommodities = function getAllCommodities(req, res) {
  var commodities;
  return regeneratorRuntime.async(function getAllCommodities$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Commodity.find());

        case 3:
          commodities = _context5.sent;
          res.status(200).json({
            commodities: commodities
          });
          _context5.next = 11;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          res.status(500).json({
            message: 'Error encountered retrieving commodities'
          });

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Get Commodity by ID


var getCommodityById = function getCommodityById(req, res) {
  var id, commodity;
  return regeneratorRuntime.async(function getCommodityById$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          id = req.params.id;
          _context6.next = 4;
          return regeneratorRuntime.awrap(Commodity.findById(id));

        case 4:
          commodity = _context6.sent;

          if (commodity) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: 'Commodity not found'
          }));

        case 7:
          res.status(200).json({
            commodity: commodity
          });
          _context6.next = 14;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          res.status(500).json({
            message: 'Error encountered retrieving commodity'
          });

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; // route to search commodities


var searchCommodities = function searchCommodities(req, res) {
  var query, commodities;
  return regeneratorRuntime.async(function searchCommodities$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          query = req.query.q;

          if (query) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            message: 'Search query is required'
          }));

        case 4:
          _context7.next = 6;
          return regeneratorRuntime.awrap(Commodity.find({
            $or: [{
              title: {
                $regex: query,
                $options: 'i'
              }
            }, {
              description: {
                $regex: query,
                $options: 'i'
              }
            }, {
              categories: {
                $regex: query,
                $options: 'i'
              }
            }, {
              location: {
                $regex: query,
                $options: 'i'
              }
            }]
          }));

        case 6:
          commodities = _context7.sent;
          res.status(200).json({
            commodities: commodities
          });
          _context7.next = 14;
          break;

        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](0);
          console.error('Error during commodity search:', _context7.t0);
          res.status(500).json({
            message: 'Server error'
          });

        case 14:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; // route to get the all complete sales for sellers


var mostCompletedSales = function mostCompletedSales(req, res) {
  var topFarmers;
  return regeneratorRuntime.async(function mostCompletedSales$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(User.aggregate([{
            $match: {
              role: 'farmer',
              completedSales: {
                $gt: 0
              }
            }
          }, {
            $group: {
              _id: '$role',
              farmers: {
                $push: {
                  _id: '$_id',
                  name: '$name',
                  completedSales: '$completedSales'
                }
              }
            }
          }, {
            $unwind: '$farmers' // Deconstructs the farmers array for further processing

          }, {
            $sort: {
              'farmers.completedSales': -1
            } // Sort descending by completedSales

          }, {
            $limit: 20 // Limit to the top 20 farmers

          }]));

        case 3:
          topFarmers = _context8.sent;
          res.json(topFarmers);
          _context8.next = 11;
          break;

        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);
          console.error('Error fetching top farmers:', _context8.t0);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 11:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // route to get the most sold prodcts by vendors


var mostSoldProduct = function mostSoldProduct(req, res) {
  var farmerId, allOrders, productSales, mostSoldProducts, maxSales, _i, _Object$entries, _Object$entries$_i, productId, sales, mostSoldProductDetails;

  return regeneratorRuntime.async(function mostSoldProduct$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          farmerId = req.params.farmerId;

          if (farmerId) {
            _context9.next = 4;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            message: 'Farmer not found'
          }));

        case 4:
          _context9.next = 6;
          return regeneratorRuntime.awrap(Order.find({
            'items.farmer': farmerId,
            paymentStatus: 'paid'
          }));

        case 6:
          allOrders = _context9.sent;

          if (allOrders.length) {
            _context9.next = 9;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            message: 'No completed sales found'
          }));

        case 9:
          productSales = {}; // Tally the quantities sold for each product

          allOrders.forEach(function (order) {
            order.items.forEach(function (item) {
              if (item.farmer.toString() === farmerId) {
                if (!productSales[item.commodity]) {
                  productSales[item.commodity] = item.quantity;
                } else {
                  productSales[item.commodity] += item.quantity;
                }
              }
            });
          }); // Find the product(s) with the highest sales

          mostSoldProducts = [];
          maxSales = 0;

          for (_i = 0, _Object$entries = Object.entries(productSales); _i < _Object$entries.length; _i++) {
            _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), productId = _Object$entries$_i[0], sales = _Object$entries$_i[1];

            if (sales > maxSales) {
              maxSales = sales;
              mostSoldProducts = [productId];
            } else if (sales === maxSales) {
              mostSoldProducts.push(productId);
            }
          }

          if (!(mostSoldProducts.length === 0)) {
            _context9.next = 16;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            message: 'No sales data available'
          }));

        case 16:
          _context9.next = 18;
          return regeneratorRuntime.awrap(Commodity.find({
            _id: {
              $in: mostSoldProducts
            }
          }));

        case 18:
          mostSoldProductDetails = _context9.sent;
          res.status(200).json({
            mostSoldProducts: mostSoldProductDetails,
            maxSales: maxSales
          });
          _context9.next = 26;
          break;

        case 22:
          _context9.prev = 22;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          res.status(500).json({
            message: 'Error fetching most sold products'
          });

        case 26:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 22]]);
}; // all complete orders by a seller


var getCompleteOrdersByFarmer = function getCompleteOrdersByFarmer(req, res) {
  var farmerId, farmer, orders;
  return regeneratorRuntime.async(function getCompleteOrdersByFarmer$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          farmerId = req.params.farmerId;
          _context10.next = 4;
          return regeneratorRuntime.awrap(User.findById(farmerId));

        case 4:
          farmer = _context10.sent;

          if (farmer) {
            _context10.next = 7;
            break;
          }

          return _context10.abrupt("return", res.status(404).json({
            message: 'Farmer not found'
          }));

        case 7:
          _context10.next = 9;
          return regeneratorRuntime.awrap(Order.find({
            paymentStatus: 'paid'
          }).populate('items.commodity').populate('customer'));

        case 9:
          orders = _context10.sent;
          res.status(200).json(orders);
          _context10.next = 17;
          break;

        case 13:
          _context10.prev = 13;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          res.status(500).json({
            message: 'Server error'
          });

        case 17:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 13]]);
}; // Route to get the sales reports


var salesReport = function salesReport(req, res) {
  var format, _req$query, page, limit, skip, orders, data, csvWriter, itemSales, chartData, itemCount, pageCount;

  return regeneratorRuntime.async(function salesReport$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          format = req.query.format;
          _req$query = req.query, page = _req$query.page, limit = _req$query.limit;
          skip = (page - 1) * limit;
          _context11.next = 6;
          return regeneratorRuntime.awrap(Order.find({
            paymentStatus: 'paid'
          }).populate('items.commodity').populate('items.farmer').skip(skip).limit(limit));

        case 6:
          orders = _context11.sent;
          data = orders.map(function (order) {
            return order.items.map(function (item) {
              return {
                itemName: item.commodity.name,
                sellerName: item.farmer.name,
                quantity: item.quantity,
                amountPaid: item.price * item.quantity,
                orderId: order._id,
                orderDate: order.createdAt
              };
            });
          }).flat();

          if (!(format === 'csv')) {
            _context11.next = 15;
            break;
          }

          // Export to CSV
          csvWriter = createObjectCsvWriter({
            path: 'sales_report.csv',
            header: [{
              id: 'itemName',
              title: 'Item Name'
            }, {
              id: 'sellerName',
              title: 'Seller Name'
            }, {
              id: 'quantity',
              title: 'Quantity Bought'
            }, {
              id: 'amountPaid',
              title: 'Amount Paid'
            }, {
              id: 'orderId',
              title: 'Order ID'
            }, {
              id: 'orderDate',
              title: 'Order Date'
            }]
          });
          _context11.next = 12;
          return regeneratorRuntime.awrap(csvWriter.writeRecords(data));

        case 12:
          res.download('sales_report.csv');
          _context11.next = 26;
          break;

        case 15:
          if (!(format === 'chart')) {
            _context11.next = 21;
            break;
          }

          // View as pie chart
          itemSales = data.reduce(function (acc, item) {
            if (!acc[item.itemName]) {
              acc[item.itemName] = 0;
            }

            acc[item.itemName] += item.quantity;
            return acc;
          }, {});
          chartData = {
            labels: Object.keys(itemSales),
            datasets: [{
              data: Object.values(itemSales),
              backgroundColor: Object.keys(itemSales).map(function () {
                return "#".concat(Math.floor(Math.random() * 16777215).toString(16));
              })
            }]
          };
          res.json({
            chartData: chartData
          });
          _context11.next = 26;
          break;

        case 21:
          _context11.next = 23;
          return regeneratorRuntime.awrap(Order.countDocuments({
            paymentStatus: 'paid'
          }));

        case 23:
          itemCount = _context11.sent;
          pageCount = Math.ceil(itemCount / limit);
          res.json({
            has_more: paginate.hasNextPages(req)(pageCount),
            items: data,
            pageCount: pageCount,
            itemCount: itemCount
          });

        case 26:
          _context11.next = 32;
          break;

        case 28:
          _context11.prev = 28;
          _context11.t0 = _context11["catch"](0);
          console.error('Error generating sales report:', _context11.t0);
          res.status(500).json({
            message: 'Error generating sales report'
          });

        case 32:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 28]]);
}; // route to get the user reports and behaviors, might be implemented later
// route to get the invertory reports, might also be implemented later
// products/commodities tracker


var productsTracker = function productsTracker(req, res) {
  var lowCommodities, commodities, publishPromises;
  return regeneratorRuntime.async(function productsTracker$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          lowCommodities = [];
          _context12.next = 4;
          return regeneratorRuntime.awrap(Commodity.find().populate('farmer'));

        case 4:
          commodities = _context12.sent;

          if (!(!commodities || commodities.length === 0)) {
            _context12.next = 7;
            break;
          }

          return _context12.abrupt("return", res.status(404).json({
            message: 'No resources found'
          }));

        case 7:
          // Identify commodities running low
          commodities.forEach(function (commodity) {
            if (commodity.quantityAvailable <= 40) {
              lowCommodities.push({
                title: commodity.title,
                quantityAvailable: commodity.quantityAvailable,
                email: commodity.farmer.email
              });
            }
          }); // Publish events to Redis for each low commodity

          publishPromises = lowCommodities.map(function (comm) {
            return redisClient.publish('running low on product', JSON.stringify({
              email: comm.email,
              subject: "Running low on product: ".concat(comm.title),
              text: "The product \"".concat(comm.title, "\" is running low with only ").concat(comm.quantityAvailable, " items left.")
            }));
          });
          _context12.next = 11;
          return regeneratorRuntime.awrap(Promise.all(publishPromises));

        case 11:
          return _context12.abrupt("return", res.status(200).json({
            message: 'Checked all products and published notifications for low commodities.',
            lowCommodities: lowCommodities
          }));

        case 14:
          _context12.prev = 14;
          _context12.t0 = _context12["catch"](0);
          console.error('Error tracking products:', _context12.t0);
          res.status(500).json({
            message: 'An error occurred while tracking products.'
          });

        case 18:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 14]]);
}; // Scheduling the function to run every 24 hours


cron.schedule('0 0 * * *', function () {
  console.log('Running productsTracker job...');
  productsTracker();
});
module.exports = {
  router: router,
  salesReport: salesReport,
  addCommodity: addCommodity,
  buyCommodity: buyCommodity,
  getCommoditiesByFarmer: getCommoditiesByFarmer,
  getCommodityById: getCommodityById,
  getAllCommodities: getAllCommodities,
  // updateCommodity,
  deleteCommodityByName: deleteCommodityByName,
  searchCommodities: searchCommodities,
  getCompleteOrdersByFarmer: getCompleteOrdersByFarmer,
  mostCompletedSales: mostCompletedSales,
  mostSoldProduct: mostSoldProduct
};
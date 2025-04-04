"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

//still work in progress
// process.env.PORT = 3001;
var mongoose = require('mongoose');

var server = require('../server');

var User = require('../backend/users/models/user');

var Commodity = require('../backend/users/models/commodity');

var Cart = require('../backend/users/models/cart');

var chai, chaiHttp, expect;

(function _callee3() {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Promise.resolve().then(function () {
            return _interopRequireWildcard(require('chai'));
          }));

        case 2:
          chai = _context3.sent["default"];
          _context3.next = 5;
          return regeneratorRuntime.awrap(Promise.resolve().then(function () {
            return _interopRequireWildcard(require('chai-http'));
          }));

        case 5:
          chaiHttp = _context3.sent["default"];
          expect = chai.expect;
          chai.use(chaiHttp);
          describe('Cart Management', function () {
            var user, commodity;
            before(function _callee() {
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return regeneratorRuntime.awrap(mongoose.connect(process.env.DB_AUTHENTICATION, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                      }));

                    case 2:
                      // Create a user and a commodity for testing
                      user = new User({
                        name: 'Test User',
                        email: 'testuser@example.com',
                        password: 'password123',
                        role: 'buyer'
                      });
                      _context.next = 5;
                      return regeneratorRuntime.awrap(user.save());

                    case 5:
                      commodity = new Commodity({
                        name: 'Test Commodity',
                        price: 10,
                        quantityAvailable: 100
                      });
                      _context.next = 8;
                      return regeneratorRuntime.awrap(commodity.save());

                    case 8:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            });
            after(function _callee2() {
              return regeneratorRuntime.async(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return regeneratorRuntime.awrap(User.deleteMany({}));

                    case 2:
                      _context2.next = 4;
                      return regeneratorRuntime.awrap(Commodity.deleteMany({}));

                    case 4:
                      _context2.next = 6;
                      return regeneratorRuntime.awrap(Cart.deleteMany({}));

                    case 6:
                      _context2.next = 8;
                      return regeneratorRuntime.awrap(mongoose.disconnect());

                    case 8:
                    case "end":
                      return _context2.stop();
                  }
                }
              });
            });
            describe('POST /api/cart', function () {
              it('should add an item to the cart', function (done) {
                chai.request(server).post('/api/cart').set('Authorization', "Bearer ".concat(user.generateAuthToken())) // Ensure this method is correct
                .send({
                  commodityId: commodity._id,
                  quantity: 2
                }).end(function (err, res) {
                  expect(res).to.have.status(200);
                  expect(res.body).to.be.an('object');
                  expect(res.body.message).to.equal('Item added to cart');
                  expect(res.body.cart).to.have.property('items');
                  expect(res.body.cart.items).to.be.an('array').that.is.not.empty;
                  expect(res.body.cart.items[0].commodity.toString()).to.equal(commodity._id.toString());
                  expect(res.body.cart.items[0].quantity).to.equal(2);
                  done();
                });
              });
              it('should return an error for invalid commodity', function (done) {
                chai.request(server).post('/api/cart').set('Authorization', "Bearer ".concat(user.generateAuthToken())).send({
                  commodityId: 'invalidCommodityId',
                  quantity: 2
                }).end(function (err, res) {
                  expect(res).to.have.status(400);
                  expect(res.body).to.be.an('object');
                  expect(res.body.message).to.equal('Invalid commodity or quantity');
                  done();
                });
              });
              it('should return an error for invalid quantity', function (done) {
                chai.request(server).post('/api/cart').set('Authorization', "Bearer ".concat(user.generateAuthToken())).send({
                  commodityId: commodity._id,
                  quantity: 0
                }).end(function (err, res) {
                  expect(res).to.have.status(400);
                  expect(res.body).to.be.an('object');
                  expect(res.body.message).to.equal('Invalid commodity or quantity');
                  done();
                });
              });
            });
          });
          run();

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  });
})();
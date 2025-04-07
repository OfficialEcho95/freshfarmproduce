// //still work in progress

// // process.env.PORT = 3001;

// const mongoose = require('mongoose');
// const server = require('../index');
// const User = require('../backend/users/models/user');
// const Commodity = require('../backend/users/models/commodity');
// const Cart = require('../backend/users/models/cart');

// let chai, chaiHttp, expect;

// (async () => {
//     chai = (await import('chai')).default;
//     chaiHttp = (await import('chai-http')).default;
//     expect = chai.expect;
//     chai.use(chaiHttp);

//     describe('Cart Management', () => {
//         let user, commodity;

//         before(async () => {
//             // Connect to the test database
//             await mongoose.connect(process.env.DB_AUTHENTICATION, {
//                 useNewUrlParser: true,
//                 useUnifiedTopology: true,
//             });

//             // Create a user and a commodity for testing
//             user = new User({
//                 name: 'Test User',
//                 email: 'testuser@example.com',
//                 password: 'password123',
//                 role: 'buyer',
//             });
//             await user.save();

//             commodity = new Commodity({
//                 name: 'Test Commodity',
//                 price: 10,
//                 quantityAvailable: 100,
//             });
//             await commodity.save();
//         });

//         after(async () => {
//             // Clean up the database
//             await User.deleteMany({});
//             await Commodity.deleteMany({});
//             await Cart.deleteMany({});
//             await mongoose.disconnect();
//         });

//         describe('POST /api/cart', () => {
//             it('should add an item to the cart', (done) => {
//                 chai.request(server)
//                     .post('/api/cart')
//                     .set('Authorization', `Bearer ${user.generateAuthToken()}`) // Ensure this method is correct
//                     .send({ commodityId: commodity._id, quantity: 2 })
//                     .end((err, res) => {
//                         expect(res).to.have.status(200);
//                         expect(res.body).to.be.an('object');
//                         expect(res.body.message).to.equal('Item added to cart');
//                         expect(res.body.cart).to.have.property('items');
//                         expect(res.body.cart.items).to.be.an('array').that.is.not.empty;
//                         expect(res.body.cart.items[0].commodity.toString()).to.equal(commodity._id.toString());
//                         expect(res.body.cart.items[0].quantity).to.equal(2);
//                         done();
//                     });
//             });

//             it('should return an error for invalid commodity', (done) => {
//                 chai.request(server)
//                     .post('/api/cart')
//                     .set('Authorization', `Bearer ${user.generateAuthToken()}`)
//                     .send({ commodityId: 'invalidCommodityId', quantity: 2 })
//                     .end((err, res) => {
//                         expect(res).to.have.status(400);
//                         expect(res.body).to.be.an('object');
//                         expect(res.body.message).to.equal('Invalid commodity or quantity');
//                         done();
//                     });
//             });

//             it('should return an error for invalid quantity', (done) => {
//                 chai.request(server)
//                     .post('/api/cart')
//                     .set('Authorization', `Bearer ${user.generateAuthToken()}`)
//                     .send({ commodityId: commodity._id, quantity: 0 })
//                     .end((err, res) => {
//                         expect(res).to.have.status(400);
//                         expect(res.body).to.be.an('object');
//                         expect(res.body.message).to.equal('Invalid commodity or quantity');
//                         done();
//                     }); 
//             });
//         });
//     });

//     run();
// })();

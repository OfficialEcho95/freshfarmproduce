const paginate = require('express-paginate');
const Order = require('../../users/models/order');
const User = require('../../users/models/user');

// ... your sales report code

const salesReport = async (req, res) => {
  try {
    const { format } = req.query;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ paymentStatus: 'paid' })
      .populate('items.commodity')
      .populate('items.seller')
      .skip(skip)
      .limit(limit);

    const data = await Promise.all(orders.map(async (order) => await Promise.all(order.items.map(async (item) => {
      const seller = await User.findById(item.seller);
      return {
        itemName: item.commodity.title,
        sellerName: seller ? seller.name : 'Unknown Seller',
        quantity: item.quantity,
        amountPaid: item.price * item.quantity,
        orderId: order._id,
        orderDate: order.createdAt,
      };
    })))).then((results) => results.flat());

    if (format === 'csv') {
      const csvWriter = createObjectCsvWriter({
        path: 'sales_report.csv',
        header: [
          { id: 'itemName', title: 'Item Name' },
          { id: 'sellerName', title: 'Seller Name' },
          { id: 'quantity', title: 'Quantity Bought' },
          { id: 'amountPaid', title: 'Amount Paid' },
          { id: 'orderId', title: 'Order ID' },
          { id: 'orderDate', title: 'Order Date' },
        ],
      });

      await csvWriter.writeRecords(data);
      res.download('sales_report.csv');
    } else if (format === 'chart') {
      const itemSales = data.reduce((acc, item) => {
        if (!acc[item.itemName]) {
          acc[item.itemName] = 0;
        }
        acc[item.itemName] += item.quantity;
        return acc;
      }, {});

      const chartData = {
        labels: Object.keys(itemSales),
        datasets: [{
          data: Object.values(itemSales),
          backgroundColor: Object.keys(itemSales).map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`),
        }],
      };

      res.json({ chartData });
    } else {
      const itemCount = await Order.countDocuments({ paymentStatus: 'paid' });
      const pageCount = Math.ceil(itemCount / limit);

      res.json({
        has_more: paginate.hasNextPages(req)(pageCount),
        items: data,
        pageCount,
        itemCount,
      });
    }
  } catch (error) {
    console.error('Error generating sales report:', error);
    res.status(500).json({ message: 'Error generating sales report' });
  }
};

// Example route
module.exports = { salesReport };

const { ShippingMethod, ShippingRate, OrderShipping } = require('../models/shippingModel');
const orderModel = require('../models/orderModel');

// ==================== SHIPPING METHODS ====================

// Get all shipping methods
const getAllShippingMethods = async (req, res) => {
  try {
    const methods = await ShippingMethod.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, methods });
  } catch (error) {
    console.error('Error fetching shipping methods:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch shipping methods' });
  }
};

// Create new shipping method
const createShippingMethod = async (req, res) => {
  try {
    const { name, description, estimatedDays } = req.body;
    
    // Check if method with same name exists
    const existingMethod = await ShippingMethod.findOne({ name });
    if (existingMethod) {
      return res.status(400).json({ success: false, error: 'Shipping method with this name already exists' });
    }

    const method = new ShippingMethod({
      name,
      description,
      estimatedDays
    });

    await method.save();
    res.status(201).json({ success: true, method });
  } catch (error) {
    console.error('Error creating shipping method:', error);
    res.status(500).json({ success: false, error: 'Failed to create shipping method' });
  }
};

// Update shipping method
const updateShippingMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const method = await ShippingMethod.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!method) {
      return res.status(404).json({ success: false, error: 'Shipping method not found' });
    }

    res.status(200).json({ success: true, method });
  } catch (error) {
    console.error('Error updating shipping method:', error);
    res.status(500).json({ success: false, error: 'Failed to update shipping method' });
  }
};

// Delete shipping method
const deleteShippingMethod = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if method is being used in any rates
    const ratesUsingMethod = await ShippingRate.findOne({ methodId: id });
    if (ratesUsingMethod) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete method. It is being used in shipping rates.' 
      });
    }

    const method = await ShippingMethod.findByIdAndDelete(id);
    if (!method) {
      return res.status(404).json({ success: false, error: 'Shipping method not found' });
    }

    res.status(200).json({ success: true, message: 'Shipping method deleted successfully' });
  } catch (error) {
    console.error('Error deleting shipping method:', error);
    res.status(500).json({ success: false, error: 'Failed to delete shipping method' });
  }
};

// ==================== SHIPPING RATES ====================

// Get all shipping rates
const getAllShippingRates = async (req, res) => {
  try {
    const rates = await ShippingRate.find()
      .populate('methodId', 'name description')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, rates });
  } catch (error) {
    console.error('Error fetching shipping rates:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch shipping rates' });
  }
};

// Create new shipping rate
const createShippingRate = async (req, res) => {
  try {
    const { methodId, region, minWeight, maxWeight, baseRate, perKgRate } = req.body;

    // Verify method exists
    const method = await ShippingMethod.findById(methodId);
    if (!method) {
      return res.status(400).json({ success: false, error: 'Shipping method not found' });
    }

    const rate = new ShippingRate({
      methodId,
      region,
      minWeight,
      maxWeight,
      baseRate,
      perKgRate
    });

    await rate.save();
    
    // Populate method details
    await rate.populate('methodId', 'name description');
    
    res.status(201).json({ success: true, rate });
  } catch (error) {
    console.error('Error creating shipping rate:', error);
    res.status(500).json({ success: false, error: 'Failed to create shipping rate' });
  }
};

// Update shipping rate
const updateShippingRate = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const rate = await ShippingRate.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('methodId', 'name description');

    if (!rate) {
      return res.status(404).json({ success: false, error: 'Shipping rate not found' });
    }

    res.status(200).json({ success: true, rate });
  } catch (error) {
    console.error('Error updating shipping rate:', error);
    res.status(500).json({ success: false, error: 'Failed to update shipping rate' });
  }
};

// Delete shipping rate
const deleteShippingRate = async (req, res) => {
  try {
    const { id } = req.params;

    const rate = await ShippingRate.findByIdAndDelete(id);
    if (!rate) {
      return res.status(404).json({ success: false, error: 'Shipping rate not found' });
    }

    res.status(200).json({ success: true, message: 'Shipping rate deleted successfully' });
  } catch (error) {
    console.error('Error deleting shipping rate:', error);
    res.status(500).json({ success: false, error: 'Failed to delete shipping rate' });
  }
};

// ==================== ORDER SHIPPING ====================

// Get all order shipping records
const getAllOrderShipping = async (req, res) => {
  try {
    const orderShipping = await OrderShipping.find()
      .populate('orderId', 'orderNumber totalAmount createdAt')
      .populate('methodId', 'name description')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orderShipping });
  } catch (error) {
    console.error('Error fetching order shipping:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch order shipping' });
  }
};

// Get shipping for specific order
const getOrderShipping = async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderShipping = await OrderShipping.findOne({ orderId })
      .populate('orderId', 'orderNumber totalAmount createdAt')
      .populate('methodId', 'name description');

    if (!orderShipping) {
      return res.status(404).json({ success: false, error: 'Order shipping not found' });
    }

    res.status(200).json({ success: true, orderShipping });
  } catch (error) {
    console.error('Error fetching order shipping:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch order shipping' });
  }
};

// Create/Update order shipping
const updateOrderShipping = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updates = req.body;

    // Check if order exists
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    let orderShipping = await OrderShipping.findOne({ orderId });

    if (orderShipping) {
      // Update existing shipping record
      orderShipping = await OrderShipping.findOneAndUpdate(
        { orderId },
        updates,
        { new: true, runValidators: true }
      ).populate('orderId', 'orderNumber totalAmount createdAt')
       .populate('methodId', 'name description');
    } else {
      // Create new shipping record
      orderShipping = new OrderShipping({
        orderId,
        ...updates
      });
      await orderShipping.save();
      await orderShipping.populate('orderId', 'orderNumber totalAmount createdAt');
      await orderShipping.populate('methodId', 'name description');
    }

    res.status(200).json({ success: true, orderShipping });
  } catch (error) {
    console.error('Error updating order shipping:', error);
    res.status(500).json({ success: false, error: 'Failed to update order shipping' });
  }
};

// Update shipping status
const updateShippingStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, notes } = req.body;

    const orderShipping = await OrderShipping.findOne({ orderId });
    if (!orderShipping) {
      return res.status(404).json({ success: false, error: 'Order shipping not found' });
    }

    orderShipping.status = status;
    if (trackingNumber) orderShipping.trackingNumber = trackingNumber;
    if (notes) orderShipping.notes = notes;

    // Set timestamps based on status
    if (status === 'shipped' && !orderShipping.shippedAt) {
      orderShipping.shippedAt = new Date();
    }
    if (status === 'delivered' && !orderShipping.deliveredAt) {
      orderShipping.deliveredAt = new Date();
    }

    await orderShipping.save();
    await orderShipping.populate('orderId', 'orderNumber totalAmount createdAt');
    await orderShipping.populate('methodId', 'name description');

    res.status(200).json({ success: true, orderShipping });
  } catch (error) {
    console.error('Error updating shipping status:', error);
    res.status(500).json({ success: false, error: 'Failed to update shipping status' });
  }
};

// Get shipping statistics
const getShippingStats = async (req, res) => {
  try {
    const totalOrders = await OrderShipping.countDocuments();
    const pendingOrders = await OrderShipping.countDocuments({ status: 'pending' });
    const processingOrders = await OrderShipping.countDocuments({ status: 'processing' });
    const shippedOrders = await OrderShipping.countDocuments({ status: 'shipped' });
    const deliveredOrders = await OrderShipping.countDocuments({ status: 'delivered' });
    const failedOrders = await OrderShipping.countDocuments({ status: 'failed' });

    const stats = {
      total: totalOrders,
      pending: pendingOrders,
      processing: processingOrders,
      shipped: shippedOrders,
      delivered: deliveredOrders,
      failed: failedOrders
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching shipping stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch shipping statistics' });
  }
};

module.exports = {
  // Shipping Methods
  getAllShippingMethods,
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
  
  // Shipping Rates
  getAllShippingRates,
  createShippingRate,
  updateShippingRate,
  deleteShippingRate,
  
  // Order Shipping
  getAllOrderShipping,
  getOrderShipping,
  updateOrderShipping,
  updateShippingStatus,
  getShippingStats
}; 
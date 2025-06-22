const mongoose = require('mongoose');

const userInteractionSchema = new mongoose.Schema({
    userId: {
        type: String, unique:true
    },
    id: {
        type: Number, unique: true
    },
    actionType: {
        type: String, enum: ['click', 'purchase']
    },
    timestamp: {
        type: Date, default: Date.now,
    },
    interactionScore: {
        type: Number, default: 1, // Default to 1 for views
    },
});

// Optional: Indexes for faster queries (e.g., querying interactions by user or product)
userInteractionSchema.index({ userId: 1, productId: 1 });
userInteractionSchema.index({ productId: 1, actionType: 1 });

const UserInteraction = mongoose.model('UserInteraction', userInteractionSchema);
module.exports = UserInteraction;

const natural = require("natural");
const { removeStopwords } = require("stopword");
const productModel = require("../models/productModel");
const mongoose = require('mongoose')

// get single product
const singleproduct=async(req,res)=>{
    const {id}=req.query;
    try{
        const item=await productModel.findOne({id:id});
        if (!item) {
            throw new Error('Product not found');
          }
        res.status(200).json(item);
    }
    catch(error){
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
};

// get list of products based on search
const searchproducts = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }

        //Tokenization & Stopword Removal
        const tokenizer = new natural.WordTokenizer();
        let words = tokenizer.tokenize(query.toLowerCase());
        words = removeStopwords(words);

        //Price Range Extraction
        let searchConditions = [];
        const underMatch = query.match(/under (\d+)/i);
        const aboveMatch = query.match(/above (\d+)/i);
        const rangeMatch = query.match(/(\d+)\s*(to|-)\s*(\d+)/i);

        if (underMatch) {
            const maxPrice = parseInt(underMatch[1]);
            searchConditions.push({ price: { $lte: maxPrice } });
        } else if (aboveMatch) {
            const minPrice = parseInt(aboveMatch[1]);
            searchConditions.push({ price: { $gte: minPrice } });
        } else if (rangeMatch) {
            const minPrice = parseInt(rangeMatch[1]);
            const maxPrice = parseInt(rangeMatch[3]);
            searchConditions.push({ price: { $gte: minPrice, $lte: maxPrice } });
        }

        //  Full-Text Search with Cleaned Query
        const cleanedQuery = words.join(" ");
        let mongoResults = await productModel.find({ 
            $and: [ { $text: { $search: cleanedQuery } }, ...searchConditions ] 
        });

        // can chnage the parameter of length
        if (mongoResults.length > 0) {
            return res.status(200).json(mongoResults);
        }

        // Fuzzy Matching for Results if above condition not satisfied
        const allProducts = await productModel.find({ $and: searchConditions });
        const threshold = 0.8; // parameter

        const filteredProducts = allProducts.filter(product => {
            let matchFound = false;
            words.forEach(word => {
                if (natural.JaroWinklerDistance(word, product.productDisplayName.toLowerCase()) > threshold ||
                    natural.JaroWinklerDistance(word, product.masterCategory.toLowerCase()) > threshold ||
                    natural.JaroWinklerDistance(word, product.subCategory.toLowerCase()) > threshold) {
                    matchFound = true;
                }
            });
            return matchFound;
        });

        res.status(200).json(filteredProducts);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
};

module.exports={
    singleproduct,
    searchproducts
}
// post to cart
const Favorite = require('../models/Favorite');

exports.addFavorite = async (req, res) => {
    const { countryCode, countryName } = req.body;
    const userId = req.user.id;
  
    try {
      const existing = await Favorite.findOne({ userId, countryCode });
      if (existing) return res.status(400).json({ message: 'Already favorited' });
  
      const fav = await Favorite.create({ userId, countryCode, countryName });
      res.status(201).json(fav);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

exports.getFavorites = async (req, res) => {
  const userId = req.user.id;

  try {
    const favs = await Favorite.find({ userId });
    res.json(favs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

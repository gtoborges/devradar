const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();
    
    return res.json(devs);
  },

  async store (req, res) {
    const { github_username, techs, longitude, latitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if(!dev) {
      const response = await axios.get(`https://api.github.com/users/${github_username}`);
      let { name = login, avatar_url, bio } = response.data;

      const techsArray = parseStringAsArray(techs);
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio, 
        techs: techsArray,
        location
      });
    }

    return res.json(dev);
  },

  async update(req, res) {
    const { github_username, techs, longitude, latitude } = req.body

    const response = await axios.get(`https://api.github.com/users/${github_username}`);
    let { name = login, avatar_url, bio } = response.data;

    const techsArray = parseStringAsArray(techs);
    const location = {
      type: 'Point',
      coordinates: [longitude, latitude]
    };

    let dev = await Dev.update({
      name,
      avatar_url,
      bio,
      techs: techsArray,
      location
    })

    return res.json(dev)
  },

  async destroy(req, res) {
    const { github_username } = req.body

    let dev = await Dev.findOneAndDelete({ github_username: github_username })
    console.log('dev excluido: ', dev)

    return res.json({message: `Usuário ${github_username} excluído`})
  }

};
import Destinations from '../models/destinations.js'


// export const getDestination = (req, res) => {
//     res.send('This works..I think');
// }

export const getDestination = async (req, res) => {
   try {
    const destinations = await Destinations.find();
    // console.log(destinations)
    res.status(200).json(destinations)
   } catch (error) {
        res.status(404).json({message: error.message})
   }
}



export const createDestination = (req, res) => {
    res.send("Destination Created");
}